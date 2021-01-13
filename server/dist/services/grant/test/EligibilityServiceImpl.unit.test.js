"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const EligibilityCriteriaServiceImpl_1 = require("../EligibilityCriteriaServiceImpl");
const v4_1 = __importDefault(require("uuid/v4"));
const affordable_shared_models_1 = require("affordable-shared-models");
const EligibilityCriteria_1 = require("affordable-shared-models/dist/models/EligibilityCriteria");
let eligibilityService;
const mockEligibilityDao = jest_mock_extended_1.mock();
const mockOrganizationService = jest_mock_extended_1.mock();
let USER_INFO;
describe("GrantServiceImpl tests", () => {
    beforeAll(() => {
        eligibilityService = new EligibilityCriteriaServiceImpl_1.EligibilityCriteriaServiceImpl(mockEligibilityDao, mockOrganizationService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    beforeEach(() => {
        USER_INFO = {
            hasVerifiedEmail: true,
            userType: affordable_shared_models_1.UserType.RECIPIENT,
            username: "any",
            id: 3432,
            primaryEmail: v4_1.default() + "@affordhealth.org",
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
            const mismatch = new EligibilityCriteria_1.EligibilityCriteria();
            mismatch.emailAddress = v4_1.default() + "@gmail.com";
            // Perfect match
            const match = new EligibilityCriteria_1.EligibilityCriteria();
            match.emailAddress = USER_INFO.primaryEmail;
            expect(eligibilityService.meetsEligibilityRequirements(USER_INFO, match))
                .toBe(true);
            // Mismatched cases should work too
            USER_INFO.primaryEmail = "sPoNgEbOb@TeXt.CoM";
            const caseDifference = new EligibilityCriteria_1.EligibilityCriteria();
            caseDifference.emailAddress = "SpOnGeBoB@tExT.cOm";
            expect(eligibilityService.meetsEligibilityRequirements(USER_INFO, caseDifference))
                .toBe(true);
        });
    });
});
