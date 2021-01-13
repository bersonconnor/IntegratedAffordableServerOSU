"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetInfoService_1 = require("../services/GetInfoService");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const getInfoRouter = require("express").Router();
getInfoRouter.use(AuthenticationRouter_1.default.verifyToken);
const service = new GetInfoService_1.GetInfoService();
/**
 * @api {get} /userID Get User's unique ID
 * @apiName getUserID
 * @apiGroup getInfo
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} status 'OK' res status string
 * @apiSuccess {String} userID User's unique ID
 */
getInfoRouter.post("/userID", service.getUserID);
/**
 * @api {get} /orgID Get Organization's unique ID
 * @apiName getOrgID
 * @apiGroup getInfo
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} status 'OK' res status string
 * @apiSuccess {String} orgID Organization's unique ID
 */
getInfoRouter.post("/orgID", service.getOrgID);
/**
 * @api {get} /grantID Get HUG's unique ID
 * @apiName getGrantID
 * @apiGroup getInfo
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} status 'OK' res status string
 * @apiSuccess {String} grantID HUG's unique ID
 */
getInfoRouter.post("/grantID", service.getGrantID);
getInfoRouter.getOrgID = service.getOrgID;
getInfoRouter.getUserID = service.getUserID;
getInfoRouter.getGrantID = service.getGrantID;
exports.default = getInfoRouter;
