import {AffordableClient} from "affordable-client";
import {AddMemberRequest, Organization, UserInfo, UserType} from "affordable-shared-models";
import uuidv4 from "uuid/v4";
import {IntegrationTestUtils} from "../../testUtils/IntegrationTestUtils";

let userClient: AffordableClient;

const integrationTestUtils = new IntegrationTestUtils();

function createOrgDto(): Organization {
    const organization: Organization = new Organization();
    organization.name = "A New Org " + uuidv4();
    organization.phone = "A phone number";
    organization.hasBankingInfo = false;
    organization.missionStatement = "Mission";
    organization.providesService = false;
    organization.fax = "fax number";
    organization.email = uuidv4() + "@affordhealth.org";
    organization.url = uuidv4() + ".affordhealth.org";
    organization.isVerified = false;
    organization.ein = null;
    organization.taxSection = null;
    organization.irsActivityCode = null;
    return organization;
}

describe("Integration tests for Organizations", () => {
    beforeEach(async () => {
        userClient = await integrationTestUtils.createUserAndLogin();
    });

    test("Create/update/get an organization",  async () => {
        const organization = createOrgDto();
        // Call under test
        const createdOrg: Organization = await userClient.createOrganization(organization);

        expect(createdOrg.id).toBeDefined();
        expect(createdOrg.apiKey).toBeDefined();
        expect(createdOrg.apiKey.length).toBeGreaterThan(0);
        
        organization.id = createdOrg.id;
        organization.apiKey = createdOrg.apiKey;
        expect(organization).toEqual(createdOrg);
        
        createdOrg.name = "Some other org name " + uuidv4();
        createdOrg.apiKey = "This shouldn't change";
        // Update: Call under test
        const updatedOrg = await userClient.updateOrganization(createdOrg);
        expect(updatedOrg.id).toBe(createdOrg.id);
        expect(updatedOrg.name).toBe(createdOrg.name);
        expect(updatedOrg.apiKey).toBe(organization.apiKey);

        // Get: Call under test
        const retrievedOrg = await userClient.getOrganization(createdOrg.id);
        expect(retrievedOrg).toStrictEqual(updatedOrg);
    });

    test("Get an organization's API key", async () => {
        const organization = createOrgDto();

        const createdOrg: Organization = await userClient.createOrganization(organization);
        // Call under test
        const apiKey = await userClient.getApiKey(createdOrg.id);

        expect(apiKey).toEqual(createdOrg.apiKey);
    });

    test("Add and remove an organization member", async () => {
        let organization = createOrgDto();
        organization = await userClient.createOrganization(organization);
        
        const newMember = await integrationTestUtils.createUserAndLogin(UserType.DONOR);
        const newMemberUserInfo = await newMember.getMyUserInfo();
        const addMemberReq = new AddMemberRequest();
        addMemberReq.organizationId = organization.id;
        addMemberReq.userId = newMemberUserInfo.id;
        addMemberReq.isAdmin = false;
        // Call under test: add
        await userClient.addUserToOrganization(addMemberReq);

        // Call under test: get membership
        let orgMemberships = await newMember.getOrganizationsForUser(newMemberUserInfo.id);
        expect(orgMemberships.length).toEqual(1);
        expect(orgMemberships[0].organization.id).toEqual(organization.id);
        expect(orgMemberships[0].organization.name).toEqual(organization.name); // Organization information should be populated

        // Remove
        await userClient.removeMemberFromOrganization(organization.id, newMemberUserInfo.id);

        // Verify
        orgMemberships = await userClient.getOrganizationsForUser(newMemberUserInfo.id);
        expect(orgMemberships.length).toEqual(0);

    });
});