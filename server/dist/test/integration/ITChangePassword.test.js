"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
const affordable_client_1 = require("affordable-client");
const dotenv_1 = require("dotenv");
dotenv_1.config();
let userClient;
const OLD_USER_PASSWORD = "Password123!";
const NEW_USER_PASSWORD = "321-NewPass";
describe("Integration tests to change a password for a user that is already logged in", () => {
    beforeAll(async () => {
        // First create a user and log them in
        const userRequest = new affordable_shared_models_1.CreateUserRequest();
        userRequest.username = v4_1.default();
        userRequest.password = OLD_USER_PASSWORD;
        userRequest.usertype = affordable_shared_models_1.UserType.RECIPIENT;
        userRequest.email = v4_1.default() + "@affordhealth.org";
        userClient = new affordable_client_1.AffordableClient();
        await userClient.registerUser(userRequest);
    });
    test("Successfully change a user password", async () => {
        const user = await userClient.getMyUserInfo();
        await userClient.changePassword(OLD_USER_PASSWORD, NEW_USER_PASSWORD);
        // Check that the old password is now incorrect
        await expect(userClient.login(user.username, OLD_USER_PASSWORD)).rejects.toThrowError();
        // Check that the new password now successfully logs in
        await expect(userClient.login(user.username, NEW_USER_PASSWORD)).resolves.not.toThrowError();
    });
});
