import { EmailService } from "../EmailService";
import { ServiceIntegrationTestUtils } from "../../testUtils/ServiceIntegrationTestUtils";
import { DBOEmailRecordDAOImpl } from "../../database/dao/email/DBOEmailRecordDAOImpl";
import DatabaseConnection from "../../database/DatabaseConnection";
import { EmailRecordDBO } from "../../models/orm/EmailRecordDBO";
import uuidv4 from "uuid/v4";
import { UserInfo } from "affordable-shared-models";
import { AuthenticationInformationDBO } from "../../models/orm/AuthenticationInformationDBO";
import { DBOAuthenticationInformationDAOImpl } from "../../database/dao/authentication/DBOAuthenticationInformationDAOImpl";



let emailService: EmailService;
let svcTestUtil: ServiceIntegrationTestUtils;
let emailDao: DBOEmailRecordDAOImpl;
let authDao: DBOAuthenticationInformationDAOImpl;
let user: AuthenticationInformationDBO;



describe("EmailService Tests", () => {
    
    beforeAll( async (done) => {
        await DatabaseConnection.initializeDatabaseConnection();

        svcTestUtil = new ServiceIntegrationTestUtils();
        emailDao = new DBOEmailRecordDAOImpl();
        emailService = new EmailService();
        authDao = new DBOAuthenticationInformationDAOImpl();
        const userInfo = svcTestUtil.createUserAuthInfo();
        user = await authDao.createUser(userInfo);
        done();
    });

    afterAll(async (done) => {
        await authDao.deleteUserById(user.id);
        done()
    });

    test("Update Email", async () => {
        const newEmail = "myNewEmail@affordhealth.org";
        let newUser = await svcTestUtil.createUser(false);
        newUser.username = "usertest";

        
        await emailDao.createEmailRecord(<EmailRecordDBO>{
            userId: user.id,
            email: newUser.primaryEmail,
            isPrimary: true,
            verified: true,
            verificationCode: uuidv4()
        });
        expect(await emailDao.emailExists(newUser.primaryEmail)).toBe(true);
        expect(await emailDao.emailExists(newEmail)).toBe(false);
        await emailService.updateEmail(newUser, newEmail);
        expect(await emailDao.emailExists(newEmail)).toBe(true);
        expect(await emailDao.emailExists(newUser.primaryEmail)).toBe(false);
    });
});