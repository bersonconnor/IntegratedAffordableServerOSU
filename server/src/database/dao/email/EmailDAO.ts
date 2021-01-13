import {EmailRecordDBO} from "../../../models/orm/EmailRecordDBO";

export interface EmailDAO {
    getPrimaryEmail(username: string): Promise<EmailRecordDBO>;

    getAllEmails(username: string): Promise<Array<EmailRecordDBO>>;

    emailExists(email: string): Promise<boolean>;

    getUserIdByEmail(email: string): Promise<number>;

    updateVerification(record: string): Promise<void>;
    /**
     * Creates an email record in AFFORDABLE
     * @param record
     */
    createEmailRecord(record: EmailRecordDBO): Promise<EmailRecordDBO>;

    /**
     * Deletes an email address record in AFFORDABLE
     * @param email
     */
    deleteEmailRecord(email: string): Promise<void>;

    /**
     * Get whether a user has a verified email address
     */
    getVerificationById(userId: number): Promise<boolean>;

    /**
     * Retrieve an email record from the database based on the secret token provided
     */
    getEmailRecordBySecret(secret: string): Promise<EmailRecordDBO>;

}