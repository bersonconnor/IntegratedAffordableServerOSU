import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to delete a user's profile. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = 2; // input the user id for the profile you want to delete here

//Login as admin
client.login("admin", "password").then(async () => {

    // call the client method to delete a user's profile
    console.log(await client.deleteProfile(userId));
});