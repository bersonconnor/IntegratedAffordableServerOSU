"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceIntegrationTestUtils = void 0;
const dotenv_1 = require("dotenv");
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
const DonationRecordDAO_1 = require("../database/dao/grant/DonationRecordDAO");
// ORMs
const AuthenticationInformationDBO_1 = require("../models/orm/AuthenticationInformationDBO");
const DonationRecord_1 = require("../models/orm/DonationRecord");
// Services
const JoinGroupService_1 = require("../services/JoinGroupService");
const ProfileService_1 = require("../services/ProfileService");
const OrganizationServiceImpl_1 = require("../services/organization/OrganizationServiceImpl");
const AuthenticationServiceImpl_1 = require("../services/AuthenticationServiceImpl");
const GrantServiceImpl_1 = require("../services/grant/GrantServiceImpl");
const EmailService_1 = require("../services/EmailService");
const EligibilityCriteria_1 = require("affordable-shared-models/dist/models/EligibilityCriteria");
const EligibilityCriteriaServiceImpl_1 = require("../services/grant/EligibilityCriteriaServiceImpl");
dotenv_1.config();
/**
 * Uses services to create objects. Note that behavior in this class is untested!
 */
class ServiceIntegrationTestUtils {
    // TODO: Consider DI
    constructor(authenticationService, emailService, grantService) {
        var _a;
        this.authService = authenticationService !== null && authenticationService !== void 0 ? authenticationService : new AuthenticationServiceImpl_1.AuthenticationServiceImpl();
        this.emailService = (_a = this.emailService) !== null && _a !== void 0 ? _a : new EmailService_1.EmailService();
        this.grantService = grantService !== null && grantService !== void 0 ? grantService : new GrantServiceImpl_1.GrantServiceImpl();
        this.orgService = new OrganizationServiceImpl_1.OrganizationServiceImpl();
        this.joinGroupSvc = new JoinGroupService_1.JoinGroupService();
        this.profileService = new ProfileService_1.ProfileService();
        this.donationRecordDao = new DonationRecordDAO_1.DonationRecordDAO(); // TODO = new don't use a DAO!
        this.eligibilityService = new EligibilityCriteriaServiceImpl_1.EligibilityCriteriaServiceImpl();
    }
    createUserAuthInfo(isDonor = true) {
        const newUser = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
        newUser.username = v4_1.default();
        newUser.password = "P@$sVVoRd";
        newUser.TwoFactor = true;
        newUser.TwoFactorCode = "a code";
        newUser.deactivated = false;
        newUser.isDonor = isDonor;
        return newUser;
    }
    createUserRequest(isDonor = true) {
        const newUser = new affordable_shared_models_1.CreateUserRequest();
        newUser.username = v4_1.default();
        newUser.email = v4_1.default() + "@address.com";
        newUser.password = "P@$sVVoRd";
        newUser.TwoFactor = true;
        newUser.TwoFactorCode = "a code";
        newUser.deactivated = false;
        newUser.usertype = isDonor ? affordable_shared_models_1.UserType.DONOR : affordable_shared_models_1.UserType.RECIPIENT;
        return newUser;
    }
    /**
     * Creates a new user and adds them to the database.
     */
    async createUser(isDonor = true, verifiedEmail = true) {
        const adminUserInfo = await this.authService.getUserInfo(process.env.AFFORDABLE_ADMIN_USER);
        const newUser = this.createUserRequest(isDonor);
        const userInfo = (await this.authService.registerUser(newUser)).userInfo;
        await this.emailService.adminVerifyEmail(adminUserInfo, userInfo.username);
        return await this.authService.getUserInfo(userInfo.id);
    }
    /**
     * Deletes user from the database.
     */
    async deleteUser(userId) {
        return this.authService.deleteUserInfo(userId);
    }
    /**
     * Create an organization and add it to the database.
     * @param userInfo the user who is creating the organization, and will become admin
     */
    createOrganization(userInfo) {
        const org = new affordable_shared_models_1.Organization();
        org.name = v4_1.default();
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
    async createGrant(userInfo, organizationId) {
        const request = {
            grantName: "Grant " + v4_1.default(),
            grantAmount: 100.00,
            description: "Description " + v4_1.default(),
            organization: { id: organizationId }
        };
        return await this.grantService.createGrant(userInfo, request);
    }
    async createEligibilityCriteria(userInfo, organizationId) {
        const request = new EligibilityCriteria_1.EligibilityCriteria();
        request.organizationId = organizationId;
        request.emailAddress = "anyEmail@affordhealth.org";
        return await this.eligibilityService.createEligibilityCriteria(userInfo, request);
    }
    async deleteOrganization(userInfo, orgId) {
        await this.orgService.deleteOrganization(userInfo, orgId);
    }
    async addDonorToOrganization(userId, orgId, isAdmin = false) {
        // TODO: change this req body to just a plain object. reqs refactoring the service
        const req = new affordable_shared_models_1.AddMemberRequest();
        req.userId = userId;
        req.organizationId = orgId;
        req.isAdmin = isAdmin;
        await this.joinGroupSvc.addUserToOrganization(req);
    }
    async deleteGrant(userInfo, grantId) {
        return this.grantService.deleteGrant(userInfo, grantId);
    }
    async createDonationRecord(grantId, donorId, donationAmt) {
        const record = new DonationRecord_1.DonationRecord();
        record.grantId = grantId;
        record.donorId = donorId;
        record.donateAmount = donationAmt || 0;
        return this.donationRecordDao.createDonationRecord(record);
    }
}
exports.ServiceIntegrationTestUtils = ServiceIntegrationTestUtils;
