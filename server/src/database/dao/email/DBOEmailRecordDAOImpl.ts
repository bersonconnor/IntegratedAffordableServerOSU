import {Connection, getConnection} from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import {EmailRecordDBO} from "../../../models/orm/EmailRecordDBO";
import {EmailDAO} from "./EmailDAO";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { Validation } from "../../../utils/Validation";


export class DBOEmailRecordDAOImpl implements EmailDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    async getPrimaryEmail(username: string): Promise<EmailRecordDBO> {
        const result = await this.connection.manager
            .getRepository(EmailRecordDBO)
            .createQueryBuilder("email")
            .innerJoinAndSelect(AuthenticationInformationDBO, "user", "email.userId = user.id")
            .where("user.username = :username", {username: username})
            .getOne();
        if (result == null) throw new NotFoundError(`Primary email record for ${username} not found`);
        return result;
    }

    async getAllEmails(username: string): Promise<Array<EmailRecordDBO>> {
        return await this.connection.manager
                .getRepository(EmailRecordDBO)
                .createQueryBuilder("email")
                .innerJoinAndSelect(AuthenticationInformationDBO, "user", "email.userId = user.id")
                .where("user.username = :username", {username: username})
                .getMany();
    }


    public emailExists = async (email: string): Promise<boolean> => {
        const result = await this.connection.manager
        .getRepository(EmailRecordDBO)
        .createQueryBuilder("email")
        .where("email= :email", {email: email})
        .getMany();
        return result.length > 0;
    }

    public getUserIdByEmail = async (email: string): Promise<number> => {
        const emailTable = await this.connection.manager
            .getRepository(EmailRecordDBO)
            .createQueryBuilder("email")
            .where("email= :email", { email: email })
            .getOne();
        const userId = emailTable.userId;
        return userId;
    }

    public getEmailRecordBySecret = async (secret: string): Promise<EmailRecordDBO> => {
        const result = await this.connection.manager
        .getRepository(EmailRecordDBO)
        .createQueryBuilder("email")
        .where("verificationCode= :secret", {secret: secret})
        .getOne();
        if (result === undefined) {
            throw new NotFoundError("Email for user with secret=" + secret + " not found");
        }
        return result;
    }

    public getVerificationById = async (userId: number): Promise<boolean> => {
        const result = await this.connection.manager
        .getRepository(EmailRecordDBO)
        .createQueryBuilder("verified")
        .where("userId= :userId", {userId: userId})
        .getOne();
        return result.verified;
    }

    public updateVerification = async (record: string): Promise<void> => {
        await this.connection.manager
        .createQueryBuilder()
        .update(EmailRecordDBO)
        .set({verified: true})
        .where("email = :email", {email: record})
        .execute();
    }

    /**
     * Creates an email record in AFFORDABLE
     * @param record
     */

    public createEmailRecord = async (record: EmailRecordDBO): Promise<EmailRecordDBO> => {
        const result = await this.connection.manager
                .getRepository(EmailRecordDBO)
                .save(record);
        console.log("Email record created: " + result);
        return result as EmailRecordDBO;
    }

    /**
     * Deletes an email address record in AFFORDABLE
     * @param email
     */
    async deleteEmailRecord(email: string): Promise<void> {
        await this.connection.manager
                .getRepository(EmailRecordDBO)
                .createQueryBuilder()
                .delete()
                .from(EmailRecordDBO)
                .where("email = :email", {email: email})
                .execute();
        console.log("Email record deleted: " + email);
    }
}