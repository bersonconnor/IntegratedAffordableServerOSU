"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationServiceImpl_1 = require("../AuthenticationServiceImpl");
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
const IllegalArgumentError_1 = require("../../models/IllegalArgumentError");
const bcrypt = __importStar(require("bcrypt"));
const jest_mock_extended_1 = require("jest-mock-extended");
const AuthenticationInformationDBO_1 = require("../../models/orm/AuthenticationInformationDBO");
const NotFoundError_1 = require("../../models/NotFoundError");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
const LegalName_1 = require("../../models/orm/profile/LegalName");
const ForgotPasswordResetTokenDBO_1 = require("../../models/orm/ForgotPasswordResetTokenDBO");
let authenticationService;
jest.mock("bcrypt");
const mockAuthNDao = jest_mock_extended_1.mock();
const mockEmailDao = jest_mock_extended_1.mock();
const mockLegalNameDao = jest_mock_extended_1.mock();
const mockForgotPassDao = jest_mock_extended_1.mock();
const mockEmailClient = jest_mock_extended_1.mock();
const mockEmailService = jest_mock_extended_1.mock();
const USER_ID = 40214;
const USER_NAME = "username";
const USER_EMAIL = "myEmail@affordhealth.org";
const FIVE_MINUTES_IN_MILLIS = 1000 * 60 * 5; // used for dates and times
const emailRecord = {
    userId: USER_ID,
    email: USER_EMAIL,
    verified: true,
    isPrimary: true,
    verificationCode: ""
};
describe("AuthenticationServiceImpl tests", () => {
    let createUserRequest;
    beforeEach(() => {
        createUserRequest = new affordable_shared_models_1.CreateUserRequest();
        createUserRequest.username = USER_NAME;
        createUserRequest.email = USER_EMAIL;
        createUserRequest.password = v4_1.default();
        createUserRequest.usertype = affordable_shared_models_1.UserType.DONOR;
    });
    beforeAll(() => {
        authenticationService = new AuthenticationServiceImpl_1.AuthenticationServiceImpl(mockAuthNDao, mockEmailDao, mockLegalNameDao, mockEmailClient, mockEmailService, mockForgotPassDao);
    });
    describe("registerUser tests", () => {
        describe("Happy paths", () => {
            beforeEach(() => {
                jest.mock("bcrypt", () => {
                    return jest.fn().mockImplementation(() => {
                        return {
                            hash: jest.fn(() => Promise.resolve("hashed password"))
                        };
                    });
                });
                // These mocks get us through AuthenticationServiceImpl.getUserInfo (tested separately)
                mockEmailDao.getAllEmails.mockImplementation((userName) => {
                    return Promise.resolve([emailRecord]);
                });
                mockAuthNDao.getUser.mockImplementation(() => Promise.resolve({
                    id: USER_ID,
                    username: USER_NAME,
                    isDonor: true
                }));
                mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
                // end mocks for getUserInfo
            });
            afterEach(() => {
                jest.clearAllMocks();
            });
            test("No 2FA", async () => {
                const id = USER_ID;
                const userAuthInfo = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
                userAuthInfo.id = id;
                userAuthInfo.username = createUserRequest.username;
                userAuthInfo.isDonor = true;
                userAuthInfo.TwoFactor = false;
                mockAuthNDao.createUser.mockReturnValue(Promise.resolve(userAuthInfo));
                // Call under test
                const response = await authenticationService.registerUser(createUserRequest);
                // Verify that the response object is correct
                expect(response.token).toBeDefined();
                expect(response.userInfo.id).toBe(id);
                expect(response.userInfo.username).toBe(createUserRequest.username);
                expect(response.userInfo.primaryEmail).toBe(createUserRequest.email);
                expect(response.userInfo.userType).toBe(createUserRequest.usertype);
                // Verify that the password was hashed
                expect(bcrypt.hash).toBeCalledWith(createUserRequest.password, 10);
                expect(bcrypt.hash).toBeCalledTimes(1);
                // Verify that the user record was created
                expect(mockAuthNDao.createUser).toHaveBeenCalledTimes(1);
                // Verify that the email record was created
                expect(mockEmailService.addEmail).toHaveBeenCalledTimes(1);
                // Verify that a 2FA email was not sent
                expect(mockEmailClient.sendEmail).not.toBeCalled();
            });
            test("With 2FA", async () => {
                const id = USER_ID;
                const userAuthInfo = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
                userAuthInfo.id = id;
                userAuthInfo.username = createUserRequest.username;
                userAuthInfo.isDonor = true;
                userAuthInfo.TwoFactor = true;
                mockAuthNDao.createUser.mockReturnValue(Promise.resolve(userAuthInfo));
                // Call under test
                const response = await authenticationService.registerUser(createUserRequest);
                // Verify that the response object is correct
                expect(response.token).toBeDefined();
                expect(response.userInfo.id).toBe(id);
                expect(response.userInfo.username).toBe(createUserRequest.username);
                expect(response.userInfo.primaryEmail).toBe(createUserRequest.email);
                expect(response.userInfo.userType).toBe(createUserRequest.usertype);
                // Verify that the password was hashed
                expect(bcrypt.hash).toBeCalledWith(createUserRequest.password, 10);
                expect(bcrypt.hash).toBeCalledTimes(1);
                // Verify that the user record was created
                expect(mockAuthNDao.createUser).toHaveBeenCalledTimes(1);
                // Verify that the email record was created
                expect(mockEmailService.addEmail).toHaveBeenCalledTimes(1);
                // Verify that a 2FA email was sent
                expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(1);
            });
        });
        describe("registerUser validation checks", () => {
            test("No username", async () => {
                createUserRequest.username = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("No email", async () => {
                createUserRequest.email = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("No password", async () => {
                createUserRequest.password = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("No user type", async () => {
                createUserRequest.usertype = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
        });
    });
    describe("validateLogin tests", () => {
        test("Successful login", async () => {
            jest.spyOn(bcrypt, "compare").mockReturnValue(Promise.resolve(true));
            // These mocks get us through AuthenticationServiceImpl.getUserInfo (tested separately)
            mockEmailDao.getAllEmails.mockImplementation((userName) => {
                return Promise.resolve([emailRecord]);
            });
            mockAuthNDao.getUser.mockImplementation(() => Promise.resolve({
                id: USER_ID,
                username: USER_NAME,
                isDonor: true
            }));
            mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
            // end mocks for getUserInfo
            // Call under test
            expect(await authenticationService.validateLogin({ username: "username", password: "password" })).not.toBeNull();
        });
        test("No user found", async () => {
            mockAuthNDao.getPasswordForUser.mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
            await expect(authenticationService.validateLogin({ username: "username", password: "password" })).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
        });
        test("Mismatched password", async () => {
            jest.spyOn(bcrypt, "compare").mockReturnValue(Promise.resolve(false));
            await expect(authenticationService.validateLogin({ username: "username", password: "password" })).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
        });
        describe("validation checks", () => {
            test("No username", async () => {
                await expect(authenticationService.validateLogin({ username: null, password: "password" })).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("No password", async () => {
                await expect(authenticationService.validateLogin({ username: "username", password: null })).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
        });
    });
    describe("getUserInfo tests", () => {
        test("Without Legal Names", async () => {
            mockEmailDao.getAllEmails.mockImplementation((userName) => {
                return Promise.resolve([emailRecord]);
            });
            mockAuthNDao.getUser.mockImplementation(() => Promise.resolve({
                id: USER_ID,
                username: USER_NAME,
                isDonor: true
            }));
            mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
            const expected = new affordable_shared_models_1.UserInfo();
            expected.id = USER_ID;
            expected.username = USER_NAME;
            expected.primaryEmail = USER_EMAIL;
            expected.userType = affordable_shared_models_1.UserType.DONOR;
            expected.hasVerifiedEmail = true;
            // Call under test
            expect(await authenticationService.getUserInfo(USER_NAME)).toEqual(expected);
        });
        test("With Legal Names", async () => {
            mockEmailDao.getAllEmails.mockImplementation((userName) => {
                return Promise.resolve([emailRecord]);
            });
            mockAuthNDao.getUser.mockImplementation(() => Promise.resolve({
                id: USER_ID,
                username: USER_NAME,
                isDonor: true
            }));
            const legalName = new LegalName_1.LegalName();
            legalName.firstName = "First";
            legalName.lastName = "Last";
            legalName.isCurrentLegalName = true;
            const legalNameToBeDiscarded = new LegalName_1.LegalName();
            legalNameToBeDiscarded.firstName = "Old first";
            legalNameToBeDiscarded.lastName = "Old last";
            legalNameToBeDiscarded.isCurrentLegalName = false;
            mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => { return Promise.resolve([legalNameToBeDiscarded, legalName]); });
            const expected = new affordable_shared_models_1.UserInfo();
            expected.id = USER_ID;
            expected.username = USER_NAME;
            expected.primaryEmail = USER_EMAIL;
            expected.userType = affordable_shared_models_1.UserType.DONOR;
            expected.firstName = "First";
            expected.lastName = "Last";
            expected.hasVerifiedEmail = true;
            // Call under test
            expect(await authenticationService.getUserInfo("username")).toEqual(expected);
        });
        describe("validation checks", () => {
            test("No username", async () => {
                await expect(authenticationService.getUserInfo(null)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
        });
    });
    describe("accountCanBeCreatedWithEmail tests", () => {
        test("Validation: no email", async () => {
            await expect(authenticationService.accountCanBeCreatedWithEmail(null)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
        });
        test("Happy path", async () => {
            mockEmailDao.emailExists.mockImplementation(() => Promise.resolve(true));
            expect(await authenticationService.accountCanBeCreatedWithEmail("emailaddr")).toBe(false);
        });
    });
    describe("resetPassword tests", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test("The reset password code has not expired", async () => {
            const oldPass = "oldPassword";
            const newPass = "myNewPassword123";
            const hashedNewPass = await bcrypt.hash(newPass, 10);
            const code = v4_1.default() + v4_1.default();
            const forgotPassResetToken = new ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO();
            forgotPassResetToken.userId = USER_ID;
            forgotPassResetToken.secret = code;
            const today = new Date();
            forgotPassResetToken.expirationDate = new Date((today.getTime() + FIVE_MINUTES_IN_MILLIS));
            const user = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
            user.id = USER_ID;
            user.username = "myusername123";
            user.isDonor = false;
            user.password = await bcrypt.hash(oldPass, 10);
            mockForgotPassDao.getForgotPasswordResetTokenByCode.mockImplementation((code) => {
                return Promise.resolve(forgotPassResetToken);
            });
            mockForgotPassDao.deleteForgotPasswordResetTokenByCode.mockImplementation((code) => {
                return;
            });
            mockAuthNDao.getUserById.mockImplementation((userId) => {
                return Promise.resolve(user);
            });
            mockAuthNDao.updateUser.mockImplementation((user) => {
                user.password = hashedNewPass;
                return Promise.resolve(user);
            });
            // call under test
            await authenticationService.resetPassword(newPass, code);
            expect(mockForgotPassDao.getForgotPasswordResetTokenByCode).toBeCalledTimes(1);
            expect(mockForgotPassDao.getForgotPasswordResetTokenByCode).toBeCalledWith(code);
            expect(mockAuthNDao.getUserById).toBeCalledTimes(1);
            expect(mockAuthNDao.getUserById).toBeCalledWith(USER_ID);
            expect(mockAuthNDao.updateUser).toBeCalledTimes(1);
            expect(mockAuthNDao.updateUser).toBeCalledWith(user);
            expect(mockForgotPassDao.deleteForgotPasswordResetTokenByCode).toBeCalledTimes(1);
            expect(mockForgotPassDao.deleteForgotPasswordResetTokenByCode).toBeCalledWith(code);
            expect(hashedNewPass).toEqual(user.password);
        });
        test("The reset password code has expired", async () => {
            const code = v4_1.default() + v4_1.default();
            const newPass = "myNewPassword123";
            const forgotPassResetToken = new ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO();
            forgotPassResetToken.userId = USER_ID;
            forgotPassResetToken.secret = code;
            const today = new Date();
            forgotPassResetToken.expirationDate = new Date((today.getTime() - FIVE_MINUTES_IN_MILLIS));
            mockForgotPassDao.getForgotPasswordResetTokenByCode.mockImplementation((code) => {
                return Promise.resolve(forgotPassResetToken);
            });
            // call under test
            await expect(authenticationService.resetPassword(newPass, code)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockForgotPassDao.getForgotPasswordResetTokenByCode).toBeCalledTimes(1);
            expect(mockForgotPassDao.getForgotPasswordResetTokenByCode).toBeCalledWith(code);
            expect(mockAuthNDao.getUserById).not.toBeCalled();
            expect(mockAuthNDao.updateUser).not.toBeCalled();
            expect(mockForgotPassDao.deleteForgotPasswordResetTokenByCode).not.toBeCalled();
        });
    });
});
