import {AuthenticationServiceImpl} from "../AuthenticationServiceImpl";
import {CreateUserRequest, UserInfo, UserType} from "affordable-shared-models";
import uuidv4 from "uuid/v4";
import {IllegalArgumentError} from "../../models/IllegalArgumentError";
import * as bcrypt from "bcrypt";
import {mock} from "jest-mock-extended";
import {AuthenticationInformationDAO} from "../../database/dao/authentication/AuthenticationInformationDAO";
import {EmailDAO} from "../../database/dao/email/EmailDAO";
import {LegalNameDAO} from "../../database/dao/profile/LegalNameDAO";
import {AuthenticationInformationDBO} from "../../models/orm/AuthenticationInformationDBO";
import {AffordableSESClient} from "../email/AffordableSESClient";
import {NotFoundError} from "../../models/NotFoundError";
import {UnauthorizedError} from "../../models/UnauthorizedError";
import {LegalName} from "../../models/orm/profile/LegalName";
import { EmailService } from "../EmailService";
import { EmailRecordDBO } from "../../models/orm/EmailRecordDBO";
import { ForgotPasswordResetTokenDAO } from "../../database/dao/ForgotPasswordResetTokenDAO";
import { ForgotPasswordResetTokenDBO } from "../../models/orm/ForgotPasswordResetTokenDBO";

let authenticationService: AuthenticationServiceImpl;

jest.mock("bcrypt");

const mockAuthNDao = mock<AuthenticationInformationDAO>();
const mockEmailDao = mock<EmailDAO>();
const mockLegalNameDao = mock<LegalNameDAO>();
const mockForgotPassDao = mock<ForgotPasswordResetTokenDAO>();
const mockEmailClient = mock<AffordableSESClient>();
const mockEmailService = mock<EmailService>();

const USER_ID = 40214;
const USER_NAME = "username";
const USER_EMAIL = "myEmail@affordhealth.org";

const FIVE_MINUTES_IN_MILLIS = 1000 * 60 * 5; // used for dates and times

const emailRecord: EmailRecordDBO = {
    userId: USER_ID,
    email: USER_EMAIL,
    verified: true,
    isPrimary: true,
    verificationCode: ""
};


describe("AuthenticationServiceImpl tests", () => {
    let createUserRequest: CreateUserRequest;
    beforeEach(() => {
        createUserRequest = new CreateUserRequest();
        createUserRequest.username = USER_NAME;
        createUserRequest.email = USER_EMAIL;
        createUserRequest.password = uuidv4();
        createUserRequest.usertype = UserType.DONOR;
    });

    beforeAll(() => {
        authenticationService = new AuthenticationServiceImpl(mockAuthNDao, mockEmailDao, mockLegalNameDao, mockEmailClient, mockEmailService, mockForgotPassDao);
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
                    return Promise.resolve([ emailRecord ]);
                });
                mockAuthNDao.getUser.mockImplementation(() => Promise.resolve(
                    {
                        id: USER_ID,
                        username: USER_NAME,
                        isDonor: true
                    } as AuthenticationInformationDBO));
                mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => {throw new NotFoundError("");});
                // end mocks for getUserInfo

            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            test("No 2FA", async () => {
                const id = USER_ID;

                const userAuthInfo = new AuthenticationInformationDBO();
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

                const userAuthInfo = new AuthenticationInformationDBO();
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
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError);
            });

            test("No email", async () => {
                createUserRequest.email = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError);
            });

            test("No password", async () => {
                createUserRequest.password = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError);
            });

            test("No user type", async () => {
                createUserRequest.usertype = null;
                await expect(authenticationService.registerUser(createUserRequest)).rejects.toThrowError(IllegalArgumentError);
            });
        });
    });


    describe("validateLogin tests", () => {
        test("Successful login", async () => {
            jest.spyOn(bcrypt, "compare").mockReturnValue(Promise.resolve(true));

            // These mocks get us through AuthenticationServiceImpl.getUserInfo (tested separately)
            mockEmailDao.getAllEmails.mockImplementation((userName) => {
                return Promise.resolve([ emailRecord ]);
            });
            mockAuthNDao.getUser.mockImplementation(() => Promise.resolve(
                {
                    id: USER_ID,
                    username: USER_NAME,
                    isDonor: true
                } as AuthenticationInformationDBO));
            mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => {throw new NotFoundError("");});
            // end mocks for getUserInfo

            // Call under test
            expect(await authenticationService.validateLogin({ username: "username", password: "password"})).not.toBeNull();
        });

        test("No user found", async () => {
            mockAuthNDao.getPasswordForUser.mockImplementation(() => { throw new NotFoundError("");});
            await expect(authenticationService.validateLogin({ username: "username", password: "password" })).rejects.toThrowError(UnauthorizedError);
        });

        test("Mismatched password", async () => {
            jest.spyOn(bcrypt, "compare").mockReturnValue(Promise.resolve(false));
            await expect(authenticationService.validateLogin({ username: "username", password: "password" })).rejects.toThrowError(UnauthorizedError);
        });

        describe("validation checks", () => {
            test("No username", async () => {
                await expect(authenticationService.validateLogin({ username: null, password: "password" })).rejects.toThrowError(IllegalArgumentError);
            });
            test("No password", async () => {
                await expect(authenticationService.validateLogin({ username: "username", password: null })).rejects.toThrowError(IllegalArgumentError);
            });
        });
    });

    describe("getUserInfo tests", () => {
        test("Without Legal Names", async () => {
            mockEmailDao.getAllEmails.mockImplementation((userName) => {
                return Promise.resolve([ emailRecord ]);
            });
            mockAuthNDao.getUser.mockImplementation(() => Promise.resolve(
                {
                    id: USER_ID,
                    username: USER_NAME,
                    isDonor: true
                } as AuthenticationInformationDBO));
            mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => {throw new NotFoundError("");});

            const expected = new UserInfo();
            expected.id = USER_ID;
            expected.username = USER_NAME;
            expected.primaryEmail = USER_EMAIL;
            expected.userType = UserType.DONOR;
            expected.hasVerifiedEmail = true;

            // Call under test
            expect(await authenticationService.getUserInfo(USER_NAME)).toEqual(expected);
        });

        test("With Legal Names", async () => {
            mockEmailDao.getAllEmails.mockImplementation((userName) => {
                return Promise.resolve([ emailRecord ]);
            });

            mockAuthNDao.getUser.mockImplementation(() => Promise.resolve(
                {
                    id: USER_ID,
                    username: USER_NAME,
                    isDonor: true
                } as AuthenticationInformationDBO));

            const legalName = new LegalName();
            legalName.firstName = "First";
            legalName.lastName = "Last";
            legalName.isCurrentLegalName = true;

            const legalNameToBeDiscarded = new LegalName();
            legalNameToBeDiscarded.firstName = "Old first";
            legalNameToBeDiscarded.lastName = "Old last";
            legalNameToBeDiscarded.isCurrentLegalName = false;


            mockLegalNameDao.getAllLegalNamesWithUserId.mockImplementation(() => {return Promise.resolve([legalNameToBeDiscarded, legalName]);});

            const expected = new UserInfo();
            expected.id = USER_ID;
            expected.username = USER_NAME;
            expected.primaryEmail = USER_EMAIL;
            expected.userType = UserType.DONOR;
            expected.firstName = "First";
            expected.lastName = "Last";
            expected.hasVerifiedEmail = true;

            // Call under test
            expect(await authenticationService.getUserInfo("username")).toEqual(expected);
        });

        describe("validation checks", () => {
            test("No username", async () => {
                await expect(authenticationService.getUserInfo(null)).rejects.toThrowError(IllegalArgumentError);
            });
        });
    });

    describe("accountCanBeCreatedWithEmail tests", () => {
       test("Validation: no email", async () => {
           await expect(authenticationService.accountCanBeCreatedWithEmail(null)).rejects.toThrowError(IllegalArgumentError);
       });
       test("Happy path", async () => {
          mockEmailDao.emailExists.mockImplementation(() => Promise.resolve(true));
          expect(await authenticationService.accountCanBeCreatedWithEmail("emailaddr")).toBe(false);
       });
    });

    describe("resetPassword tests", () => {
        afterEach(() => {
            jest.clearAllMocks();
        })

        test("The reset password code has not expired", async () => {
            const oldPass = "oldPassword";
            const newPass = "myNewPassword123";
            const hashedNewPass = await bcrypt.hash(newPass, 10);
            const code = uuidv4() + uuidv4();

            const forgotPassResetToken = new ForgotPasswordResetTokenDBO();
            forgotPassResetToken.userId = USER_ID;
            forgotPassResetToken.secret = code;
            const today = new Date();
            forgotPassResetToken.expirationDate = new Date((today.getTime() + FIVE_MINUTES_IN_MILLIS));

            const user = new AuthenticationInformationDBO();
            user.id = USER_ID;
            user.username = "myusername123";
            user.isDonor = false;
            user.password = await bcrypt.hash(oldPass, 10);

            mockForgotPassDao.getForgotPasswordResetTokenByCode.mockImplementation((code: string): Promise<ForgotPasswordResetTokenDBO> => {
                return Promise.resolve(forgotPassResetToken);
            })

            mockForgotPassDao.deleteForgotPasswordResetTokenByCode.mockImplementation((code: string): Promise<void> => {
                return;
            })

            mockAuthNDao.getUserById.mockImplementation((userId: number): Promise<AuthenticationInformationDBO> => {
                return Promise.resolve(user);
            })

            mockAuthNDao.updateUser.mockImplementation((user: AuthenticationInformationDBO): Promise<AuthenticationInformationDBO> => {
                user.password = hashedNewPass;
                return Promise.resolve(user);
            })

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
            const code = uuidv4() + uuidv4();
            const newPass = "myNewPassword123";

            const forgotPassResetToken = new ForgotPasswordResetTokenDBO();
            forgotPassResetToken.userId = USER_ID;
            forgotPassResetToken.secret = code;
            const today = new Date();
            forgotPassResetToken.expirationDate = new Date((today.getTime() - FIVE_MINUTES_IN_MILLIS));

            mockForgotPassDao.getForgotPasswordResetTokenByCode.mockImplementation((code: string): Promise<ForgotPasswordResetTokenDBO> => {
                return Promise.resolve(forgotPassResetToken);
            })

            // call under test
            await expect(authenticationService.resetPassword(newPass, code)).rejects.toThrowError(UnauthorizedError);

            expect(mockForgotPassDao.getForgotPasswordResetTokenByCode).toBeCalledTimes(1);
            expect(mockForgotPassDao.getForgotPasswordResetTokenByCode).toBeCalledWith(code);

            expect(mockAuthNDao.getUserById).not.toBeCalled();
            expect(mockAuthNDao.updateUser).not.toBeCalled();
            expect(mockForgotPassDao.deleteForgotPasswordResetTokenByCode).not.toBeCalled();
        });
    });
});