import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { Finances } from "../../../models/orm/profile/Finances";
import { Validation } from "../../../utils/Validation";


export class FinancesDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds finance information to a user's profile
     * @param finances
     */
    public async addFinances(finances: Finances): Promise<Finances> {
        console.log("Adding user finances: ");
        console.log(finances);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            finances = await transactionalEntityManager.save(finances);
            return (finances);
        })
    }

    /**
     * Get finance info in AFFORDABLE by the User's ID
     * @param id 
     * @throws NotFoundError if no finances for the user are found
     */
    public async getFinancesByUserId(id: number): Promise<Finances> {
        const result = await this.connection.manager
            .getRepository(Finances)
            .createQueryBuilder("finances")
            .where("finances.userId = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("Finances for user with id=" + id + " not found");
        }
        return <Finances>result;
    }

    /**
     * Deletes finance info within a profile for a user by ID in AFFORDABLE
     * @param id 
     */
    public async deleteUserFinancesById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(Finances)
            .createQueryBuilder("finances")
            .delete()
            .from(Finances)
            .where("id = :id", { id: id })
            .execute();
        console.log("User's finance info was deleted. UserID: " + id);
    }
}