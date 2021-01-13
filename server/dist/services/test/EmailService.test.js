"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../EmailService");
const ServiceIntegrationTestUtils_1 = require("../../testUtils/ServiceIntegrationTestUtils");
const DBOEmailRecordDAOImpl_1 = require("../../database/dao/email/DBOEmailRecordDAOImpl");
const DatabaseConnection_1 = __importDefault(require("../../database/DatabaseConnection"));
const v4_1 = __importDefault(require("uuid/v4"));
const DBOAuthenticationInformationDAOImpl_1 = require("../../database/dao/authentication/DBOAuthenticationInformationDAOImpl");
let emailService;
let svcTestUtil;
let emailDao;
let authDao;
let user;
describe("EmailService Tests", () => {
    beforeAll(async (done) => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        svcTestUtil = new ServiceIntegrationTestUtils_1.ServiceIntegrationTestUtils();
        emailDao = new DBOEmailRecordDAOImpl_1.DBOEmailRecordDAOImpl();
        emailService = new EmailService_1.EmailService();
        authDao = new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        const userInfo = svcTestUtil.createUserAuthInfo();
        user = await authDao.createUser(userInfo);
        done();
    });
    afterAll(async (done) => {
        await authDao.deleteUserById(user.id);
        done();
    });
    test("Update Email", async () => {
        const newEmail = "myNewEmail@affordhealth.org";
        let newUser = await svcTestUtil.createUser(false);
        newUser.username = "usertest";
        await emailDao.createEmailRecord({
            userId: user.id,
            email: newUser.primaryEmail,
            isPrimary: true,
            verified: true,
            verificationCode: v4_1.default()
        });
        expect(await emailDao.emailExists(newUser.primaryEmail)).toBe(true);
        expect(await emailDao.emailExists(newEmail)).toBe(false);
        await emailService.updateEmail(newUser, newEmail);
        expect(await emailDao.emailExists(newEmail)).toBe(true);
        expect(await emailDao.emailExists(newUser.primaryEmail)).toBe(false);
    });
});
