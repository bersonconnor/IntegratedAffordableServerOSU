import { mock } from "jest-mock-extended";
import { EmailDAO } from "../../database/dao/email/EmailDAO";
import { AuthenticationInformationDAO } from "../../database/dao/authentication/AuthenticationInformationDAO";
import { AffordableEmailClient } from "../email/AffordableEmailClient";
import { ForgotPasswordResetTokenDAO } from "../../database/dao/ForgotPasswordResetTokenDAO";
import { EmailService } from "../EmailService";
import { ForgotPasswordResetTokenDBO } from "../../models/orm/ForgotPasswordResetTokenDBO";
import { AuthenticationInformationDBO } from "../../models/orm/AuthenticationInformationDBO";


const TWENTY_FOUR_HRS_IN_MILLIS = 1000 * 60 * 60 * 24;
const FIVE_MINUTES_IN_MILLIS = 1000 * 60 * 5;

const mockEmailDao = mock<EmailDAO>();
const mockEmailClient = mock<AffordableEmailClient>();
const mockAuthenticationInfoDao = mock<AuthenticationInformationDAO>();
const mockForgotPasswordDao = mock<ForgotPasswordResetTokenDAO>();

let emailService: EmailService;

describe("EmailService unit tests", () => {

    beforeAll(() => {
        emailService = new EmailService(
            mockEmailDao,
            mockEmailClient,
            mockAuthenticationInfoDao,
            mockForgotPasswordDao);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("sendResetPasswordEmail tests", () => {
        test("Email exists in Affordable", async () => {
            const userId = 2424;
            const username = "some username";
            mockEmailDao.emailExists.mockImplementation(() => {
                return Promise.resolve(true);
            })

            mockEmailDao.getUserIdByEmail.mockImplementation(() => {
                return Promise.resolve(userId);
            })

            mockForgotPasswordDao.addForgotPasswordResetToken.mockImplementation(
                (fpo: ForgotPasswordResetTokenDBO): Promise<ForgotPasswordResetTokenDBO> => {
                    expect(fpo.userId).toEqual(userId);
                    expect(fpo.secret).toBeDefined();
                    expect(fpo.secret.length).toEqual(36 + 36); // two concatenated UUIDs
                    const time1 = (new Date()).getTime() + TWENTY_FOUR_HRS_IN_MILLIS - FIVE_MINUTES_IN_MILLIS;
                    const time2 = (new Date()).getTime() + TWENTY_FOUR_HRS_IN_MILLIS + FIVE_MINUTES_IN_MILLIS;
                    expect(fpo.expirationDate.getTime()).toBeGreaterThanOrEqual(time1);
                    expect(fpo.expirationDate.getTime()).toBeLessThanOrEqual(time2);
                    return Promise.resolve(fpo);
            });

            mockAuthenticationInfoDao.getUserById.mockImplementation(() => {
                const dbo = new AuthenticationInformationDBO();
                dbo.username = username;
                return Promise.resolve(dbo);
            });


            const emailAddress = "testEmail@web.com";

            // Call under test
            await emailService.sendResetPasswordEmail(emailAddress);

            expect(mockEmailDao.emailExists).toBeCalledTimes(1);
            expect(mockEmailDao.emailExists).toBeCalledWith(emailAddress);

            expect(mockEmailDao.getUserIdByEmail).toBeCalledTimes(1);
            expect(mockEmailDao.getUserIdByEmail).toBeCalledWith(emailAddress);

            expect(mockForgotPasswordDao.addForgotPasswordResetToken).toBeCalledTimes(1);
            
            expect(mockAuthenticationInfoDao.getUserById).toBeCalledTimes(1);
            expect(mockAuthenticationInfoDao.getUserById).toBeCalledWith(userId);

            expect(mockEmailClient.sendEmail).toBeCalledTimes(1);
            expect(mockEmailClient.sendEmail).toBeCalledWith(
                expect.objectContaining({
                    to: emailAddress
                }));
        });

        test("Email doesn't exist in Affordable", async () => {
            mockEmailDao.emailExists.mockImplementation(() => {
                return Promise.resolve(false);
            })

            const emailAddress = "testEmail@web.com";

            // Call under test
            await emailService.sendResetPasswordEmail(emailAddress);

            expect(mockEmailDao.emailExists).toBeCalledTimes(1);
            expect(mockEmailDao.emailExists).toBeCalledWith(emailAddress);

            expect(mockEmailDao.getUserIdByEmail).not.toBeCalled();
            expect(mockForgotPasswordDao.addForgotPasswordResetToken).not.toBeCalled();
            expect(mockAuthenticationInfoDao.getUserById).not.toBeCalled();
            expect(mockEmailClient.sendEmail).not.toBeCalled();        
        });
    });
});
