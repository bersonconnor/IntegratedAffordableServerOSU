"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const JoinGroupService_1 = require("../services/JoinGroupService");
const OrganizationServiceImpl_1 = require("../services/organization/OrganizationServiceImpl");
const GrantServiceImpl_1 = require("../services/grant/GrantServiceImpl");
class OrganizationController {
    // TODO: Consider DI
    constructor() {
        this.organizationService = new OrganizationServiceImpl_1.OrganizationServiceImpl();
        this.joinGroupService = new JoinGroupService_1.JoinGroupService();
        this.grantService = new GrantServiceImpl_1.GrantServiceImpl();
        this.createOrganization = this.createOrganization.bind(this);
        this.updateOrganization = this.updateOrganization.bind(this);
        this.addOrganizationInfo = this.addOrganizationInfo.bind(this);
        this.getOrganization = this.getOrganization.bind(this);
        this.getApiKey = this.getApiKey.bind(this);
        this.addMemberToOrganization = this.addMemberToOrganization.bind(this);
        this.getOrganizationsForUser = this.getOrganizationsForUser.bind(this);
        this.removeMemberFromOrganization = this.removeMemberFromOrganization.bind(this);
    }
    /**
     * Create an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async createOrganization(req, res, next) {
        const orgReq = req.body;
        try {
            const createdOrg = await this.organizationService.createOrganization(res.locals.userInfo, orgReq);
            res.status(200).json(createdOrg);
        }
        catch (error) {
            next(error);
        }
    }
    async removeMemberFromOrganization(req, res, next) {
        try {
            await this.organizationService.removeMember(res.locals.userInfo, Number.parseInt(req.params.organizationId), Number.parseInt(req.params.userId));
            res.sendStatus(200);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async updateOrganization(req, res, next) {
        const orgReq = req.body;
        orgReq.id = Number.parseInt(req.params.id);
        try {
            const updatedOrg = await this.organizationService.updateOrganization(res.locals.userInfo, orgReq);
            res.status(200).json(updatedOrg);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Retrieve an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async getOrganization(req, res, next) {
        const orgId = Number.parseInt(req.params.id);
        try {
            const organization = await this.organizationService.getOrganization(res.locals.userInfo, orgId);
            res.status(200).json(organization);
        }
        catch (error) {
            next(error);
        }
    }
    // TODO: properly refactor
    async addOrganizationInfo(req, res, next) {
        await this.organizationService.addOrganizationInfo(req, res);
    }
    /**
     * Create an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async addMemberToOrganization(req, res, next) {
        const membershipRequest = req.body;
        try {
            await this.organizationService.addMemberAsUser(res.locals.userInfo, membershipRequest);
            res.status(200).json({ status: "OK" });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get the api key for an organization in Affordable
     * @param req
     * @param res
     * @param next
     */
    async getApiKey(req, res, next) {
        const organizationId = Number.parseInt(req.params.id);
        try {
            const apiKey = await this.organizationService.getApiKey(res.locals.userInfo, organizationId);
            res.status(200).json(apiKey);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     *
     */
    async getOrganizationsForUser(req, res, next) {
        const userInfo = res.locals.userInfo;
        const userId = Number.parseInt(req.params.userId);
        try {
            const organizations = await this.organizationService.getOrganizationsForUser(userInfo, userId);
            res.status(200).json(organizations);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrganizationController = OrganizationController;
