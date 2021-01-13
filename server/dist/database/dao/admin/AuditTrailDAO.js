"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditTrailDAO = void 0;
const typeorm_1 = require("typeorm");
const AuditTrailDBO_1 = require("../../../models/orm/AuditTrailDBO");
class AuditTrailDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    async addEntries(activity) {
        return await this.connection.getRepository(AuditTrailDBO_1.AuditTrailDBO).save(activity);
    }
    async getAllEntries() {
        return await this.connection.getRepository(AuditTrailDBO_1.AuditTrailDBO).createQueryBuilder('auditTrail').getMany();
    }
}
exports.AuditTrailDAO = AuditTrailDAO;
