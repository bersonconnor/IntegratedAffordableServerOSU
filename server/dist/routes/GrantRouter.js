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
const express = __importStar(require("express"));
const GrantController_1 = require("../controllers/GrantController");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const grantRouter = express.Router();
const grantController = new GrantController_1.GrantController();
grantRouter.use(AuthenticationRouter_1.default.verifyToken);
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
exports.default = grantRouter;
