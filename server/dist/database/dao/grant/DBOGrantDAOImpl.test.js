"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBOGrantDAOImpl_1 = require("./DBOGrantDAOImpl");
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const NotFoundError_1 = require("../../../models/NotFoundError");
const GrantDBO_1 = require("../../../models/orm/grant/GrantDBO");
const v4_1 = __importDefault(require("uuid/v4"));
const DaoTestUtils_1 = require("../../../testUtils/DaoTestUtils");
let grantDao;
let organization;
let daoTestUtils;
const ONE_HOUR_MILLIS = 1000 * 60 * 60;
function createDbo(organizationId) {
    const grant = new GrantDBO_1.GrantDBO();
    grant.grantName = v4_1.default();
    grant.grantAmount = "35125.25";
    grant.startTime = new Date("2020-01-01");
    grant.endTime = new Date("2021-01-01");
    grant.category = "Category 5";
    grant.description = "Purpose";
    grant.organizationId = organizationId;
    grant.eligibilityCriteria = null;
    return grant;
}
describe("DBOGrantDAOImpl tests", () => {
    beforeAll(async () => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        daoTestUtils = new DaoTestUtils_1.DaoTestUtils();
        grantDao = new DBOGrantDAOImpl_1.DBOGrantDAOImpl();
        organization = await daoTestUtils.createOrganization();
    });
    afterAll(async () => {
        await daoTestUtils.deleteOrganization(organization.id);
    });
    test("CRUD", async () => {
        const grant = createDbo(organization.id);
        // Create: call under test
        const createdGrant = await grantDao.createGrant(grant);
        // The created user should be the same, except for setting the ID
        grant.id = createdGrant.id;
        expect(createdGrant.organization.id).toEqual(organization.id);
        grant.organization = createdGrant.organization;
        expect(createdGrant).toEqual(grant);
        // Update: call under test
        createdGrant.grantName = "New grant name";
        const updatedGrant = await grantDao.updateGrant(createdGrant);
        expect(updatedGrant).toStrictEqual(createdGrant);
        // Read: call under test
        const readGrant = await grantDao.getGrantById(updatedGrant.id);
        expect(readGrant).toStrictEqual(updatedGrant);
        // Delete: call under test
        await grantDao.deleteGrantById(updatedGrant.id);
        // Trying to find the user again should give an error
        await expect(grantDao.getGrantById(readGrant.id)).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
    describe("Get all open grants with eligibility requirements", () => {
        test("Current time is within bounds of grant", async () => {
            let grant = createDbo(organization.id);
            grant.startTime = new Date(Date.now() - ONE_HOUR_MILLIS);
            grant.endTime = new Date(Date.now() + ONE_HOUR_MILLIS);
            grant = await grantDao.createGrant(grant);
            // Call under test
            let openGrants = await grantDao.getAllOpenGrants();
            openGrants = openGrants.filter(grant => grant.organizationId === organization.id);
            expect(openGrants.length).toEqual(1);
            expect(openGrants[0]).toEqual(grant);
            await grantDao.deleteGrantById(grant.id);
        });
        test("Current time is within bounds of grant, null end time", async () => {
            let grant = createDbo(organization.id);
            grant.startTime = new Date(Date.now() - ONE_HOUR_MILLIS);
            grant.endTime = null;
            grant = await grantDao.createGrant(grant);
            // Call under test
            let openGrants = await grantDao.getAllOpenGrants();
            openGrants = openGrants.filter(grant => grant.organizationId === organization.id);
            expect(openGrants.length).toEqual(1);
            expect(openGrants[0]).toEqual(grant);
            await grantDao.deleteGrantById(grant.id);
        });
        test("Current time is outside of bounds of grant", async () => {
            let grant = createDbo(organization.id);
            grant.startTime = new Date(Date.now() + ONE_HOUR_MILLIS);
            grant.endTime = new Date(Date.now() + ONE_HOUR_MILLIS * 2);
            grant = await grantDao.createGrant(grant);
            // Call under test
            let openGrants = await grantDao.getAllOpenGrants();
            openGrants = openGrants.filter(grant => grant.organizationId === organization.id);
            expect(openGrants.length).toEqual(0);
            await grantDao.deleteGrantById(grant.id);
        });
        test("Current time is outside of bounds of grant, null end time", async () => {
            let grant = createDbo(organization.id);
            grant.startTime = new Date(Date.now() + ONE_HOUR_MILLIS);
            grant.endTime = null;
            grant = await grantDao.createGrant(grant);
            // Call under test
            let openGrants = await grantDao.getAllOpenGrants();
            openGrants = openGrants.filter(grant => grant.organizationId === organization.id);
            expect(openGrants.length).toEqual(0);
            await grantDao.deleteGrantById(grant.id);
        });
    });
});
