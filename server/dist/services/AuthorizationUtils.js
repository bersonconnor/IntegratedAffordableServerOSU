"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationUtils = void 0;
const dotenv_1 = require("dotenv");
const affordable_shared_models_1 = require("affordable-shared-models");
const UnauthenticatedError_1 = require("../models/UnauthenticatedError");
const UnauthorizedError_1 = require("../models/UnauthorizedError");
dotenv_1.config();
class AuthorizationUtils {
    /**
     * Check whether the user is properly authorized.
     * Throws an appropriate error if they are not.
     * @param userInfo the user to authorized
     * @param requireVerifiedEmail require the user to have a verified email. defaults to true
     * @param requiredUserType require the user to be a certain user type. defaults to null (no requirement)
     */
    static checkAuthorization(userInfo, requireVerifiedEmail = true, requiredUserType) {
        if (userInfo == null) {
            throw new UnauthenticatedError_1.UnauthenticatedError("You are not logged in");
        }
        if (AuthorizationUtils.isAdmin(userInfo)) {
            return;
        }
        if (requireVerifiedEmail && !userInfo.hasVerifiedEmail) {
            throw new UnauthorizedError_1.UnauthorizedError("You must have a verified email address.");
        }
        if (requiredUserType !== undefined && userInfo.userType !== requiredUserType) {
            throw new UnauthorizedError_1.UnauthorizedError(`You must be of user type ${requiredUserType} to do this.`);
        }
    }
    /**
     * Checks if the user has admin privileges
     * @param userId A number that holds the current user's ID number
     * @return true if the user is an admin
     */
    static isAdmin(user) {
        return user.userType === affordable_shared_models_1.UserType.ADMIN;
    }
}
exports.AuthorizationUtils = AuthorizationUtils;
