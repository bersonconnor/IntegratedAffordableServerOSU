import { AffordableAdminClient } from "../AffordableAdminClient";

/**
 * This is a script to allow Admin users to get eligible grants for a user.
 * Please declare all variables within this script
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

const userId = "recipient"; // input the usersname here
const password = "password"; // input the password here

//login assuming the user's persona
client.login(userId, password).then( async (res) =>{

    // call the client method to get eligible grants
    console.log(await client.getEligibleGrants());
});