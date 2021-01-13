import { GrantDBO } from "../../models/orm/grant/GrantDBO";
import { Grant } from "affordable-shared-models";
import { EligibilityCriteriaDBO } from "../../models/orm/grant/EligibilityCriteriaDBO";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { OrganizationUtils } from "../organization/OrganizationUtils";

export class GrantUtils {
    public static convertGrantDtoToDbo(dto: Grant): GrantDBO {
        const dbo = new GrantDBO();
        dbo.id = dto.id;
        dbo.grantName = dto.grantName;
        dbo.grantAmount = dto.grantAmount.toString();
        dbo.startTime = dto.startDate;
        dbo.endTime = dto.endDate;
        dbo.category = dto.category;
        dbo.description = dto.description;
        dbo.organizationId = dto.organization.id;
        dbo.eligibilityCriteriaId = dto.eligibilityCriteria?.id;
        dbo.recipientId = dto.recipientId;
        return dbo;
    }

    public static convertGrantDboToDto(dbo: GrantDBO): Grant {
        const dto = new Grant();
        dto.id = dbo.id;
        dto.grantName = dbo.grantName;
        dto.description = dbo.description;
        dto.category = dbo.category;
        dto.grantAmount = Number.parseFloat(dbo.grantAmount);
        dto.startDate = dbo.startTime;
        dto.endDate = dbo.endTime;
        dto.organization = OrganizationUtils.mapDboToDto(dbo.organization);
        dto.eligibilityCriteria = dbo.eligibilityCriteriaId ? GrantUtils.convertEligibilityDboToDto(dbo.eligibilityCriteria) : null;
        dto.recipientId = dbo.recipientId;
        return dto;
    }

    public static convertEligibilityDboToDto(dbo: EligibilityCriteriaDBO): EligibilityCriteria {
        const dto = new EligibilityCriteria();
        dto.id = dbo.id;
        dto.organizationId = dbo.organizationId;
        dto.emailAddress = dbo.emailAddress;
        return dto;
    }

    public static convertEligibilityDtoToDbo(dto: EligibilityCriteria): EligibilityCriteriaDBO {
        const dbo = new EligibilityCriteriaDBO();
        dbo.id = dto.id;
        dbo.organizationId = dto.organizationId;
        dbo.emailAddress = dto.emailAddress;
        return dbo;
    }


}