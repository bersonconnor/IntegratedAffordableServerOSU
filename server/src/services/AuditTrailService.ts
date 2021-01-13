import { AuditTrailDBO } from "../models/orm/AuditTrailDBO";
import { AuditTrailDAO } from "../database/dao/admin/AuditTrailDAO";

export class AuditTrailService {
    private trailDAO: AuditTrailDAO;

    public constructor() {
        this.trailDAO = new AuditTrailDAO();
    }

    public async addEntries(username: string, action: string) {
        const time = new Date
        const trailrecord = await this.trailDAO.addEntries(<AuditTrailDBO>{
            admin: username,
            action: action,
            time: time
        })
    }

    public async getAllEntries(): Promise<Array<AuditTrailDBO>> {
        return this.trailDAO.getAllEntries();
    }

}