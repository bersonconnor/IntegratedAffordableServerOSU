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
const EligibilityCriteria_1 = require("affordable-shared-models/dist/models/EligibilityCriteria");
/**
 * This is a script to allow Admin users to update Affordable Grants.
 * Please declare all values within this script
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
const grantId = 1; // input the grant ID you wish to update here
// Declare all optional fields you'd like to update here
const eligibility = new EligibilityCriteria_1.EligibilityCriteria();
eligibility.organizationId = 1;
eligibility.emailAddress = "coolemail@hotmail.com";
//login as the admin
client.login("admin", "password").then((res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the old grant and update the respective fields
    const grant = yield client.getGrant(grantId);
    grant.eligibilityCriteria = eligibility;
    // call the client method to update a grant
    console.log(yield client.updateGrant(grant));
}));
