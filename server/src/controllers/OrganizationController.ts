import { AddMemberRequest, Organization, UserInfo } from "affordable-shared-models";
import {JoinGroupService} from "../services/JoinGroupService";
import {OrganizationServiceImpl} from "../services/organization/OrganizationServiceImpl";
import {NextFunction, Request, Response} from "express";
import { GrantService } from "../services/grant/GrantService";
import { GrantServiceImpl } from "../services/grant/GrantServiceImpl";
import { OrganizationService } from "../services/organization/OrganizationService";

export class OrganizationController {

    private organizationService: OrganizationService;
    private grantService: GrantService;
    private joinGroupService: JoinGroupService;

    // TODO: Consider DI
    public constructor() {
        this.organizationService = new OrganizationServiceImpl();
        this.joinGroupService = new JoinGroupService();
        this.grantService = new GrantServiceImpl();

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
    public async createOrganization (req: Request, res: Response, next: NextFunction): Promise<void> {
        const orgReq: Organization = req.body as Organization;
        try {
            const createdOrg = await this.organizationService.createOrganization(res.locals.userInfo, orgReq);
            res.status(200).json(createdOrg);
        } catch (error) {
            next(error);
        }
    }

    public async removeMemberFromOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.organizationService.removeMember(res.locals.userInfo,
                Number.parseInt(req.params.organizationId),
                Number.parseInt(req.params.userId));
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }

    }

    /**
     * Update an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
        const orgReq: Organization = req.body as Organization;
        orgReq.id = Number.parseInt(req.params.id);
        try {
            const updatedOrg = await this.organizationService.updateOrganization(res.locals.userInfo, orgReq);
            res.status(200).json(updatedOrg);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieve an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async getOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
        const orgId: number = Number.parseInt(req.params.id);
        try {
            const organization = await this.organizationService.getOrganization(res.locals.userInfo, orgId);
            res.status(200).json(organization);
        } catch (error) {
            next(error);
        }
    }

    // TODO: properly refactor
    public async addOrganizationInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.organizationService.addOrganizationInfo(req, res);
    }

    /**
     * Create an organization in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async addMemberToOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
        const membershipRequest = req.body as AddMemberRequest;
        try {
            await this.organizationService.addMemberAsUser(res.locals.userInfo, membershipRequest);
            res.status(200).json({ status: "OK" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get the api key for an organization in Affordable
     * @param req 
     * @param res 
     * @param next 
     */
    public async getApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        const organizationId: number = Number.parseInt(req.params.id);
        try {
            const apiKey = await this.organizationService.getApiKey(res.locals.userInfo, organizationId);
            res.status(200).json(apiKey);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async getOrganizationsForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userInfo: UserInfo = res.locals.userInfo;
        const userId: number = Number.parseInt(req.params.userId);
        try {
            const organizations = await this.organizationService.getOrganizationsForUser(userInfo, userId);
            res.status(200).json(organizations);
        } catch(error) {
            next(error);
        }

    }
}