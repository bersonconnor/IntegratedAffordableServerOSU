
import React, { Component } from "react";
import swal from "sweetalert";
import TextInput from "../../../components/TextInput/index";
import "./scss/login.scss";
import { AffordableClient, AffordableHttpError } from "affordable-client";

interface ResetPasswordProps {
  client: AffordableClient;
  resetUserPassword: (x: string) => void;
  history: any;
}

interface ResetPasswordState {
  validatePassword: boolean;
  newPassword: string;
  name1: React.ReactNode;
}

class ResetPassword extends Component<ResetPasswordProps, ResetPasswordState> {
  constructor(props) {
    super(props);
    this.state = {
      validatePassword: false,
      newPassword: "",
      name1: ""
    };
  }

  //Validate credentials from backend
  handleValidateNewPassword = ev => {
    ev.preventDefault();

    const data = new FormData();
    const newPass = (document.getElementById("newPassword")! as HTMLInputElement)
      .value;
    const confirmPass = (document.getElementById("confirmPassword")! as HTMLInputElement)
      .value;
    data.append("newPassword", newPass);
    data.append("confirmPassword", confirmPass);

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let code = params.get('code') as string;

    if (newPass == confirmPass) {
      this.setState(
        { name1: <span className="App-pass">Password Match</span> }
      )
      this.props.client.resetPassword(newPass, code)
      .then(() => {
        window.location.assign("/reset_password_success")
      })
      .catch((error: AffordableHttpError) => {
        swal("Error: could not reset your password");
        console.log("Error", error.message, "error");
      });
    } else {
      this.setState(
        { name1: <span className="App-fail">Password Mismatch</span>}
      )
    }
  };

  // MAIN
  render() {
    return (
      <div className="reset-password__container">
        <form
          className="App-forgot-password reset-password__container"
          onSubmit={this.handleValidateNewPassword}
          // TODO: fix bug and make it so that the form can be submitted by pressing the enter key
        >
          <TextInput
            password
            labelText="New Password"
            id="newPassword"
            containerClassName="reset-password__new-password-text-input"
          />
          <TextInput
            password
            labelText="Confirm Password"
            id="confirmPassword"
            containerClassName="reset-password__confirm-password-text-input"
          />
          <div>{this.state.name1}</div>
          <input
            type="submit"
            value="Reset"
            className="App-login-button reset-password__login-button"
          />
        </form>
      </div>
    );
  }
}

export default ResetPassword;
