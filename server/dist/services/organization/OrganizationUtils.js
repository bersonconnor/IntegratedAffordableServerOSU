"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUtils = void 0;
const OrganizationDBO_1 = require("../../models/orm/OrganizationDBO");
const affordable_shared_models_1 = require("affordable-shared-models");
class OrganizationUtils {
    static mapDboToDto(dbo) {
        const dto = new affordable_shared_models_1.Organization();
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
    static mapDtoToDbo(dto) {
        const organization = new OrganizationDBO_1.OrganizationDBO();
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
    static redactPrivateInformation(organization) {
        organization.apiKey = undefined;
        return organization;
    }
}
exports.OrganizationUtils = OrganizationUtils;
