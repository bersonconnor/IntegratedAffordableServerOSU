import { AdminPrivilegesDBO } from "../models/orm/profile/AdminPrivilegesDBO";
import { AdminPrivilegesDAO } from "../database/dao/admin/AdminPrivilegesDAO";

export class AdminService {
    private adminDAO: AdminPrivilegesDAO;

    public constructor() {
        this.adminDAO = new AdminPrivilegesDAO();
    }

    public async getAdmins(): Promise<Array<AdminPrivilegesDBO>> {
        return this.adminDAO.getAdmins();
    }

    public async getRegistrationRequests(): Promise<Array<AdminPrivilegesDBO>> {
        return this.adminDAO.getNotApprovedRegistration();
    }

    public async acceptRegistration(id: number): Promise<boolean> {
        return this.adminDAO.setAdminActive(id);
    }

    public async getPrivileges(id: number): Promise<AdminPrivilegesDBO> {
        return this.adminDAO.getAdminPrivileges(id);
    }

    public async setPrivileges(privs: AdminPrivilegesDBO) {
        return this.adminDAO.updateAdminPrivileges(privs);
    }

    // public async revokeAdminAccess(id: number): Promise<void> {
    //     this.adminDAO;
    // }
}