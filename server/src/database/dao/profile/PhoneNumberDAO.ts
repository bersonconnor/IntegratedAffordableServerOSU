import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { PhoneNumber } from "../../../models/orm/profile/PhoneNumber";
import { Validation } from "../../../utils/Validation";


export class PhoneNumberDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds phone number information to a user's profile
     * @param phoneNum
     */
    public async addPhoneNumber(phoneNum: PhoneNumber): Promise<PhoneNumber> {
        console.log("Adding user phone number: ");
        console.log(phoneNum);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            phoneNum = await transactionalEntityManager.save(phoneNum);
            return (phoneNum);
        })
    }
    
    /**
     * Get all phone numbers for a user in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no phone number info for the user is found
     */
    public async getAllPhoneNumbersByUserId(id: number): Promise<Array<PhoneNumber>> {
        const result = await this.connection.manager
            .getRepository(PhoneNumber)
            .createQueryBuilder("phoneNumber")
            .where("phoneNumber.id = :id", { id: id })
            .getMany();
        if (result === undefined || result.length == 0) {
            throw new NotFoundError("Phone Number info for user with id=" + id + " not found");
        }
        return <Array<PhoneNumber>>result;
    }

    /**
     * Deletes Phone number info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserPhoneNumbersById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(PhoneNumber)
            .createQueryBuilder("phoneNumber")
            .delete()
            .from(PhoneNumber)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's phone number(s) info was deleted. UserID: " + id);
    }
}