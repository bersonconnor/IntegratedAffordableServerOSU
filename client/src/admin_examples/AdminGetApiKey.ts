import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get an organization's API key. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const orgId = 1; // input the organization's ID here


//login as the admin
client.login("admin", "password").then(async() =>{

    //Call the client method to get an organizations API key
    console.log(await client.getApiKey(orgId));
});