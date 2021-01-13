import { AffordableAdminClient } from "../AffordableAdminClient";
import { AddMemberRequest } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to add a donor account to an organization. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

//Create a new AddMemberRequest and fill out the required fields
const addMember = new AddMemberRequest();
addMember.isAdmin = false;
addMember.userId = 2;
addMember.organizationId = 1;


//login as the admin
client.login("admin", "password").then(async() =>{

    //Call the client method to add a user to an organization
    console.log(await client.addUserToOrganization(addMember));
});