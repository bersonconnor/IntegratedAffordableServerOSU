import {OrganizationController} from "../controllers/OrganizationController";
import AuthenticationRouter from "./AuthenticationRouter";

/**
 * TODO: All organization routes should eventually move here.
 * 
 * Having a large routes file with many related functions is less confusing than
 * having multiple that have related functions, but it is unclear which behavior
 * belongs in which routes file
 */

const organizationRouter = require("express").Router();
const orgController = new OrganizationController();

organizationRouter.use(AuthenticationRouter.verifyToken);


/**
 * @api {post} /organization/ Create an Organization
 * @apiName CreateOrganization
 * @apiGroup Organization
 *
 * @api {Object} organization    Organization to create
 *
 * @apiSuccess (200) Created
 * 
 */
organizationRouter.post("/", orgController.createOrganization);

/**
 * @api {post} /organization/:id Update an Organization
 * @apiName CreateOrganization
 * @apiGroup Organization
 *
 * @api {Object} organization    Organization to create
 *
 * @apiSuccess (200) Created
 *
 */
organizationRouter.post("/:id", orgController.updateOrganization);

/**
 * @api {post} /organization/:id/members Add a member to an organization
 * @apiName AddMemberToOrganization
 * @apiGroup Organization
 *
 * @apiParam {Number} id Organization's unique ID.
 * @api {Number} userId the user to add
 *
 * @apiSuccess (200) Created
 *
 */
organizationRouter.post("/:id/members", orgController.addMemberToOrganization);

/**
 * @api {delete} /organization/:organizationId/members/:userId Remove a member from an organization
 * @apiName RemoveMemberFromOrganization
 * @apiGroup Organization
 *
 * @apiParam {Number} organizationId Organization's unique ID.
 * @api {Number} userId the user to remove
 *
 * @apiSuccess (200) Deleted
 *
 */
organizationRouter.delete("/:organizationId/members/:userId", orgController.removeMemberFromOrganization);


/**
 * @api {get} /organization/:id Get an Organization
 * @apiName GetOrganization
 * @apiGroup Organization
 *
 * @apiParam {Number} id Organization's unique ID.
 *
 * @apiSuccess {Object} organization       User profile information.
 * 
 */
organizationRouter.get("/:id", orgController.getOrganization);

/**
 * @api {get} /organization/:id/apiKey Get the API Key for a particular organization
 * @apiName GetOrganizationApiKey
 * @apiGroup Organization
 *
 * @apiParam {Number} id Organization's unique ID.
 *
 * @apiSuccess {string} apiKey       Organization's API Key
 * 
 */
organizationRouter.get("/:id/apiKey", orgController.getApiKey);

export default organizationRouter;