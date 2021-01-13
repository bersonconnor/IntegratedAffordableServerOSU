import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get applicants for grants. Please
 * declare all variables within the script
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const grantId = 1; // put the grant ID whose applicants you want to see here

//login as the admin
client.login("admin", "password").then( async (res) =>{

    // call the client method to get a grant's applicants
    console.log(await client.getGrantApplicants(grantId));
});