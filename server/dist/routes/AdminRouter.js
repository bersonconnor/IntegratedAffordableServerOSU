"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const AdminController_1 = require("../controllers/AdminController");
const adminRouter = express.Router();
const adminController = new AdminController_1.AdminController();
//adminRouter.use(AuthenticationRouter.verifyToken);
adminRouter.get("/getAdmins", adminController.getAllAdmins);
adminRouter.get("/getAllPrivileges", adminController.getAllAdminPrivileges);
adminRouter.get("/registrationRequests", adminController.getAdminRegistrationRequests);
adminRouter.post("/acceptRequest", adminController.acceptAdminRegistration);
adminRouter.post("/rejectRequest", adminController.rejectAdminRegistration);
adminRouter.post("/revokeAccess", adminController.revokeAdminAccess);
adminRouter.get("/getPrivileges", adminController.getAdminPrivileges);
adminRouter.post("/setPrivileges", adminController.setAdminPrivileges);
adminRouter.post("/resetAuthAdmin", adminController.resetAuthInfoAdmin);
adminRouter.post("/resetAuthNonAdmin", adminController.resetAuthInfoNonAdmin);
adminRouter.post("/sendEmail", adminController.sendEmail);
adminRouter.post("/activateDeactivateUser", adminController.activateDeactivateUser);
adminRouter.get("/allUsers", adminController.getAllUsers);
adminRouter.post("/recordTrail", adminController.recordAuditTrails);
adminRouter.get("/allTrails", adminController.getAllAuditTrails);
exports.default = adminRouter;
