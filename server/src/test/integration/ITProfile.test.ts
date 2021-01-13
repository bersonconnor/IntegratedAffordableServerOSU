import { AffordableClient } from "affordable-client";
import { ProfileFields, UserType } from "affordable-shared-models";
import { IntegrationTestUtils } from "../../testUtils/IntegrationTestUtils";

const integrationTestUtils = new IntegrationTestUtils();

let userClient: AffordableClient;

function createProfileDto(): ProfileFields.Profile {
    const profile: ProfileFields.Profile = new ProfileFields.Profile();

    const legalName = new ProfileFields.LegalName();
    legalName.firstName = "John";
    legalName.middleName = "Jean";
    legalName.lastName = "Smith";
    legalName.suffix = ProfileFields.Suffix.JR;
    legalName.currentName = true;

    const idInfo = new ProfileFields.IdentificationInfo();
    idInfo.citizenshipStatus = ProfileFields.CitizenshipStatus.CITIZEN;
    idInfo.countryOfBirth = "United States";

    idInfo.ssn = "123456789";
    idInfo.alienNumber = null;

    const address = new ProfileFields.Address();
    address.city = "Orlando";
    address.state = "Florida";
    address.street = "Main";
    address.zip = "12345";

    const infoProvider = new ProfileFields.InformationProvider();
    infoProvider.self = true;
    infoProvider.providerName = null;
    infoProvider.providerRelationship = null;
    infoProvider.providerEmployment = "Home Depot";

    const hi = new ProfileFields.HealthInsuranceInfo();
    hi.primaryCarrier = "Aetna";
    hi.planType = ProfileFields.HealthInsurancePlanType.EPO;
    hi.policyNumber = "19823782";
    hi.policyHolderIsSelf = true;
    hi.policyHolderName = null;
    hi.offeredByEmployer = false;
    hi.employerName = null;
    hi.groupNumber = null;
    hi.deductiblesOrCopayments = false;

    const employedInfo = new ProfileFields.EmployedInfo();
    employedInfo.employerName = "Burger King";
    employedInfo.positionTitle = "Manager";
    employedInfo.grossAnnualIncome = "40,000";

    const finances = new ProfileFields.FinanceInfo();
    finances.currentlyEmployed = true;
    finances.employedInfo = employedInfo;
    finances.unemployedInfo = null;
    finances.receiveFinancialAssistance = false;
    finances.assistanceText = null;
    finances.receiveSocialSecurity = false;
    finances.peopleInHouseHold = 7;

    const hc = new ProfileFields.PhysicianInfo();
    hc.firstName = "Ben";
    hc.lastName = "Thomas";
    hc.practiceLocation = "Somewhere";

    profile.legalNames = [legalName];
    profile.sex = ProfileFields.BiologicalSex.MALE;
    profile.ethnicity = "Hispanic";
    profile.birthDate = "2001-10-27";
    profile.identificationInfo = idInfo;
    profile.address = address;
    profile.maritalStatus = ProfileFields.MaritalStatus.DIVORCED;
    profile.numberOfProvidedChildren = 4;
    profile.phoneNumbers = ["7408171234"];
    profile.preferredLanguage = "English";
    profile.informationProvider = infoProvider;
    profile.healthInsurance = hi;
    profile.finances = finances;
    profile.healthCare = hc;

    return profile;
} // end of createProfileDto()

describe("Integration tests to create a profile", () => {

    beforeAll(async () => {
        userClient = await integrationTestUtils.createUserAndLogin(UserType.RECIPIENT);
    });

    test("Create/update/get a user profile",  async () => {
        const user = await userClient.getMyUserInfo();
        const profile = createProfileDto();

        // Create
        const createdProfile: ProfileFields.Profile = await userClient.createProfile(profile);
        expect(createdProfile).toBeDefined();
        expect(createdProfile).toEqual("OK");

        // Get
        const retrievedProfile: ProfileFields.Profile = await userClient.getProfile(user.id);
        expect(retrievedProfile).toBeDefined();
        // expect(retrievedProfile).toEqual(profile);

        // Delete
        await userClient.deleteProfile(user.id);
        await expect(userClient.getProfile(user.id)).rejects.toThrowError();
    });
});
