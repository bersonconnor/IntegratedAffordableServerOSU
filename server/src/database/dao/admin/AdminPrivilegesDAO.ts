import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { Donor } from "../../../models/orm/Donor";
import { RecipientDBO } from "../../../models/orm/RecipientDBO";
import { Validation } from "../../../utils/Validation";
import { AdminPrivilegesDBO } from "../../../models/orm/profile/AdminPrivilegesDBO";

export class AdminPrivilegesDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    async getAdmins(): Promise<Array<AdminPrivilegesDBO>> {
        return await this.connection.getRepository(AdminPrivilegesDBO).find({ active: true });
    }

    async getAdminPrivileges(id: number): Promise<AdminPrivilegesDBO> {
        return await this.connection.getRepository(AdminPrivilegesDBO).findOne({ userid: id });
    }

    async createAdminPrivileges(privileges: AdminPrivilegesDBO): Promise<AdminPrivilegesDBO> {
        return await this.connection.getRepository(AdminPrivilegesDBO).save(privileges);
    }

    async updateAdminPrivileges(privileges: AdminPrivilegesDBO): Promise<AdminPrivilegesDBO> {
        return await this.connection.getRepository(AdminPrivilegesDBO).save(privileges);
    }

    //query for all the not-approved registration request
    async getNotApprovedRegistration(): Promise<Array<AdminPrivilegesDBO>> {
        return await this.connection
            .getRepository(AdminPrivilegesDBO)
            .createQueryBuilder("admin")
            .where("admin.active = :active", { active: false })
            .getMany();
    }

    //update the active field in the database for an admin user
    async setAdminActive(userId: number): Promise<boolean> {
        console.log("SET ADMIN ACTIVE!");
        let result = await this.connection
            .getRepository(AdminPrivilegesDBO)
            .createQueryBuilder("admin")
            .update(AdminPrivilegesDBO)
            .set({ active: true })
            .where("userid = :userId", { userId: userId })
            .execute();
        if (result === undefined) {
            throw new NotFoundError(`User with id=${userId} not found.`);
        }
        return true;
    }

}