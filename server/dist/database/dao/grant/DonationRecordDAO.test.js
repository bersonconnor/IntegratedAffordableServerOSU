"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DonationRecordDAO_1 = require("./DonationRecordDAO");
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const DonationRecord_1 = require("../../../models/orm/DonationRecord");
const DaoTestUtils_1 = require("../../../testUtils/DaoTestUtils");
let donationRecordDao;
let testUtil;
let grant;
let org;
let donor;
describe("DonationRecord DAO tests", () => {
    beforeAll(async () => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        testUtil = new DaoTestUtils_1.DaoTestUtils();
        donationRecordDao = new DonationRecordDAO_1.DonationRecordDAO();
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
        const record = new DonationRecord_1.DonationRecord();
        record.donateAmount = 10000;
        record.donorId = donor.id;
        record.grantId = grant.id;
        // Create: call under test
        const createdDonateRecord = await donationRecordDao.createDonationRecord(record);
        // The created user should be the same, except for setting the ID
        record.id = createdDonateRecord.id;
        expect(createdDonateRecord).toBe(record);
    });
});
