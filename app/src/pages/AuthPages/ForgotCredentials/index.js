import React, { Component } from "react";
import sha256 from "fast-sha256";
import { AffordableClient, AffordableHttpError } from "affordable-client";
import swal from "sweetalert";

const randomstring = require("randomstring");

// There is currently code temporarily commented out in this file for the COVID-19 Release

class ForgotCredentials extends Component {
  constructor() {
    super();
    this.state = {
      found: false,
      showlinktologin: false,
      QRState: false,
      QRsuccess: false,
      QSState: false,
      QSnumber: -1,
      QScontent: null,
      QSanswer: null,
      QSsuccess: false,
      checkboxStateGoogleAuth: false,
      checkboxStateRawAuth: false,
      email: null
    };
  }
/*
  // function: Toogle the Google Auth Checkbox
  toggleFuncGoogleAuthCheckbox = () => {
    this.setState({
      checkboxStateGoogleAuth: !this.state.checkboxStateGoogleAuth
    });
  };

  // function: Toogle the Raw Code Checkbox
  toggleFuncRawCodeCheckbox = () => {
    this.setState({
      checkboxStateRawAuth: !this.state.checkboxStateRawAuth
    });
  };

  // function: Verify the answers to the security qs from backend
  handleSecurityQsAnswers = () => {
    const answer = sha256(
      document.getElementById("securityqs").value
    ).toString();
    if (answer === this.state.QSanswer) {
      this.setState({ QSsuccess: true });
      //if(this.state.QSsuccess){
      const data = new FormData();
      data.append("email", this.state.email);
      fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/email/recover", {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(() =>
          alert(
            "Recovery Information has been sent to the email address on file. Please Check Your email for resetting your password."
          )
        );
      // }
    } else {
      this.showAlertFail("");
    }
  };

  // function: Verify the Code with the one that is in the database from backend
  handleValidateCode = ev => {
    ev.preventDefault();
    const data = new FormData();

    //find username or email
    const x = document.getElementById("username");
    const y = document.getElementById("email");

    if (
      typeof y !== "undefined" &&
      y.value === "" &&
      !(typeof x !== "undefined" && x.value === "")
    ) {
      // for username and no email
      console.log("for username and no email");
      const name = x.value;
      const token = document.getElementById("token").value;
      data.append("token", token);
      data.append("username", name);

      if (this.state.checkboxStateGoogleAuth) {
        data.append("GoogleAuth", this.state.checkboxStateGoogleAuth);
      } else {
        data.append("GoogleAuth", this.state.checkboxStateGoogleAuth);
      }
      fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/two-factor/username", {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(response => {
          if (response.verified) {
            this.setState({ QRsuccess: true });
            const data = new FormData();
            data.append("email", response.email);
            data.append("username", response.username);
            data.append("randomString", randomstring.generate());
            data.append("timestamp", Date.now());

            fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/email/recover", {
              method: "POST",
              body: data
            })
              .then(response => response.json())
              .then(() =>
                alert(
                  "Recovery Information has been sent to the email address on file. Please Check Your email for resetting your password."
                )
              );
          }
        })
        .catch(error => this.showAlertFail(error));
    } else if (
      typeof x !== "undefined" &&
      x.value === "" &&
      !(typeof y !== "undefined" && y.value === "")
    ) {
      // for email and no username
      console.log("for email and no username");

      const name = y.value;
      const token = document.getElementById("token").value;
      data.append("token", token);
      data.append("email", name);
      if (this.state.checkboxStateGoogleAuth) {
        data.append("GoogleAuth", this.state.checkboxStateGoogleAuth);
      } else {
        data.append("GoogleAuth", this.state.checkboxStateGoogleAuth);
      }
      fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/two-factor/email", {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(response => {
          if (response.verified) {
            this.setState({ QRsuccess: true });
            const data = new FormData();
            data.append("email", response.email);
            data.append("username", response.username);
            data.append("randomString", randomstring.generate());
            data.append("timestamp", Date.now());
            fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/email/recover", {
              method: "POST",
              body: data
            })
              .then(response => response.json())
              .then(() =>
                alert(
                  "Recovery Information has been sent to the email address on file. Please Check Your email for resetting your password."
                )
              );
          }
        })
        .catch(error => this.showAlertFail(error));
    }
  };

  showAlertFail = () => {
    alert("Please Try Again");
  };
*/
  // main function which fetch from backend the retrieve status
  showAlertOnRetreiveStatus = () => {
    //const x = document.getElementById("username");
    const y = document.getElementById("email");

    /*
    if (
      typeof y !== "undefined" &&
      y.value === "" &&
      !(typeof x !== "undefined" && x.value === "")
    ) {
      // for username and no email
      if (window.confirm("Verify username: " + x.value + "?")) {
        const data = new FormData();
        data.append("username", x.value);
        fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/forgot-account/username", {
          method: "POST",
          body: data
        })
          .then(response => {
            if (response.ok) return response.json();
          })
          .then(resData => {
            this.showAlertSucc2(resData);
          });
      }
    } else */if (/*
      typeof x !== "undefined" &&
      x.value === "" &&*/
      !(typeof y !== "undefined" && y.value === "")
    ) {
      // for email and no username

      const affordableClient = new AffordableClient();
      affordableClient.forgotUserNameOrPassword(y.value);

      swal(
        "Email Sent",
        "An email should arrive in your inbox shortly",
        "success"
      );

      /*
      if (window.confirm("Verify email: " + y.value + "?")) {
        const data = new FormData();
        data.append("email", y.value);
        fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/forgot-account/email", {
          method: "POST",
          body: data
        })
          .then(response => {
            if (response.ok) return response.json();
          })
          .then(resData => {
            this.showAlertSucc2(resData);
          });
      }
      */
    }/* else if (
      !(typeof x !== "undefined" && x.value === "") &&
      !(typeof y !== "undefined" && y.value === "")
    ) {
      // for username and email
      if (window.confirm("Verify email: " + y.value + "?")) {
        const data = new FormData();
        data.append("email", y.value);
        fetch(process.env.REACT_APP_AF_BACKEND_URL + "/authentication/forgot-account/email", {
          method: "POST",
          body: data
        })
          .then(response => {
            if (response.ok) return response.json();
          })
          .then(resData => {
            this.showAlertSucc2(resData);
          });
      }
    }*/ else {
      // for no username and no email
      swal(
        "Enter your email",
        "Enter a valid email to continue",
        "error"
      );
    }
  };

  //show success/failure message on retrieve status
  showAlertSucc2(message) {
    if (
      message.success === "Username Found" ||
      message.success === "Email Found"
    ) {
      alert(message.success);
      this.setState({ email: message.email });
      this.setState({ found: true });
      if (message.twofactor === "true") {
        this.setState({ QRState: true });
      } else if (message.twofactor === "false") {
        this.setState({
          QSState: true,
          QSnumber: Math.floor(Math.random() * Math.floor(100)) % 3
        });
        if (this.state.QSnumber === 0) {
          this.setState({
            QScontent: message.Question1,
            QSanswer: message.Answer1
          });
        } else if (this.state.QSnumber === 1) {
          this.setState({
            QScontent: message.Question2,
            QSanswer: message.Answer2
          });
        } else if (this.state.QSnumber === 2) {
          this.setState({
            QScontent: message.Question3,
            QSanswer: message.Answer3
          });
        }
      }
    } else {
      alert(message.success);
    }
  }

  //MAIN
  render() {
    {/*
    const content3 = (
      <div className="row">
        <div className="col">
          <div className="row mt-5">
            <div className="col text-center">
              <p>
                Enter the QR passcode and select the proper Authentication
                option!
              </p>
            </div>
          </div>

          <div className="row mt-1">
            <div className="col text-center">
              <input type="text" id="token" className="App-login-input" />
            </div>
          </div>

          <div className="row justify-content-center mt-1">
            <div className="col-1 text-right">
              <input
                type="checkbox"
                id="GoogleAuthenticatorPass"
                onClick={this.toggleFuncGoogleAuthCheckbox}
              />
            </div>
            <div className="col-3">
              <p>Google Authenticator Password</p>
            </div>
          </div>

          <div className="row justify-content-center mt-1">
            <div className="col-1 text-right">
              <input
                type="checkbox"
                id="RawPass"
                onClick={this.toggleFuncRawCodeCheckbox}
              />
            </div>
            <div className="col-3">
              <p>Raw Secret Key</p>
            </div>
          </div>

          <div className="row mt-1">
            <div className="col text-center">
              <button
                onClick={this.handleValidateCode}
                id="authenticate"
                className="App-login-button2"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
    */}

    {/*
    let content4 = null;
    if (this.state.QSState) {
      content4 = (
        <div className="row">
          <div className="col">
            <div className="row mt-5">
              <div className="col text-center">
                <p>{this.state.QScontent}</p>
              </div>
            </div>

            <div className="row mt-1">
              <div className="col text-center">
                <input
                  type="text"
                  id="securityqs"
                  className="App-login-input"
                />
              </div>
            </div>

            <div className="row mt-1">
              <div className="col text-center">
                <button
                  onClick={this.handleSecurityQsAnswers}
                  id="ValidateAnswer"
                  className="App-login-button2"
                >
                  Validate Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  */}

    return (
      <div className="row">
        <div className="col">
          <div className="row mt-5">
            <div className="col text-center">
              <h2>Forgot Username or Password</h2>
            </div>
          </div>
          
          <div className="row">
            <div className="col text-center">
              <form className="App-login">
               {/* <input
                  type="text"
                  id="username"
                  className="App-login-input"
                  placeholder="Username"
                />
                <p>or</p> */}
                <input
                  type="email"
                  id="email"
                  className="App-login-input"
                  placeholder="Email"
                />
              </form>
            </div>
          </div>

          <div className="row">
            <div className="col text-center">
              <button
                onClick={this.showAlertOnRetreiveStatus}
                className="App-login-button"
              >
                Retrieve
              </button>
            </div>
          </div>

          {/*content4*/}
          {/*content3*/}
        </div>
      </div>
    );
  }
}

export default ForgotCredentials;
