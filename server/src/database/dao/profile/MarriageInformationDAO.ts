import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { MarriageInformation } from "../../../models/orm/profile/MarriageInformation";
import { Validation } from "../../../utils/Validation";


export class MarriageInformationDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds marriage information to a user's profile
     * @param marriageInfo
     */
    public async addMarriageInformation(marriageInfo: MarriageInformation): Promise<MarriageInformation> {
        console.log("Adding user marriage information: ");
        console.log(marriageInfo);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            marriageInfo = await transactionalEntityManager.save(marriageInfo);
            return (marriageInfo);
        })
    }

    /**
     * Get marriage info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no marriage info for the user is found
     */
    public async getMarriageInformationByUserId(id: number): Promise<MarriageInformation> {
        const result = await this.connection.manager
            .getRepository(MarriageInformation)
            .createQueryBuilder("marriageInformation")
            .where("marriageInformation.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Marriage info for user with id=" + id + " not found");
        }
        return <MarriageInformation>result;
    }

    /**
     * Deletes Marriage info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserMarriageInformationById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(MarriageInformation)
            .createQueryBuilder("marriageInformation")
            .delete()
            .from(MarriageInformation)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's marriage info was deleted. UserID: " + id);
    }
}