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
exports.AuthenticationServiceImpl = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.config();
const affordable_shared_models_1 = require("affordable-shared-models");
const imageDataURI = __importStar(require("image-data-uri"));
const QRCode = __importStar(require("qrcode"));
const speakeasy = __importStar(require("speakeasy"));
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const storedProcedure = __importStar(require("../database/storedProcedure"));
const NotFoundError_1 = require("../models/NotFoundError");
const AuthenticationInformationDBO_1 = require("../models/orm/AuthenticationInformationDBO");
const utils = __importStar(require("../utils"));
const Validation_1 = require("../utils/Validation");
const UnauthorizedError_1 = require("../models/UnauthorizedError");
const bcrypt_1 = require("bcrypt");
const DBOAuthenticationInformationDAOImpl_1 = require("../database/dao/authentication/DBOAuthenticationInformationDAOImpl");
const DBOEmailRecordDAOImpl_1 = require("../database/dao/email/DBOEmailRecordDAOImpl");
const ForgotPasswordResetTokenDAO_1 = require("../database/dao/ForgotPasswordResetTokenDAO");
const DBOLegalNameDAOImpl_1 = require("../database/dao/profile/DBOLegalNameDAOImpl");
const AffordableSESClient_1 = require("./email/AffordableSESClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EmailService_1 = require("./EmailService");
const AuthorizationUtils_1 = require("./AuthorizationUtils");
const StripeService_1 = require("./StripeService");
const TwoFactorDAOImpl_1 = require("../database/dao/authentication/TwoFactorDAOImpl");
const AdminPrivilegesDBO_1 = require("../models/orm/profile/AdminPrivilegesDBO");
const AdminPrivilegesDAO_1 = require("../database/dao/admin/AdminPrivilegesDAO");
const FAILED_LOGIN_MESSAGE = "The username or password was incorrect!";
const FAILED_RESET_PASSWORD_MESSAGE = "The password could not be reset";
const connectionPool = DatabaseConnection_1.default.getInstance();
const stripeService = StripeService_1.StripeService.getInstance();
//Dummy two factor code
const SECRET = "GQRVI3CBGZBE6U2SKQ7FKTTHJJJTKYKU"; // should be put in the .env or removed for covid MVP
class AuthenticationServiceImpl {
    // TODO: Consider DI
    constructor(authenticationDao, emailDao, legalNameDao, emailClient, emailService, forgotPassDAO) {
        this.authenticationDao = authenticationDao !== null && authenticationDao !== void 0 ? authenticationDao : new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        this.emailDao = emailDao !== null && emailDao !== void 0 ? emailDao : new DBOEmailRecordDAOImpl_1.DBOEmailRecordDAOImpl();
        this.legalNameDao = legalNameDao !== null && legalNameDao !== void 0 ? legalNameDao : new DBOLegalNameDAOImpl_1.DBOLegalNameDAOImpl();
        this.emailClient = emailClient !== null && emailClient !== void 0 ? emailClient : AffordableSESClient_1.AffordableSESClient.getInstance();
        this.emailService = emailService !== null && emailService !== void 0 ? emailService : new EmailService_1.EmailService();
        this.forgotPassDAO = forgotPassDAO !== null && forgotPassDAO !== void 0 ? forgotPassDAO : new ForgotPasswordResetTokenDAO_1.ForgotPasswordResetTokenDAO();
        this.twoFactorDAO = new TwoFactorDAOImpl_1.TwoFactorDAOImpl();
        this.adminPrivilegesDAO = new AdminPrivilegesDAO_1.AdminPrivilegesDAO();
        this.registerUser = this.registerUser.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.sendVerificationEmailForNewAccount = this.sendVerificationEmailForNewAccount.bind(this);
        this.deleteUserInfo = this.deleteUserInfo.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.validateTwoFactorCodeUsername = this.validateTwoFactorCodeUsername.bind(this);
    }
    async refreshToken(username) {
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
    async registerUser(request) {
        Validation_1.Validation.requireParam(request.username, "username");
        Validation_1.Validation.requireParam(request.email, "email");
        Validation_1.Validation.requireParam(request.password, "password");
        Validation_1.Validation.requireParam(request.usertype, "usertype");
        const originalPassword = request.password.toString();
        const user = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
        user.username = request.username;
        user.TwoFactor = request.TwoFactor;
        user.TwoFactorCode = request.TwoFactorCode;
        user.isDonor = request.usertype === affordable_shared_models_1.UserType.DONOR;
        user.isAdmin = request.usertype === affordable_shared_models_1.UserType.ADMIN;
        user.deactivated = false;
        // Hash the password using bcrypt
        user.password = await bcrypt_1.hash(originalPassword, 10);
        // TODO: Add transactions (i.e. if saving the user email fails, then we should roll back user creation)
        const newUser = await this.authenticationDao.createUser(user);
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
            let privileges = new AdminPrivilegesDBO_1.AdminPrivilegesDBO(user.id);
            await this.adminPrivilegesDAO.createAdminPrivileges(privileges);
        }
        else {
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
                html: utils.formatEmail([
                    "<h4> Username:" + newUser.username +
                        "<br></br> Please keep the following two factor code " +
                        SECRET + " separately in case you don't have access to Google Authenticator Code</h4>"
                ])
            });
        }
        return this.refreshToken(newUser.username);
    }
    /**
     * Validate a login attempt
     * @returns UserInfo
     */
    async validateLogin(req) {
        Validation_1.Validation.requireParam(req.username, "username");
        Validation_1.Validation.requireParam(req.password, "password");
        let passwordMatches;
        try {
            passwordMatches = await bcrypt_1.compare(req.password, await this.authenticationDao.getPasswordForUser(req.username));
        }
        catch (e) {
            // If we didn't find a user, we should fail the login, rather than say the user doesn't exist.
            if (e instanceof NotFoundError_1.NotFoundError) {
                console.log("User does not exist in DB");
                let invalidResponse = {
                    isValidUsername: false,
                    isValidPassword: false,
                    isAdmin: false,
                    isApprovedAdmin: false,
                    isDisabled: false
                };
                return invalidResponse;
            }
            else {
                throw e;
            }
        }
        let info = await this.authenticationDao.getUser(req.username);
        if (!passwordMatches) {
            console.log("Users password is incorrect");
            let invalidResponse = {
                isValidUsername: true,
                isValidPassword: false,
                isAdmin: false,
                isApprovedAdmin: false,
                isDisabled: false
            };
            return invalidResponse;
        }
        if (info.isAdmin) {
            console.log("User is admin");
            let privs = await this.adminPrivilegesDAO.getAdminPrivileges(info.id);
            if (!privs.active) {
                console.log("Admin user is not active");
                let invalidResponse = {
                    isValidUsername: true,
                    isValidPassword: true,
                    isAdmin: true,
                    isApprovedAdmin: false,
                    isDisabled: false
                };
                return invalidResponse;
            }
        }
        if (info.deactivated) {
            console.log("User is deactivated");
            let invalidResponse = {
                isValidUsername: true,
                isValidPassword: true,
                isAdmin: false,
                isApprovedAdmin: true,
                isDisabled: true
            };
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
    static generateToken(userInfo) {
        return jsonwebtoken_1.default.sign({ "sub": JSON.stringify(userInfo) }, process.env.AFFORDABLE_TOKEN_SIGNING_KEY, { expiresIn: "8h" });
    }
    async getUserInfo(usernameOrId) {
        Validation_1.Validation.requireParam(usernameOrId, "id");
        const authInfo = typeof usernameOrId === "number" ?
            await this.authenticationDao.getUserById(usernameOrId) :
            await this.authenticationDao.getUser(usernameOrId);
        let emails = await this.emailDao.getAllEmails(authInfo.username);
        emails = emails.filter(e => { return e.isPrimary; });
        let legalNameInfo;
        try {
            legalNameInfo = await this.legalNameDao.getAllLegalNamesWithUserId(authInfo.id);
        }
        catch (e) {
            if (e instanceof NotFoundError_1.NotFoundError) {
                // Do nothing, the user just doesn't have a legal name saved
            }
            else {
                throw e;
            }
        }
        const userInfo = new affordable_shared_models_1.UserInfo();
        userInfo.id = authInfo.id;
        userInfo.username = authInfo.username;
        userInfo.primaryEmail = emails[0].email;
        userInfo.hasVerifiedEmail = emails[0].verified;
        userInfo.isDeactivate = authInfo.deactivated;
        if (authInfo.isAdmin) {
            userInfo.userType = affordable_shared_models_1.UserType.ADMIN;
            let privs = await this.adminPrivilegesDAO.getAdminPrivileges(userInfo.id);
            userInfo.isDeactivate = !privs.active;
        }
        else if (authInfo.isDonor) {
            userInfo.userType = affordable_shared_models_1.UserType.DONOR;
        }
        else {
            userInfo.userType = affordable_shared_models_1.UserType.RECIPIENT;
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
    async accountCanBeCreatedWithEmail(email) {
        Validation_1.Validation.requireParam(email, "email");
        return !(await this.emailDao.emailExists(email));
    }
    async deleteUserInfo(userId) {
        Validation_1.Validation.requireParam(userId, "userId");
        await this.authenticationDao.deleteUserById(userId);
    }
    recoverAccountByEmail(req, res) {
        const values = [
            [
                req.body.username,
                req.body.email,
                req.body.email,
                req.body.randomString,
                req.body.timestamp
            ]
        ];
        const sql = "INSERT INTO requests VALUES ?";
        connectionPool.query(sql, [values], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            }
            else {
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
            }
            else {
                const url = "temp=" + req.body.randomString;
                const urlEncrypt = encodeURIComponent(url);
                const desiredLink = process.env.AFFORDABLE_FRONTEND_URL + "/reset_password?" + urlEncrypt;
                const desiredText = "Click Here to recover your Password";
                this.emailClient.sendEmail({
                    from: "donotreply@affordhealth.org",
                    to: req.body.email,
                    subject: "AFFORDABLE:: Account Recovery",
                    html: utils.formatEmail([
                        "<h1>Your Account has been recovered </h1><h3>Username:" + results[0][0].Username + " </h3><br></br> <a href=\"" + desiredLink + "\">" + desiredText + "</a>"
                    ])
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
                html: utils.formatEmail([
                    "<h2>Click on the following link to verify your email: </h2> <a href=\"" + desiredLink + "\">" + desiredText + "</a>"
                ])
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
                }
                else {
                    console.log("Password Updated");
                    res.status(200).json({ success: "Password Updated" });
                }
            });
        }
        else {
            // username is empty --> user has given only email as input
            const sql = "call update_password_by_email(?)";
            connectionPool.query(storedProcedure.updatePasswordByEmail, [[email, new_password]], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log("Password Updated");
                    res.status(200).json({ success: "Password Updated" });
                }
            });
        }
    }
    async changePassword(userInfo, req) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false);
        Validation_1.Validation.requireParam(req.oldPassword, "oldPassword");
        Validation_1.Validation.requireParam(req.newPassword, "newPassword");
        const username = userInfo.username;
        const oldPw = req.oldPassword;
        const newPw = req.newPassword;
        let passwordMatches;
        try {
            passwordMatches = await bcrypt_1.compare(oldPw, await this.authenticationDao.getPasswordForUser(username));
        }
        catch (e) {
            // THe username or old password information was
            if (e instanceof NotFoundError_1.NotFoundError) {
                throw new UnauthorizedError_1.UnauthorizedError(FAILED_LOGIN_MESSAGE);
            }
            else {
                throw e;
            }
        }
        if (!passwordMatches) {
            throw new UnauthorizedError_1.UnauthorizedError(FAILED_LOGIN_MESSAGE);
        }
        else { // the old password was correct, so change it to the new password
            const user = await this.authenticationDao.getUser(username);
            user.password = await bcrypt_1.hash(newPw, 10);
            await this.authenticationDao.updateUser(user);
        }
        return;
    }
    async resetPassword(newPassword, code) {
        Validation_1.Validation.requireParam(newPassword, "newPassword");
        Validation_1.Validation.requireParam(code, "code");
        console.log(code);
        const hashedNewPassword = await bcrypt_1.hash(newPassword, 10);
        const forgotPasswordResetToken = await this.forgotPassDAO.getForgotPasswordResetTokenByCode(code);
        const today = new Date();
        if (forgotPasswordResetToken.expirationDate.getTime() >= today.getTime()) { // then the forgot password object is still valid
            const user = await this.authenticationDao.getUserById(forgotPasswordResetToken.userId);
            user.password = hashedNewPassword;
            await this.authenticationDao.updateUser(user);
            await this.forgotPassDAO.deleteForgotPasswordResetTokenByCode(code);
        }
        else { // the forgot password reset token has expired
            console.log("The refresh token has expired");
            throw new UnauthorizedError_1.UnauthorizedError(FAILED_RESET_PASSWORD_MESSAGE);
        }
    }
    generateQRCode(req, res) {
        //const secret = speakeasy.generateSecret({length: 20}); // unique code generated upon each request //secret is now passed from Register.js so each user has unique code in database
        QRCode.toDataURL(req.body.secret.otpauth_url, function (error, data_url) {
            if (error) {
                console.log(error);
                res.status(500).json({ error });
            }
            else {
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
            }
            else {
                if (results[0].length > 0) {
                    if (GoogleAuth == "true") {
                        console.log("Inside GoogleAuth");
                        var verified = speakeasy.totp.verify({
                            secret: results[0][0].TwoFactorCode,
                            encoding: "base32",
                            token: userToken
                        });
                    }
                    else {
                        console.log("Inside RawAuth");
                        if (userToken == results[0][0].TwoFactorCode) {
                            console.log("Matched");
                            verified = true;
                        }
                        else {
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
            console.log("google auth", GoogleAuth);
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
            }
            else {
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
            }
            else {
                this.emailClient.sendEmail({
                    from: "donotreply@affordhealth.org",
                    to: req.body.Email,
                    subject: "AFFORDABLE:: Important Account Information",
                    html: utils.formatEmail([
                        "<h2> The account associated with this device has been deactivated. To reactivate the account, please log in.</h2>"
                    ])
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
            }
            else {
                this.emailClient.sendEmail({
                    from: "donotreply@affordhealth.org",
                    to: req.body.Email,
                    subject: "AFFORDABLE:: Important Account Information",
                    html: utils.formatEmail([
                        "<h2> The account associated with this email has been reactivated. Welcome back!</h2>"
                    ])
                });
            }
        });
    }
    async reactivateAccountById(userId) {
        let authInfo = await this.authenticationDao.getUserById(userId);
        let userInfo = await this.getUserInfo(userId);
        authInfo.deactivated = false;
        this.authenticationDao.updateUser(authInfo);
        this.emailService.sendReactivateEmail(userInfo);
    }
    async deactivateAccountById(userId) {
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
    async getAllUsers() {
        let info = await this.authenticationDao.getAllUsers();
        let userInfos = new Array();
        let infoRequests = new Array();
        info.forEach(user => {
            infoRequests.push(this.getUserInfo(user.username));
        });
        userInfos = await Promise.all(infoRequests);
        return userInfos;
    }
}
exports.AuthenticationServiceImpl = AuthenticationServiceImpl;
