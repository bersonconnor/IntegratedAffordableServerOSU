"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTestUtils = void 0;
const affordable_client_1 = require("affordable-client");
const affordable_shared_models_1 = require("affordable-shared-models");
const v4_1 = __importDefault(require("uuid/v4"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
/**
 * Uses services to create objects. Note that behavior in this class is untested!
 */
class IntegrationTestUtils {
    constructor() {
        this.adminClient = new affordable_client_1.AffordableAdminClient();
    }
    async createUserAndLogin(userType = affordable_shared_models_1.UserType.DONOR) {
        await this.adminClient.login(process.env.AFFORDABLE_ADMIN_USER, process.env.AFFORDABLE_ADMIN_PASSWORD);
        const userRequest = new affordable_shared_models_1.CreateUserRequest();
        userRequest.username = v4_1.default();
        userRequest.password = v4_1.default();
        userRequest.usertype = userType;
        userRequest.email = v4_1.default() + "@affordhealth.org";
        const client = new affordable_client_1.AffordableClient();
        await client.registerUser(userRequest);
        await this.adminClient.verifyEmailAddressForUser(await client.getMyUserInfo());
        // Log back in to the user account
        return client;
    }
    async createOrganization() {
        const organization = new affordable_shared_models_1.Organization();
        organization.name = v4_1.default();
        return await this.adminClient.createOrganization(organization);
    }
}
exports.IntegrationTestUtils = IntegrationTestUtils;
