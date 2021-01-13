"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("../DatabaseConnection"));
const NotFoundError_1 = require("../../models/NotFoundError");
const DaoTestUtils_1 = require("../../testUtils/DaoTestUtils");
const ForgotPasswordResetTokenDAO_1 = require("./ForgotPasswordResetTokenDAO");
const ForgotPasswordResetTokenDBO_1 = require("../../models/orm/ForgotPasswordResetTokenDBO");
const v4_1 = __importDefault(require("uuid/v4"));
let forgotPasswordResetTokenDAO;
let daoTestUtil;
let user;
let forgotPasswordResetToken;
let code;
describe("ForgotPasswordResetTokenDAO CRUD", () => {
    beforeAll(async () => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        daoTestUtil = new DaoTestUtils_1.DaoTestUtils();
        forgotPasswordResetTokenDAO = new ForgotPasswordResetTokenDAO_1.ForgotPasswordResetTokenDAO();
        user = await daoTestUtil.createUser();
        forgotPasswordResetToken = new ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO();
        forgotPasswordResetToken.userId = user.id;
        forgotPasswordResetToken.expirationDate = new Date();
        code = v4_1.default() + v4_1.default();
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
        await expect(forgotPasswordResetTokenDAO.getForgotPasswordResetTokenByCode(code)).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
});
