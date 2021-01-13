"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordResetTokenDAO = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../models/NotFoundError");
const ForgotPasswordResetTokenDBO_1 = require("../../models/orm/ForgotPasswordResetTokenDBO");
class ForgotPasswordResetTokenDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Adds a forgot password object based on a user's id
     * @param fpo
     */
    async addForgotPasswordResetToken(fprt) {
        console.log("Adding forgot password reset token: ");
        console.log(fprt);
        return await this.connection.getRepository(ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO).save(fprt);
    }
    /**
     * Get a forgot password reset token given the secret code
     * @param code
     * @throws NotFoundError if no forgot password object is found
     */
    async getForgotPasswordResetTokenByCode(code) {
        const result = await this.connection.manager
            .getRepository(ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO)
            .createQueryBuilder("ForgotPasswordResetToken")
            .where("ForgotPasswordResetToken.secret = :code", { code: code })
            .getMany();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("There were no forgot password reset tokens with the following code:" + code);
        }
        else if (result.length == 0) {
            throw new NotFoundError_1.NotFoundError("There were no forgot password reset tokens with the following code:" + code);
        }
        else if (result.length >= 2) { // 1 in a trillion, the same secret code was generated 2 times
            // deleting those forgot password objects
            this.deleteForgotPasswordResetTokenByCode(code);
            throw new NotFoundError_1.NotFoundError("There were now forgot password reset tokens with the following code:" + code);
        }
        return result.pop();
    }
    /**
     * Deletes all (should only be one) forgot password reset tokens from the database given their secret code
     * @param id
     */
    async deleteForgotPasswordResetTokenByCode(code) {
        await this.connection.manager
            .getRepository(ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO)
            .createQueryBuilder("ForgotPasswordResetToken")
            .delete()
            .from(ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO)
            .where("ForgotPasswordResetToken.secret = :code", { code: code })
            .execute();
        console.log("Forgot Password Reset Token with code: " + code + " was added to the database");
    }
}
exports.ForgotPasswordResetTokenDAO = ForgotPasswordResetTokenDAO;
