import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../models/NotFoundError";
import { ForgotPasswordResetTokenDBO } from "../../models/orm/ForgotPasswordResetTokenDBO";
import { Validation } from "../../utils/Validation";


export class ForgotPasswordResetTokenDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds a forgot password object based on a user's id
     * @param fpo
     */
    public async addForgotPasswordResetToken(fprt: ForgotPasswordResetTokenDBO): Promise<ForgotPasswordResetTokenDBO> {
        console.log("Adding forgot password reset token: ");
        console.log(fprt);
        return await this.connection.getRepository(ForgotPasswordResetTokenDBO).save(fprt);
    }

    /**
     * Get a forgot password reset token given the secret code
     * @param code
     * @throws NotFoundError if no forgot password object is found
     */
    public async getForgotPasswordResetTokenByCode(code: string): Promise<ForgotPasswordResetTokenDBO> {
        const result = await this.connection.manager
            .getRepository(ForgotPasswordResetTokenDBO)
            .createQueryBuilder("ForgotPasswordResetToken")
            .where("ForgotPasswordResetToken.secret = :code", { code: code })
            .getMany();
        if (result === undefined) {
            throw new NotFoundError("There were no forgot password reset tokens with the following code:" + code);
        } else if (result.length == 0) {
            throw new NotFoundError("There were no forgot password reset tokens with the following code:" + code);
        } else if (result.length >= 2) { // 1 in a trillion, the same secret code was generated 2 times
            // deleting those forgot password objects
            this.deleteForgotPasswordResetTokenByCode(code);
            throw new NotFoundError("There were now forgot password reset tokens with the following code:" + code);
        }
        return <ForgotPasswordResetTokenDBO>result.pop();
    }

    /**
     * Deletes all (should only be one) forgot password reset tokens from the database given their secret code
     * @param id 
     */
    public async deleteForgotPasswordResetTokenByCode(code: string): Promise<void> {
        await this.connection.manager
            .getRepository(ForgotPasswordResetTokenDBO)
            .createQueryBuilder("ForgotPasswordResetToken")
            .delete()
            .from(ForgotPasswordResetTokenDBO)
            .where("ForgotPasswordResetToken.secret = :code", { code: code })
            .execute();
        console.log("Forgot Password Reset Token with code: " + code + " was added to the database");
    }
}