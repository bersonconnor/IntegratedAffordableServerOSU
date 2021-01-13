import { Connection, getConnection, In, LessThanOrEqual, Raw } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { GrantDBO } from "../../../models/orm/grant/GrantDBO";
import { Validation } from "../../../utils/Validation";
import { GrantDAO } from "./GrantDAO";


export class DBOGrantDAOImpl implements GrantDAO {

    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Creates a Grant
     * @param grant
     */
    async createGrant(grant: GrantDBO): Promise<GrantDBO> {
        const result = await this.connection
            .getRepository(GrantDBO)
            .save(grant);
        console.log("Grant created: " + result);
        return this.getGrantById(result.id);
    }

    /**
     * Update a grant in the database. Uses the field grant.id to find the record to update.
     * @param grant
     */
    updateGrant(grant: GrantDBO): Promise<GrantDBO> {
        Validation.requireParam(grant.id, "grant.id");
        return this.connection.getRepository(GrantDBO).save(grant)
            .then((updatedGrant: GrantDBO) => {
                console.log("Grant updated: ", updatedGrant);
                return this.getGrantById(grant.id);
            });
    }


    /**
     * Get a grant by its ID
     * @param id
     * @throws NotFoundError if no Grant is found
     */
    async getGrantById(id: number): Promise<GrantDBO> {
        const result = await this.connection
            .getRepository(GrantDBO)
            .findOne(id);
        if (result === undefined) {
            throw new NotFoundError("Grant with id=" + id + " not found");
        }
        return result;
    }

    /**
     * Deletes a grant by ID
     * @param id
     */
    async deleteGrantById(id: number): Promise<void> {
        await this.connection
            .getRepository(GrantDBO)
            .delete(id);
        console.log("Grant deleted: " + id);
    }

    getAllOpenGrants(): Promise<Array<GrantDBO>> {
        return this.connection.getRepository(GrantDBO)
            .find({
                // Raw is safe to use here because we are not entering user input
                startTime: Raw(columnAlias => `${columnAlias} <= CURRENT_TIMESTAMP`),
                endTime: Raw(columnAlias => `(${columnAlias} >= CURRENT_TIMESTAMP OR ${columnAlias} IS NULL)`)
            });
    }

    getAllOpenGrantsWithUserApplicationStatus(userId: number): Promise<Array<GrantDBO>> {
        return this.connection
            .getRepository(GrantDBO)
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
                        startTime: Raw(columnAlias => `${columnAlias} <= CURRENT_TIMESTAMP`),
                        endTime: Raw(columnAlias => `${columnAlias} >= CURRENT_TIMESTAMP OR ${columnAlias} IS NULL`)
                    }).andWhere("applications.userId = :userId OR applications.userId IS NULL", { userId: userId });
                }
            });
    }

    getAllGrantsForOrganizations(organizationIds: number[]): Promise<Array<GrantDBO>> {
        return this.connection.getRepository(GrantDBO)
            .find({
                organizationId: In(organizationIds)
            });
    }
}