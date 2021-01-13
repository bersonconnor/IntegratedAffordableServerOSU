import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import ApplyPages from "../ApplyPages/ApplyPagesRoutingContainer";
import Dashboard from "../Dashboard";
import MainHeader from "./MainHeader";
import OrganizationPages from "../OrganizationPages/OrganizationPagesRoutingContainer";
import HUGPages from "../HUGPages/HUGPagesRoutingContainer";
import HugSearch from "../HUGPages/HUGPagesRoutingContainer/HugSearch";
import Manage from "../HUGPages/HUGPagesRoutingContainer/manage";
import NotFound from "../../ErrorPages/NotFound";
import ProfileForm from "../ProfileForm/ProfileForm";
import Settings from "../Settings";
import Filemanager from "../Filemanager";
import ZapierInfo from "../ZapierInfo";
import AddOrganization from "../OrganizationPages/AddOrganization/index";
import { UserInfoProps } from "../../../App";
import { OrganizationMembership, UserType } from "affordable-shared-models";
import Sidebar from "./Sidebar";
import Transactions from "../Transactions";
import Application from "../Application";
import AdminPage from "../AdminPage";
import Requests from "../../AdminPages/AdminRequests";
import AdminPrivileges from "../../AdminPages/Privileges";
import Email from "../../AdminPages/Email";
import DeactivateUser from "../../AdminPages/DeactivateUser"
import UserSecurity from "../../AdminPages/SecurityPage";
import AdminSidebar from "./AdminSidebar";
import { AffordableAdminClient } from "affordable-client";
import AdminPortal from "../AdminPortal";
import RevokeAdminComponent from "../../AdminPages/RevokeAdmin";
import AuditTrail from "../../AdminPages/AuditTrail";
import AuditTrails from "../../AdminPages/AuditTrail";

export const UserIDContext = React.createContext(-1);

export const RepresentingOrgIDContext = React.createContext(-1);

export const UserEmailContext = React.createContext<string | undefined>("");

class MainPagesRoutingContainerProps {
  childProps: UserInfoProps;
}

class MainPagesRoutingContainerState {
  currentOrganization: OrganizationMembership;
}

class MainPagesRoutingContainer extends Component<
  MainPagesRoutingContainerProps,
  MainPagesRoutingContainerState
  > {
  constructor(props) {
    super(props);

    this.state = new MainPagesRoutingContainerState();
    this.setCurrentRepresentedOrganization = this.setCurrentRepresentedOrganization.bind(
      this
    );
  }

  componentDidMount(): void {
    window.scrollTo(0, 0);
  }

  //for handling verified orgs
  setCurrentRepresentedOrganization(
    organization: OrganizationMembership
  ): void {
    this.setState({ currentOrganization: organization });
  }

  getSidebar() {
    console.log(this.props.childProps.getUserInfo)
    console.log(`userType is ${this.props.childProps.getUserInfo.userType}`)
    if (this.props.childProps.getUserInfo.userType === UserType.ADMIN) {
      return (
        <AdminSidebar
          client={new AffordableAdminClient()}
          userinfo={this.props.childProps.getUserInfo}
        />
      )
    } else {
      return (
        <Sidebar
          client={this.props.childProps.client}
          userType={this.props.childProps.getUserInfo.userType}
          userName={this.props.childProps.getUserInfo.username}
          user={this.props.childProps.getUserInfo.username}
          userId={this.props.childProps.getUserInfo.id}
          organizationMembership={this.state.currentOrganization}
          updateOrganizationFn={this.setCurrentRepresentedOrganization}
        />
      )
    }
  }


  render(): React.ReactNode {
    return (
      <UserIDContext.Provider value={this.props.childProps.getUserInfo.id}>
        <UserEmailContext.Provider
          value={this.props.childProps.getUserInfo.primaryEmail}
        >
          <RepresentingOrgIDContext.Provider
            value={this.state.currentOrganization?.organization?.id ?? -1}
          >
            <div className="App container-fluid">
              <div className="App row">

                {this.getSidebar()}

                <div className="col-9">
                  <MainHeader
                    client={this.props.childProps.client}
                    user={this.props.childProps.getUserInfo.username}
                    usertype={this.props.childProps.getUserInfo.userType}
                    userHasAuthenticated={
                      this.props.childProps.userHasAuthenticated
                    }
                  />

                  <div className="row">
                    <Switch>
                      <Route path="/dashboard" component={() => (
                        <Dashboard
                          client={this.props.childProps.client}
                          userId={this.props.childProps.getUserInfo.id}
                          userName={this.props.childProps.getUserInfo.username}
                          userType={this.props.childProps.getUserInfo.userType}
                          firstName={this.props.childProps.getUserInfo.firstName}
                          lastName={this.props.childProps.getUserInfo.lastName}
                        />
                      )} />
                      <Route path="/application" component={() => (
                        <Application
                          client={this.props.childProps.client}
                          userId={this.props.childProps.getUserInfo.id}
                          userName={this.props.childProps.getUserInfo.username}
                          userType={this.props.childProps.getUserInfo.userType}
                          firstName={this.props.childProps.getUserInfo.firstName}
                          lastName={this.props.childProps.getUserInfo.lastName}
                          email={
                            this.props.childProps.getUserInfo.primaryEmail
                          }
                        />
                      )} />

                      <Route path="/apply" component={ApplyPages} />
                      <Route
                        path="/affiliation"
                        component={OrganizationPages}
                      />
                      <Route path="/hug" component={HUGPages} />
                      <Route path="/search" component={HugSearch} />
                      <Route path="/manage" component={Manage} />
                      <Route
                        path="/integrate"
                        component={() => (
                          <ZapierInfo
                            client={this.props.childProps.client}
                            orgId={
                              this.state.currentOrganization?.organization?.id
                            }
                          />
                        )}
                      />
                      <Route
                        path="/profile"
                        component={() => (
                          <ProfileForm
                            client={this.props.childProps.client}
                            userId={this.props.childProps.getUserInfo.id}
                          />
                        )}
                      />
                      <Route path="/transactions" component={() => (
                        <Transactions
                          client={this.props.childProps.client}
                          userId={this.props.childProps.getUserInfo.id}
                          user={this.props.childProps.getUserInfo.username}
                          userType={this.props.childProps.getUserInfo.userType} />
                      )} />
                      <Route
                        path="/requests"
                        component={() => (
                          <Requests
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/privileges"
                        component={() => (
                          <AdminPrivileges
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/deactivateuser"
                        component={() => (
                          <DeactivateUser
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/usersecurity"
                        component={() => (
                          <UserSecurity
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/email"
                        component={() => (
                          <Email
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/revokeAccess"
                        component={() => (
                          <RevokeAdminComponent
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/audittrails"
                        component={() => (
                          <AuditTrails
                            client={this.props.childProps.adminClient}
                            adminId={this.props.childProps.getUserInfo.id}
                            admin={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/settings"
                        component={() => (
                          <Settings
                            client={this.props.childProps.client}
                            user={this.props.childProps.getUserInfo.username}
                            email={this.props.childProps.getUserInfo.primaryEmail}
                            twoFactor={this.props.childProps.getUserInfo.twoFactor}
                          />
                        )}
                      />
			// Route for file manager
			<Route
				path="/filemanager"
				component={() => (
				<Filemanager
					client={this.props.childProps.client}
					userId={this.props.childProps.getUserInfo.id}
					user={this.props.childProps.getUserInfo.username}
					userType={this.props.childProps.getUserInfo.userType}
				/>
				)}
			/>
                      <Route
                        path="/addOrg"
                        component={() => (
                          <AddOrganization
                            client={this.props.childProps.client}
                            userInfo={this.props.childProps.getUserInfo}
                          />
                        )}
                      />
                      <Route
                        path="/admin"
                        component={() => (
                          <AdminPage
                            client={this.props.childProps.adminClient}
                          />
                        )}
                      />
                      <Route component={NotFound} />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </RepresentingOrgIDContext.Provider>
        </UserEmailContext.Provider>
      </UserIDContext.Provider>
    );
  }
}

export default MainPagesRoutingContainer;
