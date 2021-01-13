"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const EmailService_1 = require("../services/EmailService");
const affordable_shared_models_1 = require("affordable-shared-models");
const AdminService_1 = require("../services/AdminService");
const AuditTrailService_1 = require("../services/AuditTrailService");
const AuthenticationServiceImpl_1 = require("../services/AuthenticationServiceImpl");
const AdminPrivilegesDBO_1 = require("../models/orm/profile/AdminPrivilegesDBO");
class AdminController {
    constructor(emailService) {
        this.emailService = emailService !== null && emailService !== void 0 ? emailService : new EmailService_1.EmailService();
        this.adminService = new AdminService_1.AdminService();
        this.authService = new AuthenticationServiceImpl_1.AuthenticationServiceImpl();
        this.auditTrailService = new AuditTrailService_1.AuditTrailService();
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
    async getAllAdmins(req, res) {
        let userId = Number(req.query.userId);
        let adminInfo = await this.authService.getUserInfo(Number(userId));
        if (adminInfo.userType !== affordable_shared_models_1.UserType.ADMIN) {
            res.status(403).send();
            return null;
        }
        else {
            let allUsers = await this.authService.getAllUsers();
            let admins = new Array();
            allUsers.forEach(user => {
                if (user.userType === affordable_shared_models_1.UserType.ADMIN) {
                    admins.push(user);
                }
            });
            res.status(200).send(admins);
            return admins;
        }
    }
    async getAllAdminPrivileges(req, res) {
        let admins = await this.adminService.getAdmins();
        let infoReqs = new Array();
        let privs = new Array();
        admins.forEach(admin => {
            if (admin.active) {
                infoReqs.push(this.authService.getUserInfo(admin.userid));
            }
        });
        let info = await Promise.all(infoReqs);
        admins.forEach(admin => {
            if (admin.active) {
                let username = info.find(user => user.id === admin.userid).username;
                let adminPrivs = AdminPrivilegesDBO_1.AdminPrivilegesDBO.toAdminPrivileges(admin, username);
                privs.push(adminPrivs);
            }
        });
        console.log("contoller admins: ", privs);
        res.status(200).send(privs);
    }
    async getAdminPrivileges(req, res) {
        const body = {
            userId: Number(req.query.userId)
        };
        let admin = await this.adminService.getPrivileges(body.userId);
        let adminInfo = await this.authService.getUserInfo(body.userId);
        let response = AdminPrivilegesDBO_1.AdminPrivilegesDBO.toAdminPrivileges(admin, adminInfo.username);
        res.status(200).send(response);
    }
    async setAdminPrivileges(req, res) {
        const body = req.body;
        let adminInfo = await this.authService.getUserInfo(body.privileges.userid);
        let requestorPrivs = await this.adminService.getPrivileges(body.adminId);
        let requestorInfo = await this.authService.getUserInfo(body.adminId);
        if (body.adminId === body.privileges.userid || !requestorPrivs.setPrivileges || adminInfo.username === "admin") {
            res.status(403).send();
        }
        let privs = AdminPrivilegesDBO_1.AdminPrivilegesDBO.fromAdminPrivileges(body.privileges);
        let admin = await this.adminService.setPrivileges(privs);
        let response = AdminPrivilegesDBO_1.AdminPrivilegesDBO.toAdminPrivileges(admin, adminInfo.username);
        this.emailService.sendAdminPrivilegesEmail(adminInfo, requestorInfo.username);
        this.emailService.notifyAllAdminsOfPrivsChange(adminInfo, requestorInfo.username);
        res.status(200).send(response);
    }
    async getAdminRegistrationRequests(req, res) {
        let requests = await this.adminService.getRegistrationRequests();
        let promises = new Array();
        for (const request of requests) {
            promises.push(this.authService.getUserInfo(request.userid));
        }
        ;
        let accounts = await Promise.all(promises);
        let response = new Array();
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
    async acceptAdminRegistration(req, res) {
        const body = req.body;
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
        let resBody = {
            username: userInfo.username,
            userId: userInfo.id,
            email: userInfo.primaryEmail,
            isAccepted: registrationIsAccepted
        };
        res.status(200).send(resBody);
    }
    async rejectAdminRegistration(req, res) {
        const body = req.body;
        let userInfo = await this.authService.getUserInfo(body.userId);
        const adminInfo = await this.authService.getUserInfo(body.adminId);
        const adminPrivs = await this.adminService.getPrivileges(body.adminId);
        // Check if the user is modifying the root admin or themselves.
        if (body.userId == body.adminId || userInfo.username === 'admin' || !adminPrivs.active || !adminPrivs.allowRejectAdminRegistration) {
            res.status(403).send();
        }
        await this.emailService.sendAdminRejectionEmail(userInfo);
        this.authService.deleteUserInfo(body.userId);
        res.status(200).send();
    }
    async revokeAdminAccess(req, res) {
        const body = req.body;
        const adminInfo = await this.adminService.getPrivileges(body.adminId);
        const userInfo = await this.authService.getUserInfo(body.userId);
        // Check if the user is modifying the root admin or themselves.
        if (body.userId == body.adminId || userInfo.username === 'admin' || !adminInfo.revokeAdminAccess) {
            res.status(403).send();
        }
        console.log('sending revocation emails.');
        await this.emailService.sendAdminRevokeEmail(userInfo);
        await this.authService.deleteUserInfo(body.userId);
        res.status(204).send();
    }
    async sendEmail(req, res) {
        let body = req.body;
        let adminId = Number(body.adminId);
        let userId = Number(body.userId);
        let adminInfo = await this.authService.getUserInfo(adminId);
        let adminPrivs = await this.adminService.getPrivileges(adminInfo.id);
        let recipientInfo = await this.authService.getUserInfo(userId);
        if (adminInfo.userType !== affordable_shared_models_1.UserType.ADMIN || !adminPrivs.messageUserEmailUser) {
            res.status(403).send();
        }
        else {
            this.emailService.sendAdminEmail(adminInfo, recipientInfo, body.subject, body.body);
        }
        let status = {
            emailWasSent: true
        };
        res.status(200).send(status);
        return status;
    }
    async activateDeactivateUser(req, res) {
        let body = req.body;
        const userInfo = await this.authService.getUserInfo(body.adminId);
        const privs = await this.adminService.getPrivileges(userInfo.id);
        // Check if the user is an admin
        if (userInfo.userType !== affordable_shared_models_1.UserType.ADMIN || !privs.deactivateUsers) {
            res.status(403).send();
        }
        else if (body.status) {
            this.authService.reactivateAccountById(body.userId);
        }
        else {
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
    async getAllUsers(req, res) {
        const body = {
            userId: Number(req.query.userId)
        };
        const userInfo = await this.authService.getUserInfo(body.userId);
        const privs = await this.adminService.getPrivileges(userInfo.id);
        let users = new Array();
        // Check if the user is an admin
        if (userInfo.userType !== affordable_shared_models_1.UserType.ADMIN || !(privs.deactivateUsers || privs.messageUserEmailUser || privs.resetAuthInfoNonAdmin)) {
            res.status(403).send();
        }
        else {
            users = await this.authService.getAllUsers();
            users = users.filter(user => user.userType !== affordable_shared_models_1.UserType.ADMIN);
            res.status(200).send(users);
        }
        return users;
    }
    async getAllAuditTrails(req, res) {
        const body = {
            userId: Number(req.query.userId)
        };
        const userInfo = await this.authService.getUserInfo(body.userId);
        const privs = await this.adminService.getPrivileges(userInfo.id);
        let trails = new Array();
        if (userInfo.userType !== affordable_shared_models_1.UserType.ADMIN || !privs.readAuditTrail) {
            res.status(403).send();
        }
        else {
            trails = await this.auditTrailService.getAllEntries();
            res.status(200).send(trails);
        }
        return trails;
    }
    async recordAuditTrails(req, res) {
        let body = req.body;
        let adminName = String(body.username);
        let adminAction = String(body.action);
        const trail = await this.auditTrailService.addEntries(adminName, adminAction);
        res.status(200).send(trail);
    }
    async resetAuthInfoNonAdmin(req, res) {
        throw new Error("Method Unimplemented");
    }
    async resetAuthInfoAdmin(req, res) {
        throw new Error("Method Unimplemented");
    }
}
exports.AdminController = AdminController;