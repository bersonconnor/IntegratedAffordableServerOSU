import { ApplicationService } from "../services/ApplicationService";
import { errorHandler } from "./ErrorHandler";
import AuthenticationRouter from "./AuthenticationRouter";

const service = ApplicationService.getInstance();
const application = require('express').Router();

application.use(AuthenticationRouter.verifyToken);

// Inserting application
application.post('/addApp', service.addApp);

// Retrieving applications for given hug
application.post('/getApps', service.getApps);

application.use(errorHandler);

module.exports = application;