import { Organization } from "..";
import { EligibilityCriteria } from "./EligibilityCriteria";

export class Grant {
    /**
     * The unique identifier of a grant
     */
    id?: number;

    /**
     * The name or title of a grant
     */
    grantName: string;

    /**
     * The amount of money that will be awarded to the recipient of the grant, in USD
     */
    grantAmount: number;

    /**
     * The earliest time in which a user can apply to a grant. If null, defaults to the current time.
     */
    startDate?: Date;

    /**
     * The latest time in which a user can apply to a grant
     */
    endDate?: Date;

    /**
     * A general category of the grant
     */
    category?: string;

    /**
     * A description of the grant.
     */
    description: string;

    /**
     * Details about the organization that is administering the grant.
     */
    organization: Organization;

    /**
     * The recipient or recipient user ID that has been selected to receive the grant.
     */
    recipientId?: number;

    /**
     * The criteria or criteria ID that a user must meet to apply to this grant.
     */
    eligibilityCriteria?: EligibilityCriteria;

    /**
     * For recipient users, this field will denote if you have previously applied to this grant.
     * For donors, this field will be undefined.
     */
    applied?: boolean | undefined;
};
