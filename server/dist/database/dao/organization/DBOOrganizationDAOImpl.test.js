"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const DBOOrganizationDAOImpl_1 = require("./DBOOrganizationDAOImpl");
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const NotFoundError_1 = require("../../../models/NotFoundError");
const OrganizationDBO_1 = require("../../../models/orm/OrganizationDBO");
let orgDao;
function createDbo() {
    const org = new OrganizationDBO_1.OrganizationDBO();
    org.name = v4_1.default();
    org.email = "orgEmail";
    org.phone = "1425135";
    org.fax = "0943805923";
    org.websiteUrl = "gov.net";
    org.mission = "Grants";
    org.ein = "3592503";
    org.taxSection = "403c";
    org.irsActivityCode = "359025";
    org.provideService = true;
    org.addBankingInfo = false;
    org.verified = true;
    org.apiKey = "api-key";
    return org;
}
describe("DBOOrganizationDAOImpl tests", () => {
    beforeAll(async (done) => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        orgDao = new DBOOrganizationDAOImpl_1.DBOOrganizationDAOImpl();
        done();
    });
    test("CRUD", async () => {
        const org = createDbo();
        // Create: call under test
        const createdOrg = await orgDao.saveOrganization(org);
        // The created user should be the same, except for setting the ID
        org.id = createdOrg.id;
        expect(createdOrg).toBe(org);
        // Update: call under test
        createdOrg.name = "New org name";
        const updatedOrg = await orgDao.saveOrganization(createdOrg);
        expect(updatedOrg).toStrictEqual(createdOrg);
        // Read: call under test
        const readOrg = await orgDao.getOrganizationById(updatedOrg.id);
        expect(readOrg).toStrictEqual(updatedOrg);
        // Delete: call under test
        await orgDao.deleteOrganizationById(updatedOrg.id);
        // Trying to find the user again should give an error
        await expect(orgDao.getOrganizationById(readOrg.id)).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
    test("Get API key", async () => {
        const org = createDbo();
        const createdOrg = await orgDao.saveOrganization(org);
        // Call under test
        const retrievedKey = await orgDao.getApiKey(createdOrg.id);
        expect(retrievedKey).toBe(org.apiKey);
        // Ensure it throws NFE when the org doesn't exist
        await orgDao.deleteOrganizationById(createdOrg.id);
        // call under test
        await expect(orgDao.getApiKey(createdOrg.id)).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
});
