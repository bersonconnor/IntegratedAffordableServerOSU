import { AdminPrivileges } from "./AdminPrivileges";

export class AdminPrivilegeUpdateRequest {
    adminId: number;
    privileges: AdminPrivileges;
}