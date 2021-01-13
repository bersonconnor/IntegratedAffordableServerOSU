"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const Insurance_1 = require("../../../models/orm/profile/Insurance");
class InsuranceDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds insurance information to a user's profile
     * @param insurance
     */
    async addInsurance(insurance) {
        console.log("Adding user insurance information: ");
        console.log(insurance);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            insurance = await transactionalEntityManager.save(insurance);
            return (insurance);
        });
    }
    /**
     * Get insurance info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no insurance info for the user is found
     */
    async getInsuranceByUserId(id) {
        const result = await this.connection.manager
            .getRepository(Insurance_1.Insurance)
            .createQueryBuilder("insurance")
            .where("insurance.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Insurance info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes insurance info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserInsuranceById(id) {
        await this.connection.manager
            .getRepository(Insurance_1.Insurance)
            .createQueryBuilder("insurance")
            .delete()
            .from(Insurance_1.Insurance)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's insurance info was deleted. UserID: " + id);
    }
}
exports.InsuranceDAO = InsuranceDAO;
