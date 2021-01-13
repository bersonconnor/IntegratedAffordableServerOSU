"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOOrganizationMembershipDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const OrganizationMembershipDBO_1 = require("../../../models/orm/OrganizationMembershipDBO");
const DBOAuthenticationInformationDAOImpl_1 = require("../authentication/DBOAuthenticationInformationDAOImpl");
class DBOOrganizationMembershipDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
        this.userAuthDao = new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        this.getAllMembershipsOfUser = this.getAllMembershipsOfUser.bind(this);
    }
    /**
     *
     * @param membership
     */
    async saveMembership(membership) {
        await this.connection
            .getRepository(OrganizationMembershipDBO_1.OrganizationMembershipDBO)
            .save(membership);
        return;
    }
    /**
     *
     * @param userId
     */
    async getAllMembershipsOfUser(userId) {
        const memberships = await this.connection
            .getRepository(OrganizationMembershipDBO_1.OrganizationMembershipDBO)
            .find({
            where: {
                donorId: userId
            },
            relations: ["organization"]
        });
        return memberships;
    }
    /**
     *
     * @param organizationId
     * @param donorId
     */
    async deleteMembership(organizationId, donorId) {
        await this.connection
            .getRepository(OrganizationMembershipDBO_1.OrganizationMembershipDBO)
            .createQueryBuilder("organization")
            .delete()
            .from(OrganizationMembershipDBO_1.OrganizationMembershipDBO)
            .where("organizationId = :orgId AND donorId = :donorId", { orgId: organizationId, donorId: donorId })
            .execute();
        console.log("Organization Membership deleted: " + donorId + " belonging to " + organizationId);
    }
}
exports.DBOOrganizationMembershipDAOImpl = DBOOrganizationMembershipDAOImpl;
