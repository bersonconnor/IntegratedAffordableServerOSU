"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOOrganizationDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const OrganizationDBO_1 = require("../../../models/orm/OrganizationDBO");
class DBOOrganizationDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Creates an organization in AFFORDABLE
     * @param org
     */
    async saveOrganization(org) {
        const result = await this.connection.manager
            .getRepository(OrganizationDBO_1.OrganizationDBO)
            .save(org);
        console.log("Organization created: " + result);
        return result;
    }
    /**
     * Get an organization in AFFORDABLE by their ID
     * @param id
     * @throws NotFoundError if no Organization is found
     */
    async getOrganizationById(id) {
        const result = await this.connection.manager
            .getRepository(OrganizationDBO_1.OrganizationDBO)
            .createQueryBuilder("org")
            .where("org.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError(`Organization with id=${id} not found`);
        }
        return result;
    }
    /**
     * Deletes an organization by ID in AFFORDABLE
     * @param id
     */
    async deleteOrganizationById(id) {
        await this.connection.manager
            .getRepository(OrganizationDBO_1.OrganizationDBO)
            .createQueryBuilder("organization")
            .delete()
            .from(OrganizationDBO_1.OrganizationDBO)
            .where("id = :id", { id: id })
            .execute();
        console.log("Organization deleted: " + id);
    }
    async getApiKey(orgId) {
        const result = await this.connection.manager
            .getRepository(OrganizationDBO_1.OrganizationDBO)
            .createQueryBuilder("org")
            .select("org.apiKey")
            .where("org.id = :id", { id: orgId })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError(`Organization with id=${orgId} not found`);
        }
        return result.apiKey;
    }
}
exports.DBOOrganizationDAOImpl = DBOOrganizationDAOImpl;
