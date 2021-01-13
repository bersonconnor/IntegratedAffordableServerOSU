"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AffordableAdminClient_1 = require("../AffordableAdminClient");
const affordable_shared_models_1 = require("affordable-shared-models");
/**
 * This is a script to allow Admin users to register a new user. Please declare
 * all variables within the script.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
//Create a new user and fill in the user's information (ID, username, usertype)
const newUser = new affordable_shared_models_1.CreateUserRequest();
newUser.username = "recipient"; //Put user's username here
newUser.password = "password"; // Put user's password here
newUser.email = "coolemail@hotmail.com"; // Put user's email here
newUser.usertype = affordable_shared_models_1.UserType.RECIPIENT; // Put user's usertype here
newUser.TwoFactor = false; // Put user's 2FA preference here
newUser.TwoFactorCode = ''; // Put user's 2FA code here
newUser.deactivated = false; // Put user's Activation status here
//Register the user
client.registerUser(newUser);
