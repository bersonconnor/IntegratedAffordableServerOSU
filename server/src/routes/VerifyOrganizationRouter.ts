import { VerifyOrganizationService } from "../services/VerifyOrganizationService";
import { errorHandler } from "./ErrorHandler";
import AuthenticationRouter from "./AuthenticationRouter";

const verifyOrganizationRouter = require("express").Router();
const service = new VerifyOrganizationService();

verifyOrganizationRouter.use(AuthenticationRouter.verifyToken);

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

export default verifyOrganizationRouter;
