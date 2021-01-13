"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantServiceImpl = void 0;
const Validation_1 = require("../../utils/Validation");
const DBOGrantDAOImpl_1 = require("../../database/dao/grant/DBOGrantDAOImpl");
const IllegalArgumentError_1 = require("../../models/IllegalArgumentError");
const affordable_shared_models_1 = require("affordable-shared-models");
const GrantUtils_1 = require("./GrantUtils");
const UnauthorizedError_1 = require("../../models/UnauthorizedError");
const DBOApplicationInformationDAOImpl_1 = require("../../database/dao/grant/DBOApplicationInformationDAOImpl");
const OrganizationServiceImpl_1 = require("../organization/OrganizationServiceImpl");
const EligibilityCriteriaServiceImpl_1 = require("./EligibilityCriteriaServiceImpl");
const AuthorizationUtils_1 = require("../AuthorizationUtils");
const ProfileService_1 = require("../ProfileService");
const IllegalStateError_1 = require("../../models/IllegalStateError");
const NotFoundError_1 = require("../../models/NotFoundError");
const OrganizationUtils_1 = require("../organization/OrganizationUtils");
const AuthenticationServiceImpl_1 = require("../AuthenticationServiceImpl");
const Applicant_1 = require("affordable-shared-models/dist/models/Applicant");
class GrantServiceImpl {
    constructor(grantDao, applicationInfoDao, organizationService, eligibilityService, profileService, authenticationService) {
        this.grantDao = grantDao !== null && grantDao !== void 0 ? grantDao : new DBOGrantDAOImpl_1.DBOGrantDAOImpl();
        this.applicationInfoDao = applicationInfoDao !== null && applicationInfoDao !== void 0 ? applicationInfoDao : new DBOApplicationInformationDAOImpl_1.DBOApplicationInformationDAOImpl();
        this.organizationService = organizationService !== null && organizationService !== void 0 ? organizationService : new OrganizationServiceImpl_1.OrganizationServiceImpl();
        this.eligibilityService = eligibilityService !== null && eligibilityService !== void 0 ? eligibilityService : new EligibilityCriteriaServiceImpl_1.EligibilityCriteriaServiceImpl();
        this.profileService = profileService !== null && profileService !== void 0 ? profileService : new ProfileService_1.ProfileService();
        this.authenticationService = authenticationService !== null && authenticationService !== void 0 ? authenticationService : new AuthenticationServiceImpl_1.AuthenticationServiceImpl();
        this.getGrant = this.getGrant.bind(this);
        this.createGrant = this.createGrant.bind(this);
        this.updateGrant = this.updateGrant.bind(this);
        this.deleteGrant = this.deleteGrant.bind(this);
        this.useOrCreateEligibilityCriteria = this.useOrCreateEligibilityCriteria.bind(this);
        this.applyToGrant = this.applyToGrant.bind(this);
        this.getOpenEligibleGrants = this.getOpenEligibleGrants.bind(this);
        this.getAllGrantsByUserType = this.getAllGrantsByUserType.bind(this);
        this.awardGrantToUser = this.awardGrantToUser.bind(this);
        this.getAllManagedGrants = this.getAllManagedGrants.bind(this);
    }
    async getGrant(userInfo, id) {
        Validation_1.Validation.requireParam(id, "id");
        const dbo = await this.grantDao.getGrantById(id);
        const grant = GrantUtils_1.GrantUtils.convertGrantDboToDto(dbo);
        grant.organization = OrganizationUtils_1.OrganizationUtils.redactPrivateInformation(grant.organization);
        return grant;
    }
    async createGrant(userInfo, grant) {
        var _a;
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        Validation_1.Validation.requireParam(grant.grantName, "grantName");
        Validation_1.Validation.requireParam(grant.organization, "organization");
        Validation_1.Validation.requireParam(grant.organization.id, "organization.id");
        Validation_1.Validation.requireParam(grant.grantAmount, "grantAmount");
        Validation_1.Validation.requireParam(grant.description, "description");
        if (grant.recipientId) {
            throw new IllegalArgumentError_1.IllegalArgumentError("You cannot set the recipient for a grant when creating it");
        }
        if (grant.startDate == null) {
            grant.startDate = new Date();
        }
        // Check to see if the user can create the grant on behalf of the organization specified in the grant.
        const userCanCreateGrant = await this.organizationService.userBelongsToOrganization(userInfo.id, (_a = grant.organization) === null || _a === void 0 ? void 0 : _a.id);
        if (!userCanCreateGrant) {
            throw new UnauthorizedError_1.UnauthorizedError(`You cannot create a grant for ${grant.organization.id} because you are not a member of that organization`);
        }
        if (grant.eligibilityCriteria) {
            // If an existing EligibilityCriteria is specified, check if the organization has permission to use it.
            // If a new eligibility criteria is specified, create it
            grant.eligibilityCriteria = await this.useOrCreateEligibilityCriteria(userInfo, grant);
        }
        grant.id = null;
        // Create and return the new Grant
        const dbo = GrantUtils_1.GrantUtils.convertGrantDtoToDbo(grant);
        return this.getGrant(userInfo, (await this.grantDao.createGrant(dbo)).id);
    }
    async updateGrant(userInfo, updatedGrant) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        Validation_1.Validation.requireParam(updatedGrant.id, "id");
        Validation_1.Validation.requireParam(updatedGrant.grantName, "grantName");
        Validation_1.Validation.requireParam(updatedGrant.organization, "organization");
        Validation_1.Validation.requireParam(updatedGrant.organization.id, "organization.id");
        Validation_1.Validation.requireParam(updatedGrant.grantAmount, "grantAmount");
        Validation_1.Validation.requireParam(updatedGrant.description, "description");
        if (updatedGrant.startDate == null) {
            updatedGrant.startDate = new Date();
        }
        const existingGrant = await this.getGrant(userInfo, updatedGrant.id);
        // Check to see if the user can create the grant on behalf of the organization specified in the grant.
        const userCanUpdateGrant = await this.organizationService.userBelongsToOrganization(userInfo.id, existingGrant.organization.id);
        if (!userCanUpdateGrant) {
            throw new UnauthorizedError_1.UnauthorizedError(`You cannot update this grant because it is managed by organization id: ${existingGrant.organization.id}, and you are not a member of that organization`);
        }
        if (updatedGrant.eligibilityCriteria) {
            // If an EligibilityCriteria is specified, check if the organization has permission to use it.
            // If a new eligibility criteria is specified, create it
            updatedGrant.eligibilityCriteria = await this.useOrCreateEligibilityCriteria(userInfo, updatedGrant);
        }
        if (existingGrant.organization.id !== updatedGrant.organization.id) {
            throw new IllegalArgumentError_1.IllegalArgumentError("You cannot change the organization that manages a grant.");
        }
        if (existingGrant.recipientId != updatedGrant.recipientId) {
            throw new IllegalArgumentError_1.IllegalArgumentError("You cannot change the recipient of a grant.");
        }
        const dbo = GrantUtils_1.GrantUtils.convertGrantDtoToDbo(updatedGrant);
        return this.getGrant(userInfo, (await this.grantDao.updateGrant(dbo)).id);
    }
    async deleteGrant(userInfo, id) {
        var _a;
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        Validation_1.Validation.requireParam(id, "id");
        const grant = await this.getGrant(userInfo, id);
        // Check to see if the user can create the grant on behalf of the organization specified in the grant.
        const userCanDeleteGrant = await this.organizationService.userBelongsToOrganization(userInfo.id, (_a = grant.organization) === null || _a === void 0 ? void 0 : _a.id);
        if (!userCanDeleteGrant) {
            throw new UnauthorizedError_1.UnauthorizedError(`You cannot delete grant ${id} because you are not a member of the managing organization`);
        }
        await this.grantDao.deleteGrantById(id);
    }
    /**
     * Check a grant to see if that grant can use its specified EligibilityCriteria.
     * If no id exists on the EligibilityCriteria object, a new one will be created.
     * @param grant
     */
    async useOrCreateEligibilityCriteria(userInfo, grant) {
        if (grant.eligibilityCriteria == null) {
            return null;
        }
        let eligibilityCriteria;
        if (grant.eligibilityCriteria.id) {
            // If ID is defined, get the EC and see if we can use it
            eligibilityCriteria = await this.eligibilityService.getEligibilityCriteria(grant.eligibilityCriteria.id);
        }
        else { // create a new one
            eligibilityCriteria = await this.eligibilityService.createEligibilityCriteria(userInfo, grant.eligibilityCriteria);
        }
        if (eligibilityCriteria.organizationId !== grant.organization.id) {
            throw new IllegalArgumentError_1.IllegalArgumentError(`You cannot use eligibility criteria id: ${eligibilityCriteria.id} for this grant
                     because the organization that manages the grant (id: ${grant.organization.id}) does not 
                     match the organization that manages the eligibility criteria (id: ${eligibilityCriteria.organizationId})`);
        }
        return eligibilityCriteria;
    }
    async applyToGrant(userInfo, grantId) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.RECIPIENT);
        Validation_1.Validation.requireParam(grantId, "grantId");
        // Users must have a profile to apply for a grant
        try {
            await this.profileService.getProfile(userInfo.id);
        }
        catch (e) {
            if (e instanceof NotFoundError_1.NotFoundError) {
                throw new UnauthorizedError_1.UnauthorizedError("You must complete your profile before applying to grants.");
            }
            else {
                throw e;
            }
        }
        // Validate that the grant exists and is open
        const grant = await this.getGrant(userInfo, grantId);
        const currentTime = new Date();
        if (grant.startDate > currentTime) {
            throw new UnauthorizedError_1.UnauthorizedError(`The grant is not accepting applications until ${grant.startDate.toString()}`);
        }
        if (grant.endDate && grant.endDate < currentTime) {
            throw new UnauthorizedError_1.UnauthorizedError("The grant is no longer accepting applications");
        }
        // Check that the user meets eligibility requirements
        let userMeetsEligibilityRequirements = true;
        if (grant.eligibilityCriteria) {
            userMeetsEligibilityRequirements = this.eligibilityService.meetsEligibilityRequirements(userInfo, grant.eligibilityCriteria);
        }
        if (!userMeetsEligibilityRequirements) {
            throw new UnauthorizedError_1.UnauthorizedError("You do not meet the requirements to apply to this grant");
        }
        const application = {
            userId: userInfo.id,
            grantId: grantId
        };
        await this.applicationInfoDao.save(application);
    }
    /**
     * When a user tries to get all grants, we need to decide what to send them
     * If they are a donor, they will get all of the grants they manage via organizations
     * If they are a recipient, they will see all open grants that they are eligible for.
     * If they are an admin, get all open grants
     * @param userInfo the calling user
     */
    async getAllGrantsByUserType(userInfo) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false);
        if (AuthorizationUtils_1.AuthorizationUtils.isAdmin(userInfo)) {
            // Get all open grants
            const grants = await this.grantDao.getAllOpenGrants();
            return grants.map((g) => {
                return GrantUtils_1.GrantUtils.convertGrantDboToDto(g);
            });
        }
        switch (userInfo.userType) {
            case affordable_shared_models_1.UserType.DONOR:
                return this.getAllManagedGrants(userInfo);
            case affordable_shared_models_1.UserType.RECIPIENT:
                return this.getOpenEligibleGrants(userInfo);
            default:
                throw new IllegalStateError_1.IllegalStateError(`UserType ${userInfo.userType} not supported for this method`);
        }
    }
    /**
     * Get all of the open grants that the user is eligible for.
     * @param userInfo
     */
    async getOpenEligibleGrants(userInfo) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false, affordable_shared_models_1.UserType.RECIPIENT);
        // Get all open grants
        const grantDbos = await this.grantDao.getAllOpenGrantsWithUserApplicationStatus(userInfo.id);
        // const grantDbos = await this.grantDao.getAllOpenGrants();
        // return grantDbos.map(GrantUtils.convertGrantDboToDto)
        const grants = grantDbos.map((dbo) => {
            const dto = GrantUtils_1.GrantUtils.convertGrantDboToDto(dbo);
            dto.organization = OrganizationUtils_1.OrganizationUtils.redactPrivateInformation(dto.organization);
            if (dbo.applications == null) {
                dto.applied = false;
            }
            else {
                dto.applied = dbo.applications.length !== 0;
            }
            return dto;
        });
        // Filter to keep just those where the user is eligible.
        return grants.filter((g) => this.eligibilityService
            .meetsEligibilityRequirements(userInfo, g.eligibilityCriteria));
    }
    /**
     * Get all of the grants that the user manages via their organizations.
     * @param userInfo
     */
    async getAllManagedGrants(userInfo) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        // Get the organizations the user belongs to
        const memberships = await this.organizationService.getOrganizationsForUser(userInfo, userInfo.id);
        const orgIds = memberships.map((m) => {
            return m.organization.id;
        });
        const grants = await this.grantDao.getAllGrantsForOrganizations(orgIds);
        return grants.map((g) => {
            return GrantUtils_1.GrantUtils.convertGrantDboToDto(g);
        });
    }
    async getApplicants(userInfo, grantId) {
        var _a;
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        Validation_1.Validation.requireParam(grantId, "grantId");
        // Get the grant because we need to know its organization
        const grant = await this.getGrant(userInfo, grantId);
        const userInOrg = await this.organizationService.userBelongsToOrganization(userInfo.id, (_a = grant.organization) === null || _a === void 0 ? void 0 : _a.id);
        if (!userInOrg) {
            throw new UnauthorizedError_1.UnauthorizedError("You cannot view applications for this grant because you are not a member of the managing organization");
        }
        const dto = [];
        const applicants = await this.applicationInfoDao.getApplicationsForGrant(grantId);
        for (const i of applicants) {
            const applicant = new Applicant_1.Applicant();
            applicant.userInfo = await this.authenticationService.getUserInfo(i.userId);
            applicant.profile = await this.profileService.getProfile(i.userId);
            dto.push(applicant);
        }
        return dto;
    }
    async awardGrantToUser(userInfo, recipientId, grantId) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, true, affordable_shared_models_1.UserType.DONOR);
        // Check that the grant exists
        const grant = await this.getGrant(userInfo, grantId);
        // Check that the user has permission to alter the grant
        const canUpdate = await this.organizationService.userBelongsToOrganization(userInfo.id, grant.organization.id);
        if (!canUpdate) {
            throw new UnauthorizedError_1.UnauthorizedError(`You cannot update this grant because it is managed by organization id: ${grant.organization.id}, and you are not a member of that organization`);
        }
        // Check that the recipient has actually applied to the grant
        const userHasApplied = await this.applicationInfoDao.applicationExists(recipientId, grantId);
        if (!userHasApplied) {
            throw new IllegalArgumentError_1.IllegalArgumentError("You cannot award a grant to a user that has not applied to the grant");
        }
        // Update the grant
        const dbo = GrantUtils_1.GrantUtils.convertGrantDtoToDbo(grant);
        dbo.recipientId = recipientId;
        await this.grantDao.updateGrant(dbo);
        return;
    }
}
exports.GrantServiceImpl = GrantServiceImpl;
