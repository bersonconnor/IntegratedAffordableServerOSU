import { AffordableClient } from "./AffordableClient";
import { AffordableClientConstants } from "./util";
import { UserInfo, AdminRegistrationResponse, AdminRegistrationRequest, Admin, AdminPrivileges, AdminPrivilegeUpdateRequest, AdminPrivilegeUpdateResponse, AdminEmailRequest, AdminDeactivateUserRequest, AdminDeactivateUserResponse, AuditTrail } from "affordable-shared-models";
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import UniversalCookies from 'universal-cookie';
import SESSION_TOKEN_COOKIE_KEY = AffordableClientConstants.SESSION_TOKEN_COOKIE_KEY;

const ADMIN_ROUTE = "/admin";

export class AffordableAdminClient extends AffordableClient {
    constructor() {
        super();
    }

    getAdmins(admin: Admin): Promise<Array<UserInfo>> {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/getAdmins", admin);
    }

    getAdminRegistrationRequests(): Promise<AdminRegistrationResponse[]> {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/registrationRequests")
    }

    acceptAdminRegistration(adminRequest: AdminRegistrationRequest): Promise<void> {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/acceptRequest", adminRequest);
    }

    rejectAdminRegistration(adminRequest: AdminRegistrationRequest): Promise<void> {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/rejectRequest", adminRequest);
    }

    revokeAdminAccess(request: AdminRegistrationRequest): Promise<void> {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/revokeAccess", request);
    }

    getPrivileges(admin: Admin): Promise<AdminPrivileges> {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/getPrivileges", admin);
    }

    getAllAdminPrivileges(): Promise<Array<AdminPrivileges>> {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/getAllPrivileges");
    }

    setPrivileges(adminId: number, privileges: AdminPrivileges): Promise<AdminPrivileges> {
        let updateRequest: AdminPrivilegeUpdateRequest = {
            adminId: adminId,
            privileges: privileges
        }
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/setPrivileges", updateRequest);
    }

    resetAuthInfoNonAdmin(user: UserInfo) {
        this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/resetAuthNonAdmin", user);
    }

    resetAuthInfoAdmin(admin: Admin) {
        this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/resetAuthNonAdmin", admin);
    }

    verifyEmailAddressForUser(userInfo: UserInfo): Promise<void> {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/verifyEmail", { username: userInfo.username })
    }

    checkPrivilege(adminId: number, privilege: string): Promise<boolean> {
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

    getAllUsers(admin: Admin): Promise<UserInfo[]> {
        console.log("admin: ", admin);
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/allUsers", admin)
    }

    recordAuditTrails(username: string, action: string) {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/recordTrail", { username: username, action: action })
    }

    getAllAuditTrails(admin: Admin): Promise<AuditTrail[]>  {
        return this.doGet(this.getBaseURL() + ADMIN_ROUTE + "/allTrails", admin)
    }

    sendUserEmail(emailRequest: AdminEmailRequest): Promise<void> {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/sendEmail", emailRequest);
    }

    activateDeactivateUser(userRequest: AdminDeactivateUserRequest): Promise<AdminDeactivateUserResponse> {
        return this.doPost(this.getBaseURL() + ADMIN_ROUTE + "/activateDeactivateUser", userRequest);
    }
}