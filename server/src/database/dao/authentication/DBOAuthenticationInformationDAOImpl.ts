import { Connection, getConnection } from "typeorm";
import { NotFoundError } from "../../../models/NotFoundError";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { Donor } from "../../../models/orm/Donor";
import { RecipientDBO } from "../../../models/orm/RecipientDBO";
import { Validation } from "../../../utils/Validation";
import { AuthenticationInformationDAO } from "./AuthenticationInformationDAO";


export class DBOAuthenticationInformationDAOImpl implements AuthenticationInformationDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }

    async getAllUsers(): Promise<Array<AuthenticationInformationDBO>> {
        return await this.connection
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder()
            .getMany();
    }

    /**
     * Creates a user in AFFORDABLE
     * @param user
     */
    async createUser(user: AuthenticationInformationDBO): Promise<AuthenticationInformationDBO> {
        console.log("Creating user id: " + user.id + " username: " + user.username);
        return await this.connection.manager.transaction(async transactionalEntityManager => {
            user = await transactionalEntityManager.save(user);
            if (user.isDonor) {
                const donorRecord = new Donor();
                donorRecord.id = user.id;
                await transactionalEntityManager.save(donorRecord);
            } else {
                const recipientRecord = new RecipientDBO();
                recipientRecord.userId = user.id;
                await transactionalEntityManager.save(recipientRecord);
            }
            return (user);
        })
    }

    /**
     * Update a user in the database. Uses the field user.id to find the record to update.
     * @param user
     */
    async updateUser(user: AuthenticationInformationDBO): Promise<AuthenticationInformationDBO> {
        Validation.requireParam(user.id, "user.id");
        await this.connection.manager
            .createQueryBuilder()
            .update(AuthenticationInformationDBO)
            .set(user)
            .where("id = :id", { id: user.id })
            .execute()
        console.log("User updated: " + user.id);
        return await this.getUserById(user.id);
    }


    /**
     * Get a user in AFFORDABLE by their ID
     * @param user
     * @throws NotFoundError if no user is found
     */
    async getUserById(id: number): Promise<AuthenticationInformationDBO> {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: id })
            .getOne()
        if (result === undefined) {
            throw new NotFoundError("User with id=" + id + " not found");
        }
        return <AuthenticationInformationDBO>result;
    }

    /**
     * Get a user in AFFORDABLE by their username
     * @param username the username of the user
     * @throws NotFoundError if no user is found
     */
    async getUser(username: string): Promise<AuthenticationInformationDBO> {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("User with username=" + username + " not found");
        }
        return <AuthenticationInformationDBO>result;
    }

    /**
     * Deletes a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserById(id: number): Promise<void> {
        await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .delete()
            .from(AuthenticationInformationDBO)
            .where("id = :id", { id: id })
            .execute();
        console.log("User deleted: " + id);
    }

    /**
     * Deletes all users in AFFORDABLE
     * @param id
     */
    async deleteAllUsers(): Promise<void> {
        await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .delete()
            .from(AuthenticationInformationDBO)
            .execute();
        console.log("All users deleted");
    }


    async getPasswordForUser(username: string): Promise<string> {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .select("user.password")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("User with username=" + username + " not found.");
        }
        console.log("Password retrieved for user:" + username);
        return result.password as string;
    }

    async getUserRequiresTwoFactorAuthentication(username: string): Promise<boolean> {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .select("user.TwoFactor")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError("User with username=" + username + " not found.");
        }
        return result.TwoFactor as boolean;
    }

    async setUserRequiresTwoFactorAuthentication(username: string, value: boolean): Promise<boolean> {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .update(AuthenticationInformationDBO)
            .set({ TwoFactor: value })
            .where("username = :username", { username: username })
            .execute()
        if (result === undefined) {
            throw new NotFoundError("User with username=" + username + " not found.");
        }
        return true;
    }

}
