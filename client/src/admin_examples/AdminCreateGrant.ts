import { AffordableAdminClient } from "../AffordableAdminClient";
import {  Grant } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to create Affordable Grants.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const orgId = 1; // input the orgId for the Organization you are creating the grant for here

//Create a new grant and fill out it's basic information
const grant = new Grant();
grant.id = 1; // insert grant id number here
grant.grantName = "Example Grant"; // insert grant name here
grant.grantAmount = 1000000000; // insert grant ammount here
grant.description = "This is an example grant. Please do not use this description"; // insert description here

//Fill in any further optional fields here

//login as the admin
client.login("admin", "password").then( async (res) =>{
    grant.organization = await client.getOrganization(orgId);

    //Call the client method to create a grant
    console.log(await client.createGrant(grant));
});
