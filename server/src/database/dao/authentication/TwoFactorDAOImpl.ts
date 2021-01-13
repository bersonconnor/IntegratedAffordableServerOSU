import { TwoFactorDBO } from "../../../models/orm/TwoFactorDBO";
import { Connection, getConnection } from "typeorm";
import { TwoFactorDAO } from "./TwoFactorDAO";

export class TwoFactorDAOImpl implements TwoFactorDAO {

    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }
    
    async getTwoFactorByUsername(username: string): Promise<TwoFactorDBO> {
        return await this.connection.manager
                        .getRepository(TwoFactorDBO)
                        .createQueryBuilder()
                        .where("Username = :username", {username: username})
                        .getOne();
    }
}