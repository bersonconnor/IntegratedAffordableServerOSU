import { AffordableClient, AffordableAdminClient } from "affordable-client";
import {CreateUserRequest, Organization, UserInfo, UserType} from "affordable-shared-models";
import uuidv4 from "uuid/v4";

import { config } from "dotenv";
config();

/**
 * Uses services to create objects. Note that behavior in this class is untested!
 */
export class IntegrationTestUtils {
    private adminClient: AffordableAdminClient;

    constructor() {
        this.adminClient = new AffordableAdminClient();
    }

    public async createUserAndLogin(userType = UserType.DONOR): Promise<AffordableClient> {
        await this.adminClient.login(process.env.AFFORDABLE_ADMIN_USER, process.env.AFFORDABLE_ADMIN_PASSWORD);
        const userRequest = new CreateUserRequest();
        userRequest.username = uuidv4();
        userRequest.password = uuidv4();
        userRequest.usertype = userType;
        userRequest.email = uuidv4() + "@affordhealth.org";

        const client = new AffordableClient();
        await client.registerUser(userRequest);
        await this.adminClient.verifyEmailAddressForUser(await client.getMyUserInfo());

        // Log back in to the user account
        return client;
    }

    public async createOrganization(): Promise<Organization> {
        const organization = new Organization();
        organization.name = uuidv4();
        return await this.adminClient.createOrganization(organization);
    }
}
