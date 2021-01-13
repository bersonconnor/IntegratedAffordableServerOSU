import { UserType } from "..";

/**
 * This class contains information about the user that should be transferred when a user is logged in,
 *  or when retrieving information about a user  
 */
export class UserInfo {
    /**
     * The user's unique ID in Affordable
     */
    id: number;

    /** 
     * The user's unique username in Affordable
     */
    username: string;

    /**
     * The user's first name. This data may not be present because it does not exist in Affordable, or may be hidden for privacy reasons.
     */
    firstName?: string;

    /**
     * The user's last name. This data may not be present because it does not exist in Affordable, or may be hidden for privacy reasons.
     */
    lastName?: string;

    /**
     * The user's first name. This data may be hidden for privacy reasons.
     */
    primaryEmail?: string;

    /**
     * The type of Affordable user.
     */
    userType: UserType;

    /**
     * True if the user has a verified email in AFFORDABLE
     */
    hasVerifiedEmail: boolean;

    /**
     * True if the user requires Two Factor Authentication
     */
    twoFactor: boolean;

    /**
     * True if the user is activated
     */
    isDeactivate?: boolean;
}
