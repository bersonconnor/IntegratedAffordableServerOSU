import { RepresentOrganizationService } from "../services/RepresentOrganizationService";
import { errorHandler } from "./ErrorHandler";
const representOrganization = require("express").Router();
import AuthenticationRouter from "./AuthenticationRouter";

const service = new RepresentOrganizationService();

representOrganization.use(AuthenticationRouter.verifyToken);

/**
 * @api {put} /addMember Add member to Organization
 * @apiName addMember
 * @apiGroup representOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} Result status set to 'OK'
 */
representOrganization.post("/addMember", service.addMember);

/**
 * @api {get} /affiliations Get organization affiliations for user
 * @apiName getAffiliations
 * @apiGroup representOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {List} orgsInfo List of organization affiliations for user
 */
representOrganization.post("/affiliations", service.getAffiliations);

representOrganization.addMember = service.addMember;
representOrganization.getAffiliations = service.getAffiliations;

representOrganization.use(errorHandler);
module.exports = representOrganization;
