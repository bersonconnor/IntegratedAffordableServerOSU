import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to see user organization affiliations. 
 * Please declare all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = 2; //Put user's id here


//login as the admin
client.login("admin", "password").then(async() =>{

    //Call the client method to get a user's org affiliations
    console.log(await client.getOrganizationsForUser(userId));
});