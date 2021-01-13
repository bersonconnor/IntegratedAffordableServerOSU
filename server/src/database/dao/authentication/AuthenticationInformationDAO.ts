import {AuthenticationInformationDBO} from "../../../models/orm/AuthenticationInformationDBO";

export interface AuthenticationInformationDAO {
    getAllUsers(): Promise<Array<AuthenticationInformationDBO>>;

    /**
     * Creates a user in AFFORDABLE
     * @param user {@class UserAuthenticationInformation}
     * @returns {@class UserAuthenticationInformation}
     */
    createUser(user: AuthenticationInformationDBO): Promise<AuthenticationInformationDBO>;

    /**
     * Update a user in the database. Uses the field user.id to find the record to update.
     * @param user
     */
    updateUser(user: AuthenticationInformationDBO): Promise<AuthenticationInformationDBO>;

    /**
     * Get a user in AFFORDABLE by their ID
     * @param user
     * @throws NotFoundError {@class NotFoundError} if no user is found
     */
    getUserById(id: number): Promise<AuthenticationInformationDBO>;

    /**
     * Get a user in AFFORDABLE by their username
     * @param username the username of the user
     * @throws NotFoundError if no user is found
     */
    getUser(username: string): Promise<AuthenticationInformationDBO>;

    /**
     * Deletes a user by ID in AFFORDABLE
     * @param id
     */
    deleteUserById(id: number): Promise<void>;

    /**
     * Deletes a user by ID in AFFORDABLE
     * @param id
     */
    deleteAllUsers(): Promise<void>;

    getPasswordForUser(username: string): Promise<string>;

    getUserRequiresTwoFactorAuthentication(username: string): Promise<boolean>;

    setUserRequiresTwoFactorAuthentication(username: string, value: boolean): Promise<boolean>;
}