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
exports.EmailService = void 0;
const DBOEmailRecordDAOImpl_1 = require("../database/dao/email/DBOEmailRecordDAOImpl");
const DBOAuthenticationInformationDAOImpl_1 = require("../database/dao/authentication/DBOAuthenticationInformationDAOImpl");
const ForgotPasswordResetTokenDAO_1 = require("../database/dao/ForgotPasswordResetTokenDAO");
const v4_1 = __importDefault(require("uuid/v4"));
const utils = __importStar(require("../utils"));
const AffordableSESClient_1 = require("./email/AffordableSESClient");
const AuthorizationUtils_1 = require("./AuthorizationUtils");
const UnauthorizedError_1 = require("../models/UnauthorizedError");
const Validation_1 = require("../utils/Validation");
const email_templates_1 = __importDefault(require("email-templates"));
const AdminService_1 = require("./AdminService");
const AuthenticationServiceImpl_1 = require("./AuthenticationServiceImpl");
class EmailService {
    constructor(emailDao, emailClient, authenticationInfoDao, forgotPasswordDao, authService) {
        this.isVerified = async (userId) => {
            const verified = await this.emailDao.getVerificationById(userId);
            return verified;
        };
        this.addEmail = async (userId, emailAddress, isPrimary, isVerified) => {
            const secret = v4_1.default();
            const emailRecord = await this.emailDao.createEmailRecord({
                userId: userId,
                email: emailAddress,
                isPrimary: isPrimary,
                verified: isVerified,
                verificationCode: secret
            });
            await this.emailClient.sendEmail(await this.formMessageForVerifyEmail(emailAddress, secret));
            return emailRecord;
        };
        this.sendResetPasswordEmail = async (emailAddress) => {
            const emailIsInDB = await this.emailDao.emailExists(emailAddress);
            if (emailIsInDB) {
                const userId = await this.emailDao.getUserIdByEmail(emailAddress);
                const secret = v4_1.default() + v4_1.default();
                const today = new Date();
                var expirationDate = new Date();
                expirationDate.setDate(today.getDate() + 1); // setting the expirationdate 24 hours from now
                await this.forgotPasswordDao.addForgotPasswordResetToken({
                    userId: userId,
                    secret: secret,
                    expirationDate: expirationDate
                });
                const username = (await this.authDao.getUserById(userId)).username;
                await this.emailClient.sendEmail(this.formMessageForResetPassword(emailAddress, username, secret));
            }
            return;
        };
        this.updateEmail = async (user, newAddress) => {
            const secret = v4_1.default();
            await this.emailDao.deleteEmailRecord(user.primaryEmail);
            let newRecord = await this.emailDao.createEmailRecord({
                userId: user.id,
                email: newAddress,
                isPrimary: true,
                verified: false,
                verificationCode: secret
            });
            await this.emailClient.sendEmail(await this.formMessageForVerifyEmail(newAddress, secret));
        };
        /**
         * Verifies email by secret and returns redirect url
         */
        this.verifyEmail = async (code) => {
            try {
                const record = await this.emailDao.getEmailRecordBySecret(code);
                const email = record.email;
                await this.emailDao.updateVerification(email);
            }
            catch (error) {
                return (process.env.AFFORDABLE_FRONTEND_URL + "/email_verify_failure");
            }
            return (process.env.AFFORDABLE_FRONTEND_URL + "/email_verify_success");
        };
        this.emailDao = emailDao !== null && emailDao !== void 0 ? emailDao : new DBOEmailRecordDAOImpl_1.DBOEmailRecordDAOImpl();
        this.emailClient = emailClient !== null && emailClient !== void 0 ? emailClient : AffordableSESClient_1.AffordableSESClient.getInstance();
        this.authDao = authenticationInfoDao !== null && authenticationInfoDao !== void 0 ? authenticationInfoDao : new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        this.forgotPasswordDao = forgotPasswordDao !== null && forgotPasswordDao !== void 0 ? forgotPasswordDao : new ForgotPasswordResetTokenDAO_1.ForgotPasswordResetTokenDAO();
        this.adminVerifyEmail = this.adminVerifyEmail.bind(this);
        this.adminService = new AdminService_1.AdminService();
        this.authService = new AuthenticationServiceImpl_1.AuthenticationServiceImpl(null, null, null, null, this, null);
    }
    async formMessageForVerifyEmail(email, secret) {
        const hyperlink = process.env.AFFORDABLE_BACKEND_URL + '/authentication/email/verify?code=' + secret;
        const desiredText = 'Click here!';
        console.log("hyperlink: " + hyperlink);
        const mail = new email_templates_1.default();
        const locals = {
            hyperlink: hyperlink,
            desiredText: desiredText
        };
        const text = await mail.render("verify_email", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Please Verify your Email',
            html: text
        };
        return messageBody;
    }
    formMessageForResetPassword(email, username, secret) {
        const hyperlink = process.env.AFFORDABLE_FRONTEND_URL + '/reset_password?code=' + secret;
        const desiredText = 'Click here to reset your password';
        console.log("hyperlink: " + hyperlink);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Reset your password',
            html: utils.formatEmail([
                '<h2>Your username is "', username, '", if you still need to reset your password, click the following link: </h2> <a href="' + hyperlink + '">' + desiredText + '</a>'
            ])
        };
        return messageBody;
    }
    async formMessageForAdminRejection(email, username) {
        const mail = new email_templates_1.default();
        const locals = { username: username };
        const text = await mail.render("admin_reject", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Admin Registration Rejected',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminAcceptance(email, username) {
        const mail = new email_templates_1.default();
        const locals = { username: username };
        const text = await mail.render("admin_accept", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Admin Registration Accepted',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminPrivs(email, username, admin) {
        const mail = new email_templates_1.default();
        const locals = { username: username, admin: admin };
        const text = await mail.render("admin_change_privs", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Admin Privileges Modified',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminAcceptanceAdmin(email, username, admin) {
        const mail = new email_templates_1.default();
        const locals = { username: username, admin: admin };
        const text = await mail.render("admin_accept_admin", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: New Admin Has Been Approved',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminRevoke(email, username) {
        const mail = new email_templates_1.default();
        const locals = { username: username };
        const text = await mail.render("admin_revoke", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Admin Account Revoked',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminDeactivateUser(userInfo) {
        const mail = new email_templates_1.default();
        const locals = { username: userInfo.username };
        const text = await mail.render("admin_deactivate_user", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: userInfo.primaryEmail,
            subject: 'Affordable:: User Account Deactivated',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminDeactivateUserAdmin(email, username, admin) {
        const mail = new email_templates_1.default();
        const locals = { username: username, admin: admin };
        const text = await mail.render("admin_deactivate_user_admin", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Admin Has Deactivated User',
            html: text
        };
        return messageBody;
    }
    async formMessageForAdminReactivateUser(userInfo) {
        const mail = new email_templates_1.default();
        const locals = { username: userInfo.username };
        const text = await mail.render("admin_reactivate_user", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: userInfo.primaryEmail,
            subject: 'Affordable:: User Account Reactivated',
            html: text
        };
        return messageBody;
    }
    async formMessageFromAdmin(email, replyAddress, subject, body) {
        const mail = new email_templates_1.default();
        const locals = { body: body };
        const text = await mail.render("basic_template", locals);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            cc: replyAddress,
            replyTo: replyAddress,
            subject: `Affordable:: ${subject}`,
            html: text
        };
        return messageBody;
    }
    async adminVerifyEmail(adminUserInfo, username) {
        Validation_1.Validation.requireParam(username, "username");
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(adminUserInfo);
        if (!AuthorizationUtils_1.AuthorizationUtils.isAdmin(adminUserInfo)) {
            throw new UnauthorizedError_1.UnauthorizedError("You must be an administrator to do this");
        }
        const record = await this.emailDao.getPrimaryEmail(username);
        record.verified = true;
        await this.emailDao.createEmailRecord(record);
    }
    async sendAdminRejectionEmail(user) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(user.primaryEmail);
            const username = (await this.authDao.getUserById(userId)).username;
            await this.emailClient.sendEmail(await this.formMessageForAdminRejection(user.primaryEmail, username));
        }
        return;
    }
    async sendAdminAcceptanceEmail(user) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(user.primaryEmail);
            const username = (await this.authDao.getUserById(userId)).username;
            await this.emailClient.sendEmail(await this.formMessageForAdminAcceptance(user.primaryEmail, username));
        }
        return;
    }
    async notifyAllAdminsOfAcceptance(userInfo, adminUsername) {
        const admins = await this.adminService.getAdmins();
        const adminRequests = new Array();
        let adminInfo = new Array();
        admins.forEach(admin => {
            if (admin.allowRejectAdminRegistration && admin.active) {
                adminRequests.push(this.authService.getUserInfo(admin.userid));
            }
        });
        adminInfo = await Promise.all(adminRequests);
        const userId = await this.emailDao.getUserIdByEmail(userInfo.primaryEmail);
        const username = (await this.authDao.getUserById(userId)).username;
        adminInfo.forEach(admin => {
            this.formMessageForAdminAcceptanceAdmin(admin.primaryEmail, username, adminUsername).then(email => {
                this.emailClient.sendEmail(email);
            });
        });
        return;
    }
    async sendAdminPrivilegesEmail(user, adminUsername) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            await this.emailClient.sendEmail(await this.formMessageForAdminPrivs(user.primaryEmail, user.username, adminUsername));
        }
        return;
    }
    async notifyAllAdminsOfPrivsChange(userInfo, adminUsername) {
        const admins = await this.adminService.getAdmins();
        const adminRequests = new Array();
        const authInfo = await this.authService.getUserInfo(adminUsername);
        let adminInfo = new Array();
        admins.forEach(admin => {
            if (admin.setPrivileges && admin.active && admin.userid !== userInfo.id) {
                console.log(`Addin user: adminUserId ${admin.userid} userInfo ${userInfo.id}`);
                adminRequests.push(this.authService.getUserInfo(admin.userid));
            }
        });
        adminInfo = await Promise.all(adminRequests);
        const userId = await this.emailDao.getUserIdByEmail(userInfo.primaryEmail);
        const username = (await this.authDao.getUserById(userId)).username;
        adminInfo.forEach(admin => {
            this.formMessageForAdminPrivs(admin.primaryEmail, username, adminUsername).then(email => {
                this.emailClient.sendEmail(email);
            });
        });
        return;
    }
    async sendAdminRevokeEmail(user) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(user.primaryEmail);
            const username = (await this.authDao.getUserById(userId)).username;
            await this.emailClient.sendEmail(await this.formMessageForAdminRevoke(user.primaryEmail, username));
        }
        return;
    }
    async sendDeactivateEmail(user) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            await this.emailClient.sendEmail(await this.formMessageForAdminDeactivateUser(user));
        }
        return;
    }
    async notifyAllAdminsOfDeactivation(userInfo, adminUsername) {
        const admins = await this.adminService.getAdmins();
        const adminRequests = new Array();
        let adminInfo = new Array();
        admins.forEach(admin => {
            if (admin.deactivateUsers && admin.active) {
                adminRequests.push(this.authService.getUserInfo(admin.userid));
            }
        });
        adminInfo = await Promise.all(adminRequests);
        const userId = await this.emailDao.getUserIdByEmail(userInfo.primaryEmail);
        const username = (await this.authDao.getUserById(userId)).username;
        adminInfo.forEach(admin => {
            this.formMessageForAdminDeactivateUserAdmin(admin.primaryEmail, username, adminUsername).then(email => {
                this.emailClient.sendEmail(email);
            });
        });
        return;
    }
    async sendReactivateEmail(user) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            await this.emailClient.sendEmail(await this.formMessageForAdminReactivateUser(user));
        }
        return;
    }
    async sendAdminEmail(adminUserInfo, recipientUserInfo, subject, body) {
        const emailIsInDB = await this.emailDao.emailExists(recipientUserInfo.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(recipientUserInfo.primaryEmail);
            //const username = (await this.authDao.getUserById(userId)).username;
            await this.emailClient.sendEmail(await this.formMessageFromAdmin(recipientUserInfo.primaryEmail, adminUserInfo.primaryEmail, subject, body));
        }
        return;
    }
}
exports.EmailService = EmailService;
