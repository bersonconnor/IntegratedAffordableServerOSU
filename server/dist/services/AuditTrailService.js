"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditTrailService = void 0;
const AuditTrailDAO_1 = require("../database/dao/admin/AuditTrailDAO");
class AuditTrailService {
    constructor() {
        this.trailDAO = new AuditTrailDAO_1.AuditTrailDAO();
    }
    async addEntries(username, action) {
        const time = new Date;
        const trailrecord = await this.trailDAO.addEntries({
            admin: username,
            action: action,
            time: time
        });
    }
    async getAllEntries() {
        return this.trailDAO.getAllEntries();
    }
}
exports.AuditTrailService = AuditTrailService;
