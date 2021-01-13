"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SexAndEthnicityDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const SexAndEthnicity_1 = require("../../../models/orm/profile/SexAndEthnicity");
class SexAndEthnicityDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds sex and ethnicity information to a user's profile
     * @param sae
     */
    async addSexAndEthnicity(sae) {
        console.log("Adding sex and ethnicity: ");
        console.log(sae);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            sae = await transactionalEntityManager.save(sae);
            return (sae);
        });
    }
    /**
     * Get sex and ethnicity info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no sex and ethnicity info for the user is found
     */
    async getSexAndEthnicityByUserId(id) {
        const result = await this.connection.manager
            .getRepository(SexAndEthnicity_1.SexAndEthnicity)
            .createQueryBuilder("sexAndEthnicity")
            .where("sexAndEthnicity.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Sex and Ethnicity info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes sex and ethnicity info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserSexAndEthnicityById(id) {
        await this.connection.manager
            .getRepository(SexAndEthnicity_1.SexAndEthnicity)
            .createQueryBuilder("sexAndEthnicity")
            .delete()
            .from(SexAndEthnicity_1.SexAndEthnicity)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's sex and ethnicity info was deleted. UserID: " + id);
    }
}
exports.SexAndEthnicityDAO = SexAndEthnicityDAO;
