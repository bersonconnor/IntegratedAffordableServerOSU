"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthorizationUtils_1 = require("../AuthorizationUtils");
const dotenv_1 = require("dotenv");
const UnauthenticatedError_1 = require("../../models/UnauthenticatedError");
const affordable_shared_models_1 = require("affordable-shared-models");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
dotenv_1.config();
describe("AuthorizationUtils Tests", () => {
    describe("checkAuthentication tests", () => {
        test("Any user type, verified email", () => {
            const userInfo = new affordable_shared_models_1.UserInfo();
            userInfo.hasVerifiedEmail = true;
            AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo);
        });
        test("Null user info", () => {
            expect(() => AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(null)).toThrowError(UnauthenticatedError_1.UnauthenticatedError);
        });
        test("Admin user", () => {
            const adminUserInfo = new affordable_shared_models_1.UserInfo();
            adminUserInfo.id = Number.parseInt(process.env.AFFORDABLE_ADMIN_ID);
            AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(adminUserInfo);
        });
        test("User does not have a verified email", () => {
            const userInfo = new affordable_shared_models_1.UserInfo();
            userInfo.hasVerifiedEmail = false;
            expect(() => AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo)).toThrowError(UnauthorizedError_1.UnauthorizedError);
        });
        test("Verified email not required", () => {
            const userInfo = new affordable_shared_models_1.UserInfo();
            userInfo.hasVerifiedEmail = false;
            AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false);
        });
        test("Only permit the specified user type", () => {
            const userInfo = new affordable_shared_models_1.UserInfo();
            const permittedType = affordable_shared_models_1.UserType.DONOR;
            userInfo.hasVerifiedEmail = true;
            for (const type in Object.keys(affordable_shared_models_1.UserType)) {
                userInfo.userType = affordable_shared_models_1.UserType[type];
                if (affordable_shared_models_1.UserType[type] === permittedType) {
                    expect(AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, permittedType)).not.toThrowError();
                }
                else {
                    expect(() => AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, permittedType)).toThrowError(UnauthorizedError_1.UnauthorizedError);
                }
            }
        });
    });
    describe("isAdmin tests", () => {
        test("User is Admin", () => {
            const id = Number.parseInt(process.env.AFFORDABLE_ADMIN_ID);
            const userAuthInfo = new affordable_shared_models_1.UserInfo;
            userAuthInfo.userType = affordable_shared_models_1.UserType.ADMIN;
            const isAdmin = AuthorizationUtils_1.AuthorizationUtils.isAdmin(userAuthInfo);
            expect(isAdmin).toBe(true);
        });
        test("User is Not Admin", () => {
            const id = Number.parseInt(process.env.AFFORDABLE_ADMIN_ID);
            const userAuthInfo = new affordable_shared_models_1.UserInfo;
            userAuthInfo.userType = affordable_shared_models_1.UserType.RECIPIENT;
            const isAdmin = AuthorizationUtils_1.AuthorizationUtils.isAdmin(userAuthInfo);
            expect(isAdmin).toBe(false);
        });
    });
});
