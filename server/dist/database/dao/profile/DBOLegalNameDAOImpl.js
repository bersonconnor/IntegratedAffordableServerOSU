"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOLegalNameDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const LegalName_1 = require("../../../models/orm/profile/LegalName");
class DBOLegalNameDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds legal name information to a user's profile, can be used for creating and updating
     * @param legalName
     */
    async addLegalName(legalName) {
        console.log("Adding legal name: ");
        console.log(legalName);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            legalName = await transactionalEntityManager.save(legalName);
            return (legalName);
        });
    }
    /**
     * Get a legal name(s) in AFFORDABLE by the User's ID
     * @param id
     * @return array of {@class LegalName}
     * @throws NotFoundError if no legal name for the user is found
     */
    async getAllLegalNamesWithUserId(id) {
        const result = await this.connection.manager
            .getRepository(LegalName_1.LegalName)
            .createQueryBuilder("legalName")
            .where("legalName.id = :id", { id: id })
            .getMany();
        if (result === undefined || result.length == 0) {
            throw new NotFoundError_1.NotFoundError("Legal name for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes legal name(s) info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserLegalNamesById(id) {
        await this.connection.manager
            .getRepository(LegalName_1.LegalName)
            .createQueryBuilder("name")
            .delete()
            .from(LegalName_1.LegalName)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's Legal Name(s) was deleted. UserID: " + id);
    }
}
exports.DBOLegalNameDAOImpl = DBOLegalNameDAOImpl;
