import {
    AddMemberRequest,
    Organization,
    OrganizationMembership,
    OrganizationMembershipValues,
    UserInfo,
    UserType
} from "affordable-shared-models";
import uuidv4 from "uuid/v4";
import { DBOOrganizationDAOImpl } from "../../database/dao/organization/DBOOrganizationDAOImpl";
import { DBOOrganizationMembershipDAOImpl } from "../../database/dao/organization/DBOOrganizationMembershipDAOImpl";
import db from "../../database/DatabaseConnection";
import { OrganizationDBO } from "../../models/orm/OrganizationDBO";
import { OrganizationMembershipDBO } from "../../models/orm/OrganizationMembershipDBO";
import * as utils from "../../utils";
import { Validation } from "../../utils/Validation";
import { AffordableSESClient } from "../email/AffordableSESClient";
import { OrganizationService } from "./OrganizationService";
import { OrganizationUtils } from "./OrganizationUtils";
import { OrganizationDAO } from "../../database/dao/organization/OrganizationDAO";
import { OrganizationMembershipDAO } from "../../database/dao/organization/OrganizationMembershipDAO";
import { AffordableEmailClient } from "../email/AffordableEmailClient";
import { AuthorizationUtils } from "../AuthorizationUtils";
import { UnauthorizedError } from "../../models/UnauthorizedError";
import { AuthenticationService } from "../AuthenticationService";
import { AuthenticationServiceImpl } from "../AuthenticationServiceImpl";

const connectionPool = db.getInstance();

export class OrganizationServiceImpl implements OrganizationService {

    private orgDao: OrganizationDAO;
    private orgMembershipDao: OrganizationMembershipDAO;
    private authService: AuthenticationService;
    private emailClient: AffordableEmailClient;

    public constructor(authService?: AuthenticationService,
                       organizationDao?: OrganizationDAO,
                       organizationMembershipDao?: OrganizationMembershipDAO,
                       emailClient?: AffordableEmailClient) {
        this.orgDao = organizationDao ?? new DBOOrganizationDAOImpl();
        this.orgMembershipDao = organizationMembershipDao ?? new DBOOrganizationMembershipDAOImpl();
        this.authService = authService ?? new AuthenticationServiceImpl();
        this.emailClient = emailClient ?? AffordableSESClient.getInstance();

        this.createOrganization = this.createOrganization.bind(this);
        this.updateOrganization = this.updateOrganization.bind(this);
        this.getOrganization = this.getOrganization.bind(this);
        this.deleteOrganization = this.deleteOrganization.bind(this);
        this.getApiKey = this.getApiKey.bind(this);
        this.sendVerificationEmailForAddOrg = this.sendVerificationEmailForAddOrg.bind(this);
        this.addOrganizationInfo = this.addOrganizationInfo.bind(this);
        this.getOrganizationsForUser = this.getOrganizationsForUser.bind(this);
    }

    /**
     * Creates an organization
     * @param organization a CreateOrganizationRequest that has at least a specified orgName
     */
    async createOrganization(userInfo: UserInfo, organization: Organization): Promise<Organization> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);
        organization.id = undefined;
        Validation.requireParam(organization.name, "name");
        // Generate an API Key
        organization.apiKey = uuidv4();
        const dbo: OrganizationDBO = OrganizationUtils.mapDtoToDbo(organization);
        const createdOrg = await this.orgDao.saveOrganization(dbo);

        // Add them to the organization as an administrator
        const addMemberRequest = new AddMemberRequest();
        addMemberRequest.userId = userInfo.id;
        addMemberRequest.organizationId = createdOrg.id;
        addMemberRequest.isAdmin = true;
        await this.addMember(addMemberRequest);
        return this.getOrganization(userInfo, createdOrg.id);
    }

    async updateOrganization(userInfo: UserInfo, organization: Organization): Promise<Organization> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);
        Validation.requireParam(organization.id, "id");
        Validation.requireParam(organization.name, "name");

        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organization.id))) {
            throw new UnauthorizedError(`You are not a member of organization ${organization.id}`);
        }
        const currentOrganization = await this.getOrganization(userInfo, organization.id);
        // Do not update the API key
        organization.apiKey = currentOrganization.apiKey;
        const dbo = OrganizationUtils.mapDtoToDbo(organization);
        return OrganizationUtils.mapDboToDto(await this.orgDao.saveOrganization(dbo));
    }

    /**
     * Gets an organization
     * @param orgId
     */
    async getOrganization(userInfo: UserInfo, orgId: number): Promise<Organization> {
        AuthorizationUtils.checkAuthorization(userInfo, false);

        const organization = OrganizationUtils.mapDboToDto(await this.orgDao.getOrganizationById(orgId));
        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organization.id))) {
            organization.apiKey = undefined;
        }

        Validation.requireParam(orgId, "orgId");
        return organization;
    }

    /**
     * Deletes an organization
     * @param orgId
     */
    async deleteOrganization(userInfo: UserInfo, orgId: number): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo, false);

        if (!(await this.userBelongsToOrganization(userInfo.id, orgId))) {
            throw new UnauthorizedError("You can't delete this organization because you are not a member");
        }

        Validation.requireParam(orgId, "orgId");
        await this.orgDao.deleteOrganizationById(orgId);
    }

    //Send verification email for add org
    async sendVerificationEmailForAddOrg(req, res): Promise<void> {
        //donor admin user email
        const email = req.body.email;
        this.emailClient.sendEmail({
            from: "donotreply@affordhealth.org",
            to: email,
            subject: "Affordable:: About Your Organization",
            html: utils.formatAddOrgEmail(req.orgName),
            attachments: [{
                filename: "EmailsLogo.png",
                path: "../app/src/assets/images/EmailsLogo.png",
                cid: "AddEmailsLogo"
            }]

        });
        res.sendStatus(200);
    }

    async getApiKey(userInfo: UserInfo, organizationId: number): Promise<string> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);

        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organizationId))) {
            throw new UnauthorizedError(`You are not a member of organization ${organizationId}`);
        }

        return this.orgDao.getApiKey(organizationId);
    }

    //Adds organization information *Should only be called after the organization it is referencing has been added to the database*
    async addOrganizationInfo(req, res): Promise<void> {
        let servicesValues = [[]];
        let sqlServe = "";
        let accountInfoValues = [[]];
        let sqlAcc = "";
        let successfulQuery = true;

        //Insert Service information if it was entered
        if (req.body.ProvideService != null && req.body.ProvideService == "1") {
            servicesValues = [
                [
                    null,
                    req.body.orgID,
                    req.body.service,
                    req.body.specialtyService
                ]
            ];

            sqlServe = "INSERT INTO Services VALUES ?";

            await connectionPool.query(sqlServe, [servicesValues], (error) => {
                if (error) {
                    console.log(error);
                    successfulQuery = false;
                    res.status(502).json({error});
                } else {
                    console.log("Organization Services Records inserted");
                }
            });
        }

        //Insert Banking info if it was entered
        if (req.body.bankInfo != null && req.body.bankInfo == "1") {
            accountInfoValues = [
                [
                    null,
                    req.body.accountType,
                    req.body.accountNickname,
                    req.body.accountName,
                    req.body.accountRouting,
                    req.body.accountNumber,
                    req.body.orgID,
                    req.body.userID
                ]
            ];

            sqlAcc = "INSERT INTO AccountInfo VALUES ?";

            await connectionPool.query(sqlAcc, [accountInfoValues], (error) => {
                if (error) {
                    console.log(error);
                    successfulQuery = false;
                    res.status(502).json({error});
                } else {
                    console.log("Organization Banking Info inserted");
                }
            });
        }

        const membershipReq = new OrganizationMembershipDBO();
        membershipReq.donor = req.body.userID;
        membershipReq.organization = req.body.orgID;
        membershipReq.isAdmin = true;
        membershipReq.membershipStartDate = new Date();

        await this.orgMembershipDao.saveMembership(membershipReq);

        //Insert organization locations
        const locations = JSON.parse(req.body.locations);
        let i = 0;
        for (i = 0; i <= req.body.numOfLocations; i++) {
            let locationType = "Secondary";
            if (i == 0) {
                locationType = "Primary";
            }
            const locValues = [
                [
                    null,
                    req.body.orgID,
                    locationType,
                    locations[i].addressLine1,
                    locations[i].addressLine2,
                    locations[i].city,
                    locations[i].state,
                    locations[i].zip,
                ]
            ];

            //Forms query
            const sqlLoc = "INSERT INTO OrgLocations VALUES ?";

            //Performs query
            await connectionPool.query(sqlLoc, [locValues], (error) => {
                if (error) {
                    console.log(error);
                    successfulQuery = false;
                    res.status(502).json({error});
                } else {
                    console.log("Organization Location Records inserted");
                    //Will only send status 200 if all previous queries were successful
                    if (successfulQuery) {
                        res.status(200).json({"status": "OK"});
                    }
                }
            });
        }
    }

    async getOrganizationsForUser(userInfo: UserInfo, userId: number): Promise<Array<OrganizationMembership>> {
        // No need to be authorized

        const organizations = await this.orgMembershipDao.getAllMembershipsOfUser(userId);

        return organizations.map((item: OrganizationMembershipDBO): OrganizationMembership => {
            const om = new OrganizationMembership();
            om.organization = OrganizationUtils.mapDboToDto(item.organization);
            om.organization.apiKey = undefined;
            om.membership = item.isAdmin ? OrganizationMembershipValues.ADMIN : OrganizationMembershipValues.MEMBER;
            return om;
        });
    }

    async addMemberAsUser(userInfo: UserInfo, request: AddMemberRequest): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo);
        Validation.requireParam(request.organizationId, "orgID");
        Validation.requireParam(request.userId, "userID");

        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, request.organizationId))) {
            throw new UnauthorizedError(`You are not a member of organization ${request.organizationId}`);
        }
        
        return this.addMember(request);
    }

    private addMember(request: AddMemberRequest): Promise<void> {
        const organizationMembership = new OrganizationMembershipDBO();
        organizationMembership.organizationId = request.organizationId;
        organizationMembership.donorId = request.userId;
        organizationMembership.isAdmin = request.isAdmin ?? false;
        organizationMembership.membershipStartDate = new Date();

        return this.orgMembershipDao.saveMembership(organizationMembership);
    }

    async removeMember(userInfo: UserInfo, organizationId: number, userId: number): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo);
        Validation.requireParam(organizationId, "orgID");
        Validation.requireParam(userId, "userID");

        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organizationId))) {
            throw new UnauthorizedError(`You are not a member of organization ${organizationId}`);
        }

        await this.orgMembershipDao.deleteMembership(organizationId, userId);
    }

    async userBelongsToOrganization(userId: number, organizationId: number): Promise<boolean> {
        // TODO: This can be simplified with one SQL query looking for userId and orgId in the same row.
        const memberships = await this.getOrganizationsForUser(null, userId);
        return memberships.some(
            (membership: OrganizationMembership): boolean => {
                return membership.organization.id === organizationId;
            }
        );
    }
}