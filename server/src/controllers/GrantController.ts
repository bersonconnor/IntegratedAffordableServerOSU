import { NextFunction, Request, Response } from "express";
import { GrantService } from "../services/grant/GrantService";
import { GrantServiceImpl } from "../services/grant/GrantServiceImpl";
import { Grant, UserInfo } from "affordable-shared-models";
import { Applicant } from "affordable-shared-models/dist/models/Applicant";

export class GrantController {

    private grantService: GrantService;

    public constructor(grantService?: GrantService) {
        this.grantService = grantService ?? new GrantServiceImpl();

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
    public async createGrant(req: Request, res: Response, next: NextFunction): Promise<void> {
        const grant = req.body as Grant;
        try {
            const createdGrant = await this.grantService.createGrant(res.locals.userInfo as UserInfo, grant);
            res.status(200).json(createdGrant);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async updateGrant(req: Request, res: Response, next: NextFunction): Promise<void> {
        const grant = req.body as Grant;
        grant.id = Number.parseInt(req.params.id);
        try {
            const updatedGrant = await this.grantService.updateGrant(res.locals.userInfo as UserInfo, grant);
            res.status(200).json(updatedGrant);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieve a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async getGrant(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number.parseInt(req.params.id);
        try {
            const retrievedGrant = await this.grantService.getGrant(res.locals.userInfo, id);
            res.status(200).json(retrievedGrant);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a Grant
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async deleteGrant(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number.parseInt(req.params.id);
        try {
            await this.grantService.deleteGrant(res.locals.userInfo as UserInfo, id);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    public async getAllGrants(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const grants: Grant[] = await this.grantService.getAllGrantsByUserType(res.locals.userInfo as UserInfo);
            res.status(200).json(grants);
        } catch (error) {
            next(error);
        }
    }

    public async applyToGrant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const grantId = Number.parseInt(req.params.grantId);
            await this.grantService.applyToGrant(res.locals.userInfo as UserInfo, grantId);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    public async getGrantApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const grantId = Number.parseInt(req.params.grantId);
            const applicants: Applicant[] = await this.grantService.getApplicants(res.locals.userInfo as UserInfo, grantId);
            res.status(200).json(applicants);
        } catch (error) {
            next(error);
        }
    }

    public async awardGrant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const grantId = Number.parseInt(req.params.grantId);
            const userId = Number.parseInt(req.params.userId);
            await this.grantService.awardGrantToUser(res.locals.userInfo as UserInfo, userId, grantId);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }


}