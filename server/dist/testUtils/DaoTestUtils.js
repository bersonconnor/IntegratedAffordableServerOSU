"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoTestUtils = void 0;
const v4_1 = __importDefault(require("uuid/v4"));
const DBOGrantDAOImpl_1 = require("../database/dao/grant/DBOGrantDAOImpl");
const DBOOrganizationDAOImpl_1 = require("../database/dao/organization/DBOOrganizationDAOImpl");
const AuthenticationInformationDBO_1 = require("../models/orm/AuthenticationInformationDBO");
const GrantDBO_1 = require("../models/orm/grant/GrantDBO");
const OrganizationDBO_1 = require("../models/orm/OrganizationDBO");
const DBOAuthenticationInformationDAOImpl_1 = require("../database/dao/authentication/DBOAuthenticationInformationDAOImpl");
/**
 * Uses services to create objects. Note that behavior in this class is untested!
 */
class DaoTestUtils {
    // TODO: Consider DI
    constructor(authenticationDao) {
        this.authDao = authenticationDao !== null && authenticationDao !== void 0 ? authenticationDao : new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        this.orgDao = new DBOOrganizationDAOImpl_1.DBOOrganizationDAOImpl();
        this.grantDao = new DBOGrantDAOImpl_1.DBOGrantDAOImpl();
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
    /**
     * Creates a new user and adds them to the database.
     */
    async createUser(isDonor = true) {
        const newUser = this.createUserAuthInfo(isDonor);
        return this.authDao.createUser(newUser);
    }
    /**
     * Deletes user from the database.
     */
    async deleteUser(userId) {
        return this.authDao.deleteUserById(userId);
    }
    /**
     * Create an organization and add it to the database.
     */
    async createOrganization() {
        const org = new OrganizationDBO_1.OrganizationDBO();
        org.name = v4_1.default();
        org.email = "orgEmail";
        org.phone = "1425135";
        org.fax = "0943805923";
        org.websiteUrl = "gov.net";
        org.mission = "Grants";
        org.provideService = true;
        org.addBankingInfo = false;
        org.verified = true;
        return await this.orgDao.saveOrganization(org);
    }
    async deleteOrganization(orgId) {
        this.orgDao.deleteOrganizationById(orgId);
    }
    async createGrant(organizationId) {
        const request = new GrantDBO_1.GrantDBO();
        request.grantName = "Grant " + v4_1.default();
        request.organizationId = organizationId;
        request.grantAmount = "99.99";
        request.description = "";
        request.startTime = new Date();
        return await this.grantDao.createGrant(request);
    }
    async deleteGrant(grantId) {
        return await this.grantDao.deleteGrantById(grantId);
    }
}
exports.DaoTestUtils = DaoTestUtils;
