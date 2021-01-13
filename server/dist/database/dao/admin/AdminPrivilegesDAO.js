"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPrivilegesDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const AdminPrivilegesDBO_1 = require("../../../models/orm/profile/AdminPrivilegesDBO");
class AdminPrivilegesDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    async getAdmins() {
        return await this.connection.getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO).find({ active: true });
    }
    async getAdminPrivileges(id) {
        return await this.connection.getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO).findOne({ userid: id });
    }
    async createAdminPrivileges(privileges) {
        return await this.connection.getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO).save(privileges);
    }
    async updateAdminPrivileges(privileges) {
        return await this.connection.getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO).save(privileges);
    }
    //query for all the not-approved registration request
    async getNotApprovedRegistration() {
        return await this.connection
            .getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO)
            .createQueryBuilder("admin")
            .where("admin.active = :active", { active: false })
            .getMany();
    }
    //update the active field in the database for an admin user
    async setAdminActive(userId) {
        console.log("SET ADMIN ACTIVE!");
        let result = await this.connection
            .getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO)
            .createQueryBuilder("admin")
            .update(AdminPrivilegesDBO_1.AdminPrivilegesDBO)
            .set({ active: true })
            .where("userid = :userId", { userId: userId })
            .execute();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError(`User with id=${userId} not found.`);
        }
        return true;
    }
}
exports.AdminPrivilegesDAO = AdminPrivilegesDAO;
