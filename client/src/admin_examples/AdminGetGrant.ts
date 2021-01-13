import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get Affordable Grants.
 * Please declare all variables within the script
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const grantId = 1; // input the grant ID you want to view here

//login as the admin
client.login("admin", "password").then( async (res) =>{

    // call the client method to get a grant
    console.log(await client.getGrant(grantId)); 
});