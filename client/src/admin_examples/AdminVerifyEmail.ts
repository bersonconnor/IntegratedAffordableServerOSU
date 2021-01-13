import { AffordableAdminClient } from "../AffordableAdminClient";
import { UserInfo, UserType } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to verify a user's email. 
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

//Create a new user and fill in the user's information (ID, username, usertype)
const userinfo = new UserInfo();
userinfo.id = 2; //Put user's id here
userinfo.username = "recipient" // Put user's username here
userinfo.userType = UserType.RECIPIENT // Put user's usertype here
userinfo.hasVerifiedEmail = false; //put user's verified email value here

//login as the admin
client.login("admin", "password").then(res =>{

    //Call the client method to verify email address
    client.verifyEmailAddressForUser(userinfo);
});

