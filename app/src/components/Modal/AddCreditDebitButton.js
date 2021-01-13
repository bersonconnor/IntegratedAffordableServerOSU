import React, { Component } from "react";
import Popup from "reactjs-popup";

import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

import "./scss/modal.scss";
import "../../styles/buttons.css";
import CheckoutForm from "./CheckoutForm";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || window.REACT_APP_STRIPE_PUBLISHABLE_KEY);

class ThankYouModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <Popup
                    open={this.props.open}
                    closeOnDocumentClick={false}
                    >
                    <div className="header">
                        <p>{this.props.message}</p>
                    </div>
                    <div className="action">
                        {/* Close the transaction modal*/}
                        <button
                            className="submit-button"
                            onClick={this.props.onMainClose}>
                            Close
                       </button>
                    </div>
                </Popup>
            </div>
        );
    }
}


class AddCreditDebitButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            nameError: false,
            cardTypeError: false,
            hadSubmitted: false,
            open2: false,
            cardType: "--",
            cardName: ""


        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalSuccess = this.closeModalSuccess.bind(this);
        this.handleNameError = this.handleNameError.bind(this);
        this.handleCardTypeError = this.handleCardTypeError.bind(this);
        this.handlehadSubmitted = this.handlehadSubmitted.bind(this);
        this.handleChangeCardType = this.handleChangeCardType.bind(this);
        this.handleChangeCardName = this.handleChangeCardName.bind(this);

    }

    handlehadSubmitted(val){
        this.setState({open2: val});
        console.log("Open Thank you modal: " + val);

    }

    handleChangeCardType(val){
        this.setState({cardType: val});
    }

    handleChangeCardName(val){
        this.setState({cardName: val});
    }

    openModal(e) {
        this.setState({
            open: true
        });

        console.log("Add Card Modal Open");
    }

    closeModalSuccess() {
        this.setState({
            open: false,
            nameError: false,
            cardTypeError: false,
            hadSubmitted: false,
            open2: false,
            cardType: "--",
            cardName: ""
         });
        console.log("Add Card Modal Close");
    }

    closeModal() {
        this.setState({
            open: false,
            nameError: false,
            cardTypeError: false,
            hadSubmitted: false,
            open2: false,
            cardType: "--",
            cardName: ""
        });
        console.log("Add Card Modal Cancel");
    }

    handleNameError(val){
        this.setState({nameError: val});
    }

    handleCardTypeError(val){
        this.setState({cardTypeError: val});
    }

    render() {
        return (
            <div>
                <button className="submit-button" onClick={this.openModal}>
                    Add Card
                </button>
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closeModal}>

                    <a className="close" onClick={this.closeModal}>
                        &times;
                    </a>
                    <div className="header"> Add Credit/Debit Card </div>
                    <div className="content">

                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                            nameError={this.state.nameError}
                            handleNameError={this.handleNameError}
                            cardTypeError={this.state.cardTypeError}
                            handleCardTypeError={this.handleCardTypeError}
                            handlehadSubmitted={this.handlehadSubmitted}
                            cardType={this.state.cardType}
                            handleChangeCardType={this.handleChangeCardType}
                            cardName={this.state.cardName}
                            handleChangeCardName={this.handleChangeCardName} />
                        </Elements>


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
                        { /* Submit the transaction*/}
                        {/*NEED TO CHECK WHAT OTHER PEOPLE ARE USING TO DETERMINE USER */}
                        <div className="floats-right">
                            <ThankYouModal
                                open={this.state.open2}
                                usertype={this.props.usertype}
                                onMainClose={this.closeModalSuccess}
                                buttonType="Add Card"
                                message="Your card has been added." />
                           </div>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default AddCreditDebitButton;
