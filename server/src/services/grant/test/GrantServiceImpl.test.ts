import { IllegalArgumentError } from "../../../models/IllegalArgumentError";
import { GrantServiceImpl } from "../GrantServiceImpl";
import { Grant, Organization, UserInfo } from "affordable-shared-models";
import { UnauthenticatedError } from "../../../models/UnauthenticatedError";
import { UnauthorizedError } from "../../../models/UnauthorizedError";
import DatabaseConnection from "../../../database/DatabaseConnection";
import { ServiceIntegrationTestUtils } from "../../../testUtils/ServiceIntegrationTestUtils";

let grantService: GrantServiceImpl;

let serviceTestUtils: ServiceIntegrationTestUtils;

let donor: UserInfo;
let recipient: UserInfo;
let organization: Organization;

function createRequestDto(): Grant {
    const requestDto = new Grant();
    requestDto.id = 324524;
    requestDto.description = "My grant desc";
    requestDto.grantAmount = 29.99;
    requestDto.grantName = "Title of grant";
    requestDto.organization = {
        id: organization.id
    };
    requestDto.eligibilityCriteria = {
        organizationId: organization.id,
        emailAddress: "some email address"
    };
    requestDto.startDate = new Date(3133641600000);
    requestDto.category = "My category";
    requestDto.endDate = null;
    requestDto.recipientId = null;
    return requestDto;
}

describe("GrantServiceImpl tests", () => {

    beforeAll(async () => {
        await DatabaseConnection.initializeDatabaseConnection();
        serviceTestUtils = new ServiceIntegrationTestUtils();
        donor = await serviceTestUtils.createUser(true);
        organization = await serviceTestUtils.createOrganization(donor);
        recipient = await serviceTestUtils.createUser(false);

        // Service under test
        grantService = new GrantServiceImpl();
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createGrant tests", () => {
        describe("Successful cases", () => {
            test("Basic create", async () => {
                const requestDto = createRequestDto();

                // Call under test
                const result = await grantService.createGrant(donor, requestDto);

                expect(result.id).not.toEqual(requestDto.id);
                requestDto.id = result.id;
                // Organization will be filled out in the result
                expect(result.organization.id).toEqual(requestDto.organization.id);
                requestDto.organization = result.organization;
                // Eligibility criteria will have been created in the result;
                expect(result.eligibilityCriteria.id).toBeDefined();
                requestDto.eligibilityCriteria.id = result.eligibilityCriteria.id;
                expect(result.eligibilityCriteria).toEqual(requestDto.eligibilityCriteria);

                expect(result).toEqual(requestDto);
            });

            test("Start date is null", async () => {
                const requestDto = createRequestDto();
                requestDto.startDate = null;

                // Call under test
                const result = await grantService.createGrant(donor, requestDto);

                // Check that the start date is within the last 5 min
                expect(result.startDate.getTime()).toBeLessThan(Date.now() + 1000 * 60 * 5);
                expect(result.startDate.getTime()).toBeGreaterThan(Date.now() - 1000 * 60 * 5);

                requestDto.startDate = result.startDate;

                expect(result.id).not.toEqual(requestDto.id);
                requestDto.id = result.id;
                // Organization will be filled out in the result
                expect(result.organization.id).toEqual(requestDto.organization.id);
                requestDto.organization = result.organization;
                // Eligibility criteria will have been created in the result;
                expect(result.eligibilityCriteria.id).toBeDefined();
                requestDto.eligibilityCriteria.id = result.eligibilityCriteria.id;
                expect(result.eligibilityCriteria).toEqual(requestDto.eligibilityCriteria);

                expect(result).toEqual(requestDto);
            });

            test("Null eligibility criteria", async () => {
                const requestDto = createRequestDto();

                requestDto.eligibilityCriteria = null;

                // Call under test
                const result = await grantService.createGrant(donor, requestDto);

                expect(result.id).not.toEqual(requestDto.id);
                requestDto.id = result.id;
                // Organization will be filled out in the result
                expect(result.organization.id).toEqual(requestDto.organization.id);
                requestDto.organization = result.organization;
                // Eligibility criteria should be null
                expect(result.eligibilityCriteria).toBeNull();

                expect(result).toEqual(requestDto);
            });

            test("Existing eligibility criteria", async () => {
                const existingCriteria = await serviceTestUtils.createEligibilityCriteria(donor, organization.id);

                const requestDto = createRequestDto();

                requestDto.eligibilityCriteria = { id: existingCriteria.id };

                // Call under test
                const result = await grantService.createGrant(donor, requestDto);

                expect(result.id).not.toEqual(requestDto.id);
                requestDto.id = result.id;
                // Organization will be filled out in the result
                expect(result.organization.id).toEqual(requestDto.organization.id);
                requestDto.organization = result.organization;
                // Eligibility criteria should be null
                expect(result.eligibilityCriteria).toEqual(existingCriteria);
                requestDto.eligibilityCriteria = existingCriteria;

                expect(result).toEqual(requestDto);
            });
        });
        describe("Error cases", function () {
            describe("Validation checks", () => {
                test("No grant name", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantName = null;
                    await expect(grantService.createGrant(donor, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
                test("No organization ID", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization = null;
                    await expect(grantService.createGrant(donor, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
            });

            test("Unauthenticated", async () => {
                await expect(grantService.createGrant(null, createRequestDto())).rejects.toThrowError(UnauthenticatedError);
            });

            test("User is not a donor", async () => {
                await expect(grantService.createGrant(recipient, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("User doesn't belong to organization", async () => {
                const otherDonor = await serviceTestUtils.createUser(true);
                const otherOrg = await serviceTestUtils.createOrganization(otherDonor);
                const requestDto = createRequestDto();
                requestDto.organization.id = otherOrg.id;
                await expect(grantService.createGrant(donor, requestDto)).rejects.toThrowError(UnauthorizedError);
            });

            test("Eligibility criteria belongs to a different organization", async () => {
                const otherDonor = await serviceTestUtils.createUser(true);
                const otherOrg = await serviceTestUtils.createOrganization(otherDonor);
                const otherCriteria = await serviceTestUtils.createEligibilityCriteria(otherDonor, otherOrg.id);
                const requestDto = createRequestDto();
                requestDto.eligibilityCriteria.id = otherCriteria.id;
                await expect(grantService.createGrant(donor, requestDto)).rejects.toThrowError(IllegalArgumentError);
            });

            test("Organization doesn't exist", async () => {
                const requestDto = createRequestDto();
                requestDto.organization.id = 8988888888;
                await expect(grantService.createGrant(donor, requestDto)).rejects.toThrowError(UnauthorizedError);
            });
        });
    });

    describe("updateGrant tests", () => {
        let existingGrant: Grant;
        beforeEach(async () => {
           existingGrant = await grantService.createGrant(donor, createRequestDto());
        });
        describe("Successful cases", () => {
            test("Basic update", async () => {
                const changedGrant = existingGrant;
                changedGrant.grantName = "A brand new name";
                // Call under test
                const updatedGrant = await grantService.updateGrant(donor, changedGrant);
                expect(updatedGrant).toEqual(changedGrant);
            });

        });
    });
});

