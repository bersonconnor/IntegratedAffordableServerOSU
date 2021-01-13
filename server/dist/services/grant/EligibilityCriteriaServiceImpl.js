"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityCriteriaServiceImpl = void 0;
const Validation_1 = require("../../utils/Validation");
const affordable_shared_models_1 = require("affordable-shared-models");
const GrantUtils_1 = require("./GrantUtils");
const DBOGrantEligibilityDAOImpl_1 = require("../../database/dao/grant/DBOGrantEligibilityDAOImpl");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
const OrganizationServiceImpl_1 = require("../organization/OrganizationServiceImpl");
const AuthorizationUtils_1 = require("../AuthorizationUtils");
class EligibilityCriteriaServiceImpl {
    constructor(eligibilityDao, organizationService) {
        this.eligibilityDao = eligibilityDao !== null && eligibilityDao !== void 0 ? eligibilityDao : new DBOGrantEligibilityDAOImpl_1.DBOGrantEligibilityDAOImpl();
        this.organizationService = organizationService !== null && organizationService !== void 0 ? organizationService : new OrganizationServiceImpl_1.OrganizationServiceImpl();
    }
    async getEligibilityCriteria(id) {
        return GrantUtils_1.GrantUtils.convertEligibilityDboToDto(await this.eligibilityDao.get(id));
    }
    async createEligibilityCriteria(userInfo, eligibilityCriteria) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        Validation_1.Validation.requireParam(eligibilityCriteria, "eligibilityCriteria");
        Validation_1.Validation.requireParam(eligibilityCriteria.organizationId, "eligibilityCriteria.organizationId");
        eligibilityCriteria.id = null;
        // Check to see if the user can create the criteria on behalf of the specified organization.
        const canCreate = await this.organizationService.userBelongsToOrganization(userInfo.id, eligibilityCriteria.organizationId);
        if (!canCreate) {
            throw new UnauthorizedError_1.UnauthorizedError(`You cannot create EligibilityCriteria for organization id: ${eligibilityCriteria.organizationId} because you are not a member of that organization`);
        }
        const dbo = GrantUtils_1.GrantUtils.convertEligibilityDtoToDbo(eligibilityCriteria);
        return this.getEligibilityCriteria((await this.eligibilityDao.save(dbo)).id);
    }
    meetsEligibilityRequirements(userInfo, requirements) {
        if (requirements == null)
            return true;
        let isEligible = true;
        if (requirements.emailAddress) {
            isEligible = isEligible && userInfo.primaryEmail.toLowerCase() === requirements.emailAddress.toLowerCase();
        }
        return isEligible;
    }
}
exports.EligibilityCriteriaServiceImpl = EligibilityCriteriaServiceImpl;
