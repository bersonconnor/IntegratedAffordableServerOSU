import { config } from "dotenv";
import { AddMemberRequest, CreateUserRequest, Grant, Organization, UserInfo, UserType } from "affordable-shared-models";
import uuidv4 from "uuid/v4";
import { DonationRecordDAO } from "../database/dao/grant/DonationRecordDAO";
// ORMs
import { AuthenticationInformationDBO } from "../models/orm/AuthenticationInformationDBO";
import { DonationRecord } from "../models/orm/DonationRecord";
// Services
import { JoinGroupService } from "../services/JoinGroupService";
import { ProfileService } from "../services/ProfileService";
import { AuthenticationService } from "../services/AuthenticationService";
import { OrganizationServiceImpl } from "../services/organization/OrganizationServiceImpl";
import { AuthenticationServiceImpl } from "../services/AuthenticationServiceImpl";
import { GrantService } from "../services/grant/GrantService";
import { GrantServiceImpl } from "../services/grant/GrantServiceImpl";
import { EmailService } from "../services/EmailService";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { EligibilityCriteriaService } from "../services/grant/EligibilityCriteriaService";
import { EligibilityCriteriaServiceImpl } from "../services/grant/EligibilityCriteriaServiceImpl";

config();

/**
 * Uses services to create objects. Note that behavior in this class is untested!
 */
export class ServiceIntegrationTestUtils {
    private authService: AuthenticationService;
    private grantService: GrantService;
    private orgService: OrganizationServiceImpl;
    private donationRecordDao: DonationRecordDAO; // TODO: don't use a DAO!
    private joinGroupSvc: JoinGroupService;
    private profileService: ProfileService;
    private emailService: EmailService;
    private eligibilityService: EligibilityCriteriaService;

    // TODO: Consider DI
    public constructor(authenticationService?: AuthenticationService,
                       emailService?: EmailService,
                       grantService?: GrantService) {
        this.authService = authenticationService ?? new AuthenticationServiceImpl();
        this.emailService = this.emailService ?? new EmailService();
        this.grantService = grantService ?? new GrantServiceImpl();
        this.orgService = new OrganizationServiceImpl();
        this.joinGroupSvc = new JoinGroupService();
        this.profileService = new ProfileService();
        this.donationRecordDao = new DonationRecordDAO(); // TODO = new don't use a DAO!
        this.eligibilityService = new EligibilityCriteriaServiceImpl();
    }


    public createUserAuthInfo(isDonor = true): AuthenticationInformationDBO {
        const newUser = new AuthenticationInformationDBO();
        newUser.username = uuidv4();
        newUser.password = "P@$sVVoRd";
        newUser.TwoFactor = true;
        newUser.TwoFactorCode = "a code";
        newUser.deactivated = false;
        newUser.isDonor = isDonor;

        return newUser;
    }

    public createUserRequest(isDonor = true): CreateUserRequest {
        const newUser = new CreateUserRequest();
        newUser.username = uuidv4();
        newUser.email = uuidv4() + "@address.com";
        newUser.password = "P@$sVVoRd";
        newUser.TwoFactor = true;
        newUser.TwoFactorCode = "a code";
        newUser.deactivated = false;
        newUser.usertype = isDonor ? UserType.DONOR : UserType.RECIPIENT;
        return newUser;
    }


    /**
     * Creates a new user and adds them to the database.
     */
    public async createUser(isDonor = true, verifiedEmail = true): Promise<UserInfo> {
        const adminUserInfo =  await this.authService.getUserInfo(process.env.AFFORDABLE_ADMIN_USER);
        const newUser = this.createUserRequest(isDonor);
        const userInfo = (await this.authService.registerUser(newUser)).userInfo;
        await this.emailService.adminVerifyEmail(adminUserInfo, userInfo.username);
        return await this.authService.getUserInfo(userInfo.id);
    }

    /**
     * Deletes user from the database.
     */
    public async deleteUser(userId: number): Promise<void> {
        return this.authService.deleteUserInfo(userId);
    }


    /**
     * Create an organization and add it to the database.
     * @param userInfo the user who is creating the organization, and will become admin
     */
    public createOrganization(userInfo: UserInfo): Promise<Organization> {
        const org = new Organization();
        org.name = uuidv4();
        org.email = "orgEmail";
        org.phone = "1425135";
        org.fax = "0943805923";
        org.url = "gov.net";
        org.missionStatement = "Grants";
        org.providesService = true;
        org.hasBankingInfo = false;
        org.isVerified = true;
        org.ein = null;
        org.irsActivityCode = null;
        org.taxSection = null;
        return this.orgService.createOrganization(userInfo, org);
    }

    public async createGrant(userInfo: UserInfo, organizationId?: number): Promise<Grant> {
        const request = {
            grantName: "Grant " + uuidv4(),
            grantAmount: 100.00,
            description: "Description " + uuidv4(),
            organization: { id: organizationId }
        } as Grant;
        return await this.grantService.createGrant(userInfo, request);
    }

    public async createEligibilityCriteria(userInfo: UserInfo, organizationId: number): Promise<EligibilityCriteria> {
        const request = new EligibilityCriteria();
        request.organizationId = organizationId;
        request.emailAddress = "anyEmail@affordhealth.org";
        return await this.eligibilityService.createEligibilityCriteria(userInfo, request);
    }


    public async deleteOrganization(userInfo: UserInfo, orgId: number): Promise<void> {
        await this.orgService.deleteOrganization(userInfo, orgId);
    }

    public async addDonorToOrganization(userId: number, orgId: number, isAdmin = false): Promise<void> {
        // TODO: change this req body to just a plain object. reqs refactoring the service
        const req = new AddMemberRequest();
        req.userId = userId;
        req.organizationId = orgId;
        req.isAdmin = isAdmin;
        await this.joinGroupSvc.addUserToOrganization(req);
    }

    public async deleteGrant(userInfo: UserInfo, grantId: number): Promise<void> {
        return this.grantService.deleteGrant(userInfo, grantId);
    }

    public async createDonationRecord(grantId: number, donorId: number, donationAmt?: number): Promise<DonationRecord> {
        const record = new DonationRecord();
        record.grantId = grantId;
        record.donorId = donorId;
        record.donateAmount = donationAmt || 0;
        return this.donationRecordDao.createDonationRecord(record);
    }

}