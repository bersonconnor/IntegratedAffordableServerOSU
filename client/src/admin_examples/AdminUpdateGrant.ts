import { AffordableAdminClient } from "../AffordableAdminClient";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";

/**
 * This is a script to allow Admin users to update Affordable Grants.
 * Please declare all values within this script
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const grantId = 1; // input the grant ID you wish to update here

// Declare all optional fields you'd like to update here
const eligibility = new EligibilityCriteria();
eligibility.organizationId = 1;
eligibility.emailAddress = "coolemail@hotmail.com";

//login as the admin
client.login("admin", "password").then( async (res) =>{

    // get the old grant and update the respective fields
    const grant =  await client.getGrant(grantId); 
    grant.eligibilityCriteria = eligibility;

    // call the client method to update a grant
    console.log(await client.updateGrant(grant));
});
