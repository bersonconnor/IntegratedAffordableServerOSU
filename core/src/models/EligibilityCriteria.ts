/**
 * Eligibility Criteria describe constraints that a user must achieve to apply for a grant.
 */
export class EligibilityCriteria {
    /**
     * The unique ID of the eligibility criteria
     */
    public id?: number;

    /**
     * The organization that owns and can modify this criteria.
     * This field will always be returned.
     * This is a required field when creating a new EligibilityCriteria.
     * When referencing an existing EligibilityCriteria (e.g. when creating a grant), it is optional.
     */
    public organizationId?: number;

    /**
     * An email address that a user must have to apply to a grant with this eligibility criteria.
     * This constraint makes it easy to ensure that a particular user is the only individual who can apply to a grant.
     */
    public emailAddress?: string;
};