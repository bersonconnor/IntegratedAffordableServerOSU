
import uuidv4 from "uuid/v4";
import { DBOOrganizationDAOImpl } from "./DBOOrganizationDAOImpl";
import DatabaseConnection from "../../DatabaseConnection";
import { NotFoundError } from "../../../models/NotFoundError";
import { OrganizationDBO } from "../../../models/orm/OrganizationDBO";

let orgDao: DBOOrganizationDAOImpl;

function createDbo(): OrganizationDBO {
    const org = new OrganizationDBO();
    org.name = uuidv4();
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
        await DatabaseConnection.initializeDatabaseConnection();
        orgDao = new DBOOrganizationDAOImpl();
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
        await expect(orgDao.getOrganizationById(readOrg.id)).rejects.toThrowError(NotFoundError);
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
        await expect(orgDao.getApiKey(createdOrg.id)).rejects.toThrowError(NotFoundError);

    });
});