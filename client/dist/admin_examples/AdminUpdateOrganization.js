"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AffordableAdminClient_1 = require("../AffordableAdminClient");
/**
 * This is a script to allow Admin users to update organizations. Please declare
 * all variables within the script.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
const orgId = 1; //Put org id you want to update here
//Input field values you want to update here
const url = "www.affordhealth.org";
const email = "covid19@affordhealth.org";
//login as the admin
client.login("admin", "password").then(() => __awaiter(void 0, void 0, void 0, function* () {
    // get the organization and save the respective fields
    const organization = yield client.getOrganization(orgId);
    organization.url = url;
    organization.email = email;
    //Call the client method to update an organization
    console.log(yield client.updateOrganization(organization));
}));
