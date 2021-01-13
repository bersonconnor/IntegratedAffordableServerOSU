"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumberDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const PhoneNumber_1 = require("../../../models/orm/profile/PhoneNumber");
class PhoneNumberDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds phone number information to a user's profile
     * @param phoneNum
     */
    async addPhoneNumber(phoneNum) {
        console.log("Adding user phone number: ");
        console.log(phoneNum);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            phoneNum = await transactionalEntityManager.save(phoneNum);
            return (phoneNum);
        });
    }
    /**
     * Get all phone numbers for a user in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no phone number info for the user is found
     */
    async getAllPhoneNumbersByUserId(id) {
        const result = await this.connection.manager
            .getRepository(PhoneNumber_1.PhoneNumber)
            .createQueryBuilder("phoneNumber")
            .where("phoneNumber.id = :id", { id: id })
            .getMany();
        if (result === undefined || result.length == 0) {
            throw new NotFoundError_1.NotFoundError("Phone Number info for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes Phone number info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserPhoneNumbersById(id) {
        await this.connection.manager
            .getRepository(PhoneNumber_1.PhoneNumber)
            .createQueryBuilder("phoneNumber")
            .delete()
            .from(PhoneNumber_1.PhoneNumber)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's phone number(s) info was deleted. UserID: " + id);
    }
}
exports.PhoneNumberDAO = PhoneNumberDAO;
