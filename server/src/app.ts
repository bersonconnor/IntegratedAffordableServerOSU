import express, { Router } from "express";
import "reflect-metadata";
import { errorHandler } from "./routes/ErrorHandler";
import cors from "cors";
import fileUpload from "express-fileupload"; //Used to parse data sent from front-end
import morgan from "morgan"; //Logs additional information about calls being made to server
import path from "path";
import { config } from "dotenv";
config();


import AdminRouter from "./routes/AdminRouter";
import AuthenticationRouter from "./routes/AuthenticationRouter";
import GrantRouter from "./routes/GrantRouter";
import ProfileRouter from "./routes/ProfileRouter";
import OrganizationRouter from "./routes/OrganizationRouter";

import ActivityRouter from "./routes/ActivityRouter";

// TODO: Deprecate and remove, moving routes to logical places (auth/profile/org, etc based on endpoint)
import GetInfoRouter from "./routes/GetInfoRouter";

// TODO: Deprecate and remove the following routers in favor of a consolidated OrganizationRouter
import AddOrganizationRouter from "./routes/AddOrganizationRouter";
import JoinGroupRouter from "./routes/JoinGroupRouter";
import VerifyOrganizationRouter from "./routes/VerifyOrganizationRouter";
import ManageOrganizationRouter from "./routes/ManageRouter";
import PingRouter from "./routes/PingRouter";

const router: Router = express.Router();

const app = express();

const FileRouter = require('./routes/FileRouter');
const stripeRouter = require('./routes/StripeRouter');
const transactionRouter = require('./routes/TransactionRouter');
const webhookRouter = require('./routes/WebhookRouter');
const applicationRouter = require('./routes/ApplicationRouter');


app.use(cors({
  credentials: true,
  origin: process.env.AFFORDABLE_FRONTEND_URL
}));
app.use(express.json());

app.use(fileUpload({
  limits: {
      fileSize: process.env.MAX_FILE_SIZE
  },
}));
app.use(morgan("dev"));

// Middleware for verifying and refreshing a session token.
//app.use(AuthenticationRouter.verifyToken);

//Allows access to QR code images
app.use("/public", express.static(path.join(__dirname, "public")));

/**
 * Routing
 */
app.use("/admin", AdminRouter);
app.use("/authentication", AuthenticationRouter);
app.use("/grant", GrantRouter);
app.use("/activity", ActivityRouter);
app.use("/profile", ProfileRouter);
app.use("/addOrg", AddOrganizationRouter);
app.use("/verifyOrg", VerifyOrganizationRouter);
app.use("/joinGroup", JoinGroupRouter);
app.use("/info", GetInfoRouter);
app.use("/manage", ManageOrganizationRouter);
app.use("/organization", OrganizationRouter);

app.use('/file',FileRouter);
app.use('/webhook', webhookRouter);
app.use('/stripe', stripeRouter);
app.use('/transaction', transactionRouter);
app.use('/application', applicationRouter);
app.use('/ping', PingRouter)


// Error handler middleware should be added after all routes 
app.use(errorHandler);

export default app;
