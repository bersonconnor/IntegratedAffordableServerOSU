"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationService_1 = require("../services/ApplicationService");
const ErrorHandler_1 = require("./ErrorHandler");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const service = ApplicationService_1.ApplicationService.getInstance();
const application = require('express').Router();
application.use(AuthenticationRouter_1.default.verifyToken);
// Inserting application
application.post('/addApp', service.addApp);
// Retrieving applications for given hug
application.post('/getApps', service.getApps);
application.use(ErrorHandler_1.errorHandler);
module.exports = application;
