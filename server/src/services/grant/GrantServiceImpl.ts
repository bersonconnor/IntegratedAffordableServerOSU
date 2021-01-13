import { GrantService } from "./GrantService";
import { Validation } from "../../utils/Validation";
import { GrantDAO } from "../../database/dao/grant/GrantDAO";
import { DBOGrantDAOImpl } from "../../database/dao/grant/DBOGrantDAOImpl";
import { IllegalArgumentError } from "../../models/IllegalArgumentError";
import { Grant, OrganizationMembership, UserInfo, UserType } from "affordable-shared-models";
import { GrantUtils } from "./GrantUtils";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { UnauthorizedError } from "../../models/UnauthorizedError";
import { DBOApplicationInformationDAOImpl } from "../../database/dao/grant/DBOApplicationInformationDAOImpl";
import { ApplicationInformationDAO } from "../../database/dao/grant/ApplicationInformationDAO";
import { ApplicationInformationDBO } from "../../models/orm/grant/ApplicationInformationDBO";
import { OrganizationService } from "../organization/OrganizationService";
import { OrganizationServiceImpl } from "../organization/OrganizationServiceImpl";
import { EligibilityCriteriaService } from "./EligibilityCriteriaService";
import { EligibilityCriteriaServiceImpl } from "./EligibilityCriteriaServiceImpl";
import { AuthorizationUtils } from "../AuthorizationUtils";
import { ProfileService } from "../ProfileService";
import { IllegalStateError } from "../../models/IllegalStateError";
import { GrantDBO } from "../../models/orm/grant/GrantDBO";
import { NotFoundError } from "../../models/NotFoundError";
import { OrganizationUtils } from "../organization/OrganizationUtils";
import { AuthenticationService } from "../AuthenticationService";
import { AuthenticationServiceImpl } from "../AuthenticationServiceImpl";
import { Applicant } from "affordable-shared-models/dist/models/Applicant";

export class GrantServiceImpl implements GrantService {
    
    private grantDao: GrantDAO;
    private applicationInfoDao: ApplicationInformationDAO;
    private organizationService: OrganizationService;
    private eligibilityService: EligibilityCriteriaService;
    private profileService: ProfileService;
    private authenticationService: AuthenticationService;

    constructor(grantDao?: GrantDAO,
                applicationInfoDao?: ApplicationInformationDAO,
                organizationService?: OrganizationService,
                eligibilityService?: EligibilityCriteriaService,
                profileService?: ProfileService,
                authenticationService?: AuthenticationService) {

        this.grantDao = grantDao ?? new DBOGrantDAOImpl();
        this.applicationInfoDao = applicationInfoDao ?? new DBOApplicationInformationDAOImpl();
        this.organizationService = organizationService ?? new OrganizationServiceImpl();
        this.eligibilityService = eligibilityService ?? new EligibilityCriteriaServiceImpl();
        this.profileService = profileService ?? new ProfileService();
        this.authenticationService = authenticationService ?? new AuthenticationServiceImpl();

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

    async getGrant(userInfo: UserInfo, id: number): Promise<Grant> {
        Validation.requireParam(id, "id");
        const dbo = await this.grantDao.getGrantById(id);
        const grant = GrantUtils.convertGrantDboToDto(dbo);
        grant.organization = OrganizationUtils.redactPrivateInformation(grant.organization);
        return grant;
    }

    async createGrant(userInfo: UserInfo, grant: Grant): Promise<Grant> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);
        Validation.requireParam(grant.grantName, "grantName");
        Validation.requireParam(grant.organization, "organization");
        Validation.requireParam(grant.organization.id, "organization.id");
        Validation.requireParam(grant.grantAmount, "grantAmount");
        Validation.requireParam(grant.description, "description");

        if (grant.recipientId) {
            throw new IllegalArgumentError("You cannot set the recipient for a grant when creating it");
        }

        if (grant.startDate == null) {
            grant.startDate = new Date();
        }

        // Check to see if the user can create the grant on behalf of the organization specified in the grant.
        const userCanCreateGrant = await this.organizationService.userBelongsToOrganization(userInfo.id, grant.organization?.id);
        if (!userCanCreateGrant) {
            throw new UnauthorizedError(`You cannot create a grant for ${grant.organization.id} because you are not a member of that organization`);
        }

        if (grant.eligibilityCriteria) {
            // If an existing EligibilityCriteria is specified, check if the organization has permission to use it.
            // If a new eligibility criteria is specified, create it
            grant.eligibilityCriteria = await this.useOrCreateEligibilityCriteria(userInfo, grant);
        }

        grant.id = null;

        // Create and return the new Grant
        const dbo = GrantUtils.convertGrantDtoToDbo(grant);
        return this.getGrant(userInfo, (await this.grantDao.createGrant(dbo)).id);
    }

    async updateGrant(userInfo: UserInfo, updatedGrant: Grant): Promise<Grant> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);
        Validation.requireParam(updatedGrant.id, "id");
        Validation.requireParam(updatedGrant.grantName, "grantName");
        Validation.requireParam(updatedGrant.organization, "organization");
        Validation.requireParam(updatedGrant.organization.id, "organization.id");
        Validation.requireParam(updatedGrant.grantAmount, "grantAmount");
        Validation.requireParam(updatedGrant.description, "description");

        if (updatedGrant.startDate == null) {
            updatedGrant.startDate = new Date();
        }

        const existingGrant = await this.getGrant(userInfo, updatedGrant.id);

        // Check to see if the user can create the grant on behalf of the organization specified in the grant.
        const userCanUpdateGrant = await this.organizationService.userBelongsToOrganization(userInfo.id, existingGrant.organization.id);
        if (!userCanUpdateGrant) {
            throw new UnauthorizedError(`You cannot update this grant because it is managed by organization id: ${existingGrant.organization.id}, and you are not a member of that organization`);
        }

        if (updatedGrant.eligibilityCriteria) {
            // If an EligibilityCriteria is specified, check if the organization has permission to use it.
            // If a new eligibility criteria is specified, create it
            updatedGrant.eligibilityCriteria = await this.useOrCreateEligibilityCriteria(userInfo, updatedGrant);
        }

        if (existingGrant.organization.id !== updatedGrant.organization.id) {
            throw new IllegalArgumentError("You cannot change the organization that manages a grant.");
        }

        if (existingGrant.recipientId != updatedGrant.recipientId) {
            throw new IllegalArgumentError("You cannot change the recipient of a grant.");
        }

        const dbo = GrantUtils.convertGrantDtoToDbo(updatedGrant);
        return this.getGrant(userInfo, (await this.grantDao.updateGrant(dbo)).id);
    }

    async deleteGrant(userInfo: UserInfo, id: number): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);

        Validation.requireParam(id, "id");

        const grant = await this.getGrant(userInfo, id);
        // Check to see if the user can create the grant on behalf of the organization specified in the grant.
        const userCanDeleteGrant = await this.organizationService.userBelongsToOrganization(userInfo.id, grant.organization?.id);
        if (!userCanDeleteGrant) {
            throw new UnauthorizedError(`You cannot delete grant ${id} because you are not a member of the managing organization`);
        }

        await this.grantDao.deleteGrantById(id);
    }

    /**
     * Check a grant to see if that grant can use its specified EligibilityCriteria.
     * If no id exists on the EligibilityCriteria object, a new one will be created.
     * @param grant
     */
    async useOrCreateEligibilityCriteria(userInfo: UserInfo, grant: Grant): Promise<EligibilityCriteria> {
        if (grant.eligibilityCriteria == null) {
            return null;
        }
        let eligibilityCriteria: EligibilityCriteria;
        if (grant.eligibilityCriteria.id) {
            // If ID is defined, get the EC and see if we can use it
            eligibilityCriteria = await this.eligibilityService.getEligibilityCriteria(grant.eligibilityCriteria.id);
        } else { // create a new one
            eligibilityCriteria = await this.eligibilityService.createEligibilityCriteria(userInfo, grant.eligibilityCriteria);
        }
        if (eligibilityCriteria.organizationId !== grant.organization.id) {
            throw new IllegalArgumentError(`You cannot use eligibility criteria id: ${eligibilityCriteria.id} for this grant
                     because the organization that manages the grant (id: ${grant.organization.id}) does not 
                     match the organization that manages the eligibility criteria (id: ${eligibilityCriteria.organizationId})`);
        }
        return eligibilityCriteria;
    }


    async applyToGrant(userInfo: UserInfo, grantId: number): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.RECIPIENT);
        Validation.requireParam(grantId, "grantId");

        // Users must have a profile to apply for a grant
        try {
            await this.profileService.getProfile(userInfo.id);
        } catch (e) {
            if (e instanceof NotFoundError) {
                throw new UnauthorizedError("You must complete your profile before applying to grants.");
            } else {
                throw e;
            }
        }

        // Validate that the grant exists and is open
        const grant = await this.getGrant(userInfo, grantId);
        const currentTime = new Date();
        if (grant.startDate > currentTime) {
            throw new UnauthorizedError(`The grant is not accepting applications until ${grant.startDate.toString()}`);
        }
        if (grant.endDate && grant.endDate < currentTime) {
            throw new UnauthorizedError("The grant is no longer accepting applications");
        }

        // Check that the user meets eligibility requirements
        let userMeetsEligibilityRequirements = true;
        if (grant.eligibilityCriteria) {
            userMeetsEligibilityRequirements = this.eligibilityService.meetsEligibilityRequirements(userInfo, grant.eligibilityCriteria);
        }
        if (!userMeetsEligibilityRequirements) {
            throw new UnauthorizedError("You do not meet the requirements to apply to this grant");
        }

        const application: ApplicationInformationDBO = {
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
    public async getAllGrantsByUserType(userInfo: UserInfo): Promise<Array<Grant>> {
        AuthorizationUtils.checkAuthorization(userInfo, false);
        if (AuthorizationUtils.isAdmin(userInfo)) {
            // Get all open grants
            const grants = await this.grantDao.getAllOpenGrants();
            return grants.map((g: GrantDBO): Grant => {
                return GrantUtils.convertGrantDboToDto(g);
            })
        }
        switch (userInfo.userType) {
            case UserType.DONOR:
                return this.getAllManagedGrants(userInfo);
            case UserType.RECIPIENT:
                return this.getOpenEligibleGrants(userInfo);
            default:
                throw new IllegalStateError(`UserType ${userInfo.userType} not supported for this method`);
        }
    }

    /**
     * Get all of the open grants that the user is eligible for.
     * @param userInfo
     */
    async getOpenEligibleGrants(userInfo: UserInfo): Promise<Array<Grant>> {
        AuthorizationUtils.checkAuthorization(userInfo, false, UserType.RECIPIENT);

        // Get all open grants
        const grantDbos = await this.grantDao.getAllOpenGrantsWithUserApplicationStatus(userInfo.id);
        // const grantDbos = await this.grantDao.getAllOpenGrants();
        // return grantDbos.map(GrantUtils.convertGrantDboToDto)
        const grants = grantDbos.map((dbo: GrantDBO): Grant => {
            const dto = GrantUtils.convertGrantDboToDto(dbo);
            dto.organization = OrganizationUtils.redactPrivateInformation(dto.organization);
            if (dbo.applications == null) {
                dto.applied = false;
            } else {
                dto.applied = dbo.applications.length !== 0;
            }
            return dto;
        });

        // Filter to keep just those where the user is eligible.
        return grants.filter(
            (g: Grant): boolean =>
                this.eligibilityService
                    .meetsEligibilityRequirements(userInfo, g.eligibilityCriteria)
        );
    }


    /**
     * Get all of the grants that the user manages via their organizations.
     * @param userInfo
     */
    async getAllManagedGrants(userInfo: UserInfo): Promise<Array<Grant>> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);

        // Get the organizations the user belongs to
        const memberships = await this.organizationService.getOrganizationsForUser(userInfo, userInfo.id);
        const orgIds = memberships.map((m: OrganizationMembership): number => {
            return m.organization.id;
        });
        const grants = await this.grantDao.getAllGrantsForOrganizations(orgIds);

        return grants.map((g: GrantDBO): Grant => {
            return GrantUtils.convertGrantDboToDto(g);
        });
    }

    async getApplicants(userInfo: UserInfo, grantId: number): Promise<Array<Applicant>> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);
        Validation.requireParam(grantId, "grantId");

        // Get the grant because we need to know its organization
        const grant = await this.getGrant(userInfo, grantId);

        const userInOrg = await this.organizationService.userBelongsToOrganization(userInfo.id, grant.organization?.id);
        if (!userInOrg) {
            throw new UnauthorizedError("You cannot view applications for this grant because you are not a member of the managing organization");
        }


        const dto: Applicant[] = [];
        const applicants = await this.applicationInfoDao.getApplicationsForGrant(grantId);
        for (const i of applicants) {
            const applicant = new Applicant();
            applicant.userInfo = await this.authenticationService.getUserInfo(i.userId);
            applicant.profile = await this.profileService.getProfile(i.userId);
            dto.push(applicant);
        }
        return dto;
    }


    async awardGrantToUser(userInfo: UserInfo, recipientId: number, grantId: number): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);

        // Check that the grant exists
        const grant = await this.getGrant(userInfo, grantId);

        // Check that the user has permission to alter the grant
        const canUpdate = await this.organizationService.userBelongsToOrganization(userInfo.id, grant.organization.id);
        if (!canUpdate) {
            throw new UnauthorizedError(`You cannot update this grant because it is managed by organization id: ${grant.organization.id}, and you are not a member of that organization`);
        }

        // Check that the recipient has actually applied to the grant
        const userHasApplied = await this.applicationInfoDao.applicationExists(recipientId, grantId);
        if (!userHasApplied) {
            throw new IllegalArgumentError("You cannot award a grant to a user that has not applied to the grant");
        }

        // Update the grant
        const dbo = GrantUtils.convertGrantDtoToDbo(grant);
        dbo.recipientId = recipientId;
        await this.grantDao.updateGrant(dbo);
        return;
    }

}