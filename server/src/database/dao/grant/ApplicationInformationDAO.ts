import { ApplicationInformationDBO } from "../../../models/orm/grant/ApplicationInformationDBO";

export interface ApplicationInformationDAO {
    /**
     * Creates an application record in AFFORDABLE
     * @param record
     */
    save(record: ApplicationInformationDBO): Promise<ApplicationInformationDBO>;

    /**
     * Deletes an application record in AFFORDABLE
     * @param id
     */
    delete(id: number): Promise<void>;

    /**
     * Retrieves application information record by its id
     * @param id
     */
    get(id: number): Promise<ApplicationInformationDBO>;

    /**
     * Get all of the grants to which a user has applied.
     * @param userId
     */
    getApplicationsForUser(userId: number): Promise<Array<ApplicationInformationDBO>>;

    /**
     * Get all of the applicants that have applied for a grant.
     * @param grantId
     */
    getApplicationsForGrant(grantId: number): Promise<Array<ApplicationInformationDBO>>;

    /**
     * Find whether or not a particular user has applied for a particular grant.
     * @param userId
     * @param grantId
     */
    applicationExists(userId: number, grantId: number): Promise<boolean>;
}