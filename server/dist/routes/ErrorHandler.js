"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const IllegalArgumentError_1 = require("../models/IllegalArgumentError");
const NotFoundError_1 = require("../models/NotFoundError");
const UnauthorizedError_1 = require("../models/UnauthorizedError");
const UnauthenticatedError_1 = require("../models/UnauthenticatedError");
function errorHandler(err, req, res, next) {
    // Expected errors always throw Error.
    if (Object.prototype.isPrototypeOf.call(IllegalArgumentError_1.IllegalArgumentError.prototype, err)) {
        return res.status(err.status || 400).json({ error: err.message });
    }
    if (Object.prototype.isPrototypeOf.call(NotFoundError_1.NotFoundError.prototype, err)) {
        return res.status(err.status || 404).json({ error: err.message });
    }
    if (Object.prototype.isPrototypeOf.call(UnauthorizedError_1.UnauthorizedError.prototype, err)) {
        return res.status(err.status || 401).json({ error: err.message });
    }
    if (Object.prototype.isPrototypeOf.call(UnauthenticatedError_1.UnauthenticatedError.prototype, err)) {
        return res.status(err.status || 401).json({ error: err.message });
    }
    // Unexpected errors will either throw unexpected stuff or crash the application.
    if (Object.prototype.isPrototypeOf.call(Error.prototype, err)) {
        console.log(err);
        return res.status(err.status || 500).json({ error: err.message });
    }
    console.error("~~~ Unexpected error exception start ~~~");
    console.error(req);
    console.error(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        DatabaseConnection_1.default.initializeDatabaseConnection()
            .then(() => {
            console.log("Database connection re-established");
        })
            .catch(e => {
            console.log("Error initializing database");
            throw e;
        });
    }
    console.error("~~~ Unexpected error exception end ~~~");
    return res.status(500).json({ error: "Unknown Internal Server Error" });
}
exports.errorHandler = errorHandler;
