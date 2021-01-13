import { AffordableClient } from "affordable-client";
import { CreateUserRequest, UserType } from "affordable-shared-models";
import uuidv4 from "uuid/v4";

describe("Integration tests to create and log into an account", () => {

    test("Create and log in to account",  async () => {
        const userRequest = new CreateUserRequest();
        userRequest.username = uuidv4();
        userRequest.password = uuidv4();
        userRequest.usertype = UserType.DONOR;
        userRequest.email = uuidv4() + "@affordhealth.org";

        const client = new AffordableClient();

        // Call under test: user registration
        await client.registerUser(userRequest);
        // Call under test: login with credentials
        await client.login(userRequest.username, userRequest.password);

        // Call under test: failed login with incorrect credentials
        await expect(client.login(userRequest.username, userRequest.password + "-wrong")).rejects.toThrowError("Request failed with status code 401");
    });

});