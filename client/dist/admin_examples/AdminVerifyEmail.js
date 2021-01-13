"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AffordableAdminClient_1 = require("../AffordableAdminClient");
const affordable_shared_models_1 = require("affordable-shared-models");
/**
 * This is a script to allow Admin users to verify a user's email.
 * Please declare all variables within the script.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
//Create a new user and fill in the user's information (ID, username, usertype)
const userinfo = new affordable_shared_models_1.UserInfo();
userinfo.id = 2; //Put user's id here
userinfo.username = "recipient"; // Put user's username here
userinfo.userType = affordable_shared_models_1.UserType.RECIPIENT; // Put user's usertype here
userinfo.hasVerifiedEmail = false; //put user's verified email value here
//login as the admin
client.login("admin", "password").then(res => {
    //Call the client method to verify email address
    client.verifyEmailAddressForUser(userinfo);
});
