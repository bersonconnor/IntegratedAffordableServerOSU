"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentificationInformationDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const IdentificationInformation_1 = require("../../../models/orm/profile/IdentificationInformation");
class IdentificationInformationDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds identification information to a user's profile
     * @param idInfo
     */
    async addIdentificationInformation(idInfo) {
        console.log("Adding user identification information: ");
        console.log(idInfo);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            idInfo = await transactionalEntityManager.save(idInfo);
            return (idInfo);
        });
    }
    /**
     * Get identification info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no identification info for the user is found
     */
    async getIdentificationInformationByUserId(id) {
        const result = await this.connection.manager
            .getRepository(IdentificationInformation_1.IdentificationInformation)
            .createQueryBuilder("identificationInformation")
            .where("identificationInformation.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Identification info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes identification info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserIdentificationInformationById(id) {
        await this.connection.manager
            .getRepository(IdentificationInformation_1.IdentificationInformation)
            .createQueryBuilder("identificaitonInformation")
            .delete()
            .from(IdentificationInformation_1.IdentificationInformation)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's identification info was deleted. UserID: " + id);
    }
}
exports.IdentificationInformationDAO = IdentificationInformationDAO;
