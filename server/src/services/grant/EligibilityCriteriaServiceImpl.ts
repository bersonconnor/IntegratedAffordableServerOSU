import { Validation } from "../../utils/Validation";
import { UserInfo, UserType } from "affordable-shared-models";
import { GrantUtils } from "./GrantUtils";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { GrantEligibilityDAO } from "../../database/dao/grant/GrantEligibilityDAO";
import { DBOGrantEligibilityDAOImpl } from "../../database/dao/grant/DBOGrantEligibilityDAOImpl";
import { UnauthorizedError } from "../../models/UnauthorizedError";
import { OrganizationService } from "../organization/OrganizationService";
import { OrganizationServiceImpl } from "../organization/OrganizationServiceImpl";
import { EligibilityCriteriaService } from "./EligibilityCriteriaService";
import { AuthorizationUtils } from "../AuthorizationUtils";

export class EligibilityCriteriaServiceImpl implements EligibilityCriteriaService {

    private eligibilityDao: GrantEligibilityDAO;
    private organizationService: OrganizationService;

    constructor(eligibilityDao?: GrantEligibilityDAO,
                organizationService?: OrganizationService) {

        this.eligibilityDao = eligibilityDao ?? new DBOGrantEligibilityDAOImpl();
        this.organizationService = organizationService ?? new OrganizationServiceImpl();

    }

    async getEligibilityCriteria(id: number): Promise<EligibilityCriteria> {
        return GrantUtils.convertEligibilityDboToDto(await this.eligibilityDao.get(id));
    }

    async createEligibilityCriteria(userInfo: UserInfo, eligibilityCriteria: EligibilityCriteria): Promise<EligibilityCriteria> {
        AuthorizationUtils.checkAuthorization(userInfo, true, UserType.DONOR);
        Validation.requireParam(eligibilityCriteria, "eligibilityCriteria");
        Validation.requireParam(eligibilityCriteria.organizationId, "eligibilityCriteria.organizationId");

        eligibilityCriteria.id = null;
        // Check to see if the user can create the criteria on behalf of the specified organization.
        const canCreate = await this.organizationService.userBelongsToOrganization(userInfo.id, eligibilityCriteria.organizationId);
        if (!canCreate) {
            throw new UnauthorizedError(`You cannot create EligibilityCriteria for organization id: ${eligibilityCriteria.organizationId} because you are not a member of that organization`);
        }

        const dbo = GrantUtils.convertEligibilityDtoToDbo(eligibilityCriteria);
        return this.getEligibilityCriteria((await this.eligibilityDao.save(dbo)).id);
    }

    meetsEligibilityRequirements(userInfo: UserInfo, requirements: EligibilityCriteria): boolean {
        if (requirements == null) return true;
        let isEligible = true;

        if (requirements.emailAddress) {
            isEligible = isEligible && userInfo.primaryEmail.toLowerCase() === requirements.emailAddress.toLowerCase();
        }

        return isEligible;
    }

}