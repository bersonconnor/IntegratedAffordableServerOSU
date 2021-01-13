"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const Healthcare_1 = require("../../../models/orm/profile/Healthcare");
class HealthcareDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds healthcare information to a user's profile
     * @param healthcare
     */
    async addHealthcare(healthcare) {
        console.log("Adding user healthcare: ");
        console.log(healthcare);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            healthcare = await transactionalEntityManager.save(healthcare);
            return (healthcare);
        });
    }
    /**
     * Get healthcare info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no healthcare info for the user is found
     */
    async getHealthcareByUserId(id) {
        const result = await this.connection.manager
            .getRepository(Healthcare_1.Healthcare)
            .createQueryBuilder("healthcare")
            .where("healthcare.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Healthcare info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes healthcare info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserHealthcareById(id) {
        await this.connection.manager
            .getRepository(Healthcare_1.Healthcare)
            .createQueryBuilder("healthcare")
            .delete()
            .from(Healthcare_1.Healthcare)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's healthcare info was deleted. UserID: " + id);
    }
}
exports.HealthcareDAO = HealthcareDAO;
