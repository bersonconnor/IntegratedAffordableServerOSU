import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { Donor } from "../../../models/orm/Donor";
import { RecipientDBO } from "../../../models/orm/RecipientDBO";
import { Validation } from "../../../utils/Validation";
import { AuditTrailDBO } from "../../../models/orm/AuditTrailDBO";


export class AuditTrailDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    async addEntries(activity: AuditTrailDBO) {
        return await this.connection.getRepository(AuditTrailDBO).save(activity);
    }

    async getAllEntries(): Promise<Array<AuditTrailDBO>> {
        return await this.connection.getRepository(AuditTrailDBO).createQueryBuilder('auditTrail').getMany();
    }
}