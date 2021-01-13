"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorDAOImpl = void 0;
const TwoFactorDBO_1 = require("../../../models/orm/TwoFactorDBO");
const typeorm_1 = require("typeorm");
class TwoFactorDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    async getTwoFactorByUsername(username) {
        return await this.connection.manager
            .getRepository(TwoFactorDBO_1.TwoFactorDBO)
            .createQueryBuilder()
            .where("Username = :username", { username: username })
            .getOne();
    }
}
exports.TwoFactorDAOImpl = TwoFactorDAOImpl;
