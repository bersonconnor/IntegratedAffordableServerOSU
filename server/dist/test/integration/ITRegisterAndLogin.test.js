"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const affordable_client_1 = require("affordable-client");
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
describe("Integration tests to create and log into an account", () => {
    test("Create and log in to account", async () => {
        const userRequest = new affordable_shared_models_1.CreateUserRequest();
        userRequest.username = v4_1.default();
        userRequest.password = v4_1.default();
        userRequest.usertype = affordable_shared_models_1.UserType.DONOR;
        userRequest.email = v4_1.default() + "@affordhealth.org";
        const client = new affordable_client_1.AffordableClient();
        // Call under test: user registration
        await client.registerUser(userRequest);
        // Call under test: login with credentials
        await client.login(userRequest.username, userRequest.password);
        // Call under test: failed login with incorrect credentials
        await expect(client.login(userRequest.username, userRequest.password + "-wrong")).rejects.toThrowError("Request failed with status code 401");
    });
});
