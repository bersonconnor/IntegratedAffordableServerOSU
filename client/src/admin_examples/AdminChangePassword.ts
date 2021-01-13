import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to change a user's password. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const username = "recipient"; // Put in the username whom you want to change passwords here
const password = "password"; // Put in the user's old password here
const newPassword = "newpassword"; // Put in the user's new password here

//Login assuming the user's persona
client.login(username, password).then(async () => {

    //Call the client method to change a user's password
    console.log( await client.changePassword(password, newPassword));
});