import { AuthenticationInformationDAO } from "../authentication/AuthenticationInformationDAO";
import { EmailDAO } from "./EmailDAO";
import DatabaseConnection from "../../DatabaseConnection";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { EmailRecordDBO } from "../../../models/orm/EmailRecordDBO";
import {DBOAuthenticationInformationDAOImpl} from "../authentication/DBOAuthenticationInformationDAOImpl";
import {DBOEmailRecordDAOImpl} from "./DBOEmailRecordDAOImpl";
import { DaoTestUtils } from "../../../testUtils/DaoTestUtils";

let authDao: AuthenticationInformationDAO;
let emailDao: EmailDAO;
let daoTestUtils: DaoTestUtils;

let user: AuthenticationInformationDBO;

beforeAll(async () => {
    await DatabaseConnection.initializeDatabaseConnection();
    daoTestUtils = new DaoTestUtils();
    authDao = new DBOAuthenticationInformationDAOImpl();
    emailDao = new DBOEmailRecordDAOImpl();
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
        } as EmailRecordDBO);

        // Email should exist
        expect(await emailDao.emailExists(email)).toBe(true);

        // Delete
        await emailDao.deleteEmailRecord(email);

        // Email should not exist anymore
        expect(await emailDao.emailExists(email)).toBe(false);
    });
});
