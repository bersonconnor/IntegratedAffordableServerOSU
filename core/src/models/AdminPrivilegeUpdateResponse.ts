import { AdminPrivileges } from "..";

export class AdminPrivilegeUpdateResponse {
    isSuccessful: boolean;
    privileges: AdminPrivileges;
}