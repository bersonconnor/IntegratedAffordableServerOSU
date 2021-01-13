import React, { Component } from "react";
import Popup from "reactjs-popup";

import "./scss/modal.scss";
import "../../styles/buttons.css";

class ThankYouModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ open: true });

        console.log(this.props.buttonType + " Confirm Modal Open");
    }

    closeModal() {
        this.setState({ open: false });
        console.log(this.props.buttonType + " Confirm Modal Close");

        this.props.onConfirmModalClose();
        this.props.onMainClose();

    }

    render() {
        return (
            <div>
                <button className="submit-button" onClick={this.openModal}>
                    Confirm
                </button>
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick= {false}
                    onClose={this.closeModal}>
                    <div className="header">
                        <p>{this.props.message}</p>
                    </div>
                    <div className="action">

                        {/* Close the transaction modal*/}
                        <div className="floats-right">
                            <button
                                className="submit-button"
                                onClick={this.closeModal}>
                                Close
                       </button>
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default ThankYouModal;