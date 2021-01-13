import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { SexAndEthnicity } from "../../../models/orm/profile/SexAndEthnicity";
import { Validation } from "../../../utils/Validation";


export class SexAndEthnicityDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds sex and ethnicity information to a user's profile
     * @param sae
     */
    public async addSexAndEthnicity(sae: SexAndEthnicity): Promise<SexAndEthnicity> {
        console.log("Adding sex and ethnicity: ");
        console.log(sae);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            sae = await transactionalEntityManager.save(sae);
            return (sae);
        })
    }

    /**
     * Get sex and ethnicity info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no sex and ethnicity info for the user is found
     */
    public async getSexAndEthnicityByUserId(id: number): Promise<SexAndEthnicity> {
        const result = await this.connection.manager
            .getRepository(SexAndEthnicity)
            .createQueryBuilder("sexAndEthnicity")
            .where("sexAndEthnicity.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Sex and Ethnicity info for user with id=" + id + " not found");
        }
        return <SexAndEthnicity>result;
    }

    /**
     * Deletes sex and ethnicity info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserSexAndEthnicityById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(SexAndEthnicity)
            .createQueryBuilder("sexAndEthnicity")
            .delete()
            .from(SexAndEthnicity)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's sex and ethnicity info was deleted. UserID: " + id);
    }
}