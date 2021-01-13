"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ActivityService_1 = require("../services/ActivityService");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const activityRouter = express_1.Router();
const activitySvc = new ActivityService_1.ActivityService();
activityRouter.use(AuthenticationRouter_1.default.verifyToken);
/**
 * @api {get} /get-ip Retrieve users IP Address
 * @apiName getIPAddr
 * @apiGroup Activity
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success IP lookup notification.
 * @apiSuccess {String} IP_addr  IP address.
 */
activityRouter.post("/get-ip", activitySvc.getIPAddr);
/**
 * @api {get} /get-timestamp Retrieve timestamp from Last Login
 * @apiName getLastLogin
 * @apiGroup Activity
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Timestamp lookup notification.
 * @apiSuccess {List} Timelog  List of user login timestamps.
 */
activityRouter.post("/get-timestamp", activitySvc.getLastLogIn);
/**
 * @api {get} /get-activity Retrieve user's last activity made on their profile
 * @apiName getLastActivity
 * @apiGroup Activity
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Timestamp lookup notification.
 * @apiSuccess {List} activities  List of user-made activities.
 */
activityRouter.post("/get-activity", activitySvc.getLastActivity);
/**
 * @api {put} /add-activity Add new user activity
 * @apiName addActivity
 * @apiGroup Activity
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} success Console log that new user records were created.
 */
activityRouter.post("/add-activity", activitySvc.addActivity);
exports.default = activityRouter;
