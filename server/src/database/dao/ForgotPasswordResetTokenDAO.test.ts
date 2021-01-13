import DatabaseConnection from "../DatabaseConnection";
import { AuthenticationInformationDBO } from "../../models/orm/AuthenticationInformationDBO";
import { NotFoundError } from "../../models/NotFoundError";
import { DaoTestUtils } from "../../testUtils/DaoTestUtils";
import { ForgotPasswordResetTokenDAO } from "./ForgotPasswordResetTokenDAO";
import { ForgotPasswordResetTokenDBO } from "../../models/orm/ForgotPasswordResetTokenDBO";
import uuidv4 from "uuid/v4";

let forgotPasswordResetTokenDAO: ForgotPasswordResetTokenDAO;
let daoTestUtil: DaoTestUtils;

let user: AuthenticationInformationDBO;
let forgotPasswordResetToken: ForgotPasswordResetTokenDBO;

let code: string;

describe("ForgotPasswordResetTokenDAO CRUD", () => {

    beforeAll(async () => {
        await DatabaseConnection.initializeDatabaseConnection();
        daoTestUtil = new DaoTestUtils();
        forgotPasswordResetTokenDAO = new ForgotPasswordResetTokenDAO();
        user = await daoTestUtil.createUser();
        
        forgotPasswordResetToken = new ForgotPasswordResetTokenDBO();
        forgotPasswordResetToken.userId = user.id;
        forgotPasswordResetToken.expirationDate = new Date();
        code = uuidv4() + uuidv4();
        forgotPasswordResetToken.secret = code;
    });

    

    test("Create/get/delete", async () => {

        // Create
        await forgotPasswordResetTokenDAO.addForgotPasswordResetToken(forgotPasswordResetToken);
        
        // Get
        const receivedObj = await forgotPasswordResetTokenDAO.getForgotPasswordResetTokenByCode(code);

        // receivedObj should be the same as the forgotPassObj
        expect(receivedObj.userId == forgotPasswordResetToken.userId);
        expect(receivedObj.expirationDate == forgotPasswordResetToken.expirationDate);
        expect(receivedObj.secret == forgotPasswordResetToken.secret);

        // Delete
        await forgotPasswordResetTokenDAO.deleteForgotPasswordResetTokenByCode(code);

        // This forgot password object should no longer exist int he DB
        await expect(forgotPasswordResetTokenDAO.getForgotPasswordResetTokenByCode(code)).rejects.toThrowError(NotFoundError);
    });
});
