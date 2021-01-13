import * as express from "express";
import { AdminController } from "../controllers/AdminController";
import AuthenticationRouter from "./AuthenticationRouter";

const adminRouter = express.Router();
const adminController = new AdminController();

//adminRouter.use(AuthenticationRouter.verifyToken);

adminRouter.get("/getAdmins", adminController.getAllAdmins);

adminRouter.get("/getAllPrivileges", adminController.getAllAdminPrivileges)

adminRouter.get("/registrationRequests", adminController.getAdminRegistrationRequests);

adminRouter.post("/acceptRequest", adminController.acceptAdminRegistration);

adminRouter.post("/rejectRequest", adminController.rejectAdminRegistration);

adminRouter.post("/revokeAccess", adminController.revokeAdminAccess);

adminRouter.get("/getPrivileges", adminController.getAdminPrivileges);

adminRouter.post("/setPrivileges", adminController.setAdminPrivileges);

adminRouter.post("/resetAuthAdmin", adminController.resetAuthInfoAdmin);

adminRouter.post("/resetAuthNonAdmin", adminController.resetAuthInfoNonAdmin);

adminRouter.post("/sendEmail", adminController.sendEmail);

adminRouter.post("/activateDeactivateUser", adminController.activateDeactivateUser)

adminRouter.get("/allUsers", adminController.getAllUsers);

adminRouter.post("/recordTrail", adminController.recordAuditTrails);

adminRouter.get("/allTrails", adminController.getAllAuditTrails);

export default adminRouter;