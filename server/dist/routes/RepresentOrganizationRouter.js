"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RepresentOrganizationService_1 = require("../services/RepresentOrganizationService");
const ErrorHandler_1 = require("./ErrorHandler");
const representOrganization = require("express").Router();
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const service = new RepresentOrganizationService_1.RepresentOrganizationService();
representOrganization.use(AuthenticationRouter_1.default.verifyToken);
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
representOrganization.use(ErrorHandler_1.errorHandler);
module.exports = representOrganization;
