import { AffordableAdminClient } from "../AffordableAdminClient";
import { Organization } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to create organizations. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

//Create a new organization and fill in the org's required information
const organization = new Organization();
organization.name = "AFFORDABLE INC."; // Put organization name here

// Fill any optional organization fields here

//login as the admin
client.login("admin", "password").then(async() =>{

    //Call the client method to create a new organization
    console.log(await client.createOrganization(organization));
});

