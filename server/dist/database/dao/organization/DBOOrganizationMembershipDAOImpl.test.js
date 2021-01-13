"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const DBOOrganizationMembershipDAOImpl_1 = require("./DBOOrganizationMembershipDAOImpl");
const OrganizationMembershipDBO_1 = require("../../../models/orm/OrganizationMembershipDBO");
const DaoTestUtils_1 = require("../../../testUtils/DaoTestUtils");
let orgMembershipDao;
let daoTestUtil;
let user;
let organization;
describe("DBOOrganizationMembershipDAOImpl tests", () => {
    beforeAll(async () => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        daoTestUtil = new DaoTestUtils_1.DaoTestUtils();
        orgMembershipDao = new DBOOrganizationMembershipDAOImpl_1.DBOOrganizationMembershipDAOImpl();
        organization = await daoTestUtil.createOrganization();
        user = await daoTestUtil.createUser(true);
    });
    test("CRUD", async () => {
        const dbo = new OrganizationMembershipDBO_1.OrganizationMembershipDBO();
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
