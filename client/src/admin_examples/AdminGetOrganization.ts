import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get an organization. 
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const orgId = 1; //Put organization id here


//login as the admin
client.login("admin", "password").then(async() =>{

    //Call the client method to get an organization
    console.log(await client.getOrganization(orgId));
});