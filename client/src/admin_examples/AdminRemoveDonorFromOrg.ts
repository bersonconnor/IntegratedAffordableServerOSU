import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to remove users from organizations. 
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = 2; //Put user's id here
const orgId = 1; // Put organization's id here

//login as the admin
client.login("admin", "password").then(async() =>{

    //Call the client method to remove a user from an organization
    console.log(await client.removeMemberFromOrganization(orgId, userId));
});