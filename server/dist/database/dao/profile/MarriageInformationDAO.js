"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarriageInformationDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const MarriageInformation_1 = require("../../../models/orm/profile/MarriageInformation");
class MarriageInformationDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds marriage information to a user's profile
     * @param marriageInfo
     */
    async addMarriageInformation(marriageInfo) {
        console.log("Adding user marriage information: ");
        console.log(marriageInfo);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            marriageInfo = await transactionalEntityManager.save(marriageInfo);
            return (marriageInfo);
        });
    }
    /**
     * Get marriage info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no marriage info for the user is found
     */
    async getMarriageInformationByUserId(id) {
        const result = await this.connection.manager
            .getRepository(MarriageInformation_1.MarriageInformation)
            .createQueryBuilder("marriageInformation")
            .where("marriageInformation.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Marriage info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes Marriage info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserMarriageInformationById(id) {
        await this.connection.manager
            .getRepository(MarriageInformation_1.MarriageInformation)
            .createQueryBuilder("marriageInformation")
            .delete()
            .from(MarriageInformation_1.MarriageInformation)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's marriage info was deleted. UserID: " + id);
    }
}
exports.MarriageInformationDAO = MarriageInformationDAO;
