"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrganizationController_1 = require("../controllers/OrganizationController");
const OrganizationServiceImpl_1 = require("../services/organization/OrganizationServiceImpl");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const addOrganizationRouter = require("express").Router();
const organizationController = new OrganizationController_1.OrganizationController();
const addOrgService = new OrganizationServiceImpl_1.OrganizationServiceImpl();
addOrganizationRouter.use(AuthenticationRouter_1.default.verifyToken);
/**
 * @api {put} / Add new organization
 * @apiName addOrganization
 * @apiGroup addOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success console log success notification.
 * @apiSuccess {String} res_sendStatus Response Send Status set to 'OK'
 * @apiSuccessExample {json} Org-Example
 *     {
 *      "orgName":"testMetro Health",
 *      "orgName2": "Ahuja test",
 *      "orgName3": "University test Hospital",
 *      "orgName4": "test Ohio Health",
 *      "orgName5": "rep testOrg",
 *      "orgName6": "rep testOrg1",
 *      "orgID":"1000",
 *      "orgID2":"1001",
 *      "orgID3":"1002",
 *      "orgID4":"1003",
 *      "orgID5":"1004",
 *      "orgID5":"1005"
 *    }
 */
addOrganizationRouter.post("/", organizationController.createOrganization);
/**
 * @api {put} /addInfo Add new organization info
 * @apiDescription requires organization was added using 'add'Organization'
 * @apiName addOrganizationInfo
 * @apiGroup addOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success console log success notification for each data insertion.
 * @apiSuccess {String} res_sendStatus Response Send Status set to 'OK'
 */
addOrganizationRouter.post("/addInfo", addOrgService.addOrganizationInfo);
/**
 * @api {put} /email/notifyAddOrg Send Verification Email
 * @apiName sendVerificationEmailForAddOrg
 * @apiGroup addOrganization
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {Condition} smtpTransport Email is successfully sent.
 * @apiSuccess {String} res_sendStatus Response Send Status set to '200'
 */
addOrganizationRouter.post("/email/notifyAddOrg", addOrgService.sendVerificationEmailForAddOrg);
addOrganizationRouter.addOrganization = addOrgService.createOrganization;
addOrganizationRouter.addOrganizationInfo = addOrgService.addOrganizationInfo;
addOrganizationRouter.sendVerificationEmailForAddOrg = addOrgService.sendVerificationEmailForAddOrg;
exports.default = addOrganizationRouter;
