import * as express from "express";
import { GrantController } from "../controllers/GrantController";
import AuthenticationRouter from "./AuthenticationRouter";

const grantRouter = express.Router();
const grantController = new GrantController();

grantRouter.use(AuthenticationRouter.verifyToken);

/**
 * @api {get} /grant/:id Request grant information
 * @apiName GetGrant
 * @apiGroup Grant
 *
 * @apiParam {Number} id grant's unique ID.
 *
 * @apiSuccess {Object} grant The grant.
 */
grantRouter.get("/:id", grantController.getGrant);

/**
 * @api {post} /grant/ Create a grant
 * @apiName CreateGrant
 * @apiGroup Grant
 *
 * @apiParam {Object} CreateGrantRequest
 *
 * @apiSuccess {Object} grant The grant.
 */
grantRouter.post("/", grantController.createGrant);

/**
 * @api {put} /grant/:id Update a grant
 * @apiName UpdateGrant
 * @apiGroup Grant
 *
 * @apiParam {Object} CreateGrantRequest
 *
 * @apiSuccess {Object} grant The grant.
 */
grantRouter.put("/:id", grantController.updateGrant);

/**
 * @api {delete} /grant/:id Delete a grant
 * @apiName GetGrant
 * @apiGroup Grant
 *
 * @apiParam {Number} id grant's unique ID.
 *
 * @apiSuccess {Object} grant The grant.
 */
grantRouter.delete("/:id", grantController.deleteGrant);

// Apply to a grant
// This can only be done if you meet the eligibility requirements of the grant.
grantRouter.put("/:grantId/apply", grantController.applyToGrant);

// Get applicants for a grant
// This can only be done if you are a member of the organization that manages the grant
grantRouter.get("/:grantId/applicants", grantController.getGrantApplicants);

// As a donor, get the grants that your organizations are managing
// As a recipient, get the grants that you are eligible for (including those you have applied to)
grantRouter.get("/", grantController.getAllGrants);

// Award the grant to a user and close the application window.
// This can only be done if you are a member of the organization that manages the grant
grantRouter.put("/:grantId/award/:userId", grantController.awardGrant);

export default grantRouter;
