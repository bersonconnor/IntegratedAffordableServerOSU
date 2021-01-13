import {OrganizationDBO} from "../../models/orm/OrganizationDBO";
import {Organization} from "affordable-shared-models";

export class OrganizationUtils {
    static mapDboToDto(dbo: OrganizationDBO): Organization {
        const dto = new Organization();
        dto.id = dbo.id;
        dto.name = dbo.name;
        dto.email = dbo.email;
        dto.phone = dbo.phone;
        dto.fax = dbo.fax;
        dto.url = dbo.websiteUrl;
        dto.missionStatement = dbo.mission;
        dto.providesService = dbo.provideService;
        dto.hasBankingInfo = dbo.addBankingInfo;
        dto.isVerified = dbo.verified;
        dto.apiKey = dbo.apiKey;
        dto.ein = dbo.ein;
        dto.irsActivityCode = dbo.irsActivityCode;
        dto.taxSection = dbo.taxSection;
        return dto;
    }

    static mapDtoToDbo(dto: Organization): OrganizationDBO {
        const organization = new OrganizationDBO();
        organization.id = dto.id;
        organization.name = dto.name;
        organization.email = dto.email;
        organization.phone = dto.phone;
        organization.fax = dto.fax;
        organization.websiteUrl = dto.url;
        organization.mission = dto.missionStatement;
        organization.provideService = dto.providesService;
        organization.addBankingInfo = dto.hasBankingInfo;
        organization.verified = dto.isVerified;
        organization.apiKey = dto.apiKey;
        organization.ein = dto.ein;
        organization.irsActivityCode = dto.irsActivityCode;
        organization.taxSection = dto.taxSection;
        return organization;
    }

    static redactPrivateInformation(organization: Organization): Organization {
        organization.apiKey = undefined;
        return organization;
    }
}