import React, { Component } from 'react';
import { AffordableAdminClient } from 'affordable-client';
import { AdminDeactivateUserRequest, AdminDeactivateUserResponse, UserInfo, Actions } from 'affordable-shared-models';
import Popup from "reactjs-popup";
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

interface props {
    client: AffordableAdminClient;
    adminId: number;
    admin: UserInfo;
}

interface state {
    users: UserInfo[];
    filteredUsers: UserInfo[];
    adminCanView: boolean;
    adminPrivsChecked: boolean;
    open: boolean;
}

class UserSecurity extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            filteredUsers: [],
            adminCanView: false,
            adminPrivsChecked: false,
            open: false
        };

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.checkAdminPrivileges();
        this.getUsers();
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "resetAuthInfoNonAdmin").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    getUsers() {
        this.props.client.getAllUsers({ userId: this.props.adminId }).then(res => {
            this.setState({
                users: res,
                filteredUsers: res
            })
        })
    }

    closeModal() {
        this.setState({ open: false });
    }
    
    setStatus(username: string, email: string) {       
        this.props.client.removeTwoFactor(username, email).then(() => {
            this.props.client.recordAuditTrails(this.props.admin.username, `${this.props.admin.username} ${Actions.ResetTwoFactor} of ${username}`);
            this.getUsers();
        });
    }

    getResetTwoFactorButton(username: string, email: string | undefined, isTwoFactor: boolean) {        
        if (email === undefined) {
            return <text>User with Undefined Email</text>;
        }
        if (isTwoFactor) {
            return (                
                <button
                    onClick={() => this.setStatus(username, email)}
                    type="button"
                    className="btn btn-primary"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Reset Two Factor">
                    Reset
                </button>
            );
        } else {
            return (
                <text>Doesn't have MFA</text>
            );
        }        
    }

    setStatusAfterResetPassword(email: string, username: string) {
        this.props.client.forgotUserNameOrPassword(email).then(() => {
            this.props.client.recordAuditTrails(this.props.admin.username, `${this.props.admin.username} ${Actions.ResetPassword} of ${username}`);
            this.setState({
                open: true
            })
        });
    }
    
    getResetPasswordButton(email: string, username: string) {
        if (email === undefined) {
            return (
                <text>User with Undefined Email</text>
            );
        }
        
        return (
            <div>
                <button
                    onClick={() => this.setStatusAfterResetPassword(email, username)}>
                    Reset Password
                </button>   
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick={true}
                    onClose={this.closeModal}
                >
                    <span> Password Reset Email Sent! </span>
                    </Popup>  
            </div>    
        );       
    }

    getUserRows(): JSX.Element[] {
        let userRows: JSX.Element[] = [];
        let usersCopy = this.state.filteredUsers.slice(0).sort((b, a) => {
            let returnValue = 0;
            a.id < b.id ? returnValue = 1 : returnValue = -1;
            return returnValue;
        });

        for (let [index, value] of usersCopy.entries()) {
            userRows.push(
                <tr key={index}>
                    <td>{value.id}</td>
                    <td>{value.username}</td>
                    <td>{this.getResetTwoFactorButton(value.username, value.primaryEmail, value.twoFactor)}</td>
                    <td>{this.getResetPasswordButton(value.primaryEmail as string, value.username as string)}</td>
                </tr>
            )
        }

        return userRows;
    }

    filterUsers(e: React.ChangeEvent<HTMLInputElement>): void {
        let searchResults = this.state.users.filter(user => user.username.includes(e.target.value) || user.primaryEmail?.includes(e.target.value));
        this.setState({
            filteredUsers: searchResults
        });
    }

    render() {
        if (this.state.adminPrivsChecked) {
            if (this.state.adminCanView) {
                return (
                    <div className="adminPageContainer">
                        <input name="search" placeholder="search" onChange={(e) => this.filterUsers(e)}/>
                        <table className="adminTable">
                            <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td>Username</td>
                                    <td>Reset MFA</td>
                                    <td>Reset Password</td>
                                </tr>
                                {this.getUserRows()}
                            </tbody>
                        </table>
                    </div>
                )
            } else {
                return (
                    <Redirect to="/NotFound" />
                )
            }
        } else {
            return <span>Loading...</span>
        }
    }
}

export default UserSecurity;