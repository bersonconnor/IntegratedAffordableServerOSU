import { mock } from "jest-mock-extended";
import { OrganizationService } from "../../organization/OrganizationService";
import { GrantEligibilityDAO } from "../../../database/dao/grant/GrantEligibilityDAO";
import { EligibilityCriteriaServiceImpl } from "../EligibilityCriteriaServiceImpl";
import uuid from "uuid/v4";
import { UserInfo, UserType } from "affordable-shared-models";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";

let eligibilityService: EligibilityCriteriaServiceImpl;


const mockEligibilityDao = mock<GrantEligibilityDAO>();
const mockOrganizationService = mock<OrganizationService>();

let USER_INFO: UserInfo;
describe("GrantServiceImpl tests", () => {

    beforeAll(() => {
        eligibilityService = new EligibilityCriteriaServiceImpl(
            mockEligibilityDao,
            mockOrganizationService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        USER_INFO = {
            hasVerifiedEmail: true,
            userType: UserType.RECIPIENT,
            username: "any",
            id: 3432,
            primaryEmail: uuid() + "@affordhealth.org",
            twoFactor: false,
            isDeactivate: true
        };
    });


    describe("meetsEligibilityRequirements tests", () => {
        test("Null criteria", () => {
            expect(eligibilityService.meetsEligibilityRequirements(USER_INFO, null))
                .toBe(true);
        });
        test("Matching + nonmatching email address", () => {
            // Mismatch
            const mismatch = new EligibilityCriteria();
            mismatch.emailAddress = uuid() + "@gmail.com";

            // Perfect match
            const match = new EligibilityCriteria();
            match.emailAddress = USER_INFO.primaryEmail;
            expect(eligibilityService.meetsEligibilityRequirements(USER_INFO, match))
                .toBe(true);

            // Mismatched cases should work too
            USER_INFO.primaryEmail = "sPoNgEbOb@TeXt.CoM";
            const caseDifference = new EligibilityCriteria();
            caseDifference.emailAddress = "SpOnGeBoB@tExT.cOm";
            expect(eligibilityService.meetsEligibilityRequirements(USER_INFO, caseDifference))
                .toBe(true);
        });
    });

});