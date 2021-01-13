import { Connection, getConnection } from "typeorm";
import { ApplicationInformationDBO } from "../../../models/orm/grant/ApplicationInformationDBO";
import { ApplicationInformationDAO } from "./ApplicationInformationDAO";

export class DBOApplicationInformationDAOImpl implements ApplicationInformationDAO {

    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Creates an application record in AFFORDABLE
     * @param record
     */
    async save(record: ApplicationInformationDBO): Promise<ApplicationInformationDBO> {
        const result = await this.connection.getRepository(ApplicationInformationDBO).save(record);
        console.log("ApplicationInformation created: ", result);
        return result as ApplicationInformationDBO;
    }

    /**
     * Deletes an application record in AFFORDABLE
     * @param id
     */
    async delete(id: number): Promise<void> {
        await this.connection
            .getRepository(ApplicationInformationDBO)
            .createQueryBuilder()
            .delete()
            .from(ApplicationInformationDBO)
            .where("id = :id", {id: id})
            .execute();
        console.log("ApplicationInformation deleted: " + id);
    }

    /**
     * Retrieves application information record by its id
     * @param id
     */
    get(id: number): Promise<ApplicationInformationDBO> {
        return this.connection.getRepository(ApplicationInformationDBO).findOne({id: id});
    }

    /**
     * Get all of the grants to which a user has applied.
     * @param userId
     */
    getApplicationsForUser(userId: number): Promise<Array<ApplicationInformationDBO>> {
        return this.connection.getRepository(ApplicationInformationDBO).find(
            {userId: userId}
        );
    }

    /**
     * Get all of the applicants that have applied for a grant.
     * @param grantId
     */
    getApplicationsForGrant(grantId: number): Promise<Array<ApplicationInformationDBO>> {
        return this.connection.getRepository(ApplicationInformationDBO).find(
            {grantId: grantId}
        );
    }

    /**
     * Determine if a user has applied for a grant.
     */
    async applicationExists(userId: number, grantId: number): Promise<boolean> {
        const application = await this.connection.getRepository(ApplicationInformationDBO).findOne(
            {userId: userId, grantId: grantId});

        return application !== undefined;
    }
}