"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const typeorm_1 = require("typeorm");
const mysql_1 = require("mysql");
const AuthenticationInformationDBO_1 = require("../models/orm/AuthenticationInformationDBO");
const OrganizationDBO_1 = require("../models/orm/OrganizationDBO");
const EmailRecordDBO_1 = require("../models/orm/EmailRecordDBO");
const ForgotPasswordResetTokenDBO_1 = require("../models/orm/ForgotPasswordResetTokenDBO");
const DonationRecord_1 = require("../models/orm/DonationRecord");
const EligibilityCriteriaDBO_1 = require("../models/orm/grant/EligibilityCriteriaDBO");
const OrganizationMembershipDBO_1 = require("../models/orm/OrganizationMembershipDBO");
const Donor_1 = require("../models/orm/Donor");
// Additional Profile Info related table objects
const LegalName_1 = require("../models/orm/profile/LegalName");
const Address_1 = require("../models/orm/profile/Address");
const Finances_1 = require("../models/orm/profile/Finances");
const Healthcare_1 = require("../models/orm/profile/Healthcare");
const IdentificationInformation_1 = require("../models/orm/profile/IdentificationInformation");
const InformationProvider_1 = require("../models/orm/profile/InformationProvider");
const Insurance_1 = require("../models/orm/profile/Insurance");
const MarriageInformation_1 = require("../models/orm/profile/MarriageInformation");
const PhoneNumber_1 = require("../models/orm/profile/PhoneNumber");
const SexAndEthnicity_1 = require("../models/orm/profile/SexAndEthnicity");
const bcrypt_1 = require("bcrypt");
const ApplicationInformationDBO_1 = require("../models/orm/grant/ApplicationInformationDBO");
const RecipientDBO_1 = require("../models/orm/RecipientDBO");
const GrantDBO_1 = require("../models/orm/grant/GrantDBO");
const TwoFactorDBO_1 = require("../models/orm/TwoFactorDBO");
const AdminPrivilegesDBO_1 = require("../models/orm/profile/AdminPrivilegesDBO");
const DBOAuthenticationInformationDAOImpl_1 = require("./dao/authentication/DBOAuthenticationInformationDAOImpl");
const AuditTrailDBO_1 = require("../models/orm/AuditTrailDBO");
//Set up shared connection pool for database
class DatabaseConnection {
    // Do not permit instantiation
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }
    static async initializeDatabaseConnection() {
        const connection = await typeorm_1.createConnection({
            name: "default",
            type: "mysql",
            host: process.env.AFFORDABLE_DB_HOST,
            username: process.env.AFFORDABLE_DB_USER,
            password: process.env.AFFORDABLE_DB_PASSWORD,
            database: process.env.AFFORDABLE_DB_NAME,
            entities: [
                AdminPrivilegesDBO_1.AdminPrivilegesDBO,
                AuthenticationInformationDBO_1.AuthenticationInformationDBO,
                OrganizationDBO_1.OrganizationDBO,
                RecipientDBO_1.RecipientDBO,
                EligibilityCriteriaDBO_1.EligibilityCriteriaDBO,
                GrantDBO_1.GrantDBO,
                ApplicationInformationDBO_1.ApplicationInformationDBO,
                EmailRecordDBO_1.EmailRecordDBO,
                ForgotPasswordResetTokenDBO_1.ForgotPasswordResetTokenDBO,
                DonationRecord_1.DonationRecord,
                OrganizationMembershipDBO_1.OrganizationMembershipDBO,
                Donor_1.Donor,
                LegalName_1.LegalName,
                Address_1.Address,
                Finances_1.Finances,
                Healthcare_1.Healthcare,
                IdentificationInformation_1.IdentificationInformation,
                InformationProvider_1.InformationProvider,
                Insurance_1.Insurance,
                MarriageInformation_1.MarriageInformation,
                PhoneNumber_1.PhoneNumber,
                SexAndEthnicity_1.SexAndEthnicity,
                TwoFactorDBO_1.TwoFactorDBO,
                AuditTrailDBO_1.AuditTrailDBO
            ],
            synchronize: false,
            logging: true
        });
        await DatabaseConnection.createAdminUser(connection);
        return connection;
    }
    static async createAdminUser(connection) {
        console.log("Creating Admin User with ID: " + Number(process.env.AFFORDABLE_ADMIN_ID));
        const adminPassword = bcrypt_1.hashSync(process.env.AFFORDABLE_ADMIN_PASSWORD, 10);
        const authDao = new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        //authDao.createUser()
        let admin = await connection.getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .save({
            id: Number(process.env.AFFORDABLE_ADMIN_ID),
            username: process.env.AFFORDABLE_ADMIN_USER,
            password: adminPassword,
            email: process.env.AFFORDABLE_ADMIN_EMAIL,
            isAdmin: true,
        });
        await connection.getRepository(EmailRecordDBO_1.EmailRecordDBO)
            .save({
            userId: Number(process.env.AFFORDABLE_ADMIN_ID),
            email: process.env.AFFORDABLE_ADMIN_EMAIL,
            isPrimary: true,
            verified: true
        });
        let privs = {
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
        await connection.getRepository(AdminPrivilegesDBO_1.AdminPrivilegesDBO).save(privs);
    }
    static getConnectionStatus() {
        let conn = typeorm_1.getConnection();
        return conn.isConnected;
    }
}
DatabaseConnection.instance = mysql_1.createPool({
    connectionLimit: 10,
    host: process.env.AFFORDABLE_DB_HOST,
    user: process.env.AFFORDABLE_DB_USER,
    password: process.env.AFFORDABLE_DB_PASSWORD,
    database: process.env.AFFORDABLE_DB_NAME,
    insecureAuth: true,
    multipleStatements: true
});
DatabaseConnection.getInstance = () => DatabaseConnection.instance;
exports.default = DatabaseConnection;
