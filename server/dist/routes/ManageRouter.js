"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ManageService_1 = require("../services/ManageService");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const manageOrganizationRouter = require("express").Router();
manageOrganizationRouter.use(AuthenticationRouter_1.default.verifyToken);
const service = new ManageService_1.ManageService();
/**
 * @api {get} /managedonates Retrieve the number of grant donations
 * @apiName queryDonates
 * @apiGroup manage
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Number} donates Current number of donations to grant
 * @apiSuccess {String} status 'OK' res status string
 */
manageOrganizationRouter.get("/managedonates", service.queryDonates);
/**
 * @api {get} /managegrants Retrieve grants under organization
 * @apiName queryHug
 * @apiGroup manage
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {List} list of organizations grant IDs
 * @apiSuccess {String} status 'OK' res status string
 */
manageOrganizationRouter.post("/managegrants", service.queryHUG);
manageOrganizationRouter.queryHUG = service.queryHUG;
manageOrganizationRouter.queryDonates = service.queryDonates;
exports.default = manageOrganizationRouter;
