import uuidv4 from "uuid/v4";
import { AuthenticationInformationDAO } from "../database/dao/authentication/AuthenticationInformationDAO";
import { DBOGrantDAOImpl } from "../database/dao/grant/DBOGrantDAOImpl";
import { DBOOrganizationDAOImpl } from "../database/dao/organization/DBOOrganizationDAOImpl";
import { AuthenticationInformationDBO } from "../models/orm/AuthenticationInformationDBO";
import { GrantDBO } from "../models/orm/grant/GrantDBO";
import { OrganizationDBO } from "../models/orm/OrganizationDBO";
import { DBOAuthenticationInformationDAOImpl } from "../database/dao/authentication/DBOAuthenticationInformationDAOImpl";

/**
 * Uses services to create objects. Note that behavior in this class is untested!
 */
export class DaoTestUtils {
    private authDao: AuthenticationInformationDAO;
    private orgDao: DBOOrganizationDAOImpl;
    private grantDao: DBOGrantDAOImpl;

    // TODO: Consider DI
    public constructor(authenticationDao?: AuthenticationInformationDAO) {
        this.authDao = authenticationDao ?? new DBOAuthenticationInformationDAOImpl();
        this.orgDao = new DBOOrganizationDAOImpl();
        this.grantDao = new DBOGrantDAOImpl();
    }


    public createUserAuthInfo(isDonor = true): AuthenticationInformationDBO {
        const newUser = new AuthenticationInformationDBO();
        newUser.username = uuidv4();
        newUser.password = "P@$sVVoRd";
        newUser.TwoFactor = true;
        newUser.TwoFactorCode = "a code";
        newUser.deactivated = false;
        newUser.isDonor = isDonor;

        return newUser;
    }

    /**
     * Creates a new user and adds them to the database.
     */
    public async createUser(isDonor = true): Promise<AuthenticationInformationDBO> {
        const newUser = this.createUserAuthInfo(isDonor);
        return this.authDao.createUser(newUser);
    }

    /**
     * Deletes user from the database.
     */
    public async deleteUser(userId: number): Promise<void> {
        return this.authDao.deleteUserById(userId);
    }


    /**
     * Create an organization and add it to the database.
     */
    public async createOrganization(): Promise<OrganizationDBO> {
        const org = new OrganizationDBO();
        org.name = uuidv4();
        org.email = "orgEmail";
        org.phone = "1425135";
        org.fax = "0943805923";
        org.websiteUrl = "gov.net";
        org.mission = "Grants";
        org.provideService = true;
        org.addBankingInfo = false;
        org.verified = true;
        return await this.orgDao.saveOrganization(org);
    }

    public async deleteOrganization(orgId: number): Promise<void> {
        this.orgDao.deleteOrganizationById(orgId);
    }

    public async createGrant(organizationId?: number): Promise<GrantDBO> {
        const request = new GrantDBO();
        request.grantName = "Grant " + uuidv4();
        request.organizationId = organizationId;
        request.grantAmount = "99.99";
        request.description = "";
        request.startTime = new Date();
        return await this.grantDao.createGrant(request);
    }

    public async deleteGrant(grantId: number): Promise<void> {
        return await this.grantDao.deleteGrantById(grantId);
    }

}