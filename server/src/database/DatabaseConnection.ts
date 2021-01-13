import { config } from "dotenv";

config();
import { createConnection, Connection, PrimaryColumn, Column, getConnection } from "typeorm";
import { createPool, Pool } from "mysql";
import { AuthenticationInformationDBO } from "../models/orm/AuthenticationInformationDBO";
import { OrganizationDBO } from "../models/orm/OrganizationDBO";
import { EmailRecordDBO } from "../models/orm/EmailRecordDBO";
import { ForgotPasswordResetTokenDBO } from "../models/orm/ForgotPasswordResetTokenDBO";
import { DonationRecord } from "../models/orm/DonationRecord";
import { EligibilityCriteriaDBO } from "../models/orm/grant/EligibilityCriteriaDBO";
import { OrganizationMembershipDBO } from "../models/orm/OrganizationMembershipDBO";
import { Donor } from "../models/orm/Donor";
// Additional Profile Info related table objects
import { LegalName } from "../models/orm/profile/LegalName";
import { Address } from "../models/orm/profile/Address";
import { Finances } from "../models/orm/profile/Finances";
import { Healthcare } from "../models/orm/profile/Healthcare";
import { IdentificationInformation } from "../models/orm/profile/IdentificationInformation";
import { InformationProvider } from "../models/orm/profile/InformationProvider";
import { Insurance } from "../models/orm/profile/Insurance";
import { MarriageInformation } from "../models/orm/profile/MarriageInformation";
import { PhoneNumber } from "../models/orm/profile/PhoneNumber";
import { SexAndEthnicity } from "../models/orm/profile/SexAndEthnicity";
import { hashSync } from "bcrypt";
import { ApplicationInformationDBO } from "../models/orm/grant/ApplicationInformationDBO";
import { RecipientDBO } from "../models/orm/RecipientDBO";
import { GrantDBO } from "../models/orm/grant/GrantDBO";
import { TwoFactorDBO } from "../models/orm/TwoFactorDBO";
import { AdminPrivilegesDBO } from "../models/orm/profile/AdminPrivilegesDBO";
import { DBOAuthenticationInformationDAOImpl } from "./dao/authentication/DBOAuthenticationInformationDAOImpl";
import { AuditTrailDBO } from "../models/orm/AuditTrailDBO";

//Set up shared connection pool for database
class DatabaseConnection {

    // Do not permit instantiation
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    public static async initializeDatabaseConnection(): Promise<Connection> {
        const connection = await createConnection({
            name: "default",
            type: "mysql",
            host: process.env.AFFORDABLE_DB_HOST,
            username: process.env.AFFORDABLE_DB_USER,
            password: process.env.AFFORDABLE_DB_PASSWORD,
            database: process.env.AFFORDABLE_DB_NAME,
            entities: [
                AdminPrivilegesDBO,
                AuthenticationInformationDBO,
                OrganizationDBO,
                RecipientDBO,
                EligibilityCriteriaDBO,
                GrantDBO,
                ApplicationInformationDBO,
                EmailRecordDBO,
                ForgotPasswordResetTokenDBO,
                DonationRecord,
                OrganizationMembershipDBO,
                Donor,
                LegalName,
                Address,
                Finances,
                Healthcare,
                IdentificationInformation,
                InformationProvider,
                Insurance,
                MarriageInformation,
                PhoneNumber,
                SexAndEthnicity,
                TwoFactorDBO,
                AuditTrailDBO
            ],
            synchronize: false,
            logging: true
        });

        await DatabaseConnection.createAdminUser(connection);
        return connection;
    }

    public static async createAdminUser(connection: Connection): Promise<void> {
        console.log("Creating Admin User with ID: " + Number(process.env.AFFORDABLE_ADMIN_ID))
        const adminPassword = hashSync(process.env.AFFORDABLE_ADMIN_PASSWORD, 10);
        const authDao = new DBOAuthenticationInformationDAOImpl();

        //authDao.createUser()
        let admin: AuthenticationInformationDBO = await connection.getRepository(AuthenticationInformationDBO)
            .save({
                id: Number(process.env.AFFORDABLE_ADMIN_ID),
                username: process.env.AFFORDABLE_ADMIN_USER,
                password: adminPassword,
                email: process.env.AFFORDABLE_ADMIN_EMAIL,
                isAdmin: true,
            });
        await connection.getRepository(EmailRecordDBO)
            .save({
                userId: Number(process.env.AFFORDABLE_ADMIN_ID),
                email: process.env.AFFORDABLE_ADMIN_EMAIL,
                isPrimary: true,
                verified: true
            });
        let privs: AdminPrivilegesDBO = {
            active: true,
            userid: admin.id,
            allowRejectAdminRegistration: true,
            revokeAdminAccess: true,
            setPrivileges: true,
            resetAuthInfoAdmin: true,
            resetAuthInfoNonAdmin: true,
            managePaymentTransactions: true,
            messageUserEmailUser: true,
            verifyOrgStatus: true,
            deactivateUsers: true,
            createRemoveHugs: true,
            createRemoveOrgs: true,
            editApplications: true,
            readAuditTrail: true
        };
        await connection.getRepository(AdminPrivilegesDBO).save(privs);
    }

    private static instance = createPool({
        connectionLimit: 10,
        host: process.env.AFFORDABLE_DB_HOST,
        user: process.env.AFFORDABLE_DB_USER,
        password: process.env.AFFORDABLE_DB_PASSWORD,
        database: process.env.AFFORDABLE_DB_NAME,
        insecureAuth: true,
        multipleStatements: true
    });

    public static getInstance = (): Pool => DatabaseConnection.instance;

    static getConnectionStatus(): boolean {
        let conn: Connection = getConnection();
        return conn.isConnected;
    }
}

export default DatabaseConnection;