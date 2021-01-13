import React, {Component} from "react";
import {BrowserRouter} from "react-router-dom";
import AuthPagesRoutingContainer from "./pages/AuthPages/AuthPagesRoutingContainer";
import MainPagesRoutingContainer from "./pages/MainPages/MainPagesRoutingContainer";
import "./app.scss";
import {UserInfo} from "affordable-shared-models";
import { AffordableClient, AffordableAdminClient } from "affordable-client";

const IS_AUTHENTICATED_SESSION_STORAGE_KEY = "isAuthenticated";
const USER_INFO_SESSION_STORAGE_KEY = "userInfo";

class AppState {
  isAuthenticated = false;
  userInfo = new UserInfo();
}

export interface UserInfoProps {
  // These are being used in AuthPagesRoutingContainer, so we will refrain from altering them now
  userHasAuthenticated: (authenticated: boolean) => void;
  setUsername: (username: string) => void;
  // User information can be stored in an object, which will be retrieved from the server at once
  getUserInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  client: AffordableClient;
  adminClient: AffordableAdminClient;
}

class App extends Component<{}, AppState> {
  private client: AffordableClient;
  private adminClient: AffordableAdminClient;

  constructor(props) {
    super(props);
    this.client = new AffordableClient();
    this.adminClient = new AffordableAdminClient();
    this.state = new AppState();
  }

  componentDidMount(): void {
    if (sessionStorage.getItem(IS_AUTHENTICATED_SESSION_STORAGE_KEY)) {
      this.setState({ isAuthenticated: true });
    }

    if (sessionStorage.getItem(USER_INFO_SESSION_STORAGE_KEY)) {
      const userInfo = JSON.parse(
        sessionStorage.getItem(USER_INFO_SESSION_STORAGE_KEY) ?? "{}"
      ) as UserInfo;
      this.setState({ userInfo: userInfo });
    }
  }

  userHasAuthenticated = (authenticated: boolean) => {
    if (authenticated) {
      sessionStorage.setItem("isAuthenticated", authenticated.toString());
    } else {
      sessionStorage.removeItem("isAuthenticated");
    }
    this.setState({ isAuthenticated: authenticated });
  };

  setUsername = (username: string): void => {
    const userInfo = this.state.userInfo;
    userInfo.username = username;
    this.setUserInfo(userInfo);
  };

  setUserInfo = (userInfo: UserInfo): void => {
    console.log("Set user info called");
    console.log(userInfo);
    this.setState({ userInfo: userInfo });
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  render(): React.ReactNode {
    const childProps: UserInfoProps = {
      userHasAuthenticated: this.userHasAuthenticated,
      setUsername: this.setUsername,
      getUserInfo: this.state.userInfo,
      setUserInfo: this.setUserInfo,
      client: this.client,
      adminClient: this.adminClient
    };

    return (
      <BrowserRouter>
        {this.state.isAuthenticated ? (
          <MainPagesRoutingContainer childProps={childProps} />
        ) : (
          <AuthPagesRoutingContainer childProps={childProps} />
        )}
      </BrowserRouter>
    );
  }
}

export default App;
