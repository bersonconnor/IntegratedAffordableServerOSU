import React, { Component } from "react";
import { PlaidLink } from 'react-plaid-link';
import {AffordableClient} from "affordable-client";
import "../../styles/buttons.css";
const dotenv_1 = require("dotenv");
dotenv_1.config();

class ACHButton extends Component{

    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

    constructor(props) {
        super(props);
        this.client = new AffordableClient();
        this.debug = this.debug.bind(this);
        this.exchangeTokens = this.exchangeTokens.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.attachBankAccountToCustomAccount = this.attachBankAccountToCustomAccount.bind(this);
        this.exitPlaid = this.exitPlaid.bind(this);
        this.successPlaid = this.successPlaid.bind(this);
    }

    debug(message) {
        var debugMessage = document.getElementById('debug-message');
        console.log('Debug: ', message);
        debugMessage.innerText += '\n' + message;
    }

    createCustomer(bankAccountToken) {
        this.debug('Creating customer...')
        fetch('/create-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bank_account: bankAccountToken
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                this.debug('Created customer!')
                this.debug(JSON.stringify(data, null, 2))
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    /**
     * Attempts to attach given bank account token to current user
     * @param username - AFFORDABLE username
     * @param usertype - 0 or 1 to determine if recipient or donor
     * @param bankAccountToken - bank account token
     */
    async attachBankAccountToCustomAccount(username, usertype, bankAccountToken) {
        console.log("Attaching bank account to:" + username);

        const data = new FormData();
        data.append("username", username);
        data.append("usertype", usertype);
        data.append("btok", bankAccountToken);

        var json = await this.client.attachBankToCustomer(data, true);
        console.log(json);
        // checks if Stripe successfully added bank account
        if(json.success == "Bank Account Added") {
            console.info(json.message);
            this.addBankToCustomTable(username, json.message);
        }
        // notify error
        else {
            alert("Adding Bank Account Failed: Check Console");
            console.error(json.message)
        }
        // fetch call to attempt to attach bank account
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL + "/stripe/attachBankToCustomAccount", {
        //       method: "POST",
        //       body: data
        //     });
        //     if (!response.ok) {
        //       throw Error(response.statusText);
        //     }
        //     const json = await response.json();

        //     // checks if Stripe successfully added bank account
        //     if(json.success == "Bank Account Added") {
        //         console.info(json.message);
        //         this.addBankToCustomTable(username, json.message);
        //     }
        //     // notify error
        //     else {
        //         alert("Adding Bank Account Failed: Check Console");
        //         console.error(json.message)
        //     }

        // } catch (error) {
        //     console.error(error);
        // }
    }

    /**
     * Adds an entry into the ConnectedBankAccount table.
     * @param username - AFFORDABLE username of the user to attach this to
     * @param bankAccountInfo - JSON of Stripe Bank account object
     */
    async addBankToCustomTable(username, bankAccountInfo) {
         const data = new FormData();
         data.append("username", username);
         data.append("bankaccount_id", bankAccountInfo.id);
         data.append("bankaccount_status", bankAccountInfo.status);
         data.append("last4", bankAccountInfo.last4);
         data.append("bankname", bankAccountInfo.bank_name);

         var json = await this.client.addBankToCustomTable(data, true);
         console.info(json.message);

         // fetch call
        //  try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/addBankToCustomTable", {
        //         method: "POST",
        //         body: data
        //     });

        //     if(!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     console.info(json.message);
        //  } catch (error) {
        //      console.error(error);
        //  }
    }

    /**
     * Attaches the given bank account token a Stripe Customer, in our case, a donor
     * @param bankAccountToken - String bank account token
     * @param username - Username of the user
     */
    async attachBankToCustomer(username, bankAccountToken) {
        const data = new FormData();
        data.append("username", username);
        data.append("btok", bankAccountToken);

        var json = await this.client.attachBankToCustomer(data, false);
        return json.bankAccount;
        // try {
        // const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL + "/stripe/attachBankToCustomer", {
        //     method: "POST",
        //     body: data
        // });
        // if (!response.ok) {
        //     throw Error(response.statusText);
        // }
        // const json = await response.json();
        // console.log(json);
        
        // } catch (error) {
        // console.log(error);
        // }
    }


    /**
     * Function takes the tokens and id generated from Plaid to exchange
     * for a bank account token
     * @param public_token
     * @param account_id
     */
    async exchangeTokens(public_token, account_id) {
        // this.debug('Exchanging tokens...')
        var username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var json = this.client.exchangeTokens(public_token,account_id, username);
        var token = json.btok;
        console.log("Sucess: Bank Token Received\n" + token);
        return token;
            // const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +'/stripe/exchangeTokens', {
            //      method: 'POST',
            //      headers: {
            //          'Content-Type': 'application/json',
            //      },
            //      body: JSON.stringify({
            //          public_token: public_token,
            //          account_id: account_id,
            //          username: JSON.parse(sessionStorage.getItem('userInfo')).username,
            //      }),
            //  })

            //  if(!response.ok) {
            //     throw Error(response.statusText);
            //  }
            //  const json = await response.json();
            //  var token = json.btok;
            //  console.log("Sucess: Bank Token Received\n" + token);
            //  return token;
     }

    async successPlaid(public_token, metadata){
        // console.log(public_token);
        // console.log(metadata.account.name);
        // console.log(metadata.institution.name);

        // Exchange tokens
        var btok = await this.exchangeTokens(public_token,metadata.account.id);
        console.log(btok);
        // calls fetch function to get usertype of the current session user
        // NOTE: If there is a simpler way to get usertype, replace this annoying fetch function
        const data1 = new FormData();
        const username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var usertype = null;
        data1.append("username", username);
        await fetch(this.REACT_APP_AF_BACKEND_URL +"/profile/get-user-type", {
            method: "POST",
            body: data1
            })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Unable to get user type");
            }
         })
        .then(resData => {
            usertype = resData.usertype;
        });

        // user is a recipient, create only Connect account
        if(usertype == 0) {
            this.attachBankAccountToCustomAccount(username, usertype, btok);
        }
        // user is a donor
        else {
            await this.attachBankToCustomer(username, btok);
        }
    }

    exitPlaid(err, metadata){
        console.error(err);
        console.log(metadata);
    }

    render() {
        return (
            <PlaidLink
                className="submit-button"
                clientName="Affordable"
                publicKey=  {process.env.REACT_APP_PLAID_PUBLIC_KEY || window.REACT_APP_PLAID_PUBLIC_KEY}
                env="sandbox"
                product={['auth','transactions']}
                selectAccount ={true}
                onSuccess={this.successPlaid.bind(this)}
                onExit = {this.exitPlaid.bind(this)}
            >
                Add Bank
            </PlaidLink>
        );
    }
}


export default ACHButton;
