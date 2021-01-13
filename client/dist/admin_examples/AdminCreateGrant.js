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
const affordable_shared_models_1 = require("affordable-shared-models");
/**
 * This is a script to allow Admin users to create Affordable Grants.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
const orgId = 1; // input the orgId for the Organization you are creating the grant for here
//Create a new grant and fill out it's basic information
const grant = new affordable_shared_models_1.Grant();
grant.id = 1; // insert grant id number here
grant.grantName = "Example Grant"; // insert grant name here
grant.grantAmount = 1000000000; // insert grant ammount here
grant.description = "This is an example grant. Please do not use this description"; // insert description here
//Fill in any further optional fields here
//login as the admin
client.login("admin", "password").then((res) => __awaiter(void 0, void 0, void 0, function* () {
    grant.organization = yield client.getOrganization(orgId);
    //Call the client method to create a grant
    console.log(yield client.createGrant(grant));
}));
