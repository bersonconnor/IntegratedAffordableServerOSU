import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { InformationProvider } from "../../../models/orm/profile/InformationProvider";
import { Validation } from "../../../utils/Validation";


export class InformationProviderDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds information provider information to a user's profile
     * @param infoProvider
     */
    public async addInformationProvider(infoProvider: InformationProvider): Promise<InformationProvider> {
        console.log("Adding information provider details: ");
        console.log(infoProvider);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            infoProvider = await transactionalEntityManager.save(infoProvider);
            return (infoProvider);
        })
    }

    /**
     * Get information provider info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no information provider info for the user is found
     */
    public async getInformationProviderByUserId(id: number): Promise<InformationProvider> {
        const result = await this.connection.manager
            .getRepository(InformationProvider)
            .createQueryBuilder("informationProvider")
            .where("informationProvider.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Information Provider info for user with id=" + id + " not found");
        }
        return <InformationProvider>result;
    }

    /**
     * Deletes information provider info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserInformationProviderById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(InformationProvider)
            .createQueryBuilder("inforamtionProvider")
            .delete()
            .from(InformationProvider)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's information provider info was deleted. UserID: " + id);
    }
}