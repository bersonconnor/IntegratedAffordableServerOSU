import { config } from "dotenv";
import { UserInfo, UserType } from "affordable-shared-models";
import { UnauthenticatedError } from "../models/UnauthenticatedError";
import { UnauthorizedError } from "../models/UnauthorizedError";

config();

export class AuthorizationUtils {
    /**
     * Check whether the user is properly authorized.
     * Throws an appropriate error if they are not.
     * @param userInfo the user to authorized
     * @param requireVerifiedEmail require the user to have a verified email. defaults to true
     * @param requiredUserType require the user to be a certain user type. defaults to null (no requirement)
     */
    public static checkAuthorization(userInfo: UserInfo, requireVerifiedEmail = true, requiredUserType?: UserType): void {
        if (userInfo == null) {
            throw new UnauthenticatedError("You are not logged in");
        }

        if (AuthorizationUtils.isAdmin(userInfo)) {
            return;
        }

        if (requireVerifiedEmail && !userInfo.hasVerifiedEmail) {
            throw new UnauthorizedError("You must have a verified email address.");
        }

        if (requiredUserType !== undefined && userInfo.userType !== requiredUserType) {
            throw new UnauthorizedError(`You must be of user type ${requiredUserType} to do this.`);
        }
    }

    /**
     * Checks if the user has admin privileges
     * @param userId A number that holds the current user's ID number
     * @return true if the user is an admin
     */
    public static isAdmin(user: UserInfo): boolean {
        return user.userType === UserType.ADMIN;
    }
}