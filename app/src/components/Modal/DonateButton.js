import React, { Component } from "react";
import Popup from "reactjs-popup";

import SubmitModal from "./SubmitModal";
import { AffordableClient } from "affordable-client";

import "./scss/modal.scss";
import "../../styles/buttons.css";

/* Need to consider when user is recipient or donor on issue of taxes
* Will need:
* "debit" attribute - an array of saved debit card
* "user" attribute - which can be "donor" represent as a 0 or "recipient" represent as a 1
*/
class DonateButton extends Component {

    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

    constructor(props){
        super(props);
        this.client = new AffordableClient();
        this.state = {
            userBalance: 0,
            open: false,

            paymentType: "bankAccount",

            paymentMethod: "--",

            beforeTax: 0.0,
            tax: 0.0,
            afterTax: 0.0,
            stripeTax: 0,
            affordableTax: 0,


            routingNumber: "",

            accountNumber: "",

            showAmountError: false,
            fieldColor: "#FFFFFF"
        };

        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleAmountErrorMessage = this.handleAmountErrorMessage.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalSuccess = this.closeModalSuccess.bind(this)

    }


    async openModal(){
        this.setState({
            open: true,
            beforeTax: 0.0,
            showAmountError: false,
            fieldColor: '#FFFFFF'
        });

        console.log("Donate Modal Open");
        console.log(this.props.HUGID);
        const data = new FormData();
        data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        
        const username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var usertype = null;
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
        if(usertype === 1){
            usertype = "donor";
            data.append("usertype","donor");
        } else {
            data.append("usertype", "recipient");
            usertype = "recipient";
        }

        console.log(JSON.parse(sessionStorage.getItem('userInfo')).username, usertype);
        var json = await this.client.getStripeAccountBalance(username, usertype, accountID);
        const balance =json.accountAmount;
        this.setState({
            userBalance: balance
        });

        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/stripe/getAccountBalance", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     const balance =json.accountAmount;

        //      this.setState({
        //         userBalance: balance
        //     })
        //     console.log("Got the user balance")

        // } catch (error) {
        //   console.log(error);
        // }

    }

    closeModalSuccess(){
        this.setState({open: false});
        console.log("Donate Modal Close");
    }

    closeModal(){
        this.setState({open: false});
        console.log("Donate Modal Cancel");
    }


    handleChangeAmount(e){
        console.log(this.state.userBalance);
        let amountStr = typeof e.target.value === "number" ? e.target.value.toString() : e.target.value;
        if(amountStr.match("^[0-9]+([.][0-9]{0,2})?$") != null &&
        parseFloat(amountStr) != 0 && parseFloat(amountStr) < this.state.userBalance){
            console.log("match " + e.target.value)
            this.setState({ fieldColor: '#66f375'});
        }
        else{
            console.log("don't match " + e.target.value)

            this.setState({ fieldColor: '#f36684'});
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


    render(){
        return (
            <div>
                <button className="submit-button" onClick={this.openModal}>
                    Donate
                </button>
                <Popup
                  open={this.state.open}
                  closeOnDocumentClick={false}
                  onClose={this.closeModal}>

                    <a className="close" onClick={this.closeModal}>
                        &times;
                    </a>
                    <div className="header"> Donation </div>
                    <div className="content">

                        <label className="label">Amount:
                            <input
                              type="text"
                              id="accountNumber"
                              value={this.state.beforeTax}
                              style={{backgroundColor:this.state.fieldColor}}
                              onChange={this.handleChangeAmount} />

                              {this.state.showAmountError ? <p>Please enter a valid amount.</p> : <div></div>}

                        </label><br /><br />

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
                        <div className="floats-right">
                        <SubmitModal
                          usertype={this.props.usertype}
                          onMainClose={this.closeModalSuccess}
                          buttonType="Donate"
                          beforeTax={this.state.beforeTax}
                          tax={this.state.tax}
                          afterTax={this.state.afterTax}
                          HUGName={this.props.HUGName}
                          message="Thank you for your donation!!"
                          paymentType="Transfer"
                          paymentMethod="Transfer"
                          shouldOpen= {"#66f375" == this.state.fieldColor}
                          amountError={this.handleAmountErrorMessage}
                          handleHideErrorMessage = {this.handleAmountErrorMessage}
                        />
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default DonateButton;
