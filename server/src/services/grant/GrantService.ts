import { Grant, UserInfo, UserType } from "affordable-shared-models";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { AuthorizationUtils } from "../AuthorizationUtils";
import { IllegalStateError } from "../../models/IllegalStateError";
import { Applicant } from "affordable-shared-models/dist/models/Applicant";

export interface GrantService {

    /**
     * Create a grant
     * @param userInfo
     * @param request
     */
    createGrant(userInfo: UserInfo, request: Grant): Promise<Grant>;

    /**
     * Retrieve a grant and its details
     * @param id 
     */
    getGrant(userInfo: UserInfo, id: number): Promise<Grant>;

    /**
     * Update a grant
     * @param userInfo
     * @param request
     */
    updateGrant(userInfo: UserInfo, request: Grant): Promise<Grant>;

    /**
     * Delete a grant
     * @param userInfo
     * @param id
     */
    deleteGrant(userInfo: UserInfo, id: number): Promise<void>;

    /**
     * Apply to a particular grant on behalf of a user
     * @param userInfo
     * @param grantId The grant to apply to
     */
    applyToGrant(userInfo: UserInfo, grantId: number): Promise<void>;

    /**
     * Get all of the grants that a recipient user can apply to
     * @param userInfo
     */
    getOpenEligibleGrants(userInfo: UserInfo): Promise<Array<Grant>>;

    /**
     * Awards a grant to a particular recipient user.
     * @param userInfo the UserInfo of the caller
     * @param recipientId the ID of the recipient to receive the grant
     * @param grantId the ID of the grant to award.
     */
    awardGrantToUser(userInfo: UserInfo, recipientId: number, grantId: number): Promise<void>;

    /**
     * When a user tries to get all grants, we need to decide what to send them
     * If they are a donor, they will get all of the grants they manage via organizations
     * If they are a recipient, they will see all open grants that they are eligible for.
     * @param userInfo the calling user
     */
    getAllGrantsByUserType(userInfo: UserInfo): Promise<Array<Grant>>;

    /**
     * If a user is a donor, get all of the grants that they can manage as via organizations
     * @param userInfo
     */
    getAllManagedGrants(userInfo: UserInfo): Promise<Array<Grant>>;

    /**
     * Get the application info for each applicant for a particular grant.
     * @param userInfo
     * @param grantId
     */
    getApplicants(userInfo: UserInfo, grantId: number): Promise<Array<Applicant>>;
}