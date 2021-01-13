"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const LegalName_1 = require("../../../models/orm/profile/LegalName");
const NotFoundError_1 = require("../../../models/NotFoundError");
const DBOLegalNameDAOImpl_1 = require("./DBOLegalNameDAOImpl");
const DaoTestUtils_1 = require("../../../testUtils/DaoTestUtils");
const affordable_shared_models_1 = require("affordable-shared-models");
let legalNameDao;
let daoTestUtil;
let user;
let testLegalNames; // the legal names that will be entered into the DB
let testGetLegalNames; // the legal names that will be retrieved from the DB
let l1;
let l2;
async function addNames() {
    for (const element of testLegalNames) {
        await legalNameDao.addLegalName(element);
    }
}
describe("LegalNameDAO CRUD", () => {
    beforeAll(async () => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        daoTestUtil = new DaoTestUtils_1.DaoTestUtils();
        legalNameDao = new DBOLegalNameDAOImpl_1.DBOLegalNameDAOImpl();
        user = await daoTestUtil.createUser();
        l1 = new LegalName_1.LegalName();
        l1.userId = user.id;
        l1.firstName = "John";
        l1.middleName = "T";
        l1.lastName = "Smith";
        l1.suffix = affordable_shared_models_1.ProfileFields.Suffix.JR;
        l1.isCurrentLegalName = true;
        l2 = new LegalName_1.LegalName();
        l2.userId = user.id;
        l2.firstName = "John";
        l2.middleName = "T";
        l2.lastName = "Smith";
        l2.suffix = affordable_shared_models_1.ProfileFields.Suffix.JR;
        l2.isCurrentLegalName = false; // changing so that the primary key for legal name in the DB is unique
        testLegalNames = [l1, l2];
    });
    test("Create/get/delete", async () => {
        // Create
        await addNames();
        // Get
        testGetLegalNames = await legalNameDao.getAllLegalNamesWithUserId(user.id);
        // testLegalNames should be the same as the testGetLegalNames
        expect(testLegalNames.length == testGetLegalNames.length).toBeTruthy(); // just testing length for now
        // Delete
        await legalNameDao.deleteUserLegalNamesById(user.id);
        // This legal name should no longer exist int he DB
        await expect(legalNameDao.getAllLegalNamesWithUserId(user.id)).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
});
