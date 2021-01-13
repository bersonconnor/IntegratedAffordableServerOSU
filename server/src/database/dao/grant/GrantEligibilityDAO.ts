import { EligibilityCriteriaDBO } from "../../../models/orm/grant/EligibilityCriteriaDBO";

export interface GrantEligibilityDAO {
    /**
     * Create/updates a grant eligibility record in AFFORDABLE
     * @param record
     */
    save(record: EligibilityCriteriaDBO): Promise<EligibilityCriteriaDBO>;

    /**
     * Get a grant eligibility record by ID
     */
    get(record: number): Promise<EligibilityCriteriaDBO>;

    /**
     * Deletes a grant eligibility record in AFFORDABLE
     * @param id
     */
    delete(id: number): Promise<void>;
}