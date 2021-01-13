import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import EmailVerify from "../EmailVerify";
import ResetPasswordVerify from "../ResetPasswordVerify"
import EmailVerifyFailure from "../EmailVerifyFailure";
import ForgotCredentials from "../ForgotCredentials";
import Landing from "../Landing";
import Login from "../Login";
import Register from "../Register";
import ResetPassword from "../ResetPassword";
import NotFound from "../../ErrorPages/NotFound";
import ChangePrimaryEmailVerify from "../ChangePrimaryEmailVerify";
import AddSecondaryEmailVerify from "../AddSecondaryEmailVerify";
import AdminRegister from "../AdminRegister";
import { UserInfoProps } from "../../../App";

const AppliedRoute = ({ component: C, props: cProps, ...rest }) => {
  return <Route {...rest} render={props => <C {...props} {...cProps} />} />;
};

class AuthProps {
  childProps: UserInfoProps;
}

class AuthPagesRoutingContainer extends Component<AuthProps, {}> {
  constructor(props) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <div className="App container-fluid">
        <AuthHeader />
        <Switch>
          <Route exact path="/" component={Landing} />
          <AppliedRoute
            path="/login"
            component={Login}
            props={this.props.childProps}
            client={this.props.childProps.client}
          />
          <Route path="/forgot_credentials" component={ForgotCredentials} />
          <AppliedRoute
            path="/register"
            component={Register}
            props={this.props.childProps}
            client={this.props.childProps.client}
            userHasAuthenticated={this.props.childProps.userHasAuthenticated}
            setUserInfo={this.props.childProps.setUserInfo}
          />
          <AppliedRoute
            path="/admin-register"
            component={AdminRegister}
            props={this.props.childProps}
            client={this.props.childProps.client}
            userHasAuthenticated={this.props.childProps.userHasAuthenticated}
            setUserInfo={this.props.childProps.setUserInfo}
          />
          <Route
            path="/add_secondary_email_verify"
            component={AddSecondaryEmailVerify}
          />
          <Route
            path="/change_primary_email_verify"
            component={ChangePrimaryEmailVerify}
          />
          <Route path="/email_verify_success" component={EmailVerify} />
          <Route path="/reset_password_success" component={ResetPasswordVerify} />
          <Route path="/email_verify_failure" component={EmailVerifyFailure} />
          <AppliedRoute path="/reset_password" component={ResetPassword} props={this.props.childProps} client={this.props.childProps.client} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default AuthPagesRoutingContainer;
