"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AffordableAdminClient_1 = require("../AffordableAdminClient");
/**
 * This is a script to allow Admin users to update a user's primary email.
 * Please declare all variables within the script.
 *
 * DO NOT SHARE THIS SCRIPT WITH USERS!
 */
//Declare an instance of the Affordable Admin Client
let client;
client = new AffordableAdminClient_1.AffordableAdminClient();
const username = "recipient"; // input the user's username here
const password = "newpassword"; // input the user's password here
const newEmail = "cooleremail@hotmail.com"; // input the user's new email here
//Login assuming the user's persona
client.login(username, password).then(() => __awaiter(void 0, void 0, void 0, function* () {
    // call the client method to update a user's primary email
    console.log(yield client.updatePrimaryEmail(newEmail));
}));