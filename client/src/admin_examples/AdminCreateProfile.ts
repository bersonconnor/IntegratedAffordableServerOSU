import { AffordableAdminClient } from "../AffordableAdminClient";
import { ProfileFields } from "affordable-shared-models";
/**
 * This is a script to allow Admin users to create a user's profile. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

//Create a new user profile and file in information
const profile = new ProfileFields.Profile();
const name = new ProfileFields.LegalName();
name.currentName = true;
name.firstName = "Warren";
name.lastName = "Campbell";
profile.legalNames = [];
profile.legalNames.push(name);
profile.birthDate = "1970-01-01";
const address = new ProfileFields.Address;
address.street = "1234 Real Street";
address.city = "Citysburg";
address.state = "Ohio";
address.zip = "11111";
profile.address = address;
profile.phoneNumbers = ["1111111111"];

//declare any option values of the profile field here

const username = "recipient"; //Put user's username here
const password = "password"; // Put user's password here

//login assuming the user's persona
client.login(username, password).then(async () => {

    // call the client method to create a user's profile
    console.log(await client.createProfile(profile));
});