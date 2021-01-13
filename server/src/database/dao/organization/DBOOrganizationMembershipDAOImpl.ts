import { Connection, getConnection } from "typeorm";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { OrganizationMembershipDBO } from "../../../models/orm/OrganizationMembershipDBO";
import { DBOAuthenticationInformationDAOImpl } from "../authentication/DBOAuthenticationInformationDAOImpl";
import { OrganizationMembershipDAO } from "./OrganizationMembershipDAO";


export class DBOOrganizationMembershipDAOImpl implements OrganizationMembershipDAO {
    private connection: Connection;

    private userAuthDao: DBOAuthenticationInformationDAOImpl;

    public constructor() {
        this.connection = getConnection();
        this.userAuthDao = new DBOAuthenticationInformationDAOImpl();

        this.getAllMembershipsOfUser = this.getAllMembershipsOfUser.bind(this);
    }

    /**
     *
     * @param membership
     */
    async saveMembership(membership: OrganizationMembershipDBO): Promise<void> {
        await this.connection
            .getRepository(OrganizationMembershipDBO)
            .save(membership);
        return;
    }

    /**
     *
     * @param userId
     */
    async getAllMembershipsOfUser(userId: number): Promise<OrganizationMembershipDBO[]> {
        const memberships = await this.connection
            .getRepository(OrganizationMembershipDBO)
            .find( {
                where: {
                    donorId: userId
                },
                relations: ["organization"]
            });
        return memberships
    }

    /**
     *
     * @param organizationId
     * @param donorId
     */
    async deleteMembership(organizationId: number, donorId: number): Promise<void> {
        await this.connection
                .getRepository(OrganizationMembershipDBO)
                .createQueryBuilder("organization")
                .delete()
                .from(OrganizationMembershipDBO)
                .where("organizationId = :orgId AND donorId = :donorId", {orgId: organizationId, donorId: donorId})
                .execute();
        console.log("Organization Membership deleted: " + donorId + " belonging to " + organizationId);
    }


}