"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOEmailRecordDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const EmailRecordDBO_1 = require("../../../models/orm/EmailRecordDBO");
const AuthenticationInformationDBO_1 = require("../../../models/orm/AuthenticationInformationDBO");
class DBOEmailRecordDAOImpl {
    constructor() {
        this.emailExists = async (email) => {
            const result = await this.connection.manager
                .getRepository(EmailRecordDBO_1.EmailRecordDBO)
                .createQueryBuilder("email")
                .where("email= :email", { email: email })
                .getMany();
            return result.length > 0;
        };
        this.getUserIdByEmail = async (email) => {
            const emailTable = await this.connection.manager
                .getRepository(EmailRecordDBO_1.EmailRecordDBO)
                .createQueryBuilder("email")
                .where("email= :email", { email: email })
                .getOne();
            const userId = emailTable.userId;
            return userId;
        };
        this.getEmailRecordBySecret = async (secret) => {
            const result = await this.connection.manager
                .getRepository(EmailRecordDBO_1.EmailRecordDBO)
                .createQueryBuilder("email")
                .where("verificationCode= :secret", { secret: secret })
                .getOne();
            if (result === undefined) {
                throw new NotFoundError_1.NotFoundError("Email for user with secret=" + secret + " not found");
            }
            return result;
        };
        this.getVerificationById = async (userId) => {
            const result = await this.connection.manager
                .getRepository(EmailRecordDBO_1.EmailRecordDBO)
                .createQueryBuilder("verified")
                .where("userId= :userId", { userId: userId })
                .getOne();
            return result.verified;
        };
        this.updateVerification = async (record) => {
            await this.connection.manager
                .createQueryBuilder()
                .update(EmailRecordDBO_1.EmailRecordDBO)
                .set({ verified: true })
                .where("email = :email", { email: record })
                .execute();
        };
        /**
         * Creates an email record in AFFORDABLE
         * @param record
         */
        this.createEmailRecord = async (record) => {
            const result = await this.connection.manager
                .getRepository(EmailRecordDBO_1.EmailRecordDBO)
                .save(record);
            console.log("Email record created: " + result);
            return result;
        };
        this.connection = typeorm_1.getConnection();
    }
    async getPrimaryEmail(username) {
        const result = await this.connection.manager
            .getRepository(EmailRecordDBO_1.EmailRecordDBO)
            .createQueryBuilder("email")
            .innerJoinAndSelect(AuthenticationInformationDBO_1.AuthenticationInformationDBO, "user", "email.userId = user.id")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result == null)
            throw new NotFoundError_1.NotFoundError(`Primary email record for ${username} not found`);
        return result;
    }
    async getAllEmails(username) {
        return await this.connection.manager
            .getRepository(EmailRecordDBO_1.EmailRecordDBO)
            .createQueryBuilder("email")
            .innerJoinAndSelect(AuthenticationInformationDBO_1.AuthenticationInformationDBO, "user", "email.userId = user.id")
            .where("user.username = :username", { username: username })
            .getMany();
    }
    /**
     * Deletes an email address record in AFFORDABLE
     * @param email
     */
    async deleteEmailRecord(email) {
        await this.connection.manager
            .getRepository(EmailRecordDBO_1.EmailRecordDBO)
            .createQueryBuilder()
            .delete()
            .from(EmailRecordDBO_1.EmailRecordDBO)
            .where("email = :email", { email: email })
            .execute();
        console.log("Email record deleted: " + email);
    }
}
exports.DBOEmailRecordDAOImpl = DBOEmailRecordDAOImpl;
