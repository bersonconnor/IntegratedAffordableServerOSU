import { Organization, OrganizationMembership, UserInfo, AddMemberRequest } from "affordable-shared-models";
import { AuthenticationInformationDBO } from "../../models/orm/AuthenticationInformationDBO";

export interface OrganizationService {

    /**
     * Creates an organization
     * @param userInfo
     * @param organization a CreateOrganizationRequest that has at least a specified orgName
     */
    createOrganization(userInfo: UserInfo, organization: Organization): Promise<Organization>;

    /**
     * Update an organization
     * @param userInfo
     * @param organization
     */
    updateOrganization(userInfo: UserInfo, organization: Organization): Promise<Organization>;

    /**
     * Gets an organization
     * @param userInfo
     * @param orgId
     */
    getOrganization(userInfo: UserInfo, orgId: number): Promise<Organization>;

    /**
     * Deletes an organization
     * @param userInfo
     * @param orgId
     */
    deleteOrganization(userInfo: UserInfo, orgId: number): Promise<void>;

    /**
     * Add a member to an organization.
     * @param userInfo
     * @param addMemberRequest
     */
    addMemberAsUser(userInfo: UserInfo, addMemberRequest: AddMemberRequest): Promise<void>;

    /**
     * Remove a member from an organization
     * @param userInfo
     * @param organizationId
     * @param userId
     */
    removeMember(userInfo: UserInfo, organizationId: number, userId: number): Promise<void>;

    /**
     * Get the API key for an organization
     * @param userInfo
     * @param organizationId
     */
    getApiKey(userInfo: UserInfo, organizationId: number): Promise<string>;

    /**
     * Get the organizations that the user belongs to
     * @param userInfo
     * @param userId
     */
    getOrganizationsForUser(userInfo: UserInfo, userId: number): Promise<Array<OrganizationMembership>>;

    /**
     * Find whether or not a particular user belongs to a particular organization.
     * @param userId
     * @param organizationId
     */
    userBelongsToOrganization(userId: number, organizationId: number): Promise<boolean>;

    /**
     * Triggers sending an email for an added organization
     * @deprecated // TODO please remove or rewrite me to fit the current app architecture
     * @param req
     * @param res
     */
    sendVerificationEmailForAddOrg(req, res): Promise<void>;

    /**
     * Add info to an organization
     * @deprecated // TODO please remove or rewrite me to fit the current app architecture
     * @param req
     * @param res
     */
    addOrganizationInfo(req, res): Promise<void>;

}