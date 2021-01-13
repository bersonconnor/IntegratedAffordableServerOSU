"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantUtils = void 0;
const GrantDBO_1 = require("../../models/orm/grant/GrantDBO");
const affordable_shared_models_1 = require("affordable-shared-models");
const EligibilityCriteriaDBO_1 = require("../../models/orm/grant/EligibilityCriteriaDBO");
const EligibilityCriteria_1 = require("affordable-shared-models/dist/models/EligibilityCriteria");
const OrganizationUtils_1 = require("../organization/OrganizationUtils");
class GrantUtils {
    static convertGrantDtoToDbo(dto) {
        var _a;
        const dbo = new GrantDBO_1.GrantDBO();
        dbo.id = dto.id;
        dbo.grantName = dto.grantName;
        dbo.grantAmount = dto.grantAmount.toString();
        dbo.startTime = dto.startDate;
        dbo.endTime = dto.endDate;
        dbo.category = dto.category;
        dbo.description = dto.description;
        dbo.organizationId = dto.organization.id;
        dbo.eligibilityCriteriaId = (_a = dto.eligibilityCriteria) === null || _a === void 0 ? void 0 : _a.id;
        dbo.recipientId = dto.recipientId;
        return dbo;
    }
    static convertGrantDboToDto(dbo) {
        const dto = new affordable_shared_models_1.Grant();
        dto.id = dbo.id;
        dto.grantName = dbo.grantName;
        dto.description = dbo.description;
        dto.category = dbo.category;
        dto.grantAmount = Number.parseFloat(dbo.grantAmount);
        dto.startDate = dbo.startTime;
        dto.endDate = dbo.endTime;
        dto.organization = OrganizationUtils_1.OrganizationUtils.mapDboToDto(dbo.organization);
        dto.eligibilityCriteria = dbo.eligibilityCriteriaId ? GrantUtils.convertEligibilityDboToDto(dbo.eligibilityCriteria) : null;
        dto.recipientId = dbo.recipientId;
        return dto;
    }
    static convertEligibilityDboToDto(dbo) {
        const dto = new EligibilityCriteria_1.EligibilityCriteria();
        dto.id = dbo.id;
        dto.organizationId = dbo.organizationId;
        dto.emailAddress = dbo.emailAddress;
        return dto;
    }
    static convertEligibilityDtoToDbo(dto) {
        const dbo = new EligibilityCriteriaDBO_1.EligibilityCriteriaDBO();
        dbo.id = dto.id;
        dbo.organizationId = dto.organizationId;
        dbo.emailAddress = dto.emailAddress;
        return dbo;
    }
}
exports.GrantUtils = GrantUtils;
