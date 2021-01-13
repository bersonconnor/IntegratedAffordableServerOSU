import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admins to apply 
 * users to grants.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = "recipient"; // Put the user id for the user you are applying here
const password = "password"; // Put the password for the user you are applying here
const grantId = 1; // Put the grant id for the grant you are applying to here

//login assuming the users persona
client.login(userId, password).then( async (res) =>{

    // Call the client method to apply a user to a grant
    console.log(await client.applyToGrant(grantId));
});