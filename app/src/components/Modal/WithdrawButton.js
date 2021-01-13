import React, { Component } from "react";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import SubmitModal from "./SubmitModal";
import swal from "sweetalert";
import { AffordableClient } from "affordable-client";

import "./scss/modal.scss";
import "../../styles/buttons.css";/*INSERT */


/* Need to consider when user is recipient or donor on issue of taxes
* Will need:
* "debit" attribute - an array of saved debit card
* "user" attribute - which can be "donor" represent as a 0 or "recipient" represent as a 1
*/
class WithdrawButton extends Component {

    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

    constructor(props){
        super(props);
        this.client = new AffordableClient();
        this.state = {

            userBalance: 100,
            open: false,

            paymentType: "--",
            paymentMethod: "--",
            paymentMethodList: [],

            beforeTax: 0.0,
            tax: 0,
            afterTax: 0,
            stripeTax: 0,
            affordableTax: 0,

            showAmountError: false,
            showPaymentMethodError: false,
            showPaymentTypeError: false,
            paymentMethodDisabled: true,

            fieldColor: "#FFFFFF",

            buttonStyle: props.buttonStyle,
            buttonText: props.buttonText
        };

        this.handleChangePaymentType = this.handleChangePaymentType.bind(this);
        this.handleChangePaymentMethod = this.handleChangePaymentMethod.bind(this);
        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleAmountErrorMessage = this.handleAmountErrorMessage.bind(this);
        this.handlePaymentMethodErrorMessage = this.handlePaymentMethodErrorMessage.bind(this);
        this.handlePaymentTypeErrorMessage = this.handlePaymentTypeErrorMessage.bind(this);
        this.handleHideErrorMessage = this.handleHideErrorMessage.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalSuccess = this.closeModalSuccess.bind(this)
    }


    async openModal(){
        console.log("Withdraw Modal Open");
        /**
         * ********************************
         * Stripe Connect Onboarding Checks
         */
        const username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        const usertype = null;

        const data = new FormData();
        data.append("username", username);

        // gets the usertype
        await fetch(this.REACT_APP_AF_BACKEND_URL +"/profile/get-user-type", {
            method: "POST",
            body: data
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

        data.append("usertype", usertype);

        var accountID = null;
        var connectedAccountID = null;
        var requirementsDue = false;

        var json = await this.client.getStripeAccountID(username, usertype);
        console.log(json);
        if(json.success === "No Account Found") {
            alert("Error: No Withdraw Account Found!");
        } else {
            accountID = json.id;
            console.log("Account Found: " + accountID);
        }

        // first attempts to get the Stripe Connected Account ID of the current user
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/getCustomAccountID", {
        //         method: "POST",
        //         body: data
        //     });
        //     if(!response.ok) {
        //         console.error(response.statusText);
        //         throw Error(response.statusText);
        //     }

        //     const json = await response.json();

        //     // if no Connect Account was found, then send an alert
        //     // Though, this is not possible since both recipients and donors are given one
        //     if(json.success === "No Account Found") {
        //         alert("Error: No Withdraw Account Found!");
        //     } else {
        //         accountID = json.id;
        //         console.log("Account Found: " + accountID);

        //         data.append("accountID", accountID);
        //     }

        // } catch(error) {
        //     console.error(error);
        // }

        // checks if account needs to be verified
        var json = await this.client.getConnectedRequirements(username, usertype, accountID);
        if(json.success === "STRIPE ERROR") {
            console.error(json.message);
        } else {
            if(json.status === "None") {
                requirementsDue = false;
            } 
            else {
                const requirements = json.requirements;
                if(requirements[0] === "external_account") {
                    alert("Please Add a Bank Account in Settings/Banking Information");
                    return;
                }
                requirementsDue = true;
            }
            connectedAccountID = json.id;
            console.log("Account Found: " + connectedAccountID);
        }

        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/checkConnectRequirements", {
        //         method: "POST",
        //         body: data
        //     });
        //     if(!response.ok) {
        //         console.error(response.statusText);
        //         throw Error(response.statusText);
        //     }

        //     const json = await response.json();

        //     if(json.success === "STRIPE ERROR") {
        //         console.error(json.message);
        //     } else {
        //         if(json.status === "None") {
        //             requirementsDue = false;
        //         } 
        //         else {
        //             const requirements = json.requirements;
        //             if(requirements[0] === "external_account") {
        //                 alert("Please Add a Bank Account in Settings/Banking Information");
        //                 return;
        //             }
        //             requirementsDue = true;
        //         }
        //         console.log("Account Found: " + accountID);
        //         accountID = json.id;
        //     }

        // } catch(error) {
        //     console.error(error);
        // }
        /**
         * Stripe Connect Onboarding Checks End
         * *************************************
         */


         // if user's Connected account is verified, proceed as normal
         if(requirementsDue === false) {

            this.setState({
                open: true,
                paymentType: "--",
                paymentMethod: "--",
                beforeTax: 0.0,
                showAmountError: false,
                showPaymentMethodError: false,
                showPaymentTypeError: false,
                paymentMethodDisabled: true,
                fieldColor: "#FFFFFF"
            });

            var json = await this.client.getStripeAccountBalance(username, usertype, accountID);
            const balance =json.accountAmount;

            this.setState({
                userBalance: balance
            });
            console.log("Got the user balance");
            // try {
            //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/getAccountBalance", {
            //         method: "POST",
            //         body: data
            //     });
            //     if (!response.ok) {
            //         console.log("empty");
            //         throw Error(response.statusText);

            //     }

            //     const json = await response.json();
            //     const balance =json.accountAmount;

            //     this.setState({
            //         userBalance: balance
            //     })
            //     console.log("Got the user balance")

            // } catch (error) {
            // console.log(error);
            // }
        }

        // if there are requirements due
        else {
            var url = window.location.href;
            // data.append("successURL",window.location.href);
            // data.append("failureURL", window.location.href);

            //alert("To enable withdraws, we need more information. Redirecting to form...");
            swal({title: "To enable withdraws, we need more information. Proceed to information form?", 
                buttons: {
                    cancel: "Cancel",
                    proceed: {
                        text: "Proceed",
                        value: "proceed",
                    },
                },
              })
              .then(async (value) =>{
                // console.log(value + "hellllllooooo");

                switch(value){

                    case "proceed":
                        // console.log("Proceed1111111");
                        var json = await this.client.onboardingInfoReq(username, usertype, accountID, url);
                        if(json.success === "STRIPE ERROR") {
                            alert("Can't reach Stripe")
                            console.error(json.message);
                        } else {
                            console.log(json.message)
                            window.location.replace(json.message.url);
                        }

                        // try {
                        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/onboardingInfoRequest", {
                        //         method: "POST",
                        //         body: data
                        //     });
                        //     if(!response.ok) {
                        //         throw Error(response.statusText);
                        //     }

                        //     const json = await response.json();

                        //     if(json.success === "STRIPE ERROR") {
                        //         alert("Can't reach Stripe")
                        //         console.error(json.message);
                        //     } else {
                        //         console.log(json.message)
                        //         window.location.replace(json.message.url);
                        //     }

                        // } catch(error) {
                        //     console.error(error);
                        // }
                        break;

                    default:
                        // console.log("Default3333333333");

                        break;
                }
              });
        }

    }

    closeModalSuccess(){
        this.setState({
            open: false
        });
        console.log("Withdraw Modal Close");
    }

    closeModal(){
        this.setState({open: false});
        console.log("Withdraw Modal Cancel");
    }

   async handleChangePaymentType(e){
        this.setState({
            paymentType: e.target.value,
            paymentMethodList: []

        });

        var username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var json = await this.client.getPaymentMethod(username, false, true);
        const cardList=json.bankList;
        var  method=[];
        for(var i=0; i<cardList.length;i++){
            method.push(cardList[i].bankName);
        }

        this.setState({
            paymentMethodList: method,
            paymentMethodDisabled: false
        })
        console.log(method)

        // const data = new FormData();
        // data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        // data.append("paymentType",e.target.value);

        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/transaction/connectedBanks", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     const cardList=json.bankList;
        //     var  method=[];
        //     for(var i=0; i<cardList.length;i++){
        //         method.push(cardList[i].bankName);
        //     }

        //     this.setState({
        //         paymentMethodList: method,
        //         paymentMethodDisabled: false
        //     })
        //     console.log(method)

        // } catch (error) {
        // console.log(error);
        // }
    }

    handleChangePaymentMethod(e){
        this.setState({
            paymentMethod: e.target.value
        });
    }

    handleChangeAmount(e){
        console.log(JSON.parse(sessionStorage.getItem('userInfo')).username);

        let amountStr = typeof e.target.value === "number" ? e.target.value.toString() : e.target.value;
        if(amountStr.match("^[0-9]+([.][0-9]{0,2})?$") != null &&
        parseFloat(amountStr) !== 0 && parseFloat(amountStr) <= this.state.userBalance){
            console.log("Valid Input: " + e.target.value)
            this.setState({
                fieldColor: '#66f375',
                beforeTax: parseFloat(amountStr),
                tax: parseFloat(amountStr) * (this.state.stripeTax + this.state.affordableTax),
                afterTax: parseFloat(amountStr) - parseFloat(amountStr) * (this.state.stripeTax + this.state.affordableTax)
            });


        }
        else{
            console.log("Invalid Input: " + e.target.value)

            this.setState({
                fieldColor: '#f36684',
                beforeTax: amountStr
            });
        }

        this.setState({
            beforeTax: e.target.value,
            tax: e.target.value * (this.state.stripeTax + this.state.affordableTax),
            afterTax: e.target.value - (e.target.value * (this.state.stripeTax + this.state.affordableTax))
        });
    }

    handleAmountErrorMessage(e){
        this.setState({ showAmountError: e })
    }

    handlePaymentMethodErrorMessage(e){
        this.setState({ showPaymentMethodError: e })
    }

    handlePaymentTypeErrorMessage(e){
        this.setState({ showPaymentTypeError: e })
    }

    handleHideErrorMessage(){
        this.setState({
            showAmountError: false,
            showPaymentMethodError: false,
            showPaymentTypeError: false
        })
    }


    render(){
        var methodShow = this.state.paymentMethodList;
        methodShow = methodShow.map((item, index) => {
            return (
            <option value={item}>{item}</option>
            );
        });

        return (
            <div style={this.state.buttonStyle}>
                {this.state.buttonStyle === undefined ?
                    <Button className="submit-button" onClick={this.openModal}>
                    {this.state.buttonText === undefined ?
                        "Withdraw"
                    :
                        this.state.buttonText
                    }
                    </Button>
                :
                    <Button onClick={this.openModal} style={this.state.buttonStyle} block size="lg">
                        {this.state.buttonText === undefined ?
                            "Withdraw"
                        :
                            this.state.buttonText
                        }
                    </Button>
                }
                <Popup
                  open={this.state.open}
                  closeOnDocumentClick = {false}
                  onClose={this.closeModal}>

                    <a className="close" onClick={this.closeModal}>
                        &times;
                    </a>
                    <div className="header"> Withdraw </div>
                    <div className="content">
                        <label className="label">Payment Type:&nbsp;
                            <select
                              className="paymentType"
                              id="paymentType"
                              onChange={this.handleChangePaymentType}
                              value={this.state.paymentType}>
                                <option value="--">--</option>
                                <option value="BankAccount">Bank Account</option>
                                {/* <option value="Debit">Debit Card</option> */}
                            </select>
                            {this.state.showPaymentTypeError ? <p>Please select a payment type</p> : <div></div>}
                        </label><br />

                        <label className="label">Payment Method: &nbsp;
                            <select
                              className="paymentMethod"
                              id="paymentMethod"
                              disabled={this.state.paymentMethodDisabled}
                              value={this.state.paymentMethod}
                              onChange={this.handleChangePaymentMethod}>
                            <option value="--">--</option>
                                {methodShow}
                            </select>
                            {this.state.showPaymentMethodError ? <p>Please select a payment method.</p> : <div></div>}
                        </label><br />

                        <label className="label">Amount:&nbsp;
                            <input
                              type="text"
                              id="amountNumber"
                              value={this.state.beforeTax}
                              style={{backgroundColor:this.state.fieldColor}}
                              onChange={this.handleChangeAmount} />

                              {this.state.showAmountError ? <p>Please enter a valid amount.</p> : <div></div>}

                        </label><br />



                    </div>
                    <div className="actions">
                        <div className="floats-right">
                        {/*Cancel the transaction */}
                        <button
                          className="submit-button"
                          onClick={this.closeModal}>
                            Cancel
                        </button>
                        </div>

                        { /* Submit the transaction*/ }
                        {/*NEED TO CHECK WHAT OTHER PEOPLE ARE USING TO DETERMINE USER */ }
                        <SubmitModal
                          usertype={this.props.usertype}
                          onMainClose={this.closeModalSuccess}
                          buttonType="Withdraw"
                          beforeTax={this.state.beforeTax}
                          tax={this.state.tax}
                          afterTax={this.state.afterTax}
                          message="Your transaction is being processed. Thank you for using our service!!"
                          shouldOpen= {"#66f375" == this.state.fieldColor}
                          paymentType={this.state.paymentType}
                          paymentMethod={this.state.paymentMethod}
                          amountError={this.handleAmountErrorMessage}
                          paymentMethodError={this.handlePaymentMethodErrorMessage}
                          paymentTypeError={this.handlePaymentTypeErrorMessage}
                          handleHideErrorMessage = {this.handleHideErrorMessage}
                          />
                    </div>
                </Popup>
            </div>
        );
    }
}

export default WithdrawButton;
