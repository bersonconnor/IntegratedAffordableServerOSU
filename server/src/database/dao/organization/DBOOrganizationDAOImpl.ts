import {Connection, getConnection} from "typeorm";
import {NotFoundError} from "../../../models/NotFoundError";
import {OrganizationDBO} from "../../../models/orm/OrganizationDBO";
import {OrganizationDAO} from "./OrganizationDAO";


export class DBOOrganizationDAOImpl implements OrganizationDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Creates an organization in AFFORDABLE
     * @param org
     */
    async saveOrganization(org: OrganizationDBO): Promise<OrganizationDBO> {
        const result = await this.connection.manager
            .getRepository(OrganizationDBO)
            .save(org);
        console.log("Organization created: " + result);
        return result;
    }

    /**
     * Get an organization in AFFORDABLE by their ID
     * @param id
     * @throws NotFoundError if no Organization is found
     */
    async getOrganizationById(id: number): Promise<OrganizationDBO> {
        const result = await this.connection.manager
            .getRepository(OrganizationDBO)
            .createQueryBuilder("org")
            .where("org.id = :id", {id: id})
            .getOne();
        if (result === undefined) {
            throw new NotFoundError(`Organization with id=${id} not found`);
        }
        return result as OrganizationDBO;
    }

    /**
     * Deletes an organization by ID in AFFORDABLE
     * @param id
     */
    async deleteOrganizationById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(OrganizationDBO)
            .createQueryBuilder("organization")
            .delete()
            .from(OrganizationDBO)
            .where("id = :id", {id: id})
            .execute();
        console.log("Organization deleted: " + id);
    }

    async getApiKey(orgId: number): Promise<string> {
        const result = await this.connection.manager
            .getRepository(OrganizationDBO)
            .createQueryBuilder("org")
            .select("org.apiKey")
            .where("org.id = :id", {id: orgId})
            .getOne();
        if (result === undefined) {
            throw new NotFoundError(`Organization with id=${orgId} not found`);
        }
        return result.apiKey as string;
    }

}