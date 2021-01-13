"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffordableAdminClient = void 0;
const AffordableClient_1 = require("./AffordableClient");
const ADMIN_ROUTE = "/admin";
class AffordableAdminClient extends AffordableClient_1.AffordableClient {
    constructor() {
        super();
    }
    getAdmins(admin) {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/getAdmins", admin);
    }
    getAdminRegistrationRequests() {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/registrationRequests");
    }
    acceptAdminRegistration(adminRequest) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/acceptRequest", adminRequest);
    }
    rejectAdminRegistration(adminRequest) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/rejectRequest", adminRequest);
    }
    revokeAdminAccess(request) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/revokeAccess", request);
    }
    getPrivileges(admin) {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/getPrivileges", admin);
    }
    getAllAdminPrivileges() {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/getAllPrivileges");
    }
    setPrivileges(adminId, privileges) {
        let updateRequest = {
            adminId: adminId,
            privileges: privileges
        };
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/setPrivileges", updateRequest);
    }
    resetAuthInfoNonAdmin(user) {
        this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/resetAuthNonAdmin", user);
    }
    resetAuthInfoAdmin(admin) {
        this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/resetAuthNonAdmin", admin);
    }
    verifyEmailAddressForUser(userInfo) {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/verifyEmail", { username: userInfo.username });
    }
    checkPrivilege(adminId, privilege) {
        return new Promise((resolve) => {
            resolve(true);
            // this.getUserInfo(adminId).then((res: UserInfo) => {
            //     if (res.userType == "admin") {
            //         this.getPrivileges({ userId: adminId }).then((res: AdminPrivileges) => {
            //             let canView: boolean = res[privilege];
            //             console.log("can view: ", canView);
            //             resolve(canView);
            //         });
            //     } else {
            //         resolve(true);
            //     }
            // });
        });
    }
    getAllUsers(admin) {
        console.log("admin: ", admin);
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/allUsers", admin);
    }
    recordAuditTrails(username, action) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/recordTrail", { username: username, action: action });
    }
    getAllAuditTrails(admin) {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/allTrails", admin);
    }
    sendUserEmail(emailRequest) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/sendEmail", emailRequest);
    }
    activateDeactivateUser(userRequest) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/activateDeactivateUser", userRequest);
    }
}
exports.AffordableAdminClient = AffordableAdminClient;
