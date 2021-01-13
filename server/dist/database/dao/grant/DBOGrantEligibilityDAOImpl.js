"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOGrantEligibilityDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const EligibilityCriteriaDBO_1 = require("../../../models/orm/grant/EligibilityCriteriaDBO");
class DBOGrantEligibilityDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Creates a grant eligibility record in AFFORDABLE
     * @param record
     */
    async save(record) {
        const result = await this.connection.getRepository(EligibilityCriteriaDBO_1.EligibilityCriteriaDBO).save(record);
        return result;
    }
    /**
     * Deletes a grant eligibility record in AFFORDABLE
     * @param grantId
     */
    async delete(grantId) {
        await this.connection
            .getRepository(EligibilityCriteriaDBO_1.EligibilityCriteriaDBO)
            .createQueryBuilder()
            .delete()
            .from(EligibilityCriteriaDBO_1.EligibilityCriteriaDBO)
            .where("id = :id", { id: grantId })
            .execute();
        console.log("GrantEligibility deleted: " + grantId);
    }
    get(id) {
        return this.connection.getRepository(EligibilityCriteriaDBO_1.EligibilityCriteriaDBO).findOne({ id: id });
    }
}
exports.DBOGrantEligibilityDAOImpl = DBOGrantEligibilityDAOImpl;
