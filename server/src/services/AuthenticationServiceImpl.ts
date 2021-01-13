import { config } from "dotenv";
config();
import { CreateUserRequest, UserInfo, UserType, LoginRequest, LoginResponse, ChangePasswordReq, TwoFactorResponse, InvalidLoginResponse } from "affordable-shared-models";
import * as imageDataURI from "image-data-uri";
import * as QRCode from "qrcode";
import * as speakeasy from "speakeasy";
import { AuthenticationInformationDAO } from "../database/dao/authentication/AuthenticationInformationDAO";
import { EmailDAO } from "../database/dao/email/EmailDAO";
import db from "../database/DatabaseConnection";
import * as storedProcedure from "../database/storedProcedure";
import { NotFoundError } from "../models/NotFoundError";
import { AuthenticationInformationDBO } from "../models/orm/AuthenticationInformationDBO";
import * as utils from "../utils";
import { Validation } from "../utils/Validation";
import { UnauthorizedError } from "../models/UnauthorizedError";
import { LegalNameDAO } from "../database/dao/profile/LegalNameDAO";
import { LegalName } from "../models/orm/profile/LegalName";
import { compare, hash } from "bcrypt";
import { DBOAuthenticationInformationDAOImpl } from "../database/dao/authentication/DBOAuthenticationInformationDAOImpl";
import { DBOEmailRecordDAOImpl } from "../database/dao/email/DBOEmailRecordDAOImpl";
import { ForgotPasswordResetTokenDAO } from "../database/dao/ForgotPasswordResetTokenDAO";
import { DBOLegalNameDAOImpl } from "../database/dao/profile/DBOLegalNameDAOImpl";
import { AuthenticationService } from "./AuthenticationService";
import { AffordableEmailClient } from "./email/AffordableEmailClient";
import { AffordableSESClient } from "./email/AffordableSESClient";
import jwt from "jsonwebtoken";
import { EmailService } from "./EmailService";
import { AuthorizationUtils } from "./AuthorizationUtils";
import { StripeService } from "./StripeService";
import { TwoFactorDAO } from '../database/dao/authentication/TwoFactorDAO'
import { TwoFactorDAOImpl } from "../database/dao/authentication/TwoFactorDAOImpl";
import { AdminPrivilegesDBO } from "../models/orm/profile/AdminPrivilegesDBO";
import { AdminPrivilegesDAO } from "../database/dao/admin/AdminPrivilegesDAO";
import { EmailRecordDBO } from "../models/orm/EmailRecordDBO";

const FAILED_LOGIN_MESSAGE = "The username or password was incorrect!";
const FAILED_RESET_PASSWORD_MESSAGE = "The password could not be reset";

const connectionPool = db.getInstance();
const stripeService = StripeService.getInstance();

//Dummy two factor code
const SECRET = "GQRVI3CBGZBE6U2SKQ7FKTTHJJJTKYKU"; // should be put in the .env or removed for covid MVP

export class AuthenticationServiceImpl implements AuthenticationService {
    private authenticationDao: AuthenticationInformationDAO;
    private emailDao: EmailDAO;
    private legalNameDao: LegalNameDAO;
    private emailClient: AffordableEmailClient;
    private emailService: EmailService;
    private forgotPassDAO: ForgotPasswordResetTokenDAO;
    private twoFactorDAO: TwoFactorDAO;
    private adminPrivilegesDAO: AdminPrivilegesDAO;

    // TODO: Consider DI
    public constructor(authenticationDao?: AuthenticationInformationDAO,
        emailDao?: EmailDAO,
        legalNameDao?: LegalNameDAO,
        emailClient?: AffordableEmailClient,
        emailService?: EmailService,
        forgotPassDAO?: ForgotPasswordResetTokenDAO) {
        this.authenticationDao = authenticationDao ?? new DBOAuthenticationInformationDAOImpl();
        this.emailDao = emailDao ?? new DBOEmailRecordDAOImpl();
        this.legalNameDao = legalNameDao ?? new DBOLegalNameDAOImpl();
        this.emailClient = emailClient ?? AffordableSESClient.getInstance();
        this.emailService = emailService ?? new EmailService();
        this.forgotPassDAO = forgotPassDAO ?? new ForgotPasswordResetTokenDAO();
        this.twoFactorDAO = new TwoFactorDAOImpl();
        this.adminPrivilegesDAO = new AdminPrivilegesDAO();
        this.registerUser = this.registerUser.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.sendVerificationEmailForNewAccount = this.sendVerificationEmailForNewAccount.bind(this);
        this.deleteUserInfo = this.deleteUserInfo.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.validateTwoFactorCodeUsername = this.validateTwoFactorCodeUsername.bind(this);
    }

    async refreshToken(username: string): Promise<LoginResponse> {
        const userInfo = await this.getUserInfo(username);

        return {
            userInfo: userInfo,
            token: AuthenticationServiceImpl.generateToken(userInfo),
        };
    }

    /**
     * Creates a user in affordable
     * @param request A {@class CreateUserRequest} object that must have the following fields:
     *  username
     *  email
     *  password
     *  usertype
     */
    async registerUser(request: CreateUserRequest): Promise<LoginResponse> {
        Validation.requireParam(request.username, "username");
        Validation.requireParam(request.email, "email");
        Validation.requireParam(request.password, "password");
        Validation.requireParam(request.usertype, "usertype");


        const originalPassword = request.password.toString();

        const user = new AuthenticationInformationDBO();
        user.username = request.username;
        user.TwoFactor = request.TwoFactor;
        user.TwoFactorCode = request.TwoFactorCode;
        user.isDonor = request.usertype === UserType.DONOR;
        user.isAdmin = request.usertype === UserType.ADMIN;
        user.deactivated = false;

        // Hash the password using bcrypt
        user.password = await hash(originalPassword, 10);

        // TODO: Add transactions (i.e. if saving the user email fails, then we should roll back user creation)
        const newUser: AuthenticationInformationDBO = await this.authenticationDao.createUser(user);
        console.log("New user created: ", newUser);

        // user needs to be authenticated first to create stripe table entry
        // adds an empty Stripe Custom account on creation if a recipient
        if (user.isDonor) {
            console.log("--New User is Donor: Creating Customer Account");
            // await stripeService.createCustomer(user);
            // await stripeService.createConnectedAccount(user, user.isDonor);
        }
        // else, add customer to Stripe account
        else if (user.isAdmin) {
            let privileges = new AdminPrivilegesDBO(user.id);
            await this.adminPrivilegesDAO.createAdminPrivileges(privileges);
        } else {
            // console.log("--New User is Recipient: Creating Custom Account");
            // await stripeService.createConnectedAccount(user, user.isDonor);
        }


        await this.emailService.addEmail(newUser.id, request.email, true, false);

        // if user has opted for two factor an email is sent to the user with the raw two factor code for username/password recovery
        if (newUser.TwoFactor === true) {
            this.emailClient.sendEmail({
                from: "donotreply@affordhealth.org",
                to: request.email,
                subject: "AFFORDABLE: Important Account Information",
                html: utils.formatEmail(
                    [
                        "<h4> Username:" + newUser.username +
                        "<br></br> Please keep the following two factor code " +
                        SECRET + " separately in case you don't have access to Google Authenticator Code</h4>"
                    ]
                )
            });
        }

        return this.refreshToken(newUser.username);
    }

    /**
     * Validate a login attempt
     * @returns UserInfo
     */
    async validateLogin(req: LoginRequest): Promise<any> {
        Validation.requireParam(req.username, "username");
        Validation.requireParam(req.password, "password");
        let passwordMatches: boolean;
        try {
            passwordMatches = await compare(req.password, await this.authenticationDao.getPasswordForUser(req.username));
        } catch (e) {
            // If we didn't find a user, we should fail the login, rather than say the user doesn't exist.
            if (e instanceof NotFoundError) {
                console.log("User does not exist in DB");
                let invalidResponse: InvalidLoginResponse = {
                    isValidUsername: false,
                    isValidPassword: false,
                    isAdmin: false,
                    isApprovedAdmin: false,
                    isDisabled: false
                }

                return invalidResponse;
            } else {
                throw e;
            }
        }

        let info = await this.authenticationDao.getUser(req.username);

        if (!passwordMatches) {
            console.log("Users password is incorrect");
            let invalidResponse: InvalidLoginResponse = {
                isValidUsername: true,
                isValidPassword: false,
                isAdmin: false,
                isApprovedAdmin: false,
                isDisabled: false
            }

            return invalidResponse;
        }

        if (info.isAdmin) {
            console.log("User is admin");
            let privs = await this.adminPrivilegesDAO.getAdminPrivileges(info.id);

            if (!privs.active) {
                console.log("Admin user is not active");
                let invalidResponse: InvalidLoginResponse = {
                    isValidUsername: true,
                    isValidPassword: true,
                    isAdmin: true,
                    isApprovedAdmin: false,
                    isDisabled: false
                }

                return invalidResponse;
            }
        }

        if (info.deactivated) {
            console.log("User is deactivated");
            let invalidResponse: InvalidLoginResponse = {
                isValidUsername: true,
                isValidPassword: true,
                isAdmin: false,
                isApprovedAdmin: true,
                isDisabled: true
            }

            return invalidResponse;
        }

        // let requiresTwoFact: boolean;
        // try {
        //     requiresTwoFact = await(this.authenticationDao.getUserRequiresTwoFactorAuthentication(req.username))
        // } catch (e) {
        //     if (e instanceof NotFoundError) {
        //         throw new UnauthorizedError(FAILED_LOGIN_MESSAGE);
        //     } else {
        //         throw e;
        //     }
        // }

        // let responseObject = this.refreshToken(req.username);
        // if (requiresTwoFact) {
        //     responseObject["requiresTwoFactor"] = true;
        // }else {
        //     responseObject["requiresTwoFactor"] = false;
        // }
        return this.refreshToken(req.username);
    }

    /**
     * Creates a signed JWT
     * @param userInfo
     */
    private static generateToken(userInfo: UserInfo) {
        return jwt.sign({ "sub": JSON.stringify(userInfo) }, process.env.AFFORDABLE_TOKEN_SIGNING_KEY, { expiresIn: "8h" });
    }

    async getUserInfo(usernameOrId: string | number): Promise<UserInfo> {
        Validation.requireParam(usernameOrId, "id");

        const authInfo = typeof usernameOrId === "number" ?
            await this.authenticationDao.getUserById(usernameOrId) :
            await this.authenticationDao.getUser(usernameOrId);

        let emails = await this.emailDao.getAllEmails(authInfo.username);
        emails = emails.filter(e => { return e.isPrimary; });

        let legalNameInfo: LegalName[];
        try {
            legalNameInfo = await this.legalNameDao.getAllLegalNamesWithUserId(authInfo.id);
        } catch (e) {
            if (e instanceof NotFoundError) {
                // Do nothing, the user just doesn't have a legal name saved
            } else {
                throw e;
            }
        }

        const userInfo = new UserInfo();
        userInfo.id = authInfo.id;
        userInfo.username = authInfo.username;
        userInfo.primaryEmail = emails[0].email;
        userInfo.hasVerifiedEmail = emails[0].verified;
        userInfo.isDeactivate = authInfo.deactivated;
        if (authInfo.isAdmin) {
            userInfo.userType = UserType.ADMIN;
            let privs = await this.adminPrivilegesDAO.getAdminPrivileges(userInfo.id);
            userInfo.isDeactivate = !privs.active
        } else if (authInfo.isDonor) {
            userInfo.userType = UserType.DONOR;
        } else {
            userInfo.userType = UserType.RECIPIENT;
        }
        userInfo.twoFactor = authInfo.TwoFactor;
        if (legalNameInfo !== undefined) {
            const primaryNames = legalNameInfo.filter(name => name.isCurrentLegalName);
            if (primaryNames.length > 0) {
                userInfo.firstName = primaryNames[0].firstName;
                userInfo.lastName = primaryNames[0].lastName;
            }
        }
        return userInfo;
    }

    async accountCanBeCreatedWithEmail(email: string): Promise<boolean> {
        Validation.requireParam(email, "email");
        return !(await this.emailDao.emailExists(email));
    }

    async deleteUserInfo(userId: number): Promise<void> {
        Validation.requireParam(userId, "userId");
        await this.authenticationDao.deleteUserById(userId);
    }

    recoverAccountByEmail(req, res) {
        const values = [
            [
                req.body.username,
                req.body.email,       // newEmail column populated with accounts primary email
                req.body.email,       // oldEmail column populated with accounts primary email
                req.body.randomString,
                req.body.timestamp
            ]
        ];

        const sql = "INSERT INTO requests VALUES ?";

        connectionPool.query(sql, [values], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                console.log("Request inserted!");
            }
        });

        const email = req.body.email;
        const username = req.body.username;
        console.log("recovering account with email: " + email);
        connectionPool.query(storedProcedure.getAuthenticationInformationByEmail, email, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                const url = "temp=" + req.body.randomString;
                const urlEncrypt = encodeURIComponent(url);
                const desiredLink = process.env.AFFORDABLE_FRONTEND_URL + "/reset_password?" + urlEncrypt;
                const desiredText = "Click Here to recover your Password";
                this.emailClient.sendEmail({
                    from: "donotreply@affordhealth.org",
                    to: req.body.email,
                    subject: "AFFORDABLE:: Account Recovery",
                    html: utils.formatEmail(
                        [
                            "<h1>Your Account has been recovered </h1><h3>Username:" + results[0][0].Username + " </h3><br></br> <a href=\"" + desiredLink + "\">" + desiredText + "</a>"
                        ]
                    )
                });
                //Set success in return response to frontend
                res.status(200).send({ success: "Email Available" });
            }
        });
    }

    sendVerificationEmailForNewAccount(req, res) {
        const { email } = req.body;

        if (email) {
            const desiredLink = process.env.AFFORDABLE_FRONTEND_URL + "/email_verify";
            const desiredText = "Click Here";
            this.emailClient.sendEmail({
                from: "donotreply@affordhealth.org",
                to: email,
                subject: "Affordable:: Please Verify your Email",
                html: utils.formatEmail(
                    [
                        "<h2>Click on the following link to verify your email: </h2> <a href=\"" + desiredLink + "\">" + desiredText + "</a>"
                    ]
                )
            });
        }
        res.sendStatus(200);
    }

    updatePassword(req, res) {
        const email = req.body.email;
        const username = req.body.username;
        const new_password = req.body.new_password;

        if (email == "blank") {
            connectionPool.query(storedProcedure.updatePasswordByUsername, [[username, new_password]], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                } else {
                    console.log("Password Updated");
                    res.status(200).json({ success: "Password Updated" });
                }
            });
        } else {
            // username is empty --> user has given only email as input

            const sql = "call update_password_by_email(?)";

            connectionPool.query(storedProcedure.updatePasswordByEmail, [[email, new_password]], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                } else {
                    console.log("Password Updated");
                    res.status(200).json({ success: "Password Updated" });
                }
            });
        }
    }

    async changePassword(userInfo: UserInfo, req: ChangePasswordReq): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo, false);
        Validation.requireParam(req.oldPassword, "oldPassword");
        Validation.requireParam(req.newPassword, "newPassword");

        const username = userInfo.username;
        const oldPw = req.oldPassword;
        const newPw = req.newPassword;
        let passwordMatches: boolean;
        try {
            passwordMatches = await compare(oldPw, await this.authenticationDao.getPasswordForUser(username));
        } catch (e) {
            // THe username or old password information was
            if (e instanceof NotFoundError) {
                throw new UnauthorizedError(FAILED_LOGIN_MESSAGE);
            } else {
                throw e;
            }
        }

        if (!passwordMatches) {
            throw new UnauthorizedError(FAILED_LOGIN_MESSAGE);
        } else { // the old password was correct, so change it to the new password
            const user: AuthenticationInformationDBO = await this.authenticationDao.getUser(username);
            user.password = await hash(newPw, 10);
            await this.authenticationDao.updateUser(user);
        }

        return;
    }

    async resetPassword(newPassword: string, code: string): Promise<void> {
        Validation.requireParam(newPassword, "newPassword");
        Validation.requireParam(code, "code");

        console.log(code);

        const hashedNewPassword = await hash(newPassword, 10);

        const forgotPasswordResetToken = await this.forgotPassDAO.getForgotPasswordResetTokenByCode(code);

        const today = new Date();
        if (forgotPasswordResetToken.expirationDate.getTime() >= today.getTime()) { // then the forgot password object is still valid
            const user = await this.authenticationDao.getUserById(forgotPasswordResetToken.userId);
            user.password = hashedNewPassword;
            await this.authenticationDao.updateUser(user);
            await this.forgotPassDAO.deleteForgotPasswordResetTokenByCode(code);
        } else { // the forgot password reset token has expired
            console.log("The refresh token has expired")
            throw new UnauthorizedError(FAILED_RESET_PASSWORD_MESSAGE);
        }
    }

    generateQRCode(req, res) {
        //const secret = speakeasy.generateSecret({length: 20}); // unique code generated upon each request //secret is now passed from Register.js so each user has unique code in database
        QRCode.toDataURL(req.body.secret.otpauth_url, function (error, data_url) {
            if (error) {
                console.log(error);
                res.status(500).json({ error });
            } else {
                const filePath = "./public/filename" + req.body.imageid + ".png";
                imageDataURI.outputFile(data_url, filePath);
                res.status(200).json({ success: "Image Generated" });
            }
        });
    }

    validateTwoFactorCodeRegistration(req, res) {
        console.log("Validating Two-factor ...");
        console.log("Two Factor Code: " + req.body.token);
        console.log("With Secret: " + req.body.secret);


        const secret = req.body.secret; //this should come from the request (its the secret code created by speakeasy)
        const token = req.body.token;
        const verified = speakeasy.totp.verify({ secret: secret, encoding: "base32", token: token });

        console.log("Verified? ... " + verified);

        res.status(200).json({ verified });
    }

    validateTwoFactorCodeEmail(req, res) {
        const userToken = req.body.token;
        const email = req.body.email;
        const GoogleAuth = req.body.GoogleAuth;

        connectionPool.query(storedProcedure.getAuthenticationInformationByEmail, email, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                if (results[0].length > 0) {
                    if (GoogleAuth == "true") {
                        console.log("Inside GoogleAuth");
                        var verified = speakeasy.totp.verify({
                            secret: results[0][0].TwoFactorCode,
                            encoding: "base32",
                            token: userToken
                        });
                    } else {
                        console.log("Inside RawAuth");
                        if (userToken == results[0][0].TwoFactorCode) {
                            console.log("Matched");
                            verified = true;
                        } else {
                            verified = false;
                        }
                    }
                    console.log("Verified? ... " + verified);
                    res.status(200).json({
                        verified: verified,
                        email: results[0][0].Email,
                        username: results[0][0].Username
                    });
                }
            }
        });
    }

    validateTwoFactorCodeUsername(req, res) {
        const userToken = req.body.token;
        const username = req.body.username;
        const GoogleAuth = req.body.GoogleAuth;

        this.twoFactorDAO.getTwoFactorByUsername(username).then(twoFactor => {
            console.log("The solution is: ", twoFactor);
            console.log("google auth", GoogleAuth)
            if (GoogleAuth == "true") {
                console.log("Inside GoogleAuth");
                var verified = speakeasy.totp.verify({
                    secret: twoFactor.secret,
                    encoding: "base32",
                    token: userToken
                });
            }
            console.log("Verified? ... " + verified);
            res.status(200).json({
                verified: verified,
                email: twoFactor.email,
                username: twoFactor.username
            });
        }, error => {
            console.log(error);
            res.status(502).json({ error });
        });

        // connectionPool.query(storedProcedure.getAuthenticationInformationByUsername, username, (error, results, fields) => {
        //     if (error) {
        //         console.log(error);
        //         res.status(502).json({error});
        //     } else {
        //         console.log("The solution is: ", results);
        //         if (results[0].length > 0) {
        //             console.log("google auth", GoogleAuth)
        //             if (GoogleAuth == "true") {
        //                 console.log("Inside GoogleAuth");
        //                 var verified = speakeasy.totp.verify({
        //                     secret: results[0][0].TwoFactorCode,
        //                     encoding: "base32",
        //                     token: userToken
        //                 });
        //             } else {
        //                 console.log("Inside RawAuth");
        //                 if (userToken == results[0][0].TwoFactorCode) {
        //                     console.log("Matched");
        //                     verified = true;
        //                 } else {
        //                     verified = false;
        //                 }
        //             }
        //             console.log("Verified? ... " + verified);
        //             res.status(200).json({
        //                 verified: verified,
        //                 email: results[0][0].Email,
        //                 username: results[0][0].Username
        //             });
        //         }
        //     }
        // });
    }

    isUsernameUnique(req, res) {
        const { username } = req.body;

        connectionPool.query(storedProcedure.getAuthenticationInformationByUsername, username, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                let usernameIsUnique = true;
                if (results[0].length > 0) {
                    usernameIsUnique = false;
                }
                res.status(200).json({ usernameIsUnique });
            }
        });
    }

    deactivateAccount(req, res) {

        const sql = "UPDATE AuthenticationInformation SET Deactivated =1 WHERE Username = ?";
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                this.emailClient.sendEmail({
                    from: "donotreply@affordhealth.org",
                    to: req.body.Email,
                    subject: "AFFORDABLE:: Important Account Information",
                    html: utils.formatEmail(
                        [
                            "<h2> The account associated with this device has been deactivated. To reactivate the account, please log in.</h2>"
                        ]
                    )
                });
            }
        });

    }

    reactivateAccount(req, res) {

        const sql = "UPDATE AuthenticationInformation SET Deactivated = 0 WHERE Username = ?";
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                this.emailClient.sendEmail({
                    from: "donotreply@affordhealth.org",
                    to: req.body.Email,
                    subject: "AFFORDABLE:: Important Account Information",
                    html: utils.formatEmail(
                        [
                            "<h2> The account associated with this email has been reactivated. Welcome back!</h2>"
                        ]
                    )
                });
            }
        });

    }

    async reactivateAccountById(userId: number) {
        let authInfo = await this.authenticationDao.getUserById(userId);
        let userInfo = await this.getUserInfo(userId);

        authInfo.deactivated = false;
        this.authenticationDao.updateUser(authInfo);

        this.emailService.sendReactivateEmail(userInfo);
    }

    async deactivateAccountById(userId: number) {
        let authInfo = await this.authenticationDao.getUserById(userId);
        let userInfo = await this.getUserInfo(userId);

        authInfo.deactivated = true;
        this.authenticationDao.updateUser(authInfo);

        this.emailService.sendDeactivateEmail(userInfo);
    }

    //need city,state, ip addr and the profile username that
    failedlogin(req, res) {
        this.emailClient.sendEmail({
            from: "donotreply@affordhealth.org",
            to: req.body.Email,
            subject: "AFFORDABLE:: Important Account Information",
            html: utils.formatEmail([
                "<h2> There was a failed log in attempt for the account associated with this email at " + req.body.ip_addr + " locatated at:" + req.body.city + "," + req.body.state + "</h2>"
            ])
        });
    }

    async getAllUsers(): Promise<Array<UserInfo>> {
        let info: Array<AuthenticationInformationDBO> = await this.authenticationDao.getAllUsers();
        let userInfos = new Array<UserInfo>();

        let infoRequests = new Array<Promise<UserInfo>>();

        info.forEach(user => {
            infoRequests.push(this.getUserInfo(user.username));
        });

        userInfos = await Promise.all(infoRequests);

        return userInfos;
    }
}