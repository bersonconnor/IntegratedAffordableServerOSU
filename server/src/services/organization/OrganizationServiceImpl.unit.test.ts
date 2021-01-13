import { Organization, UserInfo, UserType } from "affordable-shared-models";
import uuid from "uuid/v4";
import { IllegalArgumentError } from "../../models/IllegalArgumentError";
import { mock } from "jest-mock-extended";
import { AffordableEmailClient } from "../email/AffordableEmailClient";
import { OrganizationDAO } from "../../database/dao/organization/OrganizationDAO";
import { OrganizationMembershipDAO } from "../../database/dao/organization/OrganizationMembershipDAO";
import { OrganizationServiceImpl } from "./OrganizationServiceImpl";
import { OrganizationUtils } from "./OrganizationUtils";
import { NotFoundError } from "../../models/NotFoundError";
import { OrganizationDBO } from "../../models/orm/OrganizationDBO";
import { AuthenticationService } from "../AuthenticationService";
import { UnauthorizedError } from "../../models/UnauthorizedError";

let user: UserInfo;
const USER_ID = 4214;
let organizationService: OrganizationServiceImpl;

const mockAuthNService = mock<AuthenticationService>();
const mockOrgDao = mock<OrganizationDAO>();
const mockOrgMembershipDao = mock<OrganizationMembershipDAO>();
const mockEmailClient = mock<AffordableEmailClient>();


describe("OrganizationServiceImpl tests", () => {
    let minimumDto: Organization;

    beforeAll(() => {
        organizationService = new OrganizationServiceImpl(mockAuthNService, mockOrgDao, mockOrgMembershipDao, mockEmailClient);
    });
    
    beforeEach(() => {
       user = new UserInfo();
       user.id = USER_ID;
       user.username = uuid();
       user.userType = UserType.DONOR;
       user.hasVerifiedEmail = true;

       minimumDto = new Organization();
       minimumDto.name = "My Org Name" + uuid();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createOrganization tests", () => {
        test("Happy path", async () => {
            const apiKey = "My key";
            const organization = new Organization();
            organization.name = "My Org Name" + uuid();
            // Add an API key to make sure it gets overwritten
            organization.apiKey = apiKey;

            let createdDbo: OrganizationDBO;
            mockOrgDao.saveOrganization.mockImplementation((dbo: OrganizationDBO): Promise<OrganizationDBO> => {
                dbo.id = 3423523;
                createdDbo = dbo;
                return Promise.resolve(dbo);
            });
            jest.spyOn(organizationService, "getOrganization").mockImplementation(() => Promise.resolve(createdDbo));

            // Call under test
            const result = await organizationService.createOrganization(user, organization);

            expect(result.id).not.toBeNull();
            expect(result.apiKey).not.toEqual(apiKey);
            expect(result.name).toEqual(organization.name);

            expect(mockOrgDao.saveOrganization).toBeCalledWith(OrganizationUtils.mapDtoToDbo(createdDbo));
        });

        test("createOrganization validation: no organization name", async () => {
            await expect(organizationService.createOrganization(user, new Organization())).rejects.toThrowError(IllegalArgumentError);
        });
    });

    describe("updateOrganization tests", () => {
        test("Happy path", async () => {
            const oldApiKey = "this should not change";
            const oldOrg = new Organization();
            oldOrg.id = 5;
            oldOrg.name = "My old org Name" + uuid();
            oldOrg.apiKey = oldApiKey;

            const updateRequest = new Organization();
            updateRequest.id = 5;
            updateRequest.name = "My Org Name" + uuid();
            updateRequest.apiKey = "this should be overwritten";

            jest.spyOn(organizationService, "userBelongsToOrganization").mockImplementation(() => Promise.resolve(true));
            let updatedDbo: OrganizationDBO;
            mockOrgDao.saveOrganization.mockImplementation((dbo: OrganizationDBO): Promise<OrganizationDBO> => {
                updatedDbo = dbo;
                return Promise.resolve(dbo);
            });
            jest.spyOn(organizationService, "getOrganization").mockImplementation(
                () => Promise.resolve(oldOrg));


            const result = await organizationService.updateOrganization(user, updateRequest);

            expect(result.id).toEqual(updateRequest.id);
            expect(result.apiKey).toEqual(oldApiKey);
            expect(result.name).toEqual(updateRequest.name);

            expect(mockOrgDao.saveOrganization).toBeCalledWith(OrganizationUtils.mapDtoToDbo({id: 5, name: updateRequest.name, apiKey: oldApiKey} as OrganizationDBO));
        });

        test("Update an organization that doesn't exist", async () => {
            const organization = new Organization();
            organization.id = 5;
            organization.name = "My Org Name" + uuid();

            jest.spyOn(organizationService, "getOrganization").mockImplementation(
                () => {throw new NotFoundError("");});

            await expect(organizationService.updateOrganization(user, organization))
                .rejects.toThrowError(NotFoundError);
        });

        describe("updateOrganization error paths", () => {
            test("No ID", async () => {
                minimumDto.id = null;
                await expect(organizationService.updateOrganization(user, minimumDto)).rejects.toThrowError(IllegalArgumentError);
            });
            test("No name", async () => {
                minimumDto.id = 453235;
                minimumDto.name = null;
                await expect(organizationService.updateOrganization(user, minimumDto)).rejects.toThrowError(IllegalArgumentError);
            });
            test("User doesn't belong to organization", async () => {
                minimumDto.id = 324453;
                jest.spyOn(organizationService, "userBelongsToOrganization").mockImplementation(() => Promise.resolve(false));
                await expect(organizationService.updateOrganization(user, minimumDto)).rejects.toThrowError(UnauthorizedError);

            });
        });
    });

});