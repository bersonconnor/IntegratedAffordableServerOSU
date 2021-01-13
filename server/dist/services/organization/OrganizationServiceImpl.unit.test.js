"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
const IllegalArgumentError_1 = require("../../models/IllegalArgumentError");
const jest_mock_extended_1 = require("jest-mock-extended");
const OrganizationServiceImpl_1 = require("./OrganizationServiceImpl");
const OrganizationUtils_1 = require("./OrganizationUtils");
const NotFoundError_1 = require("../../models/NotFoundError");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
let user;
const USER_ID = 4214;
let organizationService;
const mockAuthNService = jest_mock_extended_1.mock();
const mockOrgDao = jest_mock_extended_1.mock();
const mockOrgMembershipDao = jest_mock_extended_1.mock();
const mockEmailClient = jest_mock_extended_1.mock();
describe("OrganizationServiceImpl tests", () => {
    let minimumDto;
    beforeAll(() => {
        organizationService = new OrganizationServiceImpl_1.OrganizationServiceImpl(mockAuthNService, mockOrgDao, mockOrgMembershipDao, mockEmailClient);
    });
    beforeEach(() => {
        user = new affordable_shared_models_1.UserInfo();
        user.id = USER_ID;
        user.username = v4_1.default();
        user.userType = affordable_shared_models_1.UserType.DONOR;
        user.hasVerifiedEmail = true;
        minimumDto = new affordable_shared_models_1.Organization();
        minimumDto.name = "My Org Name" + v4_1.default();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createOrganization tests", () => {
        test("Happy path", async () => {
            const apiKey = "My key";
            const organization = new affordable_shared_models_1.Organization();
            organization.name = "My Org Name" + v4_1.default();
            // Add an API key to make sure it gets overwritten
            organization.apiKey = apiKey;
            let createdDbo;
            mockOrgDao.saveOrganization.mockImplementation((dbo) => {
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
            expect(mockOrgDao.saveOrganization).toBeCalledWith(OrganizationUtils_1.OrganizationUtils.mapDtoToDbo(createdDbo));
        });
        test("createOrganization validation: no organization name", async () => {
            await expect(organizationService.createOrganization(user, new affordable_shared_models_1.Organization())).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
        });
    });
    describe("updateOrganization tests", () => {
        test("Happy path", async () => {
            const oldApiKey = "this should not change";
            const oldOrg = new affordable_shared_models_1.Organization();
            oldOrg.id = 5;
            oldOrg.name = "My old org Name" + v4_1.default();
            oldOrg.apiKey = oldApiKey;
            const updateRequest = new affordable_shared_models_1.Organization();
            updateRequest.id = 5;
            updateRequest.name = "My Org Name" + v4_1.default();
            updateRequest.apiKey = "this should be overwritten";
            jest.spyOn(organizationService, "userBelongsToOrganization").mockImplementation(() => Promise.resolve(true));
            let updatedDbo;
            mockOrgDao.saveOrganization.mockImplementation((dbo) => {
                updatedDbo = dbo;
                return Promise.resolve(dbo);
            });
            jest.spyOn(organizationService, "getOrganization").mockImplementation(() => Promise.resolve(oldOrg));
            const result = await organizationService.updateOrganization(user, updateRequest);
            expect(result.id).toEqual(updateRequest.id);
            expect(result.apiKey).toEqual(oldApiKey);
            expect(result.name).toEqual(updateRequest.name);
            expect(mockOrgDao.saveOrganization).toBeCalledWith(OrganizationUtils_1.OrganizationUtils.mapDtoToDbo({ id: 5, name: updateRequest.name, apiKey: oldApiKey }));
        });
        test("Update an organization that doesn't exist", async () => {
            const organization = new affordable_shared_models_1.Organization();
            organization.id = 5;
            organization.name = "My Org Name" + v4_1.default();
            jest.spyOn(organizationService, "getOrganization").mockImplementation(() => { throw new NotFoundError_1.NotFoundError(""); });
            await expect(organizationService.updateOrganization(user, organization))
                .rejects.toThrowError(NotFoundError_1.NotFoundError);
        });
        describe("updateOrganization error paths", () => {
            test("No ID", async () => {
                minimumDto.id = null;
                await expect(organizationService.updateOrganization(user, minimumDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("No name", async () => {
                minimumDto.id = 453235;
                minimumDto.name = null;
                await expect(organizationService.updateOrganization(user, minimumDto)).rejects.toThrowError(IllegalArgumentError_1.IllegalArgumentError);
            });
            test("User doesn't belong to organization", async () => {
                minimumDto.id = 324453;
                jest.spyOn(organizationService, "userBelongsToOrganization").mockImplementation(() => Promise.resolve(false));
                await expect(organizationService.updateOrganization(user, minimumDto)).rejects.toThrowError(UnauthorizedError_1.UnauthorizedError);
            });
        });
    });
});
