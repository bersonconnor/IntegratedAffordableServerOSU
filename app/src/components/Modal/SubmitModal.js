import React, { Component } from "react";
import Popup from "reactjs-popup";

import ThankYouModal from "./ThankYouModal";
import {AffordableClient} from "affordable-client";
import "./scss/modal.scss";
import "../../styles/buttons.css";
import { UserType } from "affordable-shared-models";

class SubmitModal extends Component{
    constructor(props){
        super(props);
        this.client = new AffordableClient();
        this.state = {
            open:false,
            validAmount: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalSuccess = this.closeModalSuccess.bind(this);

        this.logDeposit = this.logDeposit.bind(this);
        this.logDonate = this.logDonate.bind(this);
        // this.logWithdraw = this.logWithdraw.bind(this);
    }

       // Do this stuff after page loads
       async componentDidMount() {
        // checkTransaction every 5 secs
     //   this.checkTransaction=setInterval(() => this.checkTransactionStatus(this.state.chargeID), 3000);
 
    }

//     componentWillUnmount() {
//         // Stop checking transaction 
//         clearInterval(this.checkTransaction);
//   }

    logDonate = async () => {
        var username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var json = await this.client.donateToHug(username, this.props.HUGName, this.props.afterTax);
        console.log("Inserted donation");

        // const data = new FormData();
        // data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        // data.append("HUGName", this.props.HUGName);
        // data.append("amount", this.props.afterTax);
        // console.log(JSON.parse(sessionStorage.getItem('userInfo')).username,this.props.HUGName);
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/transferFundFromDonorToHUG", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     console.log("Inserted donation");
        // } catch (error) {
        //     console.log(error);
        // }
    }

    logDeposit = async () => {
        const data = new FormData();
        data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        data.append("paymentType",this.props.paymentType);
        data.append("paymentMethod",this.props.paymentMethod);
        data.append("amountToCharge",this.props.beforeTax);
        data.append("amountToDeposit",this.props.afterTax);
        data.append("stripeFee",this.props.stripeTax);
        data.append("managementFee",this.props.affordableTax);

        var username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var json = await this.client.donateToHug(username, this.props.paymentType, 
            this.props.paymentMethod,this.props.beforeTax, this.props.afterTax,
            this.props.stripeTax, this.props.affordableTax);
        var chargeID=json.chargeID;
        console.log("chargeID is "+chargeID)

        console.log(this.props.paymentType,this.props.paymentMethod,this.props.afterTax);

        setTimeout( async function  timer(){
            var json = await this.client.donateToHug(username, chargeID, "Deposit");
            alert("Transaction Status is "+ json.transactionStatus);

        }, 5000);

        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/deposit", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     var chargeID=json.chargeID;
        //     console.log("chargeID is "+chargeID)
      
        //     setTimeout( async function  timer(){
        //         const data2 = new FormData();
        //         data2.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        //         data2.append("chargeID", chargeID);

        //         const response2 =  await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/transaction/depositStatus", {
        //             method: "POST",
        //             body: data2
        //         });

        //         if (!response2.ok) {
        //             throw Error(response2.statusText);
        //         }
        //         const json2 =await  response2.json();
        //         alert("Transaction Status is "+json2.transactionStatus);
        //     }, 5000 );
            
        // } catch (error) {
        //     console.log(error);
        // }
    }
    

    logWithdraw = async () => {
        var username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var bankID = null;
        var accountID = null;

        const data= new FormData();
        data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        data.append("paymentType",this.props.paymentType);
        data.append("paymentMethod",this.props.paymentMethod);
        data.append("amount", (this.props.afterTax * 100));
        console.log(this.props.paymentType + " " + this.props.paymentMethod + " " +this.props.afterTax);

        var json = await this.client.getCustomBank(data);
        if(json.success == "No User Found") {
            console.error("Error: Custom Account Bank Account Not Found");
            return;
        } else {
            console.log("Account Found: " + json.accountID);
            data.append("bankID", json.accountID);
        }

        // fetches the user's connected bank account
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/getCustomBank", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();

        //     if(json.success == "No User Found") {
        //         console.error("Error: Custom Account Bank Account Not Found");
        //         return;
        //     } else {
        //         console.log("Account Found: " + json.accountID);
        //         data.append("bankID", json.accountID);
        //     }
        // } catch (error) {
        //     alert("Withdraw Failed")
        //     console.log(error);
        //     return;
        // }

        // fetches the user's connected bank account
        var json = await this.client.getStripeAccountID(username, "0");
        if(json.success == "No Account Found") {
            console.error("Error: Custom Account Not Found");
            return
        } else {
            console.log("Account Found: " + json.id);
            data.append("accountID", json.id);
        }

        // data.append("usertype", "0");
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/getCustomAccountID", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();

        //     if(json.success == "No Account Found") {
        //         console.error("Error: Custom Account Not Found");
        //         return
        //     } else {
        //         console.log("Account Found: " + json.id);
        //         data.append("accountID", json.id);
        //     }
        // } catch (error) {
        //     alert("Withdraw Failed")
        //     console.log(error);
        //     return;
        // }


        // makes the transfer from the main account to Custom Account
        var transferjson = null;
        var json = await this.client.stripeTransfer(data);
        if(json.success == "STRIPE ERROR") {
            alert("Withdraw Failed")
            console.error(json.message);
            return
        } else {
            console.log(json);
            transferjson = json.message;
        }
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/transfer", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();

        //     if(json.success == "STRIPE ERROR") {
        //         alert("Withdraw Failed")
        //         console.error(json.message);
        //         return
        //     } else {
        //         console.log(json);
        //     }
        // } catch (error) {
        //     alert("Withdraw Failed")
        //     console.log(error);
        //     return;
        // }

        // makes payout
        // makes the transfer from the main account to Custom Account
        
        data.append("description", "Recipient AFFORDABLE Withdraw: Initiated by " + JSON.parse(sessionStorage.getItem('userInfo')).username +
        " | Amount: $" + this.props.afterTax);
        
        var json = await this.client.stripePayout(data, false);
        if(json.success == "STRIPE ERROR") {
            alert("Withdraw Failed")
            console.error(json.message);
            return
        } else {
            console.log(json);
            
        }
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/payout", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();

        //     if(json.success == "STRIPE ERROR") {
        //         alert("Withdraw Failed")
        //         console.error(json.message);
        //         return
        //     } else {
        //         console.log(json);
        //         payoutjson = json.message;
        //     }
        // } catch (error) {
        //     alert("Withdraw Failed")
        //     console.log(error);
        //     return;
        // }

        //Everything below for the rest of this function are database changes 

        // logs payout in externalTransactions
        var transactionID = null;
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        data.append("transferID", transferjson.id);
        //data.append("status", payoutjson.status);
        data.append("timestamp", date);
        data.set("amount", this.props.afterTax); //resets it back to original float

        var json = await this.client.stripePayout(data, true);
        transactionID = json.transactionID;
        console.log(json);
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/payoutUpdateTable", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     transactionID = json.transactionID;
        //     console.log(json);
        // } catch (error) {
        //     alert("Withdraw Failed")
        //     console.log(error);
        //     return;
        // }
        /*
        data.append("fee_amount", (this.props.beforeTax-this.props.afterTax)*100);
        try {
            const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/affordablePayoutFee", {
                method: "POST",
                body: data
            });
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const json = await response.json();
            console.log(json);
        } catch (error) {
            alert("Fee Payout Failed")
            console.log(error);
            return;
        }
        */

        // logs fee in fees table
        data.append("fee", (this.props.beforeTax-this.props.afterTax))
        data.append("transactionID", transactionID);
        /*
        try {
            const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/payoutUpdateFee", {
                method: "POST",
                body: data
            });
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const json = await response.json();
            console.log(json);
            alert("Payment Successful!");
        } catch (error) {
            alert("Withdraw Failed")
            console.log(error);
            return;
        }
        */

        
    }

    openModal(){
        
        let amountStr = typeof this.props.beforeTax === "number" ? this.props.beforeTax.toString() : this.props.beforeTax;
        if(this.props.shouldOpen && this.props.paymentMethod != "--"){
            this.setState({open: true});
            console.log(this.props.buttonType + " Submit Modal Open");
        }
        else{
            console.log("Invalid input");
            if(!(this.props.shouldOpen)){
                console.log("invalid " + amountStr);
                this.props.amountError(true);
            }
            else{
                console.log("valid " + amountStr);
                this.props.amountError(false);
            }
        }

        if(this.props.buttonType != "Donate"){
            if(this.props.paymentMethod === "--"){
                this.props.paymentMethodError(true);
            }
            else{
                this.props.paymentMethodError(false);
            }
    
            if(this.props.paymentType === "--"){    
                this.props.paymentTypeError(true);
            }
            else{
                this.props.paymentTypeError(false);
            }
        }        
    }

    closeModalSuccess(){
        if(this.state.open){
            switch(this.props.buttonType){
                case "Deposit":
                    this.logDeposit();
                    break;
                case "Donate":
                    this.logDonate();
                    break;
                case "Withdraw":
                     this.logWithdraw();
                     break;
                default:
                    console.log(this.props.paymentType);
                    break;
            }
        }

        this.setState({open: false});
        this.props.handleHideErrorMessage();

        console.log(this.props.buttonType + " Submit Modal Close");
    }

    closeModal(){
        this.setState({open: false});
        this.props.handleHideErrorMessage();

        console.log(this.props.buttonType + " Submit Modal Cancel");
    }

    render(){
        let b = (typeof this.props.beforeTax) == "string" ? parseFloat(this.props.beforeTax).toFixed(2) : this.props.beforeTax.toFixed(2);
        let t = (typeof this.props.tax) == "string" ? parseFloat(this.props.tax).toFixed(2) : this.props.tax.toFixed(2);
        let a = (typeof this.props.afterTax) == "string" ? parseFloat(this.props.afterTax).toFixed(2) : this.props.afterTax.toFixed(2);

        return (
            <div className="floats-left">
                <button className="submit-button" onClick={this.openModal}>
                    Submit
                </button>
                <Popup
                  open={this.state.open}
                  closeOnDocumentClick = {false}
                  onClose={this.closeModal}>

                    <div className="header"> {this.props.buttonType} </div>
                    <div className="content">
                    {/* Show the information of Amount going to be added to account*/}
                    <div className="moneyInformation">
                        <p className="info">Amount: {b}</p>
                        <p className="info">Processing Fee: {t}</p>
                        <p className="info">Total Amount: {a}</p>
                    </div>
                    </div>
                    <div className="action">
                        <div className="floats-right">
                        {/*Cancel the transaction*/}
                        <button
                          className="submit-button"
                          onClick={this.closeModal}>
                            Cancel
                        </button>
                        </div>
                        <div className="floats-right">
                    {/* Confirm the transaction */}
                        <ThankYouModal
                          onConfirmModalClose={this.closeModalSuccess}
                          onMainClose={this.props.onMainClose}
                          buttonType={this.props.buttonType}
                          message={this.props.message} />
                          </div>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default SubmitModal;
