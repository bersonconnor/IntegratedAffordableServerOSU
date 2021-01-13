import React, { Component } from "react";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import SubmitModal from "./SubmitModal";

import "./scss/modal.scss";
import "../../styles/buttons.css";
import { config } from "dotenv";
import { AffordableClient } from "affordable-client";
config();

// const dotenv_1 = require("dotenv");
// dotenv_1.config();


class DepositButton extends Component {
    constructor(props){
        super(props);

        this.client = new AffordableClient();
        this.state = {
            open: false,
            
            paymentType: "--",
            selectedPaymentMethod: "--",
            paymentMethodList: [],
            
            beforeTax: 0,
            tax: 0,
            afterTax: 0,
            stripeTax: 0,
            affordableTax: 0,
        
            showAmountError: false,
            showPaymentMethodError: false,
            showPaymentTypeError: false,
            paymentMethodDisabled: true,

            fieldColor: '#FFFFFF',

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

    openModal(){
        this.setState({
            open: true,
            paymentType: "--",
            paymentMethod: "",
            beforeTax: 0,
            fieldColor: "#FFFFFF",
            showAmountError: false,
            showPaymentMethodError: false,
            showPaymentTypeError: false,
            paymentMethodDisabled: true
        });

        console.log("Deposit Modal Open");

    }

    async closeModalSuccess(){
        this.setState({ 
            open: false 
        });
        console.log("Deposit Modal Close");
    }
    
    async closeModal(){
        this.setState({
            open: false 
        });
        console.log("Deposit Modal Cancel");

        // if(this.state.afterTax > 0){
        //     const data = new FormData();
            
        //     data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        //     data.append("paymentType",this.state.paymentType);
        //     data.append("paymentMethod",this.state.selectedPaymentMethod);
        //     data.append("amount",this.state.afterTax);
        //     console.log("amount is "+this.state.afterTax)
        //     try {
        //         const response = await fetch("http://localhost:4000/stripe/deposit", {
        //             method: "POST",
        //             body: data
        //         });
        //         if (!response.ok) {
        //             throw Error(response.statusText);
        //         }
        //         const json = await response.json();
        //         const cardList=json.cardList;
        //         var  method=[];
        //         for(var i=0; i<cardList.length;i++){
        //             method.push(cardList[i].cardName);
        //         }
            
    
        //          this.setState({
                    
        //             paymentMethodList: method,
        //             paymentMethodDisabled: false
        //         })
        //         console.log(method)
               
        //     } catch (error) {
        //       console.log(error);
        //     }
        // }
    }

   async handleChangePaymentType(e){
        this.setState({
            paymentType: e.target.value,
            paymentMethodList: []

        });
        const data = new FormData();
        data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
        data.append("paymentType",e.target.value);
        var username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        var json = await this.client.stripeGetSavedPaymentMethod(username,e.target.value);
        const cardList=json.cardList;
        var  method=[];
        for(var i=0; i<cardList.length;i++){
            method.push(cardList[i].cardName);
        }
    

         this.setState({
            
            paymentMethodList: method,
            paymentMethodDisabled: false
        })
        console.log(method)


        // console.log(process.env.REACT_APP_AF_BACKEND_URL);
        // try {
        //     const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL + "/stripe/getSavedPaymentMethod", {
        //         method: "POST",
        //         body: data
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }
        //     const json = await response.json();
        //     const cardList=json.cardList;
        //     var  method=[];
        //     for(var i=0; i<cardList.length;i++){
        //         method.push(cardList[i].cardName);
        //     }
        

        //      this.setState({
                
        //         paymentMethodList: method,
        //         paymentMethodDisabled: false
        //     })
        //     console.log(method)
           
        // } catch (error) {
        //   console.log(error);
        // }

    }
    
    handleChangePaymentMethod(e){
        console.log(e.target.value);
        this.setState({
            selectedPaymentMethod: e.target.value ,
            paymentMethod:e.target.value 
        });
    }

    handleChangeAmount(e){
        let amountStr = typeof e.target.value === "number" ? e.target.value.toString() : e.target.value;
    
        
        
        if(amountStr.match("^[0-9]+([.][0-9]{0,2})?$") != null &&
        parseFloat(amountStr) > 1 && parseFloat(amountStr) <= 2000){
             
            var taxRate;
            var chargeFee=0;
            if((this.state.paymentType=="BankAccount")){
                taxRate=0.008;
            }else{
                taxRate=0.029;
                chargeFee=0.5;
            }

            var managementRate= 0.025;
            var serviceFee= (parseFloat(amountStr) * taxRate)+(parseFloat(amountStr) * managementRate)+chargeFee;


            this.setState({ 
                stripeTax: parseFloat(amountStr) * taxRate +chargeFee,
                affordableTax: parseFloat(amountStr) *managementRate,
                tax: serviceFee,
                fieldColor: '#66f375',
                beforeTax: parseFloat(amountStr),
                afterTax: parseFloat(amountStr) - serviceFee
            });


          
        }
        else{
            console.log("Invalid Input" + e.target.value)

            this.setState({ 
                fieldColor: '#f36684',
                beforeTax: amountStr
            });
        }

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
        var paymentMethodList = this.state.paymentMethodList;
        paymentMethodList = ["--"].concat(paymentMethodList)
        paymentMethodList = paymentMethodList.map((item, index) => {
            return (
            <option value={item}>{item}</option>
            );
        });

        return (
            <div style={this.state.buttonStyle}>
                {this.state.buttonStyle === undefined ?
                    <Button className="submit-button" onClick={this.openModal}>
                    {this.state.buttonText === undefined ?
                        "Deposit"
                    :
                        this.state.buttonText
                    } 
                    </Button>
                :
                    <Button onClick={this.openModal} style={this.state.buttonStyle} block size="lg">
                        {this.state.buttonText === undefined ?
                            "Deposit"
                        :
                            this.state.buttonText
                        } 
                    </Button>
                }
                
                <Popup
                  open={this.state.open}
                  closeOnDocumentClick
                  onClose={this.closeModal}>
                      
                    <a className="close" onClick={this.closeModal}>
                        &times;
                    </a>
                    <div className="header"> Deposit </div>
                    <div className="content">
                        <label className="label">Payment Type:&nbsp;
                            <select 
                              className="paymentType" 
                              id="paymentType" 
                              onChange={this.handleChangePaymentType}
                              value={this.state.paymentType}>
                                <option value="--">--</option>
                                <option value="BankAccount">Bank Account</option>
                                <option value="Credit">Credit Card</option>
                                <option value="Debit">Debit Card</option>
                            </select>
                            {this.state.showPaymentTypeError ? <p>Please select a payment type</p> : <div></div>}
                        </label><br />
                        
                        <label className="label">Payment Method: &nbsp;
                            <select 
                              className="paymentMethod" 
                              id="paymentMethod" 
                              value={this.state.selectedPaymentMethod} 
                              disabled={this.state.paymentMethodDisabled} 
                              onChange={this.handleChangePaymentMethod}> 
                                {paymentMethodList}
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
                              {this.state.showAmountError ? <div></div> : <p>Between $1 and $2000</p>}
                              {this.state.showAmountError ? <p>Please enter a valid amount between $1 to $2000.</p> : <div></div>}
                        
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
                          buttonType="Deposit"
                          beforeTax={this.state.beforeTax}
                          tax={this.state.tax}
                          afterTax={this.state.afterTax}
                          stripeTax={this.state.stripeTax}
                          affordableTax={this.state.affordableTax}
                          message="Your transaction is being processed. Thank you for using our service!!" 
                          shouldOpen= {"#66f375" == this.state.fieldColor}
                          paymentType={this.state.paymentType}
                          paymentMethod={this.state.selectedPaymentMethod}
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

export default DepositButton;
