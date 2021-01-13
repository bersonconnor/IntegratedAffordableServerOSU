"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const Address_1 = require("../../../models/orm/profile/Address");
class AddressDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds address information to a user's profile
     * @param address
     */
    async addAddress(address) {
        console.log("Adding user address: ");
        console.log(address);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            address = await transactionalEntityManager.save(address);
            return (address);
        });
    }
    /**
     * Get an address in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no address for the user is found
     */
    async getAddressByUserId(id) {
        const result = await this.connection.manager
            .getRepository(Address_1.Address)
            .createQueryBuilder("address")
            .where("address.userId = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Address for user with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes address info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserAddressById(id) {
        await this.connection.manager
            .getRepository(Address_1.Address)
            .createQueryBuilder("address")
            .delete()
            .from(Address_1.Address)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's address was deleted. UserID: " + id);
    }
}
exports.AddressDAO = AddressDAO;
