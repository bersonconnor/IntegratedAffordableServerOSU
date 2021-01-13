import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { Address } from "../../../models/orm/profile/Address";
import { Validation } from "../../../utils/Validation";


export class AddressDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds address information to a user's profile
     * @param address
     */
    public async addAddress(address: Address): Promise<Address> {
        console.log("Adding user address: ");
        console.log(address);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            address = await transactionalEntityManager.save(address);
            return (address);
        })
    }

    /**
     * Get an address in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no address for the user is found
     */
    public async getAddressByUserId(id: number): Promise<Address> {
        const result = await this.connection.manager
            .getRepository(Address)
            .createQueryBuilder("address")
            .where("address.userId = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Address for user with id=" + id + " not found");
        }
        return <Address>result;
    }

    /**
     * Deletes address info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserAddressById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(Address)
            .createQueryBuilder("address")
            .delete()
            .from(Address)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's address was deleted. UserID: " + id);
    }
}