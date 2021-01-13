import { AuthorizationUtils } from "../AuthorizationUtils";
import { AuthenticationInformationDBO } from "../../models/orm/AuthenticationInformationDBO";
import { config } from "dotenv";
import { UnauthenticatedError } from "../../models/UnauthenticatedError";
import { UserInfo, UserType } from "affordable-shared-models";
import { UnauthorizedError } from "../../models/UnauthorizedError";

config();

describe("AuthorizationUtils Tests", () => {
    describe("checkAuthentication tests", () => {
        test("Any user type, verified email", () => {
            const userInfo = new UserInfo();
            userInfo.hasVerifiedEmail = true;
            AuthorizationUtils.checkAuthorization(userInfo);
        });

        test("Null user info", () => {
            expect(() => AuthorizationUtils.checkAuthorization(null)).toThrowError(UnauthenticatedError);
        });

        test("Admin user", () => {
            const adminUserInfo = new UserInfo();
            adminUserInfo.id = Number.parseInt(process.env.AFFORDABLE_ADMIN_ID);

            AuthorizationUtils.checkAuthorization(adminUserInfo);
        });

        test("User does not have a verified email", () => {
            const userInfo = new UserInfo();
            userInfo.hasVerifiedEmail = false;
            expect(() => AuthorizationUtils.checkAuthorization(userInfo)).toThrowError(UnauthorizedError);
        });

        test("Verified email not required", () => {
            const userInfo = new UserInfo();
            userInfo.hasVerifiedEmail = false;
            AuthorizationUtils.checkAuthorization(userInfo, false);
        });

        test("Only permit the specified user type", () => {
            const userInfo = new UserInfo();
            const permittedType = UserType.DONOR;
            userInfo.hasVerifiedEmail = true;

            for (const type in Object.keys(UserType)) {
                userInfo.userType = UserType[type] as UserType;
                if (UserType[type] as UserType === permittedType) {
                    expect(AuthorizationUtils.checkAuthorization(userInfo, true, permittedType)).not.toThrowError();
                } else {
                    expect(() => AuthorizationUtils.checkAuthorization(userInfo, true, permittedType)).toThrowError(UnauthorizedError);
                }
            }
        });
    });

    describe("isAdmin tests", () => {
        test("User is Admin", () => {
            const id = Number.parseInt(process.env.AFFORDABLE_ADMIN_ID);
            const userAuthInfo = new UserInfo;
            userAuthInfo.userType = UserType.ADMIN;
            const isAdmin = AuthorizationUtils.isAdmin(userAuthInfo);
            expect(isAdmin).toBe(true);
        });

        test("User is Not Admin", () => {
            const id = Number.parseInt(process.env.AFFORDABLE_ADMIN_ID);
            const userAuthInfo = new UserInfo;
            userAuthInfo.userType = UserType.RECIPIENT;
            const isAdmin = AuthorizationUtils.isAdmin(userAuthInfo);
            expect(isAdmin).toBe(false);
        });
    });

});