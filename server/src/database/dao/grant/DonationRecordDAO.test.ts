import { DonationRecordDAO } from "./DonationRecordDAO";
import DatabaseConnection from "../../DatabaseConnection";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { DonationRecord } from "../../../models/orm/DonationRecord";
import { GrantDBO } from "../../../models/orm/grant/GrantDBO";
import { OrganizationDBO } from "../../../models/orm/OrganizationDBO";
import { DaoTestUtils } from "../../../testUtils/DaoTestUtils";

let donationRecordDao: DonationRecordDAO;
let testUtil: DaoTestUtils;

let grant: GrantDBO;
let org: OrganizationDBO;
let donor: AuthenticationInformationDBO;

describe("DonationRecord DAO tests", () => {
    beforeAll(async () => {
        await DatabaseConnection.initializeDatabaseConnection();
        testUtil = new DaoTestUtils();
        donationRecordDao = new DonationRecordDAO();
    });

    beforeEach(async () => {
        donor = await testUtil.createUser(true);
        org = await testUtil.createOrganization();
        grant = await testUtil.createGrant(org.id);
    });

    afterEach(async () => {
        await testUtil.deleteGrant(grant.id);
        await testUtil.deleteUser(donor.id);
        await testUtil.deleteOrganization(org.id);
    });

    test("CRUD", async () => {
        const record = new DonationRecord();
        record.donateAmount = 10000;
        record.donorId = donor.id;
        record.grantId = grant.id;
        // Create: call under test
        const createdDonateRecord: DonationRecord = await donationRecordDao.createDonationRecord(record);

        // The created user should be the same, except for setting the ID
        record.id = createdDonateRecord.id;
        expect(createdDonateRecord).toBe(record);
    });
});