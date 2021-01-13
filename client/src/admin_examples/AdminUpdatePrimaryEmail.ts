import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to update a user's primary email. 
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const username = "recipient"; // input the user's username here
const password = "newpassword"; // input the user's password here
const newEmail = "cooleremail@hotmail.com" // input the user's new email here

//Login assuming the user's persona
client.login(username, password).then(async () => {

    // call the client method to update a user's primary email
    console.log(await client.updatePrimaryEmail(newEmail));
});