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
 * This is a script to allow Admin users to add a donor account to an organization. Please declare
 * all variables within the script.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
//Create a new AddMemberRequest and fill out the required fields
const addMember = new affordable_shared_models_1.AddMemberRequest();
addMember.isAdmin = false;
addMember.userId = 2;
addMember.organizationId = 1;
//login as the admin
client.login("admin", "password").then(() => __awaiter(void 0, void 0, void 0, function* () {
    //Call the client method to add a user to an organization
    console.log(yield client.addUserToOrganization(addMember));
}));
