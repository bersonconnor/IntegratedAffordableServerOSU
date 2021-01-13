import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { IdentificationInformation } from "../../../models/orm/profile/IdentificationInformation";
import { Validation } from "../../../utils/Validation";


export class IdentificationInformationDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds identification information to a user's profile
     * @param idInfo
     */
    public async addIdentificationInformation(idInfo: IdentificationInformation): Promise<IdentificationInformation> {
        console.log("Adding user identification information: ");
        console.log(idInfo);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            idInfo = await transactionalEntityManager.save(idInfo);
            return (idInfo);
        })
    }

    /**
     * Get identification info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no identification info for the user is found
     */
    public async getIdentificationInformationByUserId(id: number): Promise<IdentificationInformation> {
        const result = await this.connection.manager
            .getRepository(IdentificationInformation)
            .createQueryBuilder("identificationInformation")
            .where("identificationInformation.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Identification info for user with id=" + id + " not found");
        }
        return <IdentificationInformation>result;
    }

    /**
     * Deletes identification info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserIdentificationInformationById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(IdentificationInformation)
            .createQueryBuilder("identificaitonInformation")
            .delete()
            .from(IdentificationInformation)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's identification info was deleted. UserID: " + id);
    }
}