"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const DBOAuthenticationInformationDAOImpl_1 = require("../authentication/DBOAuthenticationInformationDAOImpl");
const DBOEmailRecordDAOImpl_1 = require("./DBOEmailRecordDAOImpl");
const DaoTestUtils_1 = require("../../../testUtils/DaoTestUtils");
let authDao;
let emailDao;
let daoTestUtils;
let user;
beforeAll(async () => {
    await DatabaseConnection_1.default.initializeDatabaseConnection();
    daoTestUtils = new DaoTestUtils_1.DaoTestUtils();
    authDao = new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
    emailDao = new DBOEmailRecordDAOImpl_1.DBOEmailRecordDAOImpl();
    user = await daoTestUtils.createUser();
});
afterAll(async () => {
    await authDao.deleteUserById(user.id);
});
describe("DBOEmailDAOImpl CRUD", () => {
    test("Create/get/delete", async () => {
        // Email should not exist before adding it
        const email = "myEmail@affordhealth.org";
        expect(await emailDao.emailExists(email)).toBe(false);
        // Create
        await emailDao.createEmailRecord({
            userId: user.id,
            email: email,
            isPrimary: true,
            verified: true
        });
        // Email should exist
        expect(await emailDao.emailExists(email)).toBe(true);
        // Delete
        await emailDao.deleteEmailRecord(email);
        // Email should not exist anymore
        expect(await emailDao.emailExists(email)).toBe(false);
    });
});
