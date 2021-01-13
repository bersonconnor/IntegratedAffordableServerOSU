import { Grant, UserInfo } from "affordable-shared-models";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";

export interface EligibilityCriteriaService {
    /**
     * Determine whether meets eligibility requirements for a particular grant
     * @param userInfo
     * @param requirements
     */
    meetsEligibilityRequirements(userInfo: UserInfo, requirements: EligibilityCriteria): boolean;

    /**
     * Retrieve an {@class EligibilityCriteria} by its id
     * @param id
     */
    getEligibilityCriteria(id: number): Promise<EligibilityCriteria>;

    /**
     * Create an {@class EligibilityCriteria}
     * @param userInfo
     * @param eligibilityCriteria
     */
    createEligibilityCriteria(userInfo: UserInfo, eligibilityCriteria: EligibilityCriteria): Promise<EligibilityCriteria>;

}