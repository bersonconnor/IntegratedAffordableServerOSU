import DatabaseConnection from "../../DatabaseConnection";
import {DBOOrganizationMembershipDAOImpl} from "./DBOOrganizationMembershipDAOImpl";
import {OrganizationMembershipDBO} from "../../../models/orm/OrganizationMembershipDBO";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { DaoTestUtils } from "../../../testUtils/DaoTestUtils";
import { OrganizationDBO } from "../../../models/orm/OrganizationDBO";

let orgMembershipDao: DBOOrganizationMembershipDAOImpl;
let daoTestUtil: DaoTestUtils;

let user: AuthenticationInformationDBO;
let organization: OrganizationDBO;

describe("DBOOrganizationMembershipDAOImpl tests", () => {
    beforeAll(async () => {
        await DatabaseConnection.initializeDatabaseConnection();
        daoTestUtil = new DaoTestUtils()

        orgMembershipDao = new DBOOrganizationMembershipDAOImpl();
        organization = await daoTestUtil.createOrganization();
        user = await daoTestUtil.createUser(true);
    });

    test("CRUD", async () => {
        const dbo = new OrganizationMembershipDBO();
        dbo.donorId = user.id;
        dbo.organizationId = organization.id;
        dbo.isAdmin = false;
        dbo.membershipStartDate = new Date();

        // Create call under test
        await orgMembershipDao.saveMembership(dbo);

        // Read call under test
        const memberships = await orgMembershipDao.getAllMembershipsOfUser(user.id);
        expect(memberships.length).toEqual(1);
        expect(memberships[0].organizationId).toEqual(organization.id);
        expect(memberships[0].donorId).toEqual(user.id);
        expect(memberships[0].isAdmin).toEqual(false);

        dbo.isAdmin = true;
        // Update call under test
        await orgMembershipDao.saveMembership(dbo);

        const updatedMemberships = await orgMembershipDao.getAllMembershipsOfUser(user.id);
        expect(updatedMemberships.length).toEqual(1);
        expect(updatedMemberships[0].organizationId).toEqual(organization.id);
        expect(updatedMemberships[0].donorId).toEqual(user.id);
        expect(updatedMemberships[0].isAdmin).toEqual(true); //!!

        // Delete call under test
        await orgMembershipDao.deleteMembership(organization.id, user.id);
        const m = await orgMembershipDao.getAllMembershipsOfUser(user.id);
        expect(m.length).toEqual(0);
    });
});