"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantController = void 0;
const GrantServiceImpl_1 = require("../services/grant/GrantServiceImpl");
class GrantController {
    constructor(grantService) {
        this.grantService = grantService !== null && grantService !== void 0 ? grantService : new GrantServiceImpl_1.GrantServiceImpl();
        this.createGrant = this.createGrant.bind(this);
        this.updateGrant = this.updateGrant.bind(this);
        this.getGrant = this.getGrant.bind(this);
        this.deleteGrant = this.deleteGrant.bind(this);
        this.getAllGrants = this.getAllGrants.bind(this);
        this.applyToGrant = this.applyToGrant.bind(this);
        this.awardGrant = this.awardGrant.bind(this);
        this.getGrantApplicants = this.getGrantApplicants.bind(this);
    }
    /**
     * Create a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async createGrant(req, res, next) {
        const grant = req.body;
        try {
            const createdGrant = await this.grantService.createGrant(res.locals.userInfo, grant);
            res.status(200).json(createdGrant);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async updateGrant(req, res, next) {
        const grant = req.body;
        grant.id = Number.parseInt(req.params.id);
        try {
            const updatedGrant = await this.grantService.updateGrant(res.locals.userInfo, grant);
            res.status(200).json(updatedGrant);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Retrieve a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async getGrant(req, res, next) {
        const id = Number.parseInt(req.params.id);
        try {
            const retrievedGrant = await this.grantService.getGrant(res.locals.userInfo, id);
            res.status(200).json(retrievedGrant);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async deleteGrant(req, res, next) {
        const id = Number.parseInt(req.params.id);
        try {
            await this.grantService.deleteGrant(res.locals.userInfo, id);
            res.sendStatus(200);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllGrants(req, res, next) {
        try {
            const grants = await this.grantService.getAllGrantsByUserType(res.locals.userInfo);
            res.status(200).json(grants);
        }
        catch (error) {
            next(error);
        }
    }
    async applyToGrant(req, res, next) {
        try {
            const grantId = Number.parseInt(req.params.grantId);
            await this.grantService.applyToGrant(res.locals.userInfo, grantId);
            res.sendStatus(200);
        }
        catch (error) {
            next(error);
        }
    }
    async getGrantApplicants(req, res, next) {
        try {
            const grantId = Number.parseInt(req.params.grantId);
            const applicants = await this.grantService.getApplicants(res.locals.userInfo, grantId);
            res.status(200).json(applicants);
        }
        catch (error) {
            next(error);
        }
    }
    async awardGrant(req, res, next) {
        try {
            const grantId = Number.parseInt(req.params.grantId);
            const userId = Number.parseInt(req.params.userId);
            await this.grantService.awardGrantToUser(res.locals.userInfo, userId, grantId);
            res.sendStatus(200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GrantController = GrantController;
