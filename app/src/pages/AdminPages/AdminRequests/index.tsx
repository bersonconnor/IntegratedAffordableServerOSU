import React, { Component } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import { AdminRegistrationRequest, AdminRegistrationResponse, AdminPrivileges, UserInfo, Actions } from 'affordable-shared-models';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

interface props {
    client: AffordableAdminClient,
    adminId: number,
    admin: UserInfo;
}

interface state {
    requests: AdminRegistrationResponse[],
    filteredRequests: AdminRegistrationResponse[],
    adminCanView: boolean;
    adminPrivsChecked: boolean;
}

class Requests extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            filteredRequests: [],
            adminCanView: false,
            adminPrivsChecked: false,
        };
        this.denyAdminRequest = this.denyAdminRequest.bind(this);
        this.acceptAdminRequest = this.acceptAdminRequest.bind(this);
        this.getRequestRows = this.getRequestRows.bind(this);
    }

    componentDidMount() {
        //Check User is Authorized to View Page
        this.checkAdminPrivileges();
        console.log("test")
        this.props.client.getAdminRegistrationRequests().then((res) => {
            console.log("requests: ", res);
            this.setState({
                requests: res,
                filteredRequests: res
            });
        });
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "allowRejectAdminRegistration").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    denyAdminRequest(userId: number, username: string) {
        let request: AdminRegistrationRequest = {
            userId: userId,
            adminId: this.props.adminId
        };
        this.props.client.rejectAdminRegistration(request).then(res => {
            console.log("deny")
            this.componentDidMount()
            this.props.client.recordAuditTrails(this.props.admin.username, `${Actions.DenyAdminRequest} for: ${username}`).then(res => console.log("accept res: ", res));
        });
    }

    acceptAdminRequest(userId: number, username: string): void {
        let request: AdminRegistrationRequest = {
            userId: userId,
            adminId: this.props.adminId
        };
        this.props.client.acceptAdminRegistration(request).then(res => {
            this.componentDidMount()
            this.props.client.recordAuditTrails(this.props.admin.username, `${Actions.ApproveAdminRequest} for: ${username}`).then(res => console.log("accept res: ", res));
        });
    }

    getRequestRows(): JSX.Element[] {
        let requestRows: JSX.Element[] = [];
        let requests = this.state.filteredRequests;
        for (let [index, value] of requests.entries()) {
            requestRows.push(
                <tr key={index}>
                    <td>{value.userId}</td>
                    <td>{value.username}</td>
                    <td>{value.email}</td> 
                    <td className="buttonData">
                        <button type="button" className="btn btn-secondary" onClick={(e) => this.acceptAdminRequest(value.userId, value.username)}>Accept</button>
                        <button type="button" className="btn btn-dark" onClick={(e) => this.denyAdminRequest(value.userId, value.username)}>Reject</button>
                    </td>
                </tr>
            )
        }
        return requestRows
    }

    filterRequests(e: React.ChangeEvent<HTMLInputElement>): void {
        console.log(e.target.value);
        let searchResults = this.state.requests.filter(admin => admin.username.includes(e.target.value) || admin.email.includes(e.target.value));
        this.setState({
            filteredRequests: searchResults
        });
    }

    render() {
        if (this.state.adminPrivsChecked) {
            if (this.state.adminCanView) {
                return (
                    <div className="adminPageContainer">
                        <input name="search" placeholder="search" onChange={(e) => this.filterRequests(e)}/>
                        <table className="adminTable">
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Accept/Reject</th>
                            </tr>
                            {this.getRequestRows()}
                        </table>
                    </div>
                )
            } else {
                return (
                    <Redirect to="NotFound"/>
                )
            }
        } else {
            return <div>Loading...</div>
        }
    }
}

export default Requests;