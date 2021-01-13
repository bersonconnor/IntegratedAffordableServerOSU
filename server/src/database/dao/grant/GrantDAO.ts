import { GrantDBO } from "../../../models/orm/grant/GrantDBO";

export interface GrantDAO {
    /**
     * Creates a Grant
     * @param grant
     */
    createGrant(grant: GrantDBO): Promise<GrantDBO>;

    /**
     * Update a grant in the database. Uses the field grant.id to find the record to update.
     * @param grant
     */
    updateGrant(grant: GrantDBO): Promise<GrantDBO>;

    /**
     * Get a grant by its ID
     * @param id
     * @throws NotFoundError {@class NotFoundError} if no Grant is found
     */
    getGrantById(id: number): Promise<GrantDBO>;

    /**
     * Deletes a grant by ID
     * @param id
     */
    deleteGrantById(id: number): Promise<void>;

    /**
     * Retrieve all open grants and their eligibility requirements
     */
    getAllOpenGrants(): Promise<Array<GrantDBO>>;

    /**
     * Retrieve all open grants with whether or not a user has applied for them
     */
    getAllOpenGrantsWithUserApplicationStatus(userId: number): Promise<Array<GrantDBO>>;

    /**
     * Get all of the grants managed by each organization in the provided list.
     * @param organizationIds
     */
    getAllGrantsForOrganizations(organizationIds: number[]): Promise<Array<GrantDBO>>;

}