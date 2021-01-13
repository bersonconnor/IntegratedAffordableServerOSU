"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationServiceImpl = void 0;
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
const DBOOrganizationDAOImpl_1 = require("../../database/dao/organization/DBOOrganizationDAOImpl");
const DBOOrganizationMembershipDAOImpl_1 = require("../../database/dao/organization/DBOOrganizationMembershipDAOImpl");
const DatabaseConnection_1 = __importDefault(require("../../database/DatabaseConnection"));
const OrganizationMembershipDBO_1 = require("../../models/orm/OrganizationMembershipDBO");
const utils = __importStar(require("../../utils"));
const Validation_1 = require("../../utils/Validation");
const AffordableSESClient_1 = require("../email/AffordableSESClient");
const OrganizationUtils_1 = require("./OrganizationUtils");
const AuthorizationUtils_1 = require("../AuthorizationUtils");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
const AuthenticationServiceImpl_1 = require("../AuthenticationServiceImpl");
const connectionPool = DatabaseConnection_1.default.getInstance();
class OrganizationServiceImpl {
    constructor(authService, organizationDao, organizationMembershipDao, emailClient) {
        this.orgDao = organizationDao !== null && organizationDao !== void 0 ? organizationDao : new DBOOrganizationDAOImpl_1.DBOOrganizationDAOImpl();
        this.orgMembershipDao = organizationMembershipDao !== null && organizationMembershipDao !== void 0 ? organizationMembershipDao : new DBOOrganizationMembershipDAOImpl_1.DBOOrganizationMembershipDAOImpl();
        this.authService = authService !== null && authService !== void 0 ? authService : new AuthenticationServiceImpl_1.AuthenticationServiceImpl();
        this.emailClient = emailClient !== null && emailClient !== void 0 ? emailClient : AffordableSESClient_1.AffordableSESClient.getInstance();
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
    async createOrganization(userInfo, organization) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        organization.id = undefined;
        Validation_1.Validation.requireParam(organization.name, "name");
        // Generate an API Key
        organization.apiKey = v4_1.default();
        const dbo = OrganizationUtils_1.OrganizationUtils.mapDtoToDbo(organization);
        const createdOrg = await this.orgDao.saveOrganization(dbo);
        // Add them to the organization as an administrator
        const addMemberRequest = new affordable_shared_models_1.AddMemberRequest();
        addMemberRequest.userId = userInfo.id;
        addMemberRequest.organizationId = createdOrg.id;
        addMemberRequest.isAdmin = true;
        await this.addMember(addMemberRequest);
        return this.getOrganization(userInfo, createdOrg.id);
    }
    async updateOrganization(userInfo, organization) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        Validation_1.Validation.requireParam(organization.id, "id");
        Validation_1.Validation.requireParam(organization.name, "name");
        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organization.id))) {
            throw new UnauthorizedError_1.UnauthorizedError(`You are not a member of organization ${organization.id}`);
        }
        const currentOrganization = await this.getOrganization(userInfo, organization.id);
        // Do not update the API key
        organization.apiKey = currentOrganization.apiKey;
        const dbo = OrganizationUtils_1.OrganizationUtils.mapDtoToDbo(organization);
        return OrganizationUtils_1.OrganizationUtils.mapDboToDto(await this.orgDao.saveOrganization(dbo));
    }
    /**
     * Gets an organization
     * @param orgId
     */
    async getOrganization(userInfo, orgId) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false);
        const organization = OrganizationUtils_1.OrganizationUtils.mapDboToDto(await this.orgDao.getOrganizationById(orgId));
        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organization.id))) {
            organization.apiKey = undefined;
        }
        Validation_1.Validation.requireParam(orgId, "orgId");
        return organization;
    }
    /**
     * Deletes an organization
     * @param orgId
     */
    async deleteOrganization(userInfo, orgId) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false);
        if (!(await this.userBelongsToOrganization(userInfo.id, orgId))) {
            throw new UnauthorizedError_1.UnauthorizedError("You can't delete this organization because you are not a member");
        }
        Validation_1.Validation.requireParam(orgId, "orgId");
        await this.orgDao.deleteOrganizationById(orgId);
    }
    //Send verification email for add org
    async sendVerificationEmailForAddOrg(req, res) {
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
    async getApiKey(userInfo, organizationId) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organizationId))) {
            throw new UnauthorizedError_1.UnauthorizedError(`You are not a member of organization ${organizationId}`);
        }
        return this.orgDao.getApiKey(organizationId);
    }
    //Adds organization information *Should only be called after the organization it is referencing has been added to the database*
    async addOrganizationInfo(req, res) {
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
                    res.status(502).json({ error });
                }
                else {
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
                    res.status(502).json({ error });
                }
                else {
                    console.log("Organization Banking Info inserted");
                }
            });
        }
        const membershipReq = new OrganizationMembershipDBO_1.OrganizationMembershipDBO();
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
                    res.status(502).json({ error });
                }
                else {
                    console.log("Organization Location Records inserted");
                    //Will only send status 200 if all previous queries were successful
                    if (successfulQuery) {
                        res.status(200).json({ "status": "OK" });
                    }
                }
            });
        }
    }
    async getOrganizationsForUser(userInfo, userId) {
        // No need to be authorized
        const organizations = await this.orgMembershipDao.getAllMembershipsOfUser(userId);
        return organizations.map((item) => {
            const om = new affordable_shared_models_1.OrganizationMembership();
            om.organization = OrganizationUtils_1.OrganizationUtils.mapDboToDto(item.organization);
            om.organization.apiKey = undefined;
            om.membership = item.isAdmin ? affordable_shared_models_1.OrganizationMembershipValues.ADMIN : affordable_shared_models_1.OrganizationMembershipValues.MEMBER;
            return om;
        });
    }
    async addMemberAsUser(userInfo, request) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo);
        Validation_1.Validation.requireParam(request.organizationId, "orgID");
        Validation_1.Validation.requireParam(request.userId, "userID");
        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, request.organizationId))) {
            throw new UnauthorizedError_1.UnauthorizedError(`You are not a member of organization ${request.organizationId}`);
        }
        return this.addMember(request);
    }
    addMember(request) {
        var _a;
        const organizationMembership = new OrganizationMembershipDBO_1.OrganizationMembershipDBO();
        organizationMembership.organizationId = request.organizationId;
        organizationMembership.donorId = request.userId;
        organizationMembership.isAdmin = (_a = request.isAdmin) !== null && _a !== void 0 ? _a : false;
        organizationMembership.membershipStartDate = new Date();
        return this.orgMembershipDao.saveMembership(organizationMembership);
    }
    async removeMember(userInfo, organizationId, userId) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo);
        Validation_1.Validation.requireParam(organizationId, "orgID");
        Validation_1.Validation.requireParam(userId, "userID");
        // Verify that the user is a member of the organization
        if (!(await this.userBelongsToOrganization(userInfo.id, organizationId))) {
            throw new UnauthorizedError_1.UnauthorizedError(`You are not a member of organization ${organizationId}`);
        }
        await this.orgMembershipDao.deleteMembership(organizationId, userId);
    }
    async userBelongsToOrganization(userId, organizationId) {
        // TODO: This can be simplified with one SQL query looking for userId and orgId in the same row.
        const memberships = await this.getOrganizationsForUser(null, userId);
        return memberships.some((membership) => {
            return membership.organization.id === organizationId;
        });
    }
}
exports.OrganizationServiceImpl = OrganizationServiceImpl;
