"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOGrantDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const GrantDBO_1 = require("../../../models/orm/grant/GrantDBO");
const Validation_1 = require("../../../utils/Validation");
class DBOGrantDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Creates a Grant
     * @param grant
     */
    async createGrant(grant) {
        const result = await this.connection
            .getRepository(GrantDBO_1.GrantDBO)
            .save(grant);
        console.log("Grant created: " + result);
        return this.getGrantById(result.id);
    }
    /**
     * Update a grant in the database. Uses the field grant.id to find the record to update.
     * @param grant
     */
    updateGrant(grant) {
        Validation_1.Validation.requireParam(grant.id, "grant.id");
        return this.connection.getRepository(GrantDBO_1.GrantDBO).save(grant)
            .then((updatedGrant) => {
            console.log("Grant updated: ", updatedGrant);
            return this.getGrantById(grant.id);
        });
    }
    /**
     * Get a grant by its ID
     * @param id
     * @throws NotFoundError if no Grant is found
     */
    async getGrantById(id) {
        const result = await this.connection
            .getRepository(GrantDBO_1.GrantDBO)
            .findOne(id);
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("Grant with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Deletes a grant by ID
     * @param id
     */
    async deleteGrantById(id) {
        await this.connection
            .getRepository(GrantDBO_1.GrantDBO)
            .delete(id);
        console.log("Grant deleted: " + id);
    }
    getAllOpenGrants() {
        return this.connection.getRepository(GrantDBO_1.GrantDBO)
            .find({
            // Raw is safe to use here because we are not entering user input
            startTime: typeorm_1.Raw(columnAlias => `${columnAlias} <= CURRENT_TIMESTAMP`),
            endTime: typeorm_1.Raw(columnAlias => `(${columnAlias} >= CURRENT_TIMESTAMP OR ${columnAlias} IS NULL)`)
        });
    }
    getAllOpenGrantsWithUserApplicationStatus(userId) {
        return this.connection
            .getRepository(GrantDBO_1.GrantDBO)
            .find({
            join: {
                alias: "grants",
                leftJoinAndSelect: {
                    applications: "grants.applications"
                }
            },
            where: qb => {
                qb.where({
                    // Raw is safe to use here because we are not entering user input
                    startTime: typeorm_1.Raw(columnAlias => `${columnAlias} <= CURRENT_TIMESTAMP`),
                    endTime: typeorm_1.Raw(columnAlias => `${columnAlias} >= CURRENT_TIMESTAMP OR ${columnAlias} IS NULL`)
                }).andWhere("applications.userId = :userId OR applications.userId IS NULL", { userId: userId });
            }
        });
    }
    getAllGrantsForOrganizations(organizationIds) {
        return this.connection.getRepository(GrantDBO_1.GrantDBO)
            .find({
            organizationId: typeorm_1.In(organizationIds)
        });
    }
}
exports.DBOGrantDAOImpl = DBOGrantDAOImpl;
