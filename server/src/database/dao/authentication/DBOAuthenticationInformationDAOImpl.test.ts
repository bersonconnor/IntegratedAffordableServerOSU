import uuidv4 from "uuid/v4";
import DatabaseConnection from "../../DatabaseConnection";
import { NotFoundError } from "../../../models/NotFoundError";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import {DBOAuthenticationInformationDAOImpl} from "./DBOAuthenticationInformationDAOImpl";

let authDao: DBOAuthenticationInformationDAOImpl;

describe("DBOAuthenticationInformationDAOImpl tests", () => {
    beforeAll(async (done) => {
        await DatabaseConnection.initializeDatabaseConnection();
        authDao = new DBOAuthenticationInformationDAOImpl();
        done();
    });

    test("Get a user by username that does not exist", async () => {
        await expect(authDao.getUser(uuidv4())).rejects.toThrowError(NotFoundError);
    });

    test("CRUD", async () => {
        let users: Array<AuthenticationInformationDBO> = await authDao.getAllUsers();
        const numUsers = users.length;
        const user = new AuthenticationInformationDBO();
        user.username = uuidv4();
        user.password = "password";
        user.isDonor = false;
        user.TwoFactor = true;
        user.TwoFactorCode = "a code";
        user.deactivated = false;

        // Create: call under test
        const createdUser = await authDao.createUser(user);

        users = await authDao.getAllUsers();

        // The created user should be the same, except for setting the ID
        user.id = createdUser.id;
        expect(createdUser).toBe(user);

        // Update: call under test
        const updatedUser = await authDao.updateUser(createdUser);
        expect(updatedUser).toStrictEqual(createdUser);

        // Get by id: call under test
        const readUser = await authDao.getUserById(updatedUser.id);
        expect(readUser).toStrictEqual(updatedUser);

        // Get by name: call under test
        const getByName = await authDao.getUser(createdUser.username);
        expect(readUser).toStrictEqual(getByName);

        // Read all: call under test
        expect((await authDao.getAllUsers()).length).toBe(numUsers + 1);

        // Delete: call under test
        await authDao.deleteUserById(updatedUser.id);

        // Reading all should keep num users the same
        expect((await authDao.getAllUsers()).length).toBe(numUsers);

        // Trying to find the user again should give an error
        await expect(authDao.getUserById(readUser.id)).rejects.toThrowError(NotFoundError);
    });

    afterAll(async () => {
        await authDao.deleteAllUsers();
    });
});