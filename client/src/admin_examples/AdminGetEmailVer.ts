import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to see a user's email verification.
 *  Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const username = "recipient"; //Put user's username here
const password = "newpassword" // Put user's password here

// login using the user's persona
client.login(username, password).then(async () => {

    // call the client method to get a user's email verification status
    console.log(await client.getEmailVer());
}); 