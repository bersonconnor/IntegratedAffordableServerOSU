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
 * This is a script to allow Admin users to create a user's profile. Please declare
 * all variables within the script.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
//Create a new user profile and file in information
const profile = new affordable_shared_models_1.ProfileFields.Profile();
const name = new affordable_shared_models_1.ProfileFields.LegalName();
name.currentName = true;
name.firstName = "Warren";
name.lastName = "Campbell";
profile.legalNames = [];
profile.legalNames.push(name);
profile.birthDate = "1970-01-01";
const address = new affordable_shared_models_1.ProfileFields.Address;
address.street = "1234 Real Street";
address.city = "Citysburg";
address.state = "Ohio";
address.zip = "11111";
profile.address = address;
profile.phoneNumbers = ["1111111111"];
//declare any option values of the profile field here
const username = "recipient"; //Put user's username here
const password = "password"; // Put user's password here
//login assuming the user's persona
client.login(username, password).then(() => __awaiter(void 0, void 0, void 0, function* () {
    // call the client method to create a user's profile
    console.log(yield client.createProfile(profile));
}));
