import { LegalNameDAO } from "./LegalNameDAO";
import DatabaseConnection from "../../DatabaseConnection";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { LegalName } from "../../../models/orm/profile/LegalName";
import { NotFoundError } from "../../../models/NotFoundError";
import {DBOLegalNameDAOImpl} from "./DBOLegalNameDAOImpl";
import { DaoTestUtils } from "../../../testUtils/DaoTestUtils";
import { ProfileFields } from "affordable-shared-models";

let legalNameDao: LegalNameDAO;
let daoTestUtil: DaoTestUtils;

let user: AuthenticationInformationDBO;
let testLegalNames: Array<LegalName>; // the legal names that will be entered into the DB
let testGetLegalNames: Array<LegalName>; // the legal names that will be retrieved from the DB
let l1: LegalName;
let l2: LegalName;

async function addNames() {
    for (const element of testLegalNames) {
       await legalNameDao.addLegalName(element);
    }
}

describe("LegalNameDAO CRUD", () => {

    beforeAll(async () => {
        await DatabaseConnection.initializeDatabaseConnection();
        daoTestUtil = new DaoTestUtils();
        legalNameDao = new DBOLegalNameDAOImpl();
        user = await daoTestUtil.createUser();
        
        l1 = new LegalName();
        l1.userId = user.id;
        l1.firstName = "John";
        l1.middleName = "T";
        l1.lastName = "Smith";
        l1.suffix = ProfileFields.Suffix.JR;
        l1.isCurrentLegalName = true;

        l2 = new LegalName();
        l2.userId = user.id;
        l2.firstName = "John";
        l2.middleName = "T";
        l2.lastName = "Smith";
        l2.suffix = ProfileFields.Suffix.JR;
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
        await expect(legalNameDao.getAllLegalNamesWithUserId(user.id)).rejects.toThrowError(NotFoundError);
    });
});
