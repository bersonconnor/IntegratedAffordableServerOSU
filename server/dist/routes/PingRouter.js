"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = require("./ErrorHandler");
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const pingRouter = require('express').Router();
pingRouter.use("/", returnPing);
pingRouter.use(ErrorHandler_1.errorHandler);
function returnPing(req, res) {
    let status = DatabaseConnection_1.default.getConnectionStatus();
    if (status) {
        res.status(200).send();
    }
    else {
        res.status(500).send();
    }
}
exports.default = pingRouter;
