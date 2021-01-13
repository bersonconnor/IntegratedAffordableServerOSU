import { CreateUserRequest, UserType } from "affordable-shared-models";
import uuidv4 from "uuid/v4";
import { AffordableClient, AffordableAdminClient } from "affordable-client";

import { config } from "dotenv";
config();

let userClient: AffordableClient;
const OLD_USER_PASSWORD = "Password123!";
const NEW_USER_PASSWORD = "321-NewPass";

describe("Integration tests to change a password for a user that is already logged in", () => {

    beforeAll(async () => {
        // First create a user and log them in
        const userRequest = new CreateUserRequest();
        userRequest.username = uuidv4();
        userRequest.password = OLD_USER_PASSWORD;
        userRequest.usertype = UserType.RECIPIENT;
        userRequest.email = uuidv4() + "@affordhealth.org";

        userClient = new AffordableClient();
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