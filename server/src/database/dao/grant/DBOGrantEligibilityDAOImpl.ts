import { Connection, getConnection } from "typeorm";
import { EligibilityCriteriaDBO } from "../../../models/orm/grant/EligibilityCriteriaDBO";
import { GrantEligibilityDAO } from "./GrantEligibilityDAO";

export class DBOGrantEligibilityDAOImpl implements GrantEligibilityDAO {

    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Creates a grant eligibility record in AFFORDABLE
     * @param record
     */
    async save(record: EligibilityCriteriaDBO): Promise<EligibilityCriteriaDBO> {
        const result = await this.connection.getRepository(EligibilityCriteriaDBO).save(record);
        return result as EligibilityCriteriaDBO;
    }

    /**
     * Deletes a grant eligibility record in AFFORDABLE
     * @param grantId
     */
    async delete(grantId: number): Promise<void> {
        await this.connection
                .getRepository(EligibilityCriteriaDBO)
                .createQueryBuilder()
                .delete()
                .from(EligibilityCriteriaDBO)
                .where("id = :id", {id: grantId})
                .execute();
        console.log("GrantEligibility deleted: " + grantId);
    }

    get(id: number): Promise<EligibilityCriteriaDBO> {
        return this.connection.getRepository(EligibilityCriteriaDBO).findOne({id: id});
    }
}