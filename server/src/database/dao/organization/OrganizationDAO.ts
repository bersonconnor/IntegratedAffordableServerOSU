import {OrganizationDBO} from "../../../models/orm/OrganizationDBO";
import {NotFoundError} from "../../../models/NotFoundError";

export interface OrganizationDAO {

    /**
     * Creates an organization in AFFORDABLE
     * @param org
     */
    saveOrganization(org: OrganizationDBO): Promise<OrganizationDBO>;

    /**
     * Get an organization in AFFORDABLE by their ID
     * @param id
     * @throws NotFoundError if no Organization is found
     */
    getOrganizationById(id: number): Promise<OrganizationDBO>;

    /**
     * Deletes an organization by ID in AFFORDABLE
     * @param id
     */
    deleteOrganizationById(id: number): Promise<void>;

    getApiKey(orgId: number): Promise<string>;
}