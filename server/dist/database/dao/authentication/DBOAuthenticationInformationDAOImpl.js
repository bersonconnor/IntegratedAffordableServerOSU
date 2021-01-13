"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBOAuthenticationInformationDAOImpl = void 0;
const typeorm_1 = require("typeorm");
const NotFoundError_1 = require("../../../models/NotFoundError");
const AuthenticationInformationDBO_1 = require("../../../models/orm/AuthenticationInformationDBO");
const Donor_1 = require("../../../models/orm/Donor");
const RecipientDBO_1 = require("../../../models/orm/RecipientDBO");
const Validation_1 = require("../../../utils/Validation");
class DBOAuthenticationInformationDAOImpl {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    async getAllUsers() {
        return await this.connection
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder()
            .getMany();
    }
    /**
     * Creates a user in AFFORDABLE
     * @param user
     */
    async createUser(user) {
        console.log("Creating user id: " + user.id + " username: " + user.username);
        return await this.connection.manager.transaction(async (transactionalEntityManager) => {
            user = await transactionalEntityManager.save(user);
            if (user.isDonor) {
                const donorRecord = new Donor_1.Donor();
                donorRecord.id = user.id;
                await transactionalEntityManager.save(donorRecord);
            }
            else {
                const recipientRecord = new RecipientDBO_1.RecipientDBO();
                recipientRecord.userId = user.id;
                await transactionalEntityManager.save(recipientRecord);
            }
            return (user);
        });
    }
    /**
     * Update a user in the database. Uses the field user.id to find the record to update.
     * @param user
     */
    async updateUser(user) {
        Validation_1.Validation.requireParam(user.id, "user.id");
        await this.connection.manager
            .createQueryBuilder()
            .update(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .set(user)
            .where("id = :id", { id: user.id })
            .execute();
        console.log("User updated: " + user.id);
        return await this.getUserById(user.id);
    }
    /**
     * Get a user in AFFORDABLE by their ID
     * @param user
     * @throws NotFoundError if no user is found
     */
    async getUserById(id) {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: id })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("User with id=" + id + " not found");
        }
        return result;
    }
    /**
     * Get a user in AFFORDABLE by their username
     * @param username the username of the user
     * @throws NotFoundError if no user is found
     */
    async getUser(username) {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("User with username=" + username + " not found");
        }
        return result;
    }
    /**
     * Deletes a user by ID in AFFORDABLE
     * @param id
     */
    async deleteUserById(id) {
        await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .delete()
            .from(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .where("id = :id", { id: id })
            .execute();
        console.log("User deleted: " + id);
    }
    /**
     * Deletes all users in AFFORDABLE
     * @param id
     */
    async deleteAllUsers() {
        await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .delete()
            .from(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .execute();
        console.log("All users deleted");
    }
    async getPasswordForUser(username) {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .select("user.password")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("User with username=" + username + " not found.");
        }
        console.log("Password retrieved for user:" + username);
        return result.password;
    }
    async getUserRequiresTwoFactorAuthentication(username) {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .select("user.TwoFactor")
            .where("user.username = :username", { username: username })
            .getOne();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("User with username=" + username + " not found.");
        }
        return result.TwoFactor;
    }
    async setUserRequiresTwoFactorAuthentication(username, value) {
        const result = await this.connection.manager
            .getRepository(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .createQueryBuilder("user")
            .update(AuthenticationInformationDBO_1.AuthenticationInformationDBO)
            .set({ TwoFactor: value })
            .where("username = :username", { username: username })
            .execute();
        if (result === undefined) {
            throw new NotFoundError_1.NotFoundError("User with username=" + username + " not found.");
        }
        return true;
    }
}
exports.DBOAuthenticationInformationDAOImpl = DBOAuthenticationInformationDAOImpl;
