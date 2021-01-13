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
 * This is a script to allow Admins to apply
 * users to grants.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
const userId = "recipient"; // Put the user id for the user you are applying here
const password = "password"; // Put the password for the user you are applying here
const grantId = 1; // Put the grant id for the grant you are applying to here
//login assuming the users persona
client.login(userId, password).then((res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the client method to apply a user to a grant
    console.log(yield client.applyToGrant(grantId));
}));
