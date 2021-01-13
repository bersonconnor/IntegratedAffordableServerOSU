"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const NotFoundError_1 = require("../../../models/NotFoundError");
const AuthenticationInformationDBO_1 = require("../../../models/orm/AuthenticationInformationDBO");
const DBOAuthenticationInformationDAOImpl_1 = require("./DBOAuthenticationInformationDAOImpl");
let authDao;
describe("DBOAuthenticationInformationDAOImpl tests", () => {
    beforeAll(async (done) => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        authDao = new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
        done();
    });
    test("Get a user by username that does not exist", async () => {
        await expect(authDao.getUser(v4_1.default())).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
    test("CRUD", async () => {
        let users = await authDao.getAllUsers();
        const numUsers = users.length;
        const user = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
        user.username = v4_1.default();
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
        await expect(authDao.getUserById(readUser.id)).rejects.toThrowError(NotFoundError_1.NotFoundError);
    });
    afterAll(async () => {
        await authDao.deleteAllUsers();
    });
});
