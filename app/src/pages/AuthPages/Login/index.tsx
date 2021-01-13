import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import swal from "sweetalert";
import TextInput from "../../../components/TextInput/index";
import "./scss/login.scss";
import { AffordableClient, AffordableHttpError } from "affordable-client";
import { UserInfo, LoginResponse, UserType, InvalidLoginResponse } from "affordable-shared-models";
import Button from "../../../components/Button";
import speakeasy from "speakeasy";
import { ValidateTwoFactorComponent } from "../../../components/TwoFactor/TwoFactor";

interface LoginProps {
  client: AffordableClient;
  setUserInfo: (x: UserInfo) => void;
  userHasAuthenticated: (x: boolean) => void;
  history: any;
}

interface LoginState {
  username: string;
  deactivate: boolean | null;
  email: string;
  userInfo?: UserInfo;
  QRState: string |  Blob;
  requiresTwoFactor: boolean;
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      deactivate: null,
      email: "",
      QRState: "",
      requiresTwoFactor: false
    };
    this.handleValidateTwoFactor = this.handleValidateTwoFactor.bind(this);
  }

   //function: validates two factor code from backend for users opting for two factor
   //Convert to TS
   handleValidateTwoFactor() {
    
    // const data = new FormData();
    const username = (document.getElementById("username")! as HTMLInputElement).value;
    const token = (document.getElementById("token")! as HTMLInputElement).value;
    this.setState({QRState : "true"});
    const GoogleAuthOpt = this.state.QRState;
  //   data.append("token", token);
  //   data.append("username", name);
  //   data.append("GoogleAuth", GoogleAuthOpt);
  //   fetch("http://localhost:4000/authentication/two-factor/username", {
  //     method: "POST",
  //     body: data
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       response.verified ? this.showAlertSucc2() : this.showAlertFail();
  //     });
  // };
  
  this.props.client
    .checkTwoFactorByAgainstUsername(username, token, "true")
    .then(res => {
      console.log(JSON.stringify(res))
      if (res.verified == true) {
        this.props.userHasAuthenticated(true);
      } else {
        this.showAlertFail();
      }
    });
  }

  showAlertSucc2() {
    swal(
      "Success!",
      "Two factor code validated, you've been logged in.",
      "success"
    );
    const name = (document.getElementById("username")! as HTMLInputElement).value;

    this.props.userHasAuthenticated(true);
    // this.props.setUserName(name);
    // this.setLastActivity(name);
    this.props.history.push("/application");
  }

  // upon failure
  showAlertFail() {
    alert("Please Try Again");
  }



  //Validate credentials from backend
  handleValidateLoginCredentials = ev => {
    ev.preventDefault();

    const data = new FormData();
    const name = (document.getElementById("username")! as HTMLInputElement)
      .value;
    const pass = (document.getElementById("password")! as HTMLInputElement)
      .value;
    data.append("username", name);
    data.append("password", pass);
    this.setState({ username: name });

    this.props.client
      .login(name, pass)
      .then(resData => {
        console.log("login resData: ", resData)
        //this.getEmail(name);

        if (typeof resData.userInfo !== 'undefined') { // Check if return type is LoginResponse
          this.props.setUserInfo(resData.userInfo);
          if (resData.userInfo.twoFactor) {
            console.log("requires two fact")
            this.setState({ requiresTwoFactor: true });
          } else {
            this.props.userHasAuthenticated(true);
            this.loginRouting(resData.userInfo);
          }
        } else if (typeof resData.isValidUsername !== 'undefined') { // Check if return type is InvalidLoginResponse
          console.log(resData)
          if (!resData.isValidUsername) {
            swal(
              "Unable to log you in",
              "Your username does not exist.",
              "error"
            );
          } else if (!resData.isValidPassword) {
            swal(
              "Unable to log you in",
              "Your password is not correct.",
              "error"
            );
          } else if (resData.isAdmin && !resData.isApprovedAdmin) {
            swal(
              "Unable to log you in",
              "Your Admin registration request has not been approved yet.",
              "error"
            );
          } else if (resData.isDisabled) {
              swal(
                "Unable to log you in",
                "Your account is disabled. Please contact an admin.",
                "error"
              );
          } else {
            swal(
              "Unable to log you in",
              "An internal error occured, please try again later.",
              "error"
            );
          }
        }
      }).catch((resp: AffordableHttpError) => {
        console.log("Error code returned")
        console.log(resp);
        swal(
          "Unable to log you in",
          "Internal server error.",
          "error"
        );
      })
  };

  getEmail = name => {
    const data = new FormData();
    data.append("username", name);
    console.log("checking for username ", name);
    this.props.client
      .getPrimaryEmail(name)
      .then(email => {
        this.setState({
          email: email
        });
      })
      .catch(e => console.log(e));
  };

  loginRouting(info: UserInfo) {
    if (info.userType === UserType.ADMIN) {
      // Route to Dashboard
      this.props.history.push("/dashboard");
    } else if (info.userType === UserType.RECIPIENT) {
        // Route to Application
        this.props.history.push("/application");
    } else if (info.userType === UserType.DONOR) {
      // Route to donor page
      // Nothing here right now.
    }
  }
  // MAIN
  render() {
    // DECLARATION
    let content: React.ReactNode;
    if (this.state.requiresTwoFactor) {
    content = (
      <ValidateTwoFactorComponent handleValidateTwoFactor={this.handleValidateTwoFactor} buttonText={"Authenticate"}/>
    )};
    return (
      <div className="login__container">
        <form
          className="App-login login__container"
          onSubmit={this.handleValidateLoginCredentials}
        >
          <TextInput
            labelText="Username"
            id="username"
            containerClassName="login__username-text-input"
          />
          <TextInput
            password
            labelText="Password"
            id="password"
            containerClassName="login__password-text-input"
          />
          <input
            type="submit"
            value="Login"
            className="App-login-button login__login-button"
          />
        </form>
        {content}
      </div>
    )
  }
}

export default Login;
