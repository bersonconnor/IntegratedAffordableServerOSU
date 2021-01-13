import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get a user's profile. 
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = 2; // input the user's ID whose profile you wish to view here

//Login as admin
client.login("admin", "password").then(async () => {

    // call the client method to get a user profile
    console.log(await client.getProfile(userId));
});


