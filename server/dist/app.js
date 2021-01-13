"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const ErrorHandler_1 = require("./routes/ErrorHandler");
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload")); //Used to parse data sent from front-end
const morgan_1 = __importDefault(require("morgan")); //Logs additional information about calls being made to server
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
const AdminRouter_1 = __importDefault(require("./routes/AdminRouter"));
const AuthenticationRouter_1 = __importDefault(require("./routes/AuthenticationRouter"));
const GrantRouter_1 = __importDefault(require("./routes/GrantRouter"));
const ProfileRouter_1 = __importDefault(require("./routes/ProfileRouter"));
const OrganizationRouter_1 = __importDefault(require("./routes/OrganizationRouter"));
const ActivityRouter_1 = __importDefault(require("./routes/ActivityRouter"));
// TODO: Deprecate and remove, moving routes to logical places (auth/profile/org, etc based on endpoint)
const GetInfoRouter_1 = __importDefault(require("./routes/GetInfoRouter"));
// TODO: Deprecate and remove the following routers in favor of a consolidated OrganizationRouter
const AddOrganizationRouter_1 = __importDefault(require("./routes/AddOrganizationRouter"));
const JoinGroupRouter_1 = __importDefault(require("./routes/JoinGroupRouter"));
const VerifyOrganizationRouter_1 = __importDefault(require("./routes/VerifyOrganizationRouter"));
const ManageRouter_1 = __importDefault(require("./routes/ManageRouter"));
const PingRouter_1 = __importDefault(require("./routes/PingRouter"));
const router = express_1.default.Router();
const app = express_1.default();
const FileRouter = require('./routes/FileRouter');
const stripeRouter = require('./routes/StripeRouter');
const transactionRouter = require('./routes/TransactionRouter');
const webhookRouter = require('./routes/WebhookRouter');
const applicationRouter = require('./routes/ApplicationRouter');
app.use(cors_1.default({
    credentials: true,
    origin: process.env.AFFORDABLE_FRONTEND_URL
}));
app.use(express_1.default.json());
app.use(express_fileupload_1.default({
    limits: {
        fileSize: process.env.MAX_FILE_SIZE
    },
}));
app.use(morgan_1.default("dev"));
// Middleware for verifying and refreshing a session token.
//app.use(AuthenticationRouter.verifyToken);
//Allows access to QR code images
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
/**
 * Routing
 */
app.use("/admin", AdminRouter_1.default);
app.use("/authentication", AuthenticationRouter_1.default);
app.use("/grant", GrantRouter_1.default);
app.use("/activity", ActivityRouter_1.default);
app.use("/profile", ProfileRouter_1.default);
app.use("/addOrg", AddOrganizationRouter_1.default);
app.use("/verifyOrg", VerifyOrganizationRouter_1.default);
app.use("/joinGroup", JoinGroupRouter_1.default);
app.use("/info", GetInfoRouter_1.default);
app.use("/manage", ManageRouter_1.default);
app.use("/organization", OrganizationRouter_1.default);
app.use('/file', FileRouter);
app.use('/webhook', webhookRouter);
app.use('/stripe', stripeRouter);
app.use('/transaction', transactionRouter);
app.use('/application', applicationRouter);
app.use('/ping', PingRouter_1.default);
// Error handler middleware should be added after all routes 
app.use(ErrorHandler_1.errorHandler);
exports.default = app;
