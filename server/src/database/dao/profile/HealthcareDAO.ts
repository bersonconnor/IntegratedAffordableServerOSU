import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { Healthcare } from "../../../models/orm/profile/Healthcare";
import { Validation } from "../../../utils/Validation";


export class HealthcareDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds healthcare information to a user's profile
     * @param healthcare
     */
    public async addHealthcare(healthcare: Healthcare): Promise<Healthcare> {
        console.log("Adding user healthcare: ");
        console.log(healthcare);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            healthcare = await transactionalEntityManager.save(healthcare);
            return (healthcare);
        })
    }

    /**
     * Get healthcare info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no healthcare info for the user is found
     */
    public async getHealthcareByUserId(id: number): Promise<Healthcare> {
        const result = await this.connection.manager
            .getRepository(Healthcare)
            .createQueryBuilder("healthcare")
            .where("healthcare.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Healthcare info for user with id=" + id + " not found");
        }
        return <Healthcare>result;
    }

    /**
     * Deletes healthcare info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserHealthcareById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(Healthcare)
            .createQueryBuilder("healthcare")
            .delete()
            .from(Healthcare)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's healthcare info was deleted. UserID: " + id);
    }
}