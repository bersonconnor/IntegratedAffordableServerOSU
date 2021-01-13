import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get a user's primary email.
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const username = "recipient"; // input the user's usrname here

//Login as admin
client.login("admin", "password").then(async () => {

    // call the client method to get a user's primary email
    console.log(await client.getPrimaryEmail(username));
});