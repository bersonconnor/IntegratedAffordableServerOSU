import { OrganizationController } from "../controllers/OrganizationController";
import { JoinGroupService } from "../services/JoinGroupService";
import { errorHandler } from "./ErrorHandler";
import AuthenticationRouter from "./AuthenticationRouter";

const joinGroupRouter = require("express").Router();

joinGroupRouter.use(AuthenticationRouter.verifyToken);

const service = new JoinGroupService();
const orgController = new OrganizationController();

/**
 * @api {get} /searchOrg Search database for Organization using substring
 * @apiName searchOrg
 * @apiGroup joinGroup
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} status 'OK' res status string
 * @apiSuccess {String} orgName Organization's full name
 */
joinGroupRouter.post("/searchOrg", service.searchOrg);

/**
 * @api {put} /addMember Add member to organization database
 * @apiName addMember
 * @apiGroup joinGroup
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Console log success notification
 * @apiSuccess {String} status 'OK' res status string
 */
joinGroupRouter.post("/addMember", orgController.addMemberToOrganization);


/**
 * @api {get} /affiliations Retrieve organizations user is affiliated with
 * @apiName getAffiliations
 * @apiGroup joinGroup
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {List} orgsInfo List of affiliated organizations
 */
joinGroupRouter.post("/affiliations", service.getAffiliations);

/**
 * @api {put} /removeMember Remove user affiliation from organization
 * @apiName removeMember
 * @apiGroup joinGroup
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Console log string for deletion from each organization table
 * @apiSuccess {String} status 'OK' res status string
 */
joinGroupRouter.post("/removeMember", service.removeMember);

joinGroupRouter.searchOrg = service.searchOrg;
joinGroupRouter.addMember = orgController.addMemberToOrganization;
joinGroupRouter.removeMember = service.removeMember;
joinGroupRouter.getAffiliations = service.getAffiliations;

export default joinGroupRouter;