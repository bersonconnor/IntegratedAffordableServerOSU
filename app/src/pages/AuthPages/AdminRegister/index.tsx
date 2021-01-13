import { AffordableClient } from "affordable-client";
import {
  CreateUserRequest,
  UserType,
  LoginResponse
} from "affordable-shared-models";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import swal from "sweetalert";
import "../../../styles/buttons.css";
import speakeasy from "speakeasy";
import { AddTwoFactorComponent } from "../../../components/TwoFactor/TwoFactor";

const QRCode = require("qrcode");
const randomstring = require("randomstring");

interface Props {
    history: any;
    client: AffordableClient;
    setUserInfo: (UserInfo) => void;
    userHasAuthenticated: (boolean) => void;
}

interface State {
secret: speakeasy.GeneratedSecret;
  tempvar: number;
  checkboxState: boolean;
  ipKey: string;
  ipAddr: string;
  city: string;
  state: string;
  username: string;
  password: string;
  registerLater: boolean;
  QRState: boolean;
  passwordInput: string;
  imageURL: string;
  name: React.ReactNode;
  name1: React.ReactNode;
  name2: React.ReactNode;
  usertype: string;
  validateUsername: boolean;
  validateEmail: boolean;
  validatePassword: boolean;
}

class AdminRegister extends React.Component<Props, State> {
  
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || (window as any).REACT_APP_AF_BACKEND_URL;

  constructor(props: Props) {
    super(props);

    this.state = {
        tempvar: 1,
      checkboxState: false,
      ipKey: "4a51eca5db4bb71dc9fa9cf08dd6294a",
      ipAddr: "",
      city: "",
      state: "",
      username: "",
      password: "",
      secret: speakeasy.generateSecret({ length: 20, issuer: 'Affordable Admin' }),
      registerLater: false,
      QRState: false,
      passwordInput: "",
      imageURL: "",
      name: "",
      name1: "",
      name2: "",
      usertype: "",
      validateUsername: false,
      validateEmail: false,
      validatePassword: false
    }
    
    this.handleUploadRegistrationForm = this.handleUploadRegistrationForm.bind(this);
    this.handleTwoFactorCodeValidation = this.handleTwoFactorCodeValidation.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.twoFactorCheckboxToggle = this.twoFactorCheckboxToggle.bind(this);
    this.regiesterLaterButton = this.regiesterLaterButton.bind(this);
    this.handleValidateLoginCredentials = this.handleValidateLoginCredentials.bind(
        this
    );
    
        this.handleStoreTwoFactorDatabase = this.handleStoreTwoFactorDatabase.bind(this);
      }
    
      // function: Checks whether the username typed by the user already in database
      handleUpdateUsername = e => {
        if (e.target.value.length > 4) {
          const data = new FormData();
          data.append(
            "username",
            (document.getElementById("username")! as HTMLInputElement).value
          );
    
          fetch(this.REACT_APP_AF_BACKEND_URL + "/authentication/username", {
            method: "POST",
            body: data
          })
            .then(response => {
              if (response.ok) return response.json();
            })
            .then(resData => {
              if (resData.usernameIsUnique) {
                let name = `${(document.getElementById("username")! as HTMLInputElement).value} @ Affordable Admin`
                this.setState({
                  name: (
                    <span className="App-pass">This username is available</span>
                  ),
                  validateUsername: true,
                  username: resData,
                  secret: speakeasy.generateSecret({ length: 20, issuer: 'Affordable Admin', name: name })
                });
              } else {
                this.setState({
                  name: (
                    <span className="App-fail">
                      This username is already in database
                    </span>
                  ),
                  validateUsername: false
                });
              }
            });
        } else {
          this.setState({ name: "" });
        }
      };
    
      // function: Checks Password matches with Confirm Password
      handleConfirmPassword = e => {
        const pass = (document.getElementById("password")! as HTMLInputElement)
          .value;
        const confPass = (document.getElementById("confPass")! as HTMLInputElement)
          .value;
        if (e.target.value.length > 4 && pass === confPass) {
          this.setState({
            name1: <span className="App-pass">Password Match</span>,
            validatePassword: true,
            password: pass
          });
        } else {
          this.setState({
            name1: <span className="App-fail">Password Mismatch</span>,
            validatePassword: false
          });
        }
      };
    
      /*Handle Event Functions*/
      handleChange = key => {
        return event => {
          this.setState({ [key]: event.target.value } as Pick<
            State,
            keyof State
          >);
        };
      };
    
      // function: Check Password Format
      handleCheckPasswordFormat = e => {
        if (e.target.value.length >= 4) {
          this.updatePWord(e.target.value);
          this.setState({ name1: "" });
        }
      };
      updatePWord(s) {
        this.setState({ passwordInput: s });
      }
      // function: Checks the email typed by user already in database
      validateEmail() {
        const email = (document.getElementById("email")! as HTMLInputElement).value;
        if (email.length > 5 && email.includes(".")) {
          const data = new FormData();
          data.append("email", email);
          fetch(this.REACT_APP_AF_BACKEND_URL + "/authentication/email", {
            method: "POST",
            body: data
          })
            .then(response => {
              if (response.ok) return response.json();
            })
            .then(resData => {
              if (resData.emailIsUnique) {
                this.setState({ name2: "", validateEmail: true });
              } else {
                this.setState({
                  name2: (
                    <span className="App-fail">
                      This email is already in database
                    </span>
                  ),
                  validateEmail: false
                });
              }
            });
        }
      }
    
      // function: toggle the checkbox for opting for two factor
      twoFactorCheckboxToggle() {
        this.setState({
          checkboxState: !this.state.checkboxState,
          tempvar: (this.state.tempvar + 1) % 10
        });
    
        let image;
        QRCode.toDataURL(this.state.secret.otpauth_url, (err, imageData) => {
          this.setState({
            imageURL: imageData
          });
          image = imageData;
        });
    
        //below is how the previous capstones accomplished two factor with qr codes, I thought the above method was simpler
        /* const data = new FormData();
         var x = this.state.tempvar; //Math.floor((Math.random() * 1000) + 1);
         data.append('imageid', x);
         data.append('secret', this.state.secret);
    
         fetch(process.env.REACT_APP_AF_BACKEND_URL + '/authentication/qr', {
           method: 'POST',
           body: data
         }).then((response) => {
           if(response.ok) {
             this.setState({
               imageURL: process.env.REACT_APP_AF_BACKEND_URL + '/public/filename' + x + '.png'
             });
           }
         });*/
      }
    
      // function: Validate the two factor code typed by user and with the code associated with the generated QR code in backend
      //Convert to TS
      handleTwoFactorCodeValidation(ev) {
        ev.preventDefault();
    
        const data = new FormData();
    
        const token = (document.getElementById("token")! as HTMLInputElement).value;
        data.append("token", token);
        // var x = this.state.tempvar; //Math.floor((Math.random() * 1000) + 1);
        data.append("imageid", this.state.imageURL);
        data.append("secret", this.state.secret.base32);
        console.log("secret:", this.state.secret);
    
        this.props.client
          .twoFactor(token, this.state.imageURL, this.state.secret.base32)
          .then(response => {
            if (response.verified) {
              this.showAlertSucc();
            }else {
              this.showAlertFail();
            }
          });
    
        // fetch("http://localhost:4000/authentication/two-factor", {
        //   method: "POST",
        //   body: data
        // })
        //   .then(response => response.json())
        //   .then(response => {
        //     if (response.verified) {
        //       this.showAlertSucc();
        //     } else {
        //       this.showAlertFail();
        //     }
        //   });
      }
      showAlertSucc() {
        swal(
          "Success!",
          "your device now has 2 factor authentication!we also recommend securing your device with a password to prevent fraud",
          "success"
        );
      }
      showAlertFail() {
        swal("Error", "Please Try Again", "error");
      }
    
      //Transfer Form Credentials to Backend server
      handleUploadRegistrationForm(ev) {
        ev.preventDefault(this.state.secret);
    
        if (
          this.state.validateUsername &&
          this.state.validatePassword &&
          this.state.validateEmail
        ) {
          const name = (document.getElementById("username")! as HTMLInputElement)
            .value;
          const pass = (document.getElementById("password")! as HTMLInputElement)
            .value;
          const email = (document.getElementById("email")! as HTMLInputElement)
            .value;
          const data = new CreateUserRequest();
          data.username = name;
          data.password = pass;
          data.email = email;
          data.TwoFactor = this.state.checkboxState;
          data.TwoFactorCode = this.state.secret.base32;
          data.usertype = UserType.ADMIN;
    
          this.props.client
            .registerUser(data)
            .then(response => {
              swal(
                "Thank you for registering with Affordable!",
                "Welcome",
                "success"
              );
    
              this.props.setUserInfo(response.userInfo);
    
              if (this.state.checkboxState) {
                this.handleStoreTwoFactorDatabase();
              }
    
              this.handleValidateLoginCredentials(ev, response.userInfo.username);
            })
            .catch(error => {
              console.log(error);
              swal(
                "Registration failure",
                "There was a problem creating your account",
                "error"
              );
            });
        } else {
          if (!this.state.validateUsername) {
            swal(
              "Username error",
              "Please verify your username and try again",
              "warning"
            );
          } else if (!this.state.validatePassword) {
            swal(
              "Password error",
              "Please confirm your password in the appropriate box",
              "warning"
            );
          } else if (!this.state.validateEmail) {
            swal("Email error", "Please validate your email", "warning");
          } else {
            swal(
              "General error",
              "Please verify all your inputs are filled out correctly",
              "warning"
            );
          }
        }
      }
    
    
      //Convert to TS
      handleStoreTwoFactorDatabase() {
        const deviceName = (document.getElementById("add-device-input")! as HTMLInputElement).value;
        const userName = (document.getElementById("username") as HTMLInputElement).value
        const email = (document.getElementById("email") as HTMLInputElement).value
        const randomString = randomstring.generate();
        const timeStamp = Date.now().toString();
        const secret = this.state.secret.base32;
    
        this.props.client
          .addTwoFactor(
              deviceName,
              userName,
              email,
              randomString,
              timeStamp,
              secret
          ).then(response => {
            if (response.success) {
              console.log("Secret Inserted")
            }
          });
      }
    
      regiesterLaterButton = () => {
        this.setState({ registerLater: true });
      };
    
      //Validate credentials from backend
      handleValidateLoginCredentials(ev, username) {
        ev.preventDefault();
        const data = new FormData();
        data.append("username", username);
        data.append("password", this.state.password);
    
        // TODO - Add routing back to login?
      }
      //MAIN
      render() {
        // DECLARATION
        let content: React.ReactNode;
        let validateUsernameContent = <span className="validity"></span>;
    
        if (!this.state.validateUsername) {
          validateUsernameContent = <span className="invalid"></span>;
        }
        // based on checkbox select to opt for Two factor the content below is toggled
        if (this.state.checkboxState) {
          content = (
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col text-center">
                    <h4>
                      Option provides additional security to your information on
                      login
                    </h4>
                  </div>
                </div>
                <AddTwoFactorComponent handleTwoFactorCodeValidation={this.handleTwoFactorCodeValidation} imageURL={this.state.imageURL}/>
    
                <br />
    
                <div className="row">
                  <div className="col">
                    <h4 className="text-center">
                      We also recommend securing your device with a password to
                      prevent fraud
                    </h4>
                  </div>
                </div>
    
                <br />
              </div>
            </div>
          );
        }
        return (


          <div className="row">
            <div className="col">

            
              {/* TEXT */}
              <div className="row mt-3">
                <div className="col text-center">
                  <h2>Open an admin account</h2>
                </div>
              </div>


              {/* Open Account */}
    
              {/* USERNAME */}
              <div className="row justify-content-center mt-3">
                <div className="col text-center">
                  <input
                    type="text"
                    id="username"
                    className="App-login-in"
                    placeholder="Username"
                    minLength={4}
                    maxLength={20}
                    onChange={this.handleUpdateUsername}
                    required={true}
                  />{" "}
                  {validateUsernameContent}
                  <div>{this.state.name}</div>
                </div>
              </div>
    
              {/* PASSWORD */}
              <div className="row mt-3">
                <div className="col text-center">
                  <input
                    type="password"
                    id="password"
                    className="App-login-input"
                    placeholder="Password"
                    onChange={this.handleCheckPasswordFormat}
                    required={true}
                    pattern=".*[0-9|\W_]+.*"
                  />
                  <span className="validity"></span>
                  <div>(Must contain at least 1 number or special character.)</div>
                </div>
              </div>
    
              {/* CONFIRM PASSWORD */}
              <div className="row mt-3">
                <div className="col text-center">
                  <input
                    type="password"
                    id="confPass"
                    className="App-login-input"
                    placeholder="Confirm Password"
                    minLength={4}
                    maxLength={20}
                    onChange={this.handleConfirmPassword}
                    required={true}
                  />
                  <span className="validity"></span>
                  <div>{this.state.name1}</div>
                </div>
              </div>
    
              {/* EMAIL */}
              <div className="row mt-3">
                <div className="col text-center">
                  <input
                    type="email"
                    id="email"
                    className="App-login-input"
                    placeholder="Email"
                    //                 required="required"
                    // onChange={this.handleIsEmailInDatabase}
    
                    required={true}
                    onChange={this.validateEmail}
                  />
    
                  <div>{this.state.name2}</div>
                </div>
              </div>
    
              <div className="row justify-content-center my-3">
                <div className="col-1 text-right">
                  <input type="checkbox" onClick={this.twoFactorCheckboxToggle} />
                </div>
                <div>
                  Request 2-Factor Authentication (Requires a Mobile Device)
                </div>
              </div>
    
              {content}
    
              {/* END TWO BUTTONS: REGISTER NOW/ REGISTER LATER */}
              <div className="row mt-3">
                <div className="col">
                  <form
                    className="App-login text-center"
                    onSubmit={this.handleUploadRegistrationForm}
                  >
                    <input
                      type="submit"
                      className="App-login-button3"
                      value="Apply Now"
                    />
                  </form>
                </div>
              </div>
            <div className="row mt-3">
                <div className="col text-center">
                    <span>Want to Register for a Recipient Account Instead?</span>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col text-center">
                    <a href="/register">
                        <input className="App-user-registration-button" type="submit" value="Recipent Account Registration Page"/>
                    </a>
                </div>
            </div>
            </div>
          </div>
        );
      }
    }
export default AdminRegister;
    