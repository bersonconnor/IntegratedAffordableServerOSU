import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { Insurance } from "../../../models/orm/profile/Insurance";
import { Validation } from "../../../utils/Validation";


export class InsuranceDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds insurance information to a user's profile
     * @param insurance
     */
    public async addInsurance(insurance: Insurance): Promise<Insurance> {
        console.log("Adding user insurance information: ");
        console.log(insurance);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            insurance = await transactionalEntityManager.save(insurance);
            return (insurance);
        })
    }

    /**
     * Get insurance info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no insurance info for the user is found
     */
    public async getInsuranceByUserId(id: number): Promise<Insurance> {
        const result = await this.connection.manager
            .getRepository(Insurance)
            .createQueryBuilder("insurance")
            .where("insurance.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Insurance info for user with id=" + id + " not found");
        }
        return <Insurance>result;
    }

    /**
     * Deletes insurance info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserInsuranceById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(Insurance)
            .createQueryBuilder("insurance")
            .delete()
            .from(Insurance)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's insurance info was deleted. UserID: " + id);
    }
}