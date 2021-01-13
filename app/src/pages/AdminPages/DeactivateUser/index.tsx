import React, { Component } from 'react';
import { AffordableAdminClient } from 'affordable-client';
import { AdminDeactivateUserRequest, AdminDeactivateUserResponse, UserInfo, Admin, Actions } from 'affordable-shared-models';
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
}

class Deactivate extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            filteredUsers: [],
            adminCanView: false,
            adminPrivsChecked: false
        };
    }

    componentDidMount() {
        this.checkAdminPrivileges();
        this.getUsers();
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "deactivateUsers").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    getUsers() {
        this.props.client.getAllUsers({ userId: this.props.adminId }).then(res => {
            console.log("Inside getAllUsers Method");
            this.setState({
                users: res,
                filteredUsers: res
            })
        })
        console.log("getUsers Method: " + this.state.users);
    }

    setStatus(userRequest: AdminDeactivateUserRequest, username: string) {
        this.props.client.activateDeactivateUser(userRequest).then(() => {
            let action : Actions
            userRequest.status ? action = Actions.ReactivateUser : action = Actions.DeactivateUser;
            let adminName = this.props.admin.username

            this.props.client.recordAuditTrails(adminName, `${adminName} ${action} ${username}`);
            console.log("set Status");
            this.getUsers();
        });
    }

    getDeactivateButton(userNumber: number, value: boolean, username: string | undefined) {
        let request: AdminDeactivateUserRequest = {
            userId: userNumber,
            adminId: this.props.adminId,
            status: false
        };

        if (typeof (value) !== undefined) {
            request.status = value as boolean;
        }

        if (!value) {
            return (
                <button
                    onClick={() => this.setStatus(request, username as string)}
                    type="button"
                    className="btn btn-danger"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Deactivate User">
                    Deactivate
                </button>
            );
        } else {
            return (
                <button
                    onClick={() => this.setStatus(request, username as string)}
                    type="button"
                    className="btn btn-primary"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Activate User">
                    Activate
                </button>
            );
        }
    }

    getUserRows(): JSX.Element[] {
        let userRows: JSX.Element[] = [];
        let usersCopy = this.state.filteredUsers.slice(0).sort((b, a) => {
            let returnValue = 0;
            a.id < b.id ? returnValue = 1 : returnValue = -1;
            return returnValue;
        });
        // console.log(this.state.users);
        for (let [index, value] of usersCopy.entries()) {
            userRows.push(
                <tr key={index}>
                    <td>{value.id}</td>
                    <td>{value.username}</td>
                    {/* <td>{value.firstName}</td>
                    <td>{value.lastName}</td> */}
                    <td>{value.primaryEmail}</td>
                    <td>{this.getDeactivateButton(value.id, value.isDeactivate as boolean, value.username as string)}</td>
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
        // return <span>asdasfa</span>
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
                                    {/* <td>First Name</td>
                                    <td>Last Name</td> */}
                                    <td>Email</td>
                                    <td>Activate/Deactivate</td>
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

export default Deactivate;