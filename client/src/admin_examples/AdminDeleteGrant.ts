import { AffordableAdminClient } from "../AffordableAdminClient";
import { Grant, Organization } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to delete grants.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const grantId = 1; // input the id for the grant you want to delete here

//login as the admin
client.login("admin", "password").then( async (res) =>{

    // call the client method to delete a grant
    console.log(await client.deleteGrant(grantId)); 
});