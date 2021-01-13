"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProfileController_1 = require("../controllers/ProfileController");
const ProfileService_1 = require("../services/ProfileService");
const OrganizationController_1 = require("../controllers/OrganizationController");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const profileRouter = require("express").Router();
profileRouter.use(AuthenticationRouter_1.default.verifyToken);
const service = new ProfileService_1.ProfileService();
const controller = new ProfileController_1.ProfileController();
const organizationController = new OrganizationController_1.OrganizationController();
/**
 * @api {POST} Create Profile
 * @apiName addSecondaryEmailVerify
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport verification email sent to user
 * @apiSuccess {Number} sendStatus result sendStatus set to '200'
 */
profileRouter.post("/", controller.createProfile);
/**
 * @api {GET} Get Profile by id
 * @apiName addSecondaryEmailVerify
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport verification email sent to user
 * @apiSuccess {Number} sendStatus result sendStatus set to '200'
 */
profileRouter.get("/", controller.getProfile);
/**
 * @api {DELETE} delete Profile by id
 * @apiName addSecondaryEmailVerify
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport verification email sent to user
 * @apiSuccess {Number} sendStatus result sendStatus set to '200'
 */
profileRouter.delete("/", controller.deleteProfile);
profileRouter.get("/:userId/organizations", organizationController.getOrganizationsForUser);
profileRouter.get("/:userId/userInfo", controller.getUserInfo);
/**
 * @api {GET} /get-primary-email Retrieve user's primary email
 * @apiName getPrimaryEmail
 * @apiGroup profile
 * @apiDescription requires req.body.username
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Primary email retrieval success message
 * @apiSuccess {String} email User's primary email
 */
profileRouter.get("/get-primary-email", controller.getPrimaryEmail);
/**
 * @api {put} /add-secondary-email-verify Verify user's secondary email
 * @apiName addSecondaryEmailVerify
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport verification email sent to user
 * @apiSuccess {Number} sendStatus result sendStatus set to '200'
 */
profileRouter.post("/add-secondary-email-verify", service.addSecondaryEmailVerify);
/**
 * @api {put} /primary-email-change-verify Verify change of primary email
 * @apiName changePrimaryEmailVerify
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport verification email sent to user
 * @apiSuccess {Number} sendStatus result sendStatus set to '200'
 */
profileRouter.post("/primary-email-change-verify", service.changePrimaryEmailVerify);
/**
 * @api {put} /add-email Add new user email
 * @apiName addEmail
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Email insertion success message
 */
profileRouter.post("/add-email", service.addEmail);
/**
 * @api {get} /get-emails Retrieve all user emails
 * @apiName getEmails
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Email retrieval success message
 * @apiSuccess {List} emailList List of user Emails
 */
profileRouter.post("/get-emails", service.getEmails);
/**
 * @api {get} /get-devices Retrieve all user two factor devices
 * @apiName getDevices
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Email retrieval success message
 * @apiSuccess {List} deviceList List of user two factor devices
 */
profileRouter.post("/get-devices", service.getDevices);
/**
 * @api {get} /get-request Retrieve user request
 * @apiName getRequest
 * @apiGroup profile
 * @apiDescription requires req.body.randomString
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Request retrieval success message
 * @apiSuccess {String} username User associated with request
 * @apiSuccess {String} newEmail new email associated with user
 * @apiSuccess {String} oldEmail old email associated with user
 * @apiSuccess {String} randomString request string from user
 * @apiSuccess {Time} timestamp Timestamp of request
 */
profileRouter.post("/get-request", service.getRequest);
/**
 * @api {put} /remove-request Remove user request
 * @apiName removeRequest
 * @apiGroup profile
 * @apiDescription requires req.body.randomString
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Request removal success message
 */
profileRouter.post("/remove-request", service.removeRequest);
/**
 * @api {put} /make-primary Reset user's primary email
 * @apiName makePrimary
 * @apiGroup profile
 * @apiDescription requires req.body.username, req.body.email
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Primary email success message
 */
profileRouter.post("/make-primary", service.makePrimary);
/**
 * @api {get} /get-primary-email Retrieve user's primary email
 * @apiName getPrimaryEmail
 * @apiGroup profile
 * @apiDescription requires req.body.username
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Primary email retrieval success message
 * @apiSuccess {String} email User's primary email
 */
profileRouter.post("/get-primary-email", service.getPrimaryEmail);
/**
 * @api {get} /get-user-type Find if the user is Recipient or Donor
 * @apiName getUserType
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success User type retrieval success message
 * @apiSuccess {Boolean} isDonor Boolean value for user type
 */
profileRouter.post("/get-user-type", service.getUserType);
/**
 * @api {put} /delete-email Delete user's email
 * @apiName deleteEmail
 * @apiGroup profile
 * @apiDescription requires req.body.email
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success User email deletion success message
 */
profileRouter.post("/delete-email", service.deleteEmail);
/**
 * @api {put} /update-email Update user's email
 * @apiName updateEmail
 * @apiGroup profile
 * @apiDescription requires req.body.newEmail, req.body.oldEmail
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success User email update success message
 */
profileRouter.post("/update-email", service.updateEmail);
/**
 * @api {put} /verify-email Verify user's email
 * @apiName verifyEmail
 * @apiGroup profile
 * @apiDescription requires username
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success User email verification success message
 */
profileRouter.post("/verify-email", service.verifyEmail);
/**
 * @api {put} /add-unverified-email Add new unverified user email
 * @apiName addUnverifiedEmail
 * @apiGroup profile
 * @apiDescription requires req.body.username, req.body.email
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success User email addition success message
 */
profileRouter.post("/add-unverified-email", service.addUnverifiedEmail);
/**
 * @api {put} /add-two-factor Add two factor authentication for user
 * @apiName addTwoFactor
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} console_log Console log two factor success message
 * @apiSuccess {Condition} smtpTransport Two factor email sent to user
 */
profileRouter.post("/add-two-factor", service.addTwoFactor);
/**
 * @api {put} /remove-two-factor Remove two factor authentication for user
 * @apiName removeTwoFactor
 * @apiGroup profile
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Two factor removal success message
 * @apiSuccess {Number} changed row change flag set to '1'
 */
profileRouter.post("/remove-two-factor", service.removeTwoFactor);
profileRouter.addUnverifiedEmail = service.addUnverifiedEmail;
profileRouter.verifyEmail = service.verifyEmail;
profileRouter.makePrimary = service.makePrimary;
exports.default = profileRouter;
