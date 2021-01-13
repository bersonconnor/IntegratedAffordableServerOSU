import {Connection, getConnection} from "typeorm";
import {NotFoundError} from "../../../models/NotFoundError";
import {LegalName} from "../../../models/orm/profile/LegalName";
import {LegalNameDAO} from "./LegalNameDAO";


export class DBOLegalNameDAOImpl implements LegalNameDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    /**
     * Adds legal name information to a user's profile, can be used for creating and updating
     * @param legalName
     */
    async addLegalName(legalName: LegalName): Promise<LegalName> {
        console.log("Adding legal name: ");
        console.log(legalName);

        return await this.connection.manager.transaction(async transactionalEntityManager => {
            legalName = await transactionalEntityManager.save(legalName);
            return (legalName);
        })
    }

    /**
     * Get a legal name(s) in AFFORDABLE by the User's ID
     * @param id
     * @return array of {@class LegalName}
     * @throws NotFoundError if no legal name for the user is found
     */
    async getAllLegalNamesWithUserId(id: number): Promise<Array<LegalName>> {
        const result = await this.connection.manager
            .getRepository(LegalName)
            .createQueryBuilder("legalName")
            .where("legalName.id = :id", {id: id})
            .getMany();
        if (result === undefined || result.length == 0) {
            throw new NotFoundError("Legal name for user with id=" + id + " not found");
        }
        return result as Array<LegalName>;
    }

    /**
     * Deletes legal name(s) info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserLegalNamesById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(LegalName)
            .createQueryBuilder("name")
            .delete()
            .from(LegalName)
            .where("id = :id", {id: id})
            .execute();
        console.log("User's Legal Name(s) was deleted. UserID: " + id);
    }
}