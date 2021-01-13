import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to create Affordable Grants.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = 2; // Put the userId for the user you are awarding here
const grantId = 1; // Put the grantId for the grant you are awarding here

//login as the admin
client.login("admin", "password").then( async (res) =>{

    // call the client method to award a grant to a user
    console.log(await client.awardGrantToUser(userId, grantId));
});