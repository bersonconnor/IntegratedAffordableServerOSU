import { TwoFactorDBO } from "../../../models/orm/TwoFactorDBO";

export interface TwoFactorDAO {
    getTwoFactorByUsername(username: string): Promise<TwoFactorDBO>;
}