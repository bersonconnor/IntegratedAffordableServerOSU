import { AffordableAdminClient } from "../AffordableAdminClient";
import { Organization } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to update organizations. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const orgId = 1; //Put org id you want to update here

//Input field values you want to update here
const url = "www.affordhealth.org";
const email = "covid19@affordhealth.org";

//login as the admin
client.login("admin", "password").then(async() =>{

    // get the organization and save the respective fields
    const organization = await client.getOrganization(orgId);
    organization.url = url;
    organization.email = email;

    //Call the client method to update an organization
    console.log(await client.updateOrganization(organization));
});
