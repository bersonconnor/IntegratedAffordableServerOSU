"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const AdminPrivilegesDAO_1 = require("../database/dao/admin/AdminPrivilegesDAO");
class AdminService {
    constructor() {
        this.adminDAO = new AdminPrivilegesDAO_1.AdminPrivilegesDAO();
    }
    async getAdmins() {
        return this.adminDAO.getAdmins();
    }
    async getRegistrationRequests() {
        return this.adminDAO.getNotApprovedRegistration();
    }
    async acceptRegistration(id) {
        return this.adminDAO.setAdminActive(id);
    }
    async getPrivileges(id) {
        return this.adminDAO.getAdminPrivileges(id);
    }
    async setPrivileges(privs) {
        return this.adminDAO.updateAdminPrivileges(privs);
    }
}
exports.AdminService = AdminService;
