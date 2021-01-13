import { GrantDBO } from "../../../models/orm/grant/GrantDBO";
import { Grant } from "affordable-shared-models";
import { GrantUtils } from "../GrantUtils";
import { OrganizationDBO } from "../../../models/orm/OrganizationDBO";
import { EligibilityCriteriaDBO } from "../../../models/orm/grant/EligibilityCriteriaDBO";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";

describe("GrantUtils tests", () => {
    test("GrantDBO to Grant DTO without Eligibility Criteria", () => {
        const dbo = new GrantDBO();
        dbo.id = 1;
        dbo.grantName = "My Grant Name";
        dbo.grantAmount = "100.24";
        dbo.category = "My category";
        dbo.description = "";
        dbo.eligibilityCriteriaId = null;
        dbo.startTime = new Date(100);
        dbo.endTime = new Date(200);
        dbo.organization = new OrganizationDBO();
        dbo.organization.id = 324;
        dbo.recipientId = 34;


        const expected = new Grant();
        expected.id = 1;
        expected.grantName = "My Grant Name";
        expected.grantAmount = 100.24;
        expected.category = "My category";
        expected.description = "";
        expected.eligibilityCriteria = null;
        expected.startDate = new Date(100);
        expected.endDate = new Date(200);
        expected.organization = { id: 324 };
        expected.recipientId = 34;
        const result = GrantUtils.convertGrantDboToDto(dbo);

        expect(result).toEqual(expected);
    });

    test("GrantDBO to Grant DTO with Eligibility Criteria", () => {
        const dbo = new GrantDBO();
        dbo.id = 1;
        dbo.grantName = "My Grant Name";
        dbo.grantAmount = "100.24";
        dbo.category = "My category";
        dbo.description = "";
        dbo.eligibilityCriteriaId = 5;
        dbo.eligibilityCriteria = new EligibilityCriteriaDBO();
        dbo.eligibilityCriteria.id = 5;
        dbo.startTime = new Date(100);
        dbo.endTime = new Date(200);
        dbo.organization = new OrganizationDBO();
        dbo.organization.id = 324;
        dbo.recipientId = 34;


        const expected = new Grant();
        expected.id = 1;
        expected.grantName = "My Grant Name";
        expected.grantAmount = 100.24;
        expected.category = "My category";
        expected.description = "";
        expected.eligibilityCriteria = { id: 5 };
        expected.startDate = new Date(100);
        expected.endDate = new Date(200);
        expected.organization = { id: 324 };
        expected.recipientId = 34;

        // Call under test
        const result = GrantUtils.convertGrantDboToDto(dbo);

        expect(result).toEqual(expected);
    });


    test("Grant DTO to GrantDBO", () => {
        const dto = new Grant();
        dto.id = 1;
        dto.grantName = "My Grant Name";
        dto.grantAmount = 100.24;
        dto.category = "My category";
        dto.description = "";
        dto.eligibilityCriteria = { id: 5 };
        dto.startDate = new Date(100);
        dto.endDate = new Date(200);
        dto.organization = { id: 324 };
        dto.recipientId = 34;

        const expected = new GrantDBO();
        expected.id = 1;
        expected.grantName = "My Grant Name";
        expected.grantAmount = "100.24";
        expected.category = "My category";
        expected.description = "";
        expected.eligibilityCriteriaId = 5;
        expected.startTime = new Date(100);
        expected.endTime = new Date(200);
        expected.organizationId = 324;
        expected.recipientId = 34;

        // Call under test
        const result = GrantUtils.convertGrantDtoToDbo(dto);

        expect(result).toEqual(expected);
    });

    test("GrantEligibilityDBO to EligibilityCriteria", () => {
        const dbo = new EligibilityCriteriaDBO();
        dbo.id = 1;
        dbo.organizationId = 4324;
        dbo.emailAddress = "email addr";

        const expected = new EligibilityCriteria();
        expected.id = 1;
        expected.organizationId = 4324;
        expected.emailAddress = "email addr";

        // Call under test
        const result = GrantUtils.convertEligibilityDboToDto(dbo);

        expect(result).toEqual(expected);
    });

    test("EligibilityCriteria to GrantEligibilityDBO", () => {
        const dto = new EligibilityCriteria();
        dto.id = 1;
        dto.organizationId = 4324;
        dto.emailAddress = "email addr";

        const expected = new EligibilityCriteriaDBO();
        expected.id = 1;
        expected.organizationId = 4324;
        expected.emailAddress = "email addr";

        // Call under test
        const result = GrantUtils.convertEligibilityDtoToDbo(dto);

        expect(result).toEqual(expected);
    });
});