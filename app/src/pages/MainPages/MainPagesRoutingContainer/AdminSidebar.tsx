import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import RepresentingOrganization from "./RepresentingOrganization";
import "./scss/sidebar.scss";
import logo from "./Logo.png";
import { OrganizationMembership, UserType, UserInfo, AdminPrivileges } from "affordable-shared-models";
import { AffordableAdminClient } from "affordable-client";

interface SidebarProps {
    client: AffordableAdminClient;
    userinfo: UserInfo;
}

class SidebarState {
    adminPrivileges: AdminPrivileges | null;
}

class Sidebar extends Component<SidebarProps, SidebarState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            adminPrivileges: null
        }
        this.props.client.getPrivileges({ userId: this.props.userinfo.id }).then((privs: AdminPrivileges) => {
            this.setState({ adminPrivileges: privs })
            console.log(`condition is : ${this.state.adminPrivileges != null && this.state.adminPrivileges.allowRejectAdminRegistration}`)
        })
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

                <div className="row mt-3">
                    <div className="col-2" />
                    <div className="col">
                        <Nav className="flex-column">

                            <LinkContainer to="/dashboard">
                                <Nav.Link>Dashboard</Nav.Link>
                            </LinkContainer>
                            {
                                this.state.adminPrivileges != null && this.state.adminPrivileges.allowRejectAdminRegistration ?
                                    <LinkContainer to="/requests">
                                        <Nav.Link>Admin Registration Requests</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }

                            {
                                this.state.adminPrivileges != null && this.state.adminPrivileges.setPrivileges ?
                                    <LinkContainer to="/privileges">
                                        <Nav.Link>Admin Privileges</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }

                            {
                                this.state.adminPrivileges != null && this.state.adminPrivileges.deactivateUsers ?
                                    <LinkContainer to="/deactivateuser">
                                        <Nav.Link>Admin Deactivate User</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }
                            {
                                this.state.adminPrivileges != null && this.state.adminPrivileges.resetAuthInfoNonAdmin ?
                                    <LinkContainer to="/usersecurity">
                                        <Nav.Link>Admin User Security</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }

                            {
                                this.state.adminPrivileges != null && this.state.adminPrivileges.messageUserEmailUser ?
                                    <LinkContainer to="/email">
                                        <Nav.Link>Email User</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }

                            {
                                this.state.adminPrivileges != null && this.state.adminPrivileges.revokeAdminAccess ?
                                    <LinkContainer to="/revokeAccess">
                                        <Nav.Link>Revoke Admin Access</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }

{
                                this.state.adminPrivileges != null && this.state.adminPrivileges.readAuditTrail ?
                                    <LinkContainer to="/audittrails">
                                        <Nav.Link>View Audit Trails</Nav.Link>
                                    </LinkContainer>
                                    :
                                    <div />
                            }

                            <LinkContainer to="/settings">
                                <Nav.Link>Settings</Nav.Link>
                            </LinkContainer>

                            <a className="nav-link" href="mailto:support@affordhealth.org">SUPPORT</a>
                        </Nav>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
