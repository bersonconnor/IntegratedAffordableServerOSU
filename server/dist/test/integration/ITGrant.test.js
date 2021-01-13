"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const affordable_shared_models_1 = require("affordable-shared-models");
const IntegrationTestUtils_1 = require("../../testUtils/IntegrationTestUtils");
const v4_1 = __importDefault(require("uuid/v4"));
let donor;
let recipient;
let otherRecipient;
let organization;
const integrationTestUtils = new IntegrationTestUtils_1.IntegrationTestUtils();
const profile = {
    address: {
        street: v4_1.default(),
        city: v4_1.default(),
        state: "OH",
        zip: "43210"
    },
    birthDate: "1970-01-01",
    legalNames: [{
            firstName: v4_1.default(),
            lastName: v4_1.default(),
            currentName: true
        }],
    phoneNumbers: ["1234567890"]
};
const grantsToDelete = [];
describe("Integration tests for grants", () => {
    beforeAll(async () => {
        donor = await integrationTestUtils.createUserAndLogin(affordable_shared_models_1.UserType.DONOR);
        organization = await donor.createOrganization({
            name: "My organization " + v4_1.default()
        });
        recipient = await integrationTestUtils.createUserAndLogin(affordable_shared_models_1.UserType.RECIPIENT);
        otherRecipient = await integrationTestUtils.createUserAndLogin(affordable_shared_models_1.UserType.RECIPIENT);
    });
    afterAll(async () => {
        try {
            for (const grantId of grantsToDelete) {
                await donor.deleteGrant(grantId);
            }
        }
        catch (e) { }
    });
    test("Search for eligible grants, apply, and award", async () => {
        // User cannot see the particular grant that applies to them
        let myEligibleGrants = await recipient.getEligibleGrants();
        // There may be other grants in the database, so let's only look at grants from the new organization
        myEligibleGrants = myEligibleGrants.filter(g => g.organization.id === organization.id);
        expect(myEligibleGrants.length).toBe(0);
        const grant = {
            grantName: "A Test Grant " + v4_1.default(),
            grantAmount: 22.99,
            description: "A grant for testing " + v4_1.default(),
            organization: { id: organization.id }
        };
        // Now, the donor creates a grant.
        let createdGrant = await donor.createGrant(grant);
        grantsToDelete.push(createdGrant.id);
        // Now the user should be able to see it
        myEligibleGrants = await recipient.getEligibleGrants();
        myEligibleGrants = myEligibleGrants.filter(g => g.organization.id === organization.id);
        expect(myEligibleGrants.length).toBe(1);
        expect(myEligibleGrants[0].id).toEqual(createdGrant.id);
        // Let's add an eligibility criteria to hide it from the user
        createdGrant.eligibilityCriteria = { organizationId: organization.id, emailAddress: v4_1.default() };
        createdGrant = await donor.updateGrant(createdGrant);
        // Should not be able to find it
        myEligibleGrants = await recipient.getEligibleGrants();
        myEligibleGrants = myEligibleGrants.filter(g => g.organization.id === organization.id);
        expect(myEligibleGrants.length).toBe(0);
        // Let's create an eligibility criteria that makes it so only one user can see it
        createdGrant.eligibilityCriteria = { organizationId: organization.id, emailAddress: (await recipient.getMyUserInfo()).primaryEmail };
        createdGrant = await donor.updateGrant(createdGrant);
        // Should be able to find it
        myEligibleGrants = await recipient.getEligibleGrants();
        myEligibleGrants = myEligibleGrants.filter(g => g.organization.id === organization.id);
        expect(myEligibleGrants.length).toBe(1);
        expect(myEligibleGrants[0].id).toEqual(createdGrant.id);
        // Another user should not be able to find it
        let othersEligibleGrants = await otherRecipient.getEligibleGrants();
        othersEligibleGrants = othersEligibleGrants.filter(g => g.organization.id === organization.id);
        expect(othersEligibleGrants.length).toBe(0);
        // Donor should see no applicants
        let applicants = await donor.getGrantApplicants(createdGrant.id);
        expect(applicants.length).toEqual(0);
        // No one should be able to apply to a grant without a profile
        await expect(recipient.applyToGrant(createdGrant.id)).rejects.toThrowError();
        await recipient.createProfile(profile);
        await otherRecipient.createProfile(profile);
        // Recipient should be able to apply for it
        await recipient.applyToGrant(createdGrant.id);
        // Other recipient should not
        await expect(otherRecipient.applyToGrant(createdGrant.id)).rejects.toThrowError();
        // There should now be one applicant, the user
        const mainUserInfo = await recipient.getMyUserInfo();
        const otherUserInfo = await otherRecipient.getMyUserInfo();
        applicants = await donor.getGrantApplicants(createdGrant.id);
        expect(applicants.length).toEqual(1);
        expect(applicants[0].userInfo).toEqual(mainUserInfo);
        expect(applicants[0].profile).toEqual(await recipient.getProfile(mainUserInfo.id));
        // Attempt to award grant to the user that didn't apply
        await expect(donor.awardGrantToUser(otherUserInfo.id, createdGrant.id)).rejects.toThrowError();
        // Award the grant to the user that did apply and check it
        await donor.awardGrantToUser(mainUserInfo.id, createdGrant.id);
        createdGrant = await donor.getGrant(createdGrant.id);
        expect(createdGrant.recipientId).toEqual(mainUserInfo.id);
    });
});
