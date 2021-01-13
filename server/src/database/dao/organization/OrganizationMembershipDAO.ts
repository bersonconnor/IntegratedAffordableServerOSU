import {OrganizationMembershipDBO} from "../../../models/orm/OrganizationMembershipDBO";

export interface OrganizationMembershipDAO {
    /**
     *
     * @param membership
     */
    saveMembership(membership: OrganizationMembershipDBO): Promise<void>;

    /**
     *
     * @param userId
     */
    getAllMembershipsOfUser(userId: number): Promise<Array<OrganizationMembershipDBO>>;

    /**
     *
     * @param organizationId
     * @param donorId
     */
    deleteMembership(organizationId: number, donorId: number): Promise<void>;
}