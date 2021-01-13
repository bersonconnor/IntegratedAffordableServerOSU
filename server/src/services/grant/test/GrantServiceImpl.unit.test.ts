import { mock } from "jest-mock-extended";
import { GrantServiceImpl } from "../GrantServiceImpl";
import { GrantDAO } from "../../../database/dao/grant/GrantDAO";
import { Grant, UserInfo, UserType, ProfileFields } from "affordable-shared-models";
import { OrganizationService } from "../../organization/OrganizationService";
import { ApplicationInformationDAO } from "../../../database/dao/grant/ApplicationInformationDAO";
import { EligibilityCriteriaService } from "../EligibilityCriteriaService";
import { AuthenticationService } from "../../AuthenticationService";
import { IllegalArgumentError } from "../../../models/IllegalArgumentError";
import { UnauthenticatedError } from "../../../models/UnauthenticatedError";
import { UnauthorizedError } from "../../../models/UnauthorizedError";
import { NotFoundError } from "../../../models/NotFoundError";
import { GrantUtils } from "../GrantUtils";
import { GrantDBO } from "../../../models/orm/grant/GrantDBO";
import { OrganizationDBO } from "../../../models/orm/OrganizationDBO";
import { EligibilityCriteriaDBO } from "../../../models/orm/grant/EligibilityCriteriaDBO";
import { ProfileService } from "../../ProfileService";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { ApplicationInformationDBO } from "../../../models/orm/grant/ApplicationInformationDBO";
import { IllegalStateError } from "../../../models/IllegalStateError";

const mockGrantDao = mock<GrantDAO>();
const mockApplicationInfoDao = mock<ApplicationInformationDAO>();
const mockOrganizationService = mock<OrganizationService>();
const mockEligibilityService = mock<EligibilityCriteriaService>();
const mockProfileService = mock<ProfileService>();
const mockAuthNService = mock<AuthenticationService>();

let grantService: GrantServiceImpl;

const NEW_GRANT_ID = 234;
const ORGANIZATION_ID = 4234234;

function createRequestDto(): Grant {
    const requestDto = new Grant();
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
    let donorUserInfo: UserInfo;
    let recipientUserInfo: UserInfo;

    beforeAll(() => {
        grantService = new GrantServiceImpl(mockGrantDao,
            mockApplicationInfoDao,
            mockOrganizationService,
            mockEligibilityService,
            mockProfileService,
            mockAuthNService);
    });

    beforeEach(() => {
        donorUserInfo = new UserInfo();
        donorUserInfo.id = 1234;
        donorUserInfo.hasVerifiedEmail = true;
        donorUserInfo.userType = UserType.DONOR;

        recipientUserInfo = new UserInfo();
        recipientUserInfo.id = 4321;
        recipientUserInfo.hasVerifiedEmail = true;
        recipientUserInfo.userType = UserType.RECIPIENT;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("getGrant tests", () => {
        describe("Successful cases", () => {
            test("Basic get", async () => {
                const id = 424;

                const returnedDbo = new GrantDBO();
                returnedDbo.id = id;
                returnedDbo.grantName = "A cool grant";
                returnedDbo.organizationId = ORGANIZATION_ID;
                returnedDbo.organization = new OrganizationDBO();
                returnedDbo.organization.id = ORGANIZATION_ID;
                returnedDbo.organization.name = "Cool org name";
                returnedDbo.organization.apiKey = "this is sensitive info";
                returnedDbo.eligibilityCriteria = new EligibilityCriteriaDBO();
                returnedDbo.eligibilityCriteria.id = 243143;
                returnedDbo.eligibilityCriteriaId = 243143;

                // DAO get must return a grant
                mockGrantDao.getGrantById.mockImplementation(() => {
                    return Promise.resolve(returnedDbo);
                });


                // Call under test
                const result = await grantService.getGrant(donorUserInfo, id);

                const expected = GrantUtils.convertGrantDboToDto(returnedDbo);
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
                    throw new NotFoundError("");
                });

                // Call under test
                await expect(grantService.getGrant(donorUserInfo, id)).rejects.toThrowError(NotFoundError);

                expect(mockGrantDao.getGrantById).toBeCalledTimes(1);
                expect(mockGrantDao.getGrantById).toBeCalledWith(id);
            });

            test("No ID", async () => {
                await expect(grantService.getGrant(donorUserInfo, null)).rejects.toThrowError(IllegalArgumentError);
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
                    const grant = new Grant();
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
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
                test("No organization", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("No organization id", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization.id = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("No grant amount", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantAmount = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("No description", async () => {
                    const requestDto = createRequestDto();
                    requestDto.description = null;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("Recipient is set", async () => {
                    const requestDto = createRequestDto();
                    requestDto.recipientId = 2343;
                    // Call under test
                    await expect(grantService.createGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
            });

            test("Unauthenticated", async () => {
                await expect(grantService.createGrant(null, createRequestDto())).rejects.toThrowError(UnauthenticatedError);
            });

            test("User is not a donor", async () => {
                donorUserInfo.userType = UserType.RECIPIENT;
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("User doesn't belong to organization", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => Promise.resolve(false));

                // Call under test
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("Can't use eligibility criteria", async () => {
                jest.spyOn(grantService, "useOrCreateEligibilityCriteria")
                    .mockImplementation(() => {
                        throw new UnauthorizedError("");
                    });

                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("Organization doesn't exist", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => {throw new NotFoundError("");});
                await expect(grantService.createGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(NotFoundError);
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
                    const grant = new Grant();
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
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
                test("No grant name", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantName = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
                test("No organization", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("No organization id", async () => {
                    const requestDto = createRequestDto();
                    requestDto.organization.id = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("No grant amount", async () => {
                    const requestDto = createRequestDto();
                    requestDto.grantAmount = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });

                test("No description", async () => {
                    const requestDto = createRequestDto();
                    requestDto.description = null;
                    // Call under test
                    await expect(grantService.updateGrant(donorUserInfo, requestDto)).rejects.toThrowError(IllegalArgumentError);
                });
            });

            test("Unauthenticated", async () => {
                await expect(grantService.updateGrant(null, createRequestDto())).rejects.toThrowError(UnauthenticatedError);
            });

            test("User is not a donor", async () => {
                donorUserInfo.userType = UserType.RECIPIENT;
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("User doesn't belong to organization", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => Promise.resolve(false));

                // Call under test
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("Can't use eligibility criteria", async () => {
                jest.spyOn(grantService, "useOrCreateEligibilityCriteria")
                    .mockImplementation(() => {
                        throw new UnauthorizedError("");
                    });

                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(UnauthorizedError);
            });

            test("Organization doesn't exist", async () => {
                mockOrganizationService.userBelongsToOrganization
                    .mockImplementation(() => {throw new NotFoundError("");});
                await expect(grantService.updateGrant(donorUserInfo, createRequestDto())).rejects.toThrowError(NotFoundError);
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
                await expect(grantService.deleteGrant(null,1)).rejects.toThrowError(UnauthenticatedError);
            });


            test("No grant ID", async () => {
                await expect(grantService.deleteGrant(donorUserInfo, null)).rejects.toThrowError(IllegalArgumentError);
            });

            test("User is not a member of the organization", async () => {
                mockOrganizationService.userBelongsToOrganization.mockImplementation(() => Promise.resolve(false));

                // Call under test
                await expect(grantService.deleteGrant(donorUserInfo, 1)).rejects.toThrowError(UnauthorizedError);

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
            const eligibilityCriteria = new EligibilityCriteria();
            eligibilityCriteria.id = 2414;
            grant.eligibilityCriteria = eligibilityCriteria;

            mockEligibilityService.getEligibilityCriteria
            .mockImplementation((id: number) => {
                const ec = new EligibilityCriteria();
                ec.id = id;
                ec.organizationId = grant.organization.id;
                return Promise.resolve(ec);
            })

            // Call under test
            const result = await grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant);
            expect(result.id).toEqual(grant.eligibilityCriteria.id);
            expect(result.organizationId).toEqual(grant.organization.id);

            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledTimes(1);
            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledWith(grant.eligibilityCriteria.id);
        });

        test("New eligibility criteria", async () => {
            const grant = createRequestDto();
            const eligibilityCriteria = new EligibilityCriteria();
            eligibilityCriteria.id = null;
            eligibilityCriteria.organizationId = grant.organization.id;
            grant.eligibilityCriteria = eligibilityCriteria;

            mockEligibilityService.createEligibilityCriteria
            .mockImplementation((passedUserInfo: UserInfo, ec: EligibilityCriteria) => {
                expect(passedUserInfo).toBe(donorUserInfo);
                expect(ec).toBe(grant.eligibilityCriteria);
                ec.id = 53255;
                return Promise.resolve(ec);
            })

            // Call under test
            const result = await grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant);
            expect(result.id).toEqual(grant.eligibilityCriteria.id);
            expect(result.organizationId).toEqual(grant.organization.id);

            expect(mockEligibilityService.createEligibilityCriteria).toBeCalledTimes(1);
            expect(mockEligibilityService.createEligibilityCriteria).toBeCalledWith(donorUserInfo, grant.eligibilityCriteria);

        });

        test("Organization ID mismatch", async () => {
            const grant = createRequestDto();
            const eligibilityCriteria = new EligibilityCriteria();
            eligibilityCriteria.id = 2414;
            grant.eligibilityCriteria = eligibilityCriteria;

            mockEligibilityService.getEligibilityCriteria
            .mockImplementation((id: number) => {
                const ec = new EligibilityCriteria();
                ec.id = id;
                ec.organizationId = grant.organization.id + 1; // This will cause it to fail
                return Promise.resolve(ec);
            })

            // Call under test
            await expect(grantService.useOrCreateEligibilityCriteria(donorUserInfo, grant)).rejects.toThrow(IllegalArgumentError);

            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledTimes(1);
            expect(mockEligibilityService.getEligibilityCriteria).toBeCalledWith(grant.eligibilityCriteria.id);
        });
    });

    describe("applyToGrant tests", () => {
        let grant: Grant;
        const grantId = 1612;
        beforeEach(() => {
            grant = createRequestDto();
            grant.id = grantId
            grant.startDate = new Date((new Date()).getTime() - 1000 * 60 * 5); // 5 minutes ago
            grant.endDate = new Date((new Date()).getTime() + 1000 * 60 * 5); // 5 minutes from now
    
            // Mocks needed to get through a successful case
            mockProfileService.getProfile
            .mockImplementation(() => Promise.resolve(new ProfileFields.Profile()))

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

            const expectedApplicationInfo = new ApplicationInformationDBO();
            expectedApplicationInfo.userId = recipientUserInfo.id;
            expectedApplicationInfo.grantId = grantId;
            expect(mockApplicationInfoDao.save).toBeCalledTimes(1);
            expect(mockApplicationInfoDao.save).toBeCalledWith(expectedApplicationInfo);
        });
        test("Unauthenticated", async () => {
            // Call under test
            await expect(grantService.applyToGrant(null, grantId)).rejects.toThrowError(UnauthenticatedError);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("Email not verified", async () => {
            recipientUserInfo.hasVerifiedEmail = false
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("User is not a recipient", async () => {
            // Call under test
            await expect(grantService.applyToGrant(donorUserInfo, grantId)).rejects.toThrowError(UnauthorizedError);
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("No profile", async () => {
            mockProfileService.getProfile
            .mockImplementation(() => {throw new NotFoundError("");})
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError);

            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);

            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
        test("Grant has not started", async () => {
            grant.startDate = new Date((new Date()).getTime() + 1000 * 60 * 5); // 5 minutes into the future
            grant.endDate = new Date((new Date()).getTime() + 1000 * 60 * 10); // 10 minutes into the future
            // Call under test
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError);

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
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError);

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
            await expect(grantService.applyToGrant(recipientUserInfo, grantId)).rejects.toThrowError(UnauthorizedError);

            expect(mockProfileService.getProfile).toBeCalledTimes(1);
            expect(mockProfileService.getProfile).toBeCalledWith(recipientUserInfo.id);

            expect(grantService.getGrant).toBeCalledTimes(1);
            expect(grantService.getGrant).toBeCalledWith(recipientUserInfo, grantId);
            
            expect(mockApplicationInfoDao.save).not.toBeCalled();
        });
    });
});