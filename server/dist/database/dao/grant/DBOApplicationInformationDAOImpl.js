"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOApplicationInformationDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const ApplicationInformationDBO_1 = require("../../../models/orm/grant/ApplicationInformationDBO");
class DBOApplicationInformationDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Creates an application record in AFFORDABLE
     * @param record
     */
    async save(record) {
        const result = await this.connection.getRepository(ApplicationInformationDBO_1.ApplicationInformationDBO).save(record);
        console.log("ApplicationInformation created: ", result);
        return result;
    }
    /**
     * Deletes an application record in AFFORDABLE
     * @param id
     */
    async delete(id) {
        await this.connection
            .getRepository(ApplicationInformationDBO_1.ApplicationInformationDBO)
            .createQueryBuilder()
            .delete()
            .from(ApplicationInformationDBO_1.ApplicationInformationDBO)
            .where("id = :id", { id: id })
            .execute();
        console.log("ApplicationInformation deleted: " + id);
    }
    /**
     * Retrieves application information record by its id
     * @param id
     */
    get(id) {
        return this.connection.getRepository(ApplicationInformationDBO_1.ApplicationInformationDBO).findOne({ id: id });
    }
    /**
     * Get all of the grants to which a user has applied.
     * @param userId
     */
    getApplicationsForUser(userId) {
        return this.connection.getRepository(ApplicationInformationDBO_1.ApplicationInformationDBO).find({ userId: userId });
    }
    /**
     * Get all of the applicants that have applied for a grant.
     * @param grantId
     */
    getApplicationsForGrant(grantId) {
        return this.connection.getRepository(ApplicationInformationDBO_1.ApplicationInformationDBO).find({ grantId: grantId });
    }
    /**
     * Determine if a user has applied for a grant.
     */
    async applicationExists(userId, grantId) {
        const application = await this.connection.getRepository(ApplicationInformationDBO_1.ApplicationInformationDBO).findOne({ userId: userId, grantId: grantId });
        return application !== undefined;
    }
}
exports.DBOApplicationInformationDAOImpl = DBOApplicationInformationDAOImpl;
