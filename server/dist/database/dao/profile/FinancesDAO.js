"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancesDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const Finances_1 = require("../../../models/orm/profile/Finances");
class FinancesDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds finance information to a user's profile
     * @param finances
     */
    async addFinances(finances) {
        console.log("Adding user finances: ");
        console.log(finances);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            finances = await transactionalEntityManager.save(finances);
            return (finances);
        });
    }
    /**
     * Get finance info in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no finances for the user are found
     */
    async getFinancesByUserId(id) {
        const result = await this.connection.manager
            .getRepository(Finances_1.Finances)
            .createQueryBuilder("finances")
            .where("finances.userId = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Finances for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes finance info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserFinancesById(id) {
        await this.connection.manager
            .getRepository(Finances_1.Finances)
            .createQueryBuilder("finances")
            .delete()
            .from(Finances_1.Finances)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's finance info was deleted. UserID: " + id);
    }
}
exports.FinancesDAO = FinancesDAO;
