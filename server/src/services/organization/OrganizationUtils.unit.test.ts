import { Organization } from "affordable-shared-models";
import { OrganizationUtils } from "./OrganizationUtils";
import { OrganizationDBO } from "../../models/orm/OrganizationDBO";

describe("OrganizationUtils tests", () => {

    test("Organization DBO to DTO", () => {
        const dbo = new OrganizationDBO();
        dbo.id = 43242;
        dbo.addBankingInfo = false;
        dbo.apiKey = "apiKey";
        dbo.ein = "342432";
        dbo.email = "email add";
        dbo.fax = "fax num";
        dbo.irsActivityCode = "code";
        dbo.mission = "A mission";
        dbo.name = "Org name";
        dbo.phone = "12345";
        dbo.provideService = false;
        dbo.taxSection = "123455787";
        dbo.verified = true;
        dbo.websiteUrl = "my website";

        const expected = new Organization();
        expected.id = 43242;
        expected.hasBankingInfo = false;
        expected.apiKey = "apiKey";
        expected.ein = "342432";
        expected.email = "email add";
        expected.fax = "fax num";
        expected.irsActivityCode = "code";
        expected.missionStatement = "A mission";
        expected.name = "Org name";
        expected.phone = "12345";
        expected.providesService = false;
        expected.taxSection = "123455787";
        expected.isVerified = true;
        expected.url = "my website";

        // Call under test
        const result = OrganizationUtils.mapDboToDto(dbo);

        expect(result).toEqual(expected);
    });

    test("Organization DTO to DBO", () => {
        const dto = new Organization();
        dto.id = 43242;
        dto.hasBankingInfo = false;
        dto.apiKey = "apiKey";
        dto.ein = "342432";
        dto.email = "email add";
        dto.fax = "fax num";
        dto.irsActivityCode = "code";
        dto.missionStatement = "A mission";
        dto.name = "Org name";
        dto.phone = "12345";
        dto.providesService = false;
        dto.taxSection = "123455787";
        dto.isVerified = true;
        dto.url = "my website";

        const expected = new OrganizationDBO();
        expected.id = 43242;
        expected.addBankingInfo = false;
        expected.apiKey = "apiKey";
        expected.ein = "342432";
        expected.email = "email add";
        expected.fax = "fax num";
        expected.irsActivityCode = "code";
        expected.mission = "A mission";
        expected.name = "Org name";
        expected.phone = "12345";
        expected.provideService = false;
        expected.taxSection = "123455787";
        expected.verified = true;
        expected.websiteUrl = "my website";

        // Call under test
        const result = OrganizationUtils.mapDtoToDbo(dto);

        expect(result).toEqual(expected);
    });

    test("Redact information", () => {
        const organization = new Organization();
        organization.apiKey = "my secret";

        // Call under test
        const result = OrganizationUtils.redactPrivateInformation(organization);
        expect(result.apiKey).toBeUndefined();
    });

});