import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import ApplicationOptions from "./ApplicationOptions";
import OrganizationOptions from "./OrganizationOptions";
import HUGOptions from "./HUGOptions";
import RepresentingOrganization from "./RepresentingOrganization";
import "./scss/sidebar.scss";
import logo from "./Logo.png";
import { OrganizationMembership, UserType } from "affordable-shared-models";
import { AffordableClient } from "affordable-client";
import DepositButton from "../../../components/Modal/DepositButton";
import WithdrawButton from "../../../components/Modal/WithdrawButton";


interface SidebarProps {
  client: AffordableClient;
  userId: number;
  user: string;
  userName: string;
  userType: UserType;
  organizationMembership: OrganizationMembership;
  updateOrganizationFn: (organization: OrganizationMembership) => void;
}

class SidebarState {
  pendingBalance: number = 0;
  availableBalance: number = 0;
  name: any;
  checkBalance: any;
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  constructor(props, context) {
    super(props, context);

    this.state = new SidebarState();
    this.handleChange = this.handleChange.bind(this);
    this.updateSelectedOrganization = this.updateSelectedOrganization.bind(
      this
    );
  }

  async componentDidMount() {
    var timer = setInterval(() => this.getBalance(), 30000);
    this.setState({
      checkBalance: timer
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.checkBalance);
  }


  //for handling verified orgs
  updateSelectedOrganization(organization: OrganizationMembership): void {
    this.props.updateOrganizationFn(organization);
  }

  // Use the submitted data to set the state
  handleChange(event): void {
    const { name, value } = event.target;
    // this.setState({
    //   [name]: value
    // });
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  formatBalance(pending, available) {
    var p = pending.toLocaleString(undefined, { minimumFractionDigits: 2 });
    var a = available.toLocaleString(undefined, { minimumFractionDigits: 2 });
    this.setState({
      pendingBalance: p,
      availableBalance: a
    });
  }

  getBalance = async () => {
    var balance = await this.props.client.getBalance(this.props.user, this.props.userType);
    if (balance.success === "Balance found") {
      this.formatBalance(balance.pendingBalance, balance.balance);
    }
  }


  render() {
    return (
      <div className="col-3 px-0 sidebar" onSubmit={this.handleSubmit}>
        <div className="row mt-3">
          <div className="col text-center">
            <img
              className="format-logo-sidebar"
              src={logo}
              alt="Affordable Logo"
            />
          </div>
        </div>
        {/*representing organization restrictions here*/}
        <div className="row mt-3">
          <div className="col-2" />
          <div className="col">
            {this.props.userType === UserType.RECIPIENT ? (
              <div />
            ) : (
                <RepresentingOrganization
                  client={this.props.client}
                  userId={this.props.userId}
                  representedOrganization={this.props.organizationMembership}
                  updateOrganizationFn={this.updateSelectedOrganization.bind(
                    this
                  )}
                />
              )}
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-2" />
          <div className="col">
            <Nav className="flex-column">
              {"admin".localeCompare(this.props.user) === 0 ?
                <LinkContainer to="/dashboard">
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
                : this.props.userType === UserType.RECIPIENT ?

                  <LinkContainer to="/application">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                  :
                  <LinkContainer to="/dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
              }
              {/*
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              */}
              <LinkContainer to="/transactions">
                <Nav.Link>Transactions</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/settings">
                <Nav.Link>Settings</Nav.Link>
              </LinkContainer>
		
		<LinkContainer to="/filemanager">
			<Nav.Link>File Manager</Nav.Link>
		</LinkContainer>

              {/* integration options shown for donor*/}
              {/* this.props.userType === UserType.DONOR ? (
                <LinkContainer to="/integrate">
                  <Nav.Link>Integrate</Nav.Link>
                </LinkContainer>
              ) : (
                <div />
              )} */}

              {/*application vs organization options for recipient vs donor*/}
              {/* {this.props.userType === UserType.RECIPIENT ? (
                <div>
                  <ApplicationOptions />
                </div>
              ) : (
                <div>
                  <OrganizationOptions userId={this.props.userId} />
                </div>
              )} */}
              {/*hug options present or hidden for donor vs recipient*/}
              {/* {this.props.userType === UserType.DONOR &&
              this.props.organizationMembership?.organization?.isVerified ? (
                <div>
                  <HUGOptions />
                </div>
              ) : (
                <div />
              )} */}
              <a className="nav-link" href="mailto:support@affordhealth.org">SUPPORT</a>
            </Nav>

            {/* User balance and button container */}
            {/* (Don't show if the user is the admin) */}
            {
              this.props.userName === "admin" ?
                <div />
                :
                <div className="col" >
                  <br />
                  {/* User balance */}
                        Balance
                        <br />
                  <div id="sidebar-balance">
                    <span text-align="left">${this.state.availableBalance}</span>
                  </div>

                  {/* A "Withdraw" button for recipient users or "Deposit" for donor users */}
                  {
                    this.props.userType === UserType.DONOR ?
                      <DepositButton />
                      :
                      <WithdrawButton />
                  }
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
