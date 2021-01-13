"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationProviderDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const InformationProvider_1 = require("../../../models/orm/profile/InformationProvider");
class InformationProviderDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds information provider information to a user's profile
     * @param infoProvider
     */
    async addInformationProvider(infoProvider) {
        console.log("Adding information provider details: ");
        console.log(infoProvider);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            infoProvider = await transactionalEntityManager.save(infoProvider);
            return (infoProvider);
        });
    }
    /**
     * Get information provider info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no information provider info for the user is found
     */
    async getInformationProviderByUserId(id) {
        const result = await this.connection.manager
            .getRepository(InformationProvider_1.InformationProvider)
            .createQueryBuilder("informationProvider")
            .where("informationProvider.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Information Provider info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes information provider info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserInformationProviderById(id) {
        await this.connection.manager
            .getRepository(InformationProvider_1.InformationProvider)
            .createQueryBuilder("inforamtionProvider")
            .delete()
            .from(InformationProvider_1.InformationProvider)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's information provider info was deleted. UserID: " + id);
    }
}
exports.InformationProviderDAO = InformationProviderDAO;
