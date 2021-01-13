import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";
import { Admin, AdminRegistrationResponse, AdminRegistrationRequest, AdminPrivileges, AdminPrivilegeUpdateRequest, AdminPrivilegeUpdateResponse, AdminEmailRequest, AdminEmailResponse, AdminDeactivateUserRequest, AdminDeactivateUserResponse, UserType } from "affordable-shared-models";
import { AdminService } from "../services/AdminService";
import { AuditTrailService } from "../services/AuditTrailService";
import { AuthenticationService } from "../services/AuthenticationService";
import { AuthenticationServiceImpl } from "../services/AuthenticationServiceImpl";
import { AdminPrivilegesDBO } from "../models/orm/profile/AdminPrivilegesDBO";
import { AuditTrailDBO } from "../models/orm/AuditTrailDBO"
import { UserInfo } from "../../../client/node_modules/affordable-shared-models/dist";

export class AdminController {

    emailService: EmailService;
    adminService: AdminService;
    authService: AuthenticationService;
    auditTrailService: AuditTrailService;

    public constructor(emailService?: EmailService) {
        this.emailService = emailService ?? new EmailService();
        this.adminService = new AdminService();
        this.authService = new AuthenticationServiceImpl();
        this.auditTrailService = new AuditTrailService();

        this.getAllAdmins = this.getAllAdmins.bind(this);
        this.getAllAdminPrivileges = this.getAllAdminPrivileges.bind(this);
        this.getAdminRegistrationRequests = this.getAdminRegistrationRequests.bind(this);
        this.acceptAdminRegistration = this.acceptAdminRegistration.bind(this);
        this.rejectAdminRegistration = this.rejectAdminRegistration.bind(this);
        this.revokeAdminAccess = this.revokeAdminAccess.bind(this);
        this.getAdminPrivileges = this.getAdminPrivileges.bind(this);
        this.setAdminPrivileges = this.setAdminPrivileges.bind(this);
        this.resetAuthInfoNonAdmin = this.resetAuthInfoNonAdmin.bind(this);
        this.resetAuthInfoAdmin = this.resetAuthInfoAdmin.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.activateDeactivateUser = this.activateDeactivateUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllAuditTrails = this.getAllAuditTrails.bind(this);
        this.recordAuditTrails = this.recordAuditTrails.bind(this);
    }


    // public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     const username = req.query.username;
    //     try {
    //         await this.emailService.adminVerifyEmail(res.locals.userInfo, username);
    //         res.sendStatus(200);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    public async getAllAdmins(req: Request, res: Response): Promise<Array<UserInfo>> {
        let userId = Number(req.query.userId);
        let adminInfo = await this.authService.getUserInfo(Number(userId));

        if (adminInfo.userType !== UserType.ADMIN) {
            res.status(403).send();
            return null;
        } else {
            let allUsers = await this.authService.getAllUsers();
            let admins = new Array<UserInfo>();
            allUsers.forEach(user => {
                if (user.userType === UserType.ADMIN) {
                    admins.push(user);
                }
            });
            res.status(200).send(admins)
            return admins;
        }
    }

    public async getAllAdminPrivileges(req: Request, res: Response): Promise<void> {
        let admins: Array<AdminPrivilegesDBO> = await this.adminService.getAdmins();
        let infoReqs = new Array<Promise<UserInfo>>();
        let privs = new Array<AdminPrivileges>();

        admins.forEach(admin => {
            if (admin.active) {
                infoReqs.push(this.authService.getUserInfo(admin.userid));
            }
        });

        let info: Array<UserInfo> = await Promise.all(infoReqs);

        admins.forEach(admin => {
            if (admin.active) {
                let username = info.find(user => user.id === admin.userid).username;
                let adminPrivs = AdminPrivilegesDBO.toAdminPrivileges(admin, username);
                privs.push(adminPrivs);
            }
        });

        console.log("contoller admins: ", privs);
        res.status(200).send(privs);
    }

    public async getAdminPrivileges(req: Request, res: Response): Promise<void> {
        const body: Admin = {
            userId: Number(req.query.userId)
        }
        let admin = await this.adminService.getPrivileges(body.userId);
        let adminInfo = await this.authService.getUserInfo(body.userId);

        let response = AdminPrivilegesDBO.toAdminPrivileges(admin, adminInfo.username);

        res.status(200).send(response)
    }

    public async setAdminPrivileges(req: Request, res: Response) {
        const body = req.body as AdminPrivilegeUpdateRequest;

        let adminInfo = await this.authService.getUserInfo(body.privileges.userid);
        let requestorPrivs = await this.adminService.getPrivileges(body.adminId);
        let requestorInfo = await this.authService.getUserInfo(body.adminId);

        if (body.adminId === body.privileges.userid || !requestorPrivs.setPrivileges || adminInfo.username === "admin") {
            res.status(403).send();
        }

        let privs = AdminPrivilegesDBO.fromAdminPrivileges(body.privileges);
        let admin = await this.adminService.setPrivileges(privs);
        let response = AdminPrivilegesDBO.toAdminPrivileges(admin, adminInfo.username);

        this.emailService.sendAdminPrivilegesEmail(adminInfo, requestorInfo.username);
        this.emailService.notifyAllAdminsOfPrivsChange(adminInfo, requestorInfo.username);
        res.status(200).send(response)
    }

    public async getAdminRegistrationRequests(req: Request, res: Response): Promise<void> {
        let requests = await this.adminService.getRegistrationRequests();
        let promises = new Array<Promise<UserInfo>>();

        for (const request of requests) {
            promises.push(this.authService.getUserInfo(request.userid));
        };

        let accounts: Array<UserInfo> = await Promise.all(promises);
        let response = new Array<AdminRegistrationResponse>();

        accounts.forEach(account => {
            response.push({
                userId: account.id,
                username: account.username,
                email: account.primaryEmail,
                isAccepted: false
            });
        });
        res.status(200).send(response);
    }

    public async acceptAdminRegistration(req: Request, res: Response): Promise<void> {
        const body = req.body as AdminRegistrationRequest;
        const userInfo = await this.authService.getUserInfo(body.userId);

        const adminInfo = await this.authService.getUserInfo(body.adminId);
        const adminPrivs = await this.adminService.getPrivileges(body.adminId);

        // Check if the user is modifying the root admin or themselves.
        if (body.userId == body.adminId || userInfo.username === 'admin' || !adminPrivs.active || !adminPrivs.allowRejectAdminRegistration) {
            res.status(403).send();
        }

        this.emailService.notifyAllAdminsOfAcceptance(userInfo, adminInfo.username);
        this.emailService.sendAdminAcceptanceEmail(userInfo);
        let registrationIsAccepted = await this.adminService.acceptRegistration(body.userId);

        let resBody: AdminRegistrationResponse = {
            username: userInfo.username,
            userId: userInfo.id,
            email: userInfo.primaryEmail,
            isAccepted: registrationIsAccepted
        }

        res.status(200).send(resBody);
    }

    public async rejectAdminRegistration(req: Request, res: Response): Promise<void> {
        const body = req.body as AdminRegistrationRequest;
        let userInfo = await this.authService.getUserInfo(body.userId);

        const adminInfo = await this.authService.getUserInfo(body.adminId);
        const adminPrivs = await this.adminService.getPrivileges(body.adminId);

        // Check if the user is modifying the root admin or themselves.
        if (body.userId == body.adminId || userInfo.username === 'admin' || !adminPrivs.active || !adminPrivs.allowRejectAdminRegistration) {
            res.status(403).send();
        }

        await this.emailService.sendAdminRejectionEmail(userInfo)
        this.authService.deleteUserInfo(body.userId)
        res.status(200).send();
    }

    public async revokeAdminAccess(req: Request, res: Response): Promise<void> {
        const body = req.body as AdminRegistrationRequest;
        const adminInfo = await this.adminService.getPrivileges(body.adminId);
        const userInfo = await this.authService.getUserInfo(body.userId);

        // Check if the user is modifying the root admin or themselves.
        if (body.userId == body.adminId || userInfo.username === 'admin' || !adminInfo.revokeAdminAccess) {
            res.status(403).send();
        }

        console.log('sending revocation emails.')
        await this.emailService.sendAdminRevokeEmail(userInfo);
        await this.authService.deleteUserInfo(body.userId)

        res.status(204).send();
    }

    public async sendEmail(req: Request, res: Response): Promise<AdminEmailResponse> {
        let body: AdminEmailRequest = req.body as AdminEmailRequest;
        let adminId = Number(body.adminId);
        let userId = Number(body.userId);

        let adminInfo = await this.authService.getUserInfo(adminId);
        let adminPrivs = await this.adminService.getPrivileges(adminInfo.id);
        let recipientInfo = await this.authService.getUserInfo(userId);

        if (adminInfo.userType !== UserType.ADMIN || !adminPrivs.messageUserEmailUser) {
            res.status(403).send();
        } else {
            this.emailService.sendAdminEmail(adminInfo, recipientInfo, body.subject, body.body);
        }

        let status = {
            emailWasSent: true
        };
        res.status(200).send(status);

        return status;
    }

    public async activateDeactivateUser(req: Request, res: Response): Promise<AdminDeactivateUserResponse> {
        let body: AdminDeactivateUserRequest = req.body;
        const userInfo = await this.authService.getUserInfo(body.adminId);
        const privs = await this.adminService.getPrivileges(userInfo.id);

        // Check if the user is an admin
        if (userInfo.userType !== UserType.ADMIN || !privs.deactivateUsers) {
            res.status(403).send();
        } else if (body.status) {
            this.authService.reactivateAccountById(body.userId);
        } else {
            this.authService.deactivateAccountById(body.userId);
            let info = await this.authService.getUserInfo(body.userId);
            this.emailService.notifyAllAdminsOfDeactivation(info, userInfo.username);
        }

        let status = {
            statusWasUpdated: true
        };
        res.send(200).send(status);

        return status;
    }

    public async getAllUsers(req: Request, res: Response): Promise<Array<UserInfo>> {
        const body: Admin = {
            userId: Number(req.query.userId)
        }
        const userInfo = await this.authService.getUserInfo(body.userId);
        const privs = await this.adminService.getPrivileges(userInfo.id);
        let users = new Array<UserInfo>();
        // Check if the user is an admin
        if (userInfo.userType !== UserType.ADMIN || !(privs.deactivateUsers || privs.messageUserEmailUser || privs.resetAuthInfoNonAdmin)) {
            res.status(403).send();
        } else {
            users = await this.authService.getAllUsers();
            users = users.filter(user => user.userType !== UserType.ADMIN);
            res.status(200).send(users);
        }
        return users;
    }

    public async getAllAuditTrails(req: Request, res: Response): Promise<Array<AuditTrailDBO>> {
        const body: Admin = {
            userId: Number(req.query.userId)
        }
        const userInfo = await this.authService.getUserInfo(body.userId);
        const privs = await this.adminService.getPrivileges(userInfo.id);

        let trails = new Array<AuditTrailDBO>();

        if (userInfo.userType !== UserType.ADMIN || !privs.readAuditTrail) {
            res.status(403).send();
        } else {
            trails = await this.auditTrailService.getAllEntries();
            res.status(200).send(trails);
        }

        return trails;
    }

    public async recordAuditTrails(req: Request, res: Response): Promise<void> {
        let body = req.body;
        let adminName = String(body.username);
        let adminAction = String(body.action);
        const trail = await this.auditTrailService.addEntries(adminName, adminAction);

        res.status(200).send(trail);
    }

    public async resetAuthInfoNonAdmin(req: Request, res: Response) {
        throw new Error("Method Unimplemented");
    }

    public async resetAuthInfoAdmin(req: Request, res: Response) {
        throw new Error("Method Unimplemented");
    }

}