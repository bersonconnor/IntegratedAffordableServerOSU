import { AffordableClient } from "./AffordableClient";
import { UserInfo, AdminRegistrationResponse, AdminRegistrationRequest, Admin, AdminPrivileges, AdminEmailRequest, AdminDeactivateUserRequest, AdminDeactivateUserResponse, AuditTrail } from "affordable-shared-models";
export declare class AffordableAdminClient extends AffordableClient {
    constructor();
    getAdmins(admin: Admin): Promise<Array<UserInfo>>;
    getAdminRegistrationRequests(): Promise<AdminRegistrationResponse[]>;
    acceptAdminRegistration(adminRequest: AdminRegistrationRequest): Promise<void>;
    rejectAdminRegistration(adminRequest: AdminRegistrationRequest): Promise<void>;
    revokeAdminAccess(request: AdminRegistrationRequest): Promise<void>;
    getPrivileges(admin: Admin): Promise<AdminPrivileges>;
    getAllAdminPrivileges(): Promise<Array<AdminPrivileges>>;
    setPrivileges(adminId: number, privileges: AdminPrivileges): Promise<AdminPrivileges>;
    resetAuthInfoNonAdmin(user: UserInfo): void;
    resetAuthInfoAdmin(admin: Admin): void;
    verifyEmailAddressForUser(userInfo: UserInfo): Promise<void>;
    checkPrivilege(adminId: number, privilege: string): Promise<boolean>;
    getAllUsers(admin: Admin): Promise<UserInfo[]>;
    recordAuditTrails(username: string, action: string): Promise<unknown>;
    getAllAuditTrails(admin: Admin): Promise<AuditTrail[]>;
    sendUserEmail(emailRequest: AdminEmailRequest): Promise<void>;
    activateDeactivateUser(userRequest: AdminDeactivateUserRequest): Promise<AdminDeactivateUserResponse>;
}
