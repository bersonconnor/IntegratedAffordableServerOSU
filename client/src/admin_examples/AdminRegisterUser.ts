import { AffordableAdminClient } from "../AffordableAdminClient";
import { UserType, CreateUserRequest } from "affordable-shared-models";

/**
 * This is a script to allow Admin users to register a new user. Please declare 
 * all variables within the script.
 * 
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */

//Declare an instance of the Affordable Admin Client
let client: AffordableAdminClient;
client = new AffordableAdminClient();

//Create a new user and fill in the user's information (ID, username, usertype)
const newUser = new CreateUserRequest();
newUser.username = "recipient"; //Put user's username here
newUser.password = "password" // Put user's password here
newUser.email = "coolemail@hotmail.com"; // Put user's email here
newUser.usertype = UserType.RECIPIENT // Put user's usertype here
newUser.TwoFactor = false; // Put user's 2FA preference here
newUser.TwoFactorCode = ''; // Put user's 2FA code here
newUser.deactivated = false; // Put user's Activation status here

//Register the user
client.registerUser(newUser); 