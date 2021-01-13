"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const GrantServiceImpl_1 = require("../GrantServiceImpl");
const affordable_shared_models_1 = require("affordable-shared-models");
const IllegalArgumentError_1 = require("../../../models/IllegalArgumentError");
const UnauthenticatedError_1 = require("../../../models/UnauthenticatedError");
const UnauthorizedError_1 = require("../../../models/UnauthorizedError");
const NotFoundError_1 = require("../../../models/NotFoundError");
const GrantUtils_1 = require("../GrantUtils");
const GrantDBO_1 = require("../../../models/orm/grant/GrantDBO");
const OrganizationDBO_1 = require("../../../models/orm/OrganizationDBO");
const EligibilityCriteriaDBO_1 = require("../../../models/orm/grant/EligibilityCriteriaDBO");
const EligibilityCriteria_1 = require("affordable-shared-models/dist/models/EligibilityCriteria");
const ApplicationInformationDBO_1 = require("../../../models/orm/grant/ApplicationInformationDBO");
const mockGrantDao = jest_mock_extended_1.mock();
const mockApplicationInfoDao = jest_mock_extended_1.mock();
const mockOrganizationService = jest_mock_extended_1.mock();
const mockEligibilityService = jest_mock_extended_1.mock();
const mockProfileService = jest_mock_extended_1.mock();
const mockAuthNService = jest_mock_extended_1.mock();
let grantService;
const NEW_GRANT_ID = 234;
const ORGANIZATION_ID = 4234234;
function createRequestDto() {
    const requestDto = new affordable_shared_models_1.Grant();
    requestDto.id = 324524;
    requestDto.description = "My grant desc";
    requestDto.grantAmount = 29.99;
    requestDto.grantName = "Title of grant";
    requestDto.organization = {
        id: ORGANIZATION_ID
    };
    requestDto.eligibilityCriteria = {
        organizationId: ORGANIZATION_ID,
        emailAddress: "some email address"
    };
    requestDto.startDate = new Date(3133641600000);
    requestDto.category = "My category";
    requestDto.endDate = null;
    requestDto.recipientId = null;
    return requestDto;
}
describe("GrantServiceImpl tests", () => {
    let donorUserInfo;
    let recipientUserInfo;
    beforeAll(() => {
        grantService = new GrantServiceImpl_1.GrantServiceImpl(mockGrantDao, mockApplicationInfoDao, mockOrganizationService, mockEligibilityService, mockProfileService, mockAuthNService);
    });
    beforeEach(() => {
        donorUserInfo = new affordable_shared_models_1.UserInfo();
        donorUserInfo.id = 1234;
        donorUserInfo.hasVerifiedEmail = true;
        donorUserInfo.userType = affordable_shared_models_1.UserType.DONOR;
        recipientUserInfo = new affordable_shared_models_1.UserInfo();
        recipientUserInfo.id = 4321;
        recipientUserInfo.hasVerifiedEmail = true;
        recipientUserInfo.userType = affordable_shared_models_1.UserType.RECIPIENT;
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe("getGrant tests", () => {
        describe("Successful cases", () => {
            test("Basic get", async () => {
                const id = 424;
                const returnedDbo = new GrantDBO_1.GrantDBO();
                returnedDbo.id = id;
                returnedDbo.grantName = "A cool grant";
                returnedDbo.organizationId = ORGANIZATION_ID;
                returnedDbo.organization = new OrganizationDBO_1.OrganizationDBO();
                returnedDbo.organization.id = ORGANIZATION_ID;
                returnedDbo.organization.name = "Cool org name";
                returnedDbo.organization.apiKey = "this is sensitive info";
                returnedDbo.eligibilityCriteria = new EligibilityCriteriaDBO_1.EligibilityCriteriaDBO();
                returnedDbo.eligibilityCriteria.id = 243143;
                returnedDbo.eligibilityCriteriaId = 243143;
                // DAO get must return a grant
                mockGrantDao.getGrantById.mockImplementation(() => {
                    return Promise.resolve(returnedDbo);
                });
                // Call under test
                const result = await grantService.getGrant(donorUserInfo, id);
                const expected = GrantUtils_1.GrantUtils.convertGrantDboToDto(returnedDbo);
                expected.organization.apiKey = undefined;
                expect(result).toEqual(expected);
                expect(mockGrantDao.getGrantById).toBeCalledTimes(1);
                expect(mockGrantDao.getGrantById).toBeCalledWith(id);
            });
        });
        describe("Error cases", () => {
            test("Grant not found", async () => {
                const id = 424;
                mockGrantDao.getGrantById.mockImplementation(() => {
                    throw new NotFoundError_1.NotFoundError("");
                });
                // Call under test
                await expect(grantService.getGrant(donorUserInfo, id)).rejects.toThrowError(NotFoundError_1.NotFoundError);
                expect(mockGrantDao.getGrantById).toBeCalledTimes(1);
                expect(mockGrantDao.getGrantById).toBeCalledWith(id);
            });
            test("No ID", async () => {
                await expect(grantService.getGrant(donorUserInfo, null)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
        });
    });
    describe("createGrant tests", () => {
        beforeEach(() => {
            // Mocks to get through a basic create
            // User must belong to the organization they are creating the grant for
            mockOrganizationService.userBelongsToOrganization
                .mockImplementation(() => Promise.resolve(true));
            // Check whether we can use the eligibility criteria provided.
            jest.spyOn(grantService, "useOrCreateEligibilityCriteria")
                .mockImplementation((userInfo, grant) => {
                return Promise.resolve(grant.eligibilityCriteria);
            });
            // When we create a grant, just return what was passed with a new ID.
            mockGrantDao.createGrant
                .mockImplementation((dbo) => {
                // DAO create should never be called with a null id or start time
                // eslint-disable-next-line jest/no-standalone-expect
                expect(dbo.id).toBeNull();
                // eslint-disable-next-line jest/no-standalone-expect
                expect(dbo.startTime).not.toBeNull();
                dbo.id = NEW_GRANT_ID;
                return Promise.resolve(dbo);
            });
            // After creating, we call get (which is tested elsewhere)
            // Just return an empty grant with the passed ID.
            jest.spyOn(grantService, "getGrant")
                .mockImplementation((userInfo, grantId) => {
                const grant = new affordable_shared_models_1.Grant();
                grant.id = grantId;
                return Promise.resolve(grant);
            });
        });
        describe("Successful cases", () => {
            test("Basic create", async () => {
                const requestDto = createRequestDto();
                // Call under test
                const result = await grantService.createGrant(donorUserInfo, requestDto);
                expect(result.id).toEqual(NEW_GRANT_ID);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledTimes(1);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledWith(donorUserInfo.id, ORGANIZATION_ID);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledTimes(1);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledWith(donorUserInfo, requestDto);
                expect(mockGrantDao.createGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledWith(donorUserInfo, NEW_GRANT_ID);
            });
            test("Convert null start date to current time", async () => {
                const requestDto = createRequestDto();
                requestDto.startDate = null;
                mockGrantDao.createGrant
                    .mockImplementation((dbo) => {
                    // DAO create should never be called with a null id or start time
                    expect(dbo.id).toBeNull();
                    expect(dbo.startTime).not.toBeNull();
                    // Make sure it's within the last 5 min
                    expect(dbo.startTime.getTime()).toBeGreaterThan(Date.now() - 1000 * 60 * 5);
                    dbo.id = NEW_GRANT_ID;
                    return Promise.resolve(dbo);
                });
                // Call under test
                const result = await grantService.createGrant(donorUserInfo, requestDto);
                expect(result.id).toEqual(NEW_GRANT_ID);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledTimes(1);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledWith(donorUserInfo.id, ORGANIZATION_ID);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledTimes(1);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledWith(donorUserInfo, requestDto);
                expect(mockGrantDao.createGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledWith(donorUserInfo, NEW_GRANT_ID);
            });
            test("Null eligibility criteria", async () => {
                const requestDto = createRequestDto();
                requestDto.eligibilityCriteria = null;
                mockGrantDao.createGrant
                    .mockImplementation((dbo) => {
                    // DAO create should never be called with a null id or start time
                    expect(dbo.id).toBeNull();
                    expect(dbo.startTime).not.toBeNull();
                    // Make sure it's within the last 5 min
                    expect(dbo.startTime.getTime()).toBeGreaterThan(Date.now() - 1000 * 60 * 5);
                    dbo.id = NEW_GRANT_ID;
                    return Promise.resolve(dbo);
                });
                // Call under test
                const result = await grantService.createGrant(donorUserInfo, requestDto);
                expect(result.id).toEqual(NEW_GRANT_ID);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledTimes(1);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledWith(donorUserInfo.id, ORGANIZATION_ID);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledTimes(0);
                expect(mockGrantDao.createGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledWith(donorUserInfo, NEW_GRANT_ID);
            });
        });
        describe("Error cases", () => {
            describe("Validation checks", () => {
                test("No grant name", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantName = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No organization", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No organization id", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization.id = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No grant amount", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantAmount = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No description", async () => {
                    const requestDto = createRequestDto();
                    requestDto.description = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("Recipient is set", async () => {
                    const requestDto = createRequestDto();
                    requestDto.recipientId = 2343;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
            });
            test("Unauthenticated", async () => {
                await expect(grantService.createGrant(null, createRequestDto())).rejects.toThrowError(UnauthenticatedError_1.UnauthenticatedError);
            });
            test("User is not a donor", async () => {
                donorUserInfo.userType = affordable_shared_models_1.UserType.RECIPIENT;
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
            test("User doesn't belong to organization", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => Promise.resolve(false));
                // Call under test
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
            test("Can't use eligibility criteria", async () => {
                jest.spyOn(grantService, "useOrCreateEligibilityCriteria")
                    .mockImplementation(() => {
                    throw new UnauthorizedError_1.UnauthorizedError("");
                });
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
            test("Organization doesn't exist", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(NotFoundError_1.NotFoundError);
            });
        });
    });
    describe("updateGrant tests", () => {
        beforeEach(() => {
            // Mocks to get through a basic update
            // User must belong to the organization they are creating the grant for
            mockOrganizationService.userBelongsToOrganization
                .mockImplementation(() => Promise.resolve(true));
            // Check whether we can use the eligibility criteria provided.
            jest.spyOn(grantService, "useOrCreateEligibilityCriteria")
                .mockImplementation((userInfo, grant) => {
                return Promise.resolve(grant.eligibilityCriteria);
            });
            mockGrantDao.updateGrant
                .mockImplementation((dbo) => {
                // Check the ID
                // eslint-disable-next-line jest/no-standalone-expect
                expect(dbo.id).toEqual(createRequestDto().id);
                // eslint-disable-next-line jest/no-standalone-expect
                expect(dbo.startTime).not.toBeNull();
                return Promise.resolve(dbo);
            });
            // After creating, we call get (which is tested elsewhere)
            // Just return an empty grant with the passed ID.
            jest.spyOn(grantService, "getGrant")
                .mockImplementation((userInfo, grantId) => {
                const grant = new affordable_shared_models_1.Grant();
                grant.id = grantId;
                grant.organization = { id: ORGANIZATION_ID };
                return Promise.resolve(grant);
            });
        });
        describe("Successful cases", () => {
            test("Basic update", async () => {
                const requestDto = createRequestDto();
                // Call under test
                const result = await grantService.updateGrant(donorUserInfo, requestDto);
                expect(result.id).toEqual(requestDto.id);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledTimes(1);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledWith(donorUserInfo.id, ORGANIZATION_ID);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledTimes(1);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledWith(donorUserInfo, requestDto);
                expect(mockGrantDao.updateGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledTimes(2);
                expect(grantService.getGrant).toBeCalledWith(donorUserInfo, requestDto.id);
            });
            test("Convert null start date to current time", async () => {
                const requestDto = createRequestDto();
                requestDto.startDate = null;
                mockGrantDao.updateGrant
                    .mockImplementation((dbo) => {
                    // DAO create should never be called with a null id or start time
                    expect(dbo.id).toEqual(createRequestDto().id);
                    expect(dbo.startTime).not.toBeNull();
                    // Make sure it's within the last 5 min
                    expect(dbo.startTime.getTime()).toBeGreaterThan(Date.now() - 1000 * 60 * 5);
                    return Promise.resolve(dbo);
                });
                // Call under test
                const result = await grantService.updateGrant(donorUserInfo, requestDto);
                expect(result.id).toEqual(requestDto.id);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledTimes(1);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledWith(donorUserInfo.id, ORGANIZATION_ID);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledTimes(1);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledWith(donorUserInfo, requestDto);
                expect(mockGrantDao.updateGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledTimes(2);
                expect(grantService.getGrant).toBeCalledWith(donorUserInfo, requestDto.id);
            });
            test("Null eligibility criteria", async () => {
                const requestDto = createRequestDto();
                requestDto.eligibilityCriteria = null;
                mockGrantDao.updateGrant
                    .mockImplementation((dbo) => {
                    // DAO create should never be called with a null id or start time
                    expect(dbo.id).not.toBeNull();
                    expect(dbo.startTime).not.toBeNull();
                    return Promise.resolve(dbo);
                });
                // Call under test
                const result = await grantService.updateGrant(donorUserInfo, requestDto);
                expect(result.id).toEqual(requestDto.id);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledTimes(1);
                expect(mockOrganizationService.userBelongsToOrganization).toBeCalledWith(donorUserInfo.id, ORGANIZATION_ID);
                expect(grantService.useOrCreateEligibilityCriteria).toBeCalledTimes(0);
                expect(mockGrantDao.updateGrant).toBeCalledTimes(1);
                expect(grantService.getGrant).toBeCalledTimes(2);
                expect(grantService.getGrant).toBeCalledWith(donorUserInfo, requestDto.id);
            });
        });
        describe("Error cases", () => {
            describe("Validation checks", () => {
                test("No grant id", async () => {
                    const requestDto = createRequestDto();
                    requestDto.id = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No grant name", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantName = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No organization", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No organization id", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization.id = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No grant amount", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantAmount = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
                test("No description", async () => {
                    const requestDto = createRequestDto();
                    requestDto.description = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
                });
            });
            test("Unauthenticated", async () => {
                await expect(grantService.updateGrant(null, createRequestDto())).rejects.toThrowError(UnauthenticatedError_1.UnauthenticatedError);
            });
            test("User is not a donor", async () => {
                donorUserInfo.userType = affordable_shared_models_1.UserType.RECIPIENT;
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
            test("User doesn't belong to organization", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => Promise.resolve(false));
                // Call under test
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
            test("Can't use eligibility criteria", async () => {
                jest.spyOn(grantService, "useOrCreateEligibilityCriteria")
                    .mockImplementation(() => {
                    throw new UnauthorizedError_1.UnauthorizedError("");
                });
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
            test("Organization doesn't exist", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(NotFoundError_1.NotFoundError);
            });
        });
    });
    describe("deleteGrant tests", () => {
        beforeEach(() => {
            jest.spyOn(grantService, "getGrant")
                .mockImplementation(() => {
                return Promise.resolve(createRequestDto());
            });
        });
        test("Successful path", async () => {
            mockOrganizationService.userBelongsToOrganization.mockImplementation(() => Promise.resolve(true));
            // Call under test
            const result = await grantService.deleteGrant(donorUserInfo, 1);
            expect(result).toBeUndefined();
            expect(grantService.getGrant).toHaveBeenCalledTimes(1);
            expect(grantService.getGrant).toHaveBeenCalledWith(donorUserInfo, 1);
            expect(mockGrantDao.deleteGrantById).toHaveBeenCalledTimes(1);
            expect(mockGrantDao.deleteGrantById).toHaveBeenCalledWith(1);
        });
        describe("Error paths", () => {
            test("Unauthenticated", async () => {
                await expect(grantService.deleteGrant(null, 1)).rejects.toThrowError(UnauthenticatedError_1.UnauthenticatedError);
            });
            test("No grant ID", async () => {
                await expect(grantService.deleteGrant(donorUserInfo, null)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("User is not a member of the organization", async () => {
                mockOrganizationService.userBelongsToOrganization.mockImplementation(() => Promise.resolve(false));
                // Call under test
                await expect(grantService.deleteGrant(donorUserInfo, 1)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
                expect(grantService.getGrant).toHaveBeenCalledTimes(1);
                expect(grantService.getGrant).toHaveBeenCalledWith(donorUserInfo, 1);
                expect(mockGrantDao.deleteGrantById).not.toHaveBeenCalled();
            });
        });
    });
    describe("useOrCreateEligibilityCriteria tests", () => {
        test("Null eligibility criteria", async () => {
            const grant = createRequestDto();
            grant.eligibilityCriteria = null;
            // Call under test
            const result = await grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant);
            expect(result).toBeNull();
        });
        test("Existing eligibility criteria", async () => {
            const grant = createRequestDto();
            const eligibilityCriteria = new EligibilityCriteria_1.EligibilityCriteria();
            eligibilityCriteria.id = 2414;
            grant.eligibilityCriteria = eligibilityCriteria;
            mockEligibilityService.getEligibilityCriteria
                .mockImplementation((id) => {
                const ec = new EligibilityCriteria_1.EligibilityCriteria();
                ec.id = id;
                ec.organizationId = grant.organization.id;
                return Promise.resolve(ec);
            });
            // Call under test
            const result = await grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant);
            expect(result.id).toEqual(grant.eligibilityCriteria.id);
            expect(result.organizationId).toEqual(grant.organization.id);
            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledTimes(1);
            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledWith(grant.eligibilityCriteria.id);
        });
        test("New eligibility criteria", async () => {
            const grant = createRequestDto();
            const eligibilityCriteria = new EligibilityCriteria_1.EligibilityCriteria();
            eligibilityCriteria.id = null;
            eligibilityCriteria.organizationId = grant.organization.id;
            grant.eligibilityCriteria = eligibilityCriteria;
            mockEligibilityService.createEligibilityCriteria
                .mockImplementation((passedUserInfo, ec) => {
                expect(passedUserInfo).toBe(donorUserInfo);
                expect(ec).toBe(grant.eligibilityCriteria);
                ec.id = 53255;
                return Promise.resolve(ec);
            });
            // Call under test
            const result = await grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant);
            expect(result.id).toEqual(grant.eligibilityCriteria.id);
            expect(result.organizationId).toEqual(grant.organization.id);
            expect(mockEligibilityService.createEligibilityCriteria).toBeCalledTimes(1);
            expect(mockEligibilityService.createEligibilityCriteria).toBeCalledWith(donorUserInfo, grant.eligibilityCriteria);
        });
        test("Organization ID mismatch", async () => {
            const grant = createRequestDto();
            const eligibilityCriteria = new EligibilityCriteria_1.EligibilityCriteria();
            eligibilityCriteria.id = 2414;
            grant.eligibilityCriteria = eligibilityCriteria;
            mockEligibilityService.getEligibilityCriteria
                .mockImplementation((id) => {
                const ec = new EligibilityCriteria_1.EligibilityCriteria();
                ec.id = id;
                ec.organizationId = grant.organization.id + 1; // This will cause it to fail
                return Promise.resolve(ec);
            });
            // Call under test
            await expect(grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant)).rejects.toThrow(IllegalArgumentError_1.IllegalArgumentError);
            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledTimes(1);
            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledWith(grant.eligibilityCriteria.id);
        });
    });
    describe("applyToGrant tests", () => {
        let grant;
        const grantId = 1612;
        beforeEach(() => {
            grant = createRequestDto();
            grant.id = grantId;
            grant.startDate = new Date((new Date()).getTime() - 1000 * 60 * 5); // 5 minutes ago
            grant.endDate = new Date((new Date()).getTime() + 1000 * 60 * 5); // 5 minutes from now
            // Mocks needed to get through a successful case
            mockProfileService.getProfile
                .mockImplementation(() => Promise.resolve(new affordable_shared_models_1.ProfileFields.Profile()));
            jest.spyOn(grantService, "getGrant")
                .mockImplementation(() => Promise.resolve(grant));
            mockEligibilityService.meetsEligibilityRequirements
                .mockImplementation(() => true);
        });
        test("Happy path", async () => {
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).resolves.not.toThrowError();
            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);
            expect(grantService.getGrant).toBeCalledTimes(1);
            expect(grantService.getGrant).toBeCalledWith(recipientUserInfo, grantId);
            expect(mockEligibilityService.meetsEligibilityRequirements).toBeCalledTimes(1);
            expect(mockEligibilityService.meetsEligibilityRequirements).toBeCalledWith(recipientUserInfo, grant.eligibilityCriteria);
            const expectedApplicationInfo = new ApplicationInformationDBO_1.ApplicationInformationDBO();
            expectedApplicationInfo.userId = recipientUserInfo.id;
            expectedApplicationInfo.grantId = grantId;
            expect(mockApplicationInfoDao.save).toBeCalledTimes(1);
            expect(mockApplicationInfoDao.save).toBeCalledWith(expectedApplicationInfo);
        });
        test("Unauthenticated", async () => {
            // Call under test
            await expect(grantService.applyToGrant(null, grantId)).rejects.toThrowError(UnauthenticatedError_1.UnauthenticatedError);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("Email not verified", async () => {
            recipientUserInfo.hasVerifiedEmail = false;
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("User is not a recipient", async () => {
            // Call under test
            await expect(grantService.applyToGrant(donorUserInfo, grantId)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("No profile", async () => {
            mockProfileService.getProfile
                .mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("Grant has not started", async () => {
            grant.startDate = new Date((new Date()).getTime() + 1000 * 60 * 5); // 5 minutes into the future
            grant.endDate = new Date((new Date()).getTime() + 1000 * 60 * 10); // 10 minutes into the future
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);
            expect(grantService.getGrant).toBeCalledTimes(1);
            expect(grantService.getGrant).toBeCalledWith(recipientUserInfo, grantId);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("Grant has ended", async () => {
            grant.startDate = new Date((new Date()).getTime() - 1000 * 60 * 10); // 10 minutes in the past
            grant.endDate = new Date((new Date()).getTime() - 1000 * 60 * 5); // 5 minutes in the past
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);
            expect(grantService.getGrant).toBeCalledTimes(1);
            expect(grantService.getGrant).toBeCalledWith(recipientUserInfo, grantId);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("Applicant is ineligible", async () => {
            mockEligibilityService.meetsEligibilityRequirements
                .mockImplementation(() => false);
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);
            expect(grantService.getGrant).toBeCalledTimes(1);
            expect(grantService.getGrant).toBeCalledWith(recipientUserInfo, grantId);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
    });
});
