import { GetInfoService } from "../services/GetInfoService";
import { errorHandler } from "./ErrorHandler";
import AuthenticationRouter from "./AuthenticationRouter";

const getInfoRouter = require("express").Router();

getInfoRouter.use(AuthenticationRouter.verifyToken);

const service = new GetInfoService();

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

export default getInfoRouter;
