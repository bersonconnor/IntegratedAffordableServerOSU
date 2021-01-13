import { AuthenticationController } from "../controllers/AuthenticationController";
import { EmailController } from "../controllers/EmailController";
import {AuthenticationServiceImpl} from "../services/AuthenticationServiceImpl";
const authenticationRouter = require("express").Router();
const emailController = new EmailController()
const authenticationService = new AuthenticationServiceImpl();
const authenticationController = new AuthenticationController();

// Middleware for verifying and refreshing a session token.
authenticationRouter.verifyToken = authenticationController.verifyUser;

/**
 * @api {put} /deactivate-account Deactivate user account
 * @apiName deactivateAccount
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Number} Deactivated user deactivated status set to '1'
 * @apiSuccess {Condition} smtpTransport Deactivation email sent to user.
 */
authenticationRouter.post("/deactivate-account", authenticationRouter.verifyToken, authenticationService.deactivateAccount);

/**
 * @api {put} /failed-login Notify user of failed login attempt
 * @apiName failedlogin
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport Failed login email sent to user.
 */
authenticationRouter.post("/failed-login", authenticationService.failedlogin);

/**
 * @api {put} /reactivate-account Reactivate user Account
 * @apiName reactivateAccount
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Number} Deactivated user deactivated status set to '0'
 * @apiSuccess {Condition} smtpTransport reactivatation email sent to user.
 */
authenticationRouter.post("/reactivate-account", authenticationRouter.verifyToken, authenticationService.reactivateAccount);

/**
 * @api {put} / Reactivate user Account
 * @apiName registerUser
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} console log success notification for proper database 
 */
authenticationRouter.post("/", authenticationController.registerUser);

/**
 * @api {get} /email Check if email is unique
 * @apiName isEmailUnique
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} emailIsUnqiue Boolean value for uniqueness of email 
 */
authenticationRouter.post("/email", authenticationController.accountCanBeCreatedWithEmail);

/**
 * @api {put} /email/recover Recover user account using email
 * @apiName recoverAccountByEmail
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport Recovery email sent to user
 * @apiSuccess {String}  res_status Success notification
 */
authenticationRouter.post("/email/recover", authenticationService.recoverAccountByEmail);

/**
 * @api {get} /email/verify Send user account verification email
 * @apiName sendVerificationEmailForNewAccount
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport Recovery email sent to user
 * @apiSuccess {String}  res_status Success notification
 */
authenticationRouter.get('/email/verify', authenticationRouter.verifyToken, emailController.verifyEmail);

/**
 * @api {get} /get-verification Get whether or not a user is verified
 * @apiName checkEmailVerification

 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} user email verification value
 */
authenticationRouter.get('/get-verification', authenticationRouter.verifyToken, emailController.checkEmailVerification);

 /**
  * @api {post} /email/update Update user's primary email
  * @apiName updatePrimaryEmail
  * @apiGroup Authentication
  * 
  * @apiSuccess {Condition} smtpTransport Recovery email sent to user
  * @apiSuccess {String}  res_status Success notification
  */
authenticationRouter.post('/email/update', authenticationRouter.verifyToken, emailController.updatePrimaryEmail);

/**
 * @api {get} /login Validate user login
 * @apiName validateLogin
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} UserInfo if login succeeds
 * @apiSuccess {Boolean} requiresTwoFactorAuth Boolean value of two-factor authentication
 */
authenticationRouter.post("/login", authenticationController.validateLogin);

/**
 * @api {put} /password/update Update User Password
 * @apiName updatePassword
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Console log success notification
 */
authenticationRouter.post("/password/update", authenticationRouter.verifyToken, authenticationService.updatePassword);

/**
 * @api {put} /qr Generate User QR code
 * @apiName generateQRCode
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} filePath path to QR code image
 * @apiSuccess {Object} imageDataURI QR Code object
 * @apiSuccess {String} success Console log success notification
 */
authenticationRouter.post("/qr", authenticationService.generateQRCode);

/**
 * Changes the user's password while they are logged in and on the settings page
 */
authenticationRouter.post("/change-password", authenticationRouter.verifyToken, authenticationController.changePassword);

/**
 * Sends an email to the user with a link to the frontend to reset their password
 */
authenticationRouter.post("/forgot-password", emailController.forgotPassword);

/**
 * Resets the users password from the forgot password flow
 */
authenticationRouter.post("/reset-password", authenticationController.resetPassword);

/**
 * @api {get} /two-factor Validate User Two-Factor registration
 * @apiName validateTwoFactorCodeRegistration
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} verified Boolean value of two factor verification
 */
authenticationRouter.post("/two-factor", authenticationService.validateTwoFactorCodeRegistration);

/**
 * @api {get} /two-factor/email Validate User Two-Factor Code using e-mail
 * @apiName validateTwoFactorCodeEmail
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} verified Boolean value of two factor verification
 * @apiSuccess {String} email User's registered email
 * @apiSuccess {String} user User's registered username
 */
authenticationRouter.post("/two-factor/email", authenticationRouter.verifyToken, authenticationService.validateTwoFactorCodeEmail);

/**
 * @api {get} /two-factor/username Validate User Two-Factor Code using username
 * @apiName validateTwoFactorCodeUsername
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} verified Boolean value of two factor verification
 * @apiSuccess {String} email User's registered email
 * @apiSuccess {String} user User's registered username
 */
authenticationRouter.post("/two-factor/username", authenticationRouter.verifyToken, authenticationService.validateTwoFactorCodeUsername);

/**
 * @api {get} /username Check uniqueness of username
 * @apiName isUsernameUnique
 * @apiGroup Authentication
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Boolean} usernameIsUnique Boolean value of uniqueness of username
 */
authenticationRouter.post("/username", authenticationService.isUsernameUnique);

authenticationRouter.isEmailUnique = authenticationService.accountCanBeCreatedWithEmail;

export default authenticationRouter;
