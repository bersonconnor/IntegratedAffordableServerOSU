import { EmailRecordDBO } from "../models/orm/EmailRecordDBO";
import { ForgotPasswordResetTokenDBO } from "../models/orm/ForgotPasswordResetTokenDBO";
import { DBOEmailRecordDAOImpl } from "../database/dao/email/DBOEmailRecordDAOImpl";
import { DBOAuthenticationInformationDAOImpl } from "../database/dao/authentication/DBOAuthenticationInformationDAOImpl";
import { ForgotPasswordResetTokenDAO } from "../database/dao/ForgotPasswordResetTokenDAO";
import uuidv4 from "uuid/v4";
import * as utils from "../utils";
import { AffordableSESClient } from "./email/AffordableSESClient";
import { UserInfo, AdminPrivileges } from "affordable-shared-models";
import { AuthorizationUtils } from "./AuthorizationUtils";
import { UnauthorizedError } from "../models/UnauthorizedError";

import { Validation } from "../utils/Validation";
import { EmailDAO } from "../database/dao/email/EmailDAO";
import { AffordableEmailClient } from "./email/AffordableEmailClient";
import { AuthenticationInformationDAO } from "../database/dao/authentication/AuthenticationInformationDAO";
import Mail from "nodemailer/lib/mailer";
import Email from 'email-templates'
import { AdminService } from "./AdminService";
import { AuthenticationServiceImpl } from "./AuthenticationServiceImpl";
import { AuthenticationService } from "./AuthenticationService";

export class EmailService {
    private emailDao: EmailDAO;
    private emailClient: AffordableEmailClient;
    private authDao: AuthenticationInformationDAO;
    private forgotPasswordDao: ForgotPasswordResetTokenDAO;
    private adminService: AdminService;
    private authService: AuthenticationService;

    constructor(emailDao?: EmailDAO,
        emailClient?: AffordableEmailClient,
        authenticationInfoDao?: AuthenticationInformationDAO,
        forgotPasswordDao?: ForgotPasswordResetTokenDAO,
        authService?: AuthenticationService) {
        this.emailDao = emailDao ?? new DBOEmailRecordDAOImpl();
        this.emailClient = emailClient ?? AffordableSESClient.getInstance();
        this.authDao = authenticationInfoDao ?? new DBOAuthenticationInformationDAOImpl();
        this.forgotPasswordDao = forgotPasswordDao ?? new ForgotPasswordResetTokenDAO();
        this.adminVerifyEmail = this.adminVerifyEmail.bind(this);
        this.adminService = new AdminService();
        this.authService = new AuthenticationServiceImpl(null, null, null, null, this, null);
    }

    public isVerified = async (userId: number): Promise<Boolean> => {
        const verified = await this.emailDao.getVerificationById(userId);
        return verified;
    }

    private async formMessageForVerifyEmail(email, secret): Promise<Mail.Options> {
        const hyperlink = process.env.AFFORDABLE_BACKEND_URL + '/authentication/email/verify?code=' + secret
        const desiredText = 'Click here!'
        console.log("hyperlink: " + hyperlink)

        const mail = new Email();
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

    private formMessageForResetPassword(email, username, secret): Mail.Options {
        const hyperlink = process.env.AFFORDABLE_FRONTEND_URL + '/reset_password?code=' + secret;
        const desiredText = 'Click here to reset your password';
        console.log("hyperlink: " + hyperlink);
        const messageBody = {
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: Reset your password',
            html: utils.formatEmail(
                [
                    '<h2>Your username is "', username, '", if you still need to reset your password, click the following link: </h2> <a href="' + hyperlink + '">' + desiredText + '</a>'
                ]
            )
        };
        return messageBody;
    }

    private async formMessageForAdminRejection(email, username): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminAcceptance(email, username): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminPrivs(email, username, admin): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminAcceptanceAdmin(email, username, admin): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminRevoke(email, username): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminDeactivateUser(userInfo: UserInfo): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminDeactivateUserAdmin(email, username, admin): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageForAdminReactivateUser(userInfo: UserInfo): Promise<Mail.Options> {
        const mail = new Email();
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

    private async formMessageFromAdmin(email: string, replyAddress: string, subject: string, body: string): Promise<Mail.Options> {
        const mail = new Email();
        const locals = { body: body };

        const text = await mail.render("basic_template", locals);

        const messageBody: Mail.Options = {
            from: 'donotreply@affordhealth.org',
            to: email,
            cc: replyAddress,
            replyTo: replyAddress,
            subject: `Affordable:: ${subject}`,
            html: text
        };
        return messageBody;
    }

    public addEmail = async (userId, emailAddress, isPrimary, isVerified): Promise<EmailRecordDBO> => {
        const secret = uuidv4();
        const emailRecord = await this.emailDao.createEmailRecord(<EmailRecordDBO>{
            userId: userId,
            email: emailAddress,
            isPrimary: isPrimary,
            verified: isVerified,
            verificationCode: secret
        });


        await this.emailClient.sendEmail(await this.formMessageForVerifyEmail(emailAddress, secret));

        return emailRecord;
    }

    public sendResetPasswordEmail = async (emailAddress): Promise<void> => {
        const emailIsInDB = await this.emailDao.emailExists(emailAddress);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(emailAddress);
            const secret = uuidv4() + uuidv4();
            const today = new Date();
            var expirationDate = new Date();
            expirationDate.setDate(today.getDate() + 1); // setting the expirationdate 24 hours from now

            await this.forgotPasswordDao.addForgotPasswordResetToken({
                userId: userId,
                secret: secret,
                expirationDate: expirationDate
            })

            const username = (await this.authDao.getUserById(userId)).username;

            await this.emailClient.sendEmail(this.formMessageForResetPassword(emailAddress, username, secret));
        }
        return;
    }

    public updateEmail = async (user: UserInfo, newAddress: string): Promise<void> => {
        const secret = uuidv4();
        await this.emailDao.deleteEmailRecord(user.primaryEmail);

        let newRecord = await this.emailDao.createEmailRecord({
            userId: user.id,
            email: newAddress,
            isPrimary: true,
            verified: false,
            verificationCode: secret
        })

        await this.emailClient.sendEmail(await this.formMessageForVerifyEmail(newAddress, secret));

    }

    /**
     * Verifies email by secret and returns redirect url
     */
    public verifyEmail = async (code: string): Promise<string> => {
        try {
            const record = await this.emailDao.getEmailRecordBySecret(code);
            const email = record.email;
            await this.emailDao.updateVerification(email);
        } catch (error) {
            return (process.env.AFFORDABLE_FRONTEND_URL + "/email_verify_failure");
        }
        return (process.env.AFFORDABLE_FRONTEND_URL + "/email_verify_success");
    }

    public async adminVerifyEmail(adminUserInfo: UserInfo, username: string): Promise<void> {
        Validation.requireParam(username, "username");
        AuthorizationUtils.checkAuthorization(adminUserInfo);
        if (!AuthorizationUtils.isAdmin(adminUserInfo)) {
            throw new UnauthorizedError("You must be an administrator to do this");
        }
        const record = await this.emailDao.getPrimaryEmail(username);
        record.verified = true;
        await this.emailDao.createEmailRecord(record);
    }

    public async sendAdminRejectionEmail(user: UserInfo) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(user.primaryEmail);
            const username = (await this.authDao.getUserById(userId)).username;

            await this.emailClient.sendEmail(await this.formMessageForAdminRejection(user.primaryEmail, username));
        }
        return;
    }

    public async sendAdminAcceptanceEmail(user: UserInfo) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(user.primaryEmail);
            const username = (await this.authDao.getUserById(userId)).username;

            await this.emailClient.sendEmail(await this.formMessageForAdminAcceptance(user.primaryEmail, username));
        }
        return;
    }

    public async notifyAllAdminsOfAcceptance(userInfo: UserInfo, adminUsername: string) {
        const admins = await this.adminService.getAdmins();
        const adminRequests = new Array<Promise<UserInfo>>();

        let adminInfo = new Array<UserInfo>();

        admins.forEach(admin => {
            if (admin.allowRejectAdminRegistration && admin.active) {
                adminRequests.push(this.authService.getUserInfo(admin.userid))
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

    public async sendAdminPrivilegesEmail(user: UserInfo, adminUsername) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            await this.emailClient.sendEmail(await this.formMessageForAdminPrivs(user.primaryEmail, user.username, adminUsername));
        }
        return;
    }

    public async notifyAllAdminsOfPrivsChange(userInfo: UserInfo, adminUsername: string) {
        const admins = await this.adminService.getAdmins();
        const adminRequests = new Array<Promise<UserInfo>>();
        const authInfo = await this.authService.getUserInfo(adminUsername);

        let adminInfo = new Array<UserInfo>();

        admins.forEach(admin => {
            if (admin.setPrivileges && admin.active && admin.userid !== userInfo.id) {
                console.log(`Addin user: adminUserId ${admin.userid} userInfo ${userInfo.id}`)
                adminRequests.push(this.authService.getUserInfo(admin.userid))
            }
        });
        adminInfo = await Promise.all(adminRequests);

        const userId = await this.emailDao.getUserIdByEmail(userInfo.primaryEmail);
        const username = (await this.authDao.getUserById(userId)).username;

        adminInfo.forEach(admin => {
            this.formMessageForAdminPrivs(admin.primaryEmail, username, adminUsername).then(email => {
                this.emailClient.sendEmail(email);
            })
        });

        return;
    }

    public async sendAdminRevokeEmail(user: UserInfo) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(user.primaryEmail);
            const username = (await this.authDao.getUserById(userId)).username;

            await this.emailClient.sendEmail(await this.formMessageForAdminRevoke(user.primaryEmail, username));
        }
        return;
    }

    public async sendDeactivateEmail(user: UserInfo) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            await this.emailClient.sendEmail(await this.formMessageForAdminDeactivateUser(user));
        }
        return;
    }

    public async notifyAllAdminsOfDeactivation(userInfo: UserInfo, adminUsername: string) {
        const admins = await this.adminService.getAdmins();
        const adminRequests = new Array<Promise<UserInfo>>();

        let adminInfo = new Array<UserInfo>();

        admins.forEach(admin => {
            if (admin.deactivateUsers && admin.active) {
                adminRequests.push(this.authService.getUserInfo(admin.userid))
            }
        });
        adminInfo = await Promise.all(adminRequests);

        const userId = await this.emailDao.getUserIdByEmail(userInfo.primaryEmail);
        const username = (await this.authDao.getUserById(userId)).username;

        adminInfo.forEach(admin => {
            this.formMessageForAdminDeactivateUserAdmin(admin.primaryEmail, username, adminUsername).then(email => {
                this.emailClient.sendEmail(email);
            })
        });

        return;
    }

    public async sendReactivateEmail(user: UserInfo) {
        const emailIsInDB = await this.emailDao.emailExists(user.primaryEmail);
        if (emailIsInDB) {
            await this.emailClient.sendEmail(await this.formMessageForAdminReactivateUser(user));
        }
        return;
    }

    public async sendAdminEmail(adminUserInfo: UserInfo, recipientUserInfo: UserInfo, subject: string, body: string) {
        const emailIsInDB = await this.emailDao.emailExists(recipientUserInfo.primaryEmail);
        if (emailIsInDB) {
            const userId = await this.emailDao.getUserIdByEmail(recipientUserInfo.primaryEmail);
            //const username = (await this.authDao.getUserById(userId)).username;

            await this.emailClient.sendEmail(await this.formMessageFromAdmin(recipientUserInfo.primaryEmail, adminUserInfo.primaryEmail, subject, body));
        }
        return;
    }
}
