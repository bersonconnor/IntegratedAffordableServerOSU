"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VerifyOrganizationService_1 = require("../services/VerifyOrganizationService");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const verifyOrganizationRouter = require("express").Router();
const service = new VerifyOrganizationService_1.VerifyOrganizationService();
verifyOrganizationRouter.use(AuthenticationRouter_1.default.verifyToken);
/**
 * @api {put} /verifyOrganization Verify new organization
 * @apiName verifyOrganization
 * @apiGroup verifyOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} status Result status set to 'OK'
 * @apiSuccess {Boolean} valid Boolean flag for organization's validity
 */
verifyOrganizationRouter.post("/verifyOrganization", service.verifyOrganization);
/**
 * @api {put} /email/notifyVerifyOrg Email donor admin verification email
 * @apiName sendVerificationEmailForVerifyOrg
 * @apiGroup verifyOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport Org verification email sent to user
 * @apiSuccess {Number} sendStatus send status set to '200'
 */
verifyOrganizationRouter.post("/email/notifyVerifyOrg", service.sendVerificationEmailForVerifyOrg);
verifyOrganizationRouter.verifyOrganization = service.verifyOrganization;
verifyOrganizationRouter.sendVerificationEmailForVerifyOrg = service.sendVerificationEmailForVerifyOrg;
exports.default = verifyOrganizationRouter;
