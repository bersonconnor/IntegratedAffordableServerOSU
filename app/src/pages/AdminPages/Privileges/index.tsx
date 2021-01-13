import React, { Component, ReactElement } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import { AdminPrivileges, UserInfo, Actions } from 'affordable-shared-models'
import { Dropdown } from 'react-bootstrap';
import NotFound from '../../ErrorPages/NotFound';
import { Redirect } from 'react-router-dom';

interface props {
    client: AffordableAdminClient;
    adminId: number;
    admin: UserInfo;
}
interface state {
    admins: Array<AdminPrivileges>;
    filteredAdmins: Array<AdminPrivileges>;
    adminCanView: boolean;
    adminPrivsChecked: boolean;
    searchStr: string;
}

class AdminPrivilegesComponent extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            filteredAdmins: [],
            adminCanView: false,
            adminPrivsChecked: false,
            searchStr: ""
        };
        this.getAdminRows = this.getAdminRows.bind(this);
    }

    componentDidMount() {
        //Check User is Authorized to View Page
        this.checkAdminPrivileges();
        
        this.props.client.getAllAdminPrivileges().then((res: Array<AdminPrivileges>) => {
            console.log("admins: ", res);
            res = res.filter(admin => admin.userid !== this.props.adminId && admin.username !== 'admin')
            this.setState({
                admins: res,
                filteredAdmins: res
            });
        });
        console.log("THIS ADMIN ID: ", this.props.adminId);
        console.log("state:", this.state);
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "setPrivileges").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    updatePrivilegesArray(privilegesId: number, username: string, fieldName: string, value: boolean) {
        let admin = this.state.admins.find(admin => admin.userid === privilegesId);
        if (admin) {
            admin[fieldName] = value;
            //this.updateAdminPrivilege(this.props.adminId, admin);
            this.updateAdminPrivilege(this.props.adminId, username, admin, fieldName);
        }
    }

    updateAdminPrivilege(adminId: number, username: string , privileges: AdminPrivileges, privilegeName: string) {
        this.props.client.setPrivileges(adminId, privileges).then((res: AdminPrivileges) => {
            let newAdminPrivs = res;
            let modifiedAdmin = this.state.admins.find(admin => admin.userid === res.userid);
            if (modifiedAdmin) {
                let modifiedAdminIndex = this.state.admins.indexOf(modifiedAdmin);
                let adminsCopy = this.state.admins.slice(0);
                adminsCopy.splice(modifiedAdminIndex, 1);
                this.setState({
                    admins: [...adminsCopy, newAdminPrivs]
                })
                this.filterAdmins(this.state.searchStr);
                console.log(this.state.admins);
            }
            //Send Audit Trail Update
            this.props.client.recordAuditTrails(this.props.admin.username, `${Actions.UpdatePrivilege} ${privilegeName} for: ${username}`);
        });
    }

    getPrivilegeButton(privilegesId: number, username: string, fieldName: string, value: string): JSX.Element {
        if (value === "true") {
            return (
                <button 
                onClick={(e) => this.updatePrivilegesArray(privilegesId, username, fieldName, false)} 
                type="button" 
                className="btn btn-danger adminButton"
                data-toggle="tooltip" 
                data-placement="bottom" 
                title={"Revoke: " + fieldName}>
                    Revoke
                </button>
            )
        } else {
            return (
                <button 
                onClick={(e) => this.updatePrivilegesArray(privilegesId, username, fieldName, true)} 
                type="button" 
                className="btn btn-primary adminButton"
                data-toggle="tooltip" 
                data-placement="bottom" 
                title={"Permit: " + fieldName}>
                    Permit
                </button>
            )
        }
    }

    getAdminRows(): JSX.Element[] {
        let adminRows: JSX.Element[] = [];
        let adminsCopy = this.state.filteredAdmins.slice(0).sort((a,b) => {
            let returnValue = 0;
            a.userid < b.userid ? returnValue = 1 : returnValue = -1;
            return returnValue;
        });
        for (let [index, value] of adminsCopy.entries()) {
            adminRows.push(
                <tr key={index}>
                    <td>{value.userid}</td>
                    <td>{value.username}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "allowRejectAdminRegistration", value.allowRejectAdminRegistration.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "revokeAdminAccess", value.revokeAdminAccess.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "setPrivileges", value.setPrivileges.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "resetAuthInfoNonAdmin", value.resetAuthInfoNonAdmin.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "managePaymentTransactions", value.managePaymentTransactions.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "messageUserEmailUser",  value.messageUserEmailUser.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "deactivateUsers",  value.deactivateUsers.toString() )}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "createRemoveHugs",  value.createRemoveHugs.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "createRemoveOrgs",  value.createRemoveOrgs.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "editApplications",  value.editApplications.toString())}</td>
                    <td>{this.getPrivilegeButton(value.userid, value.username, "readAuditTrail", value.readAuditTrail.toString())}</td>
                </tr>
            )
        }
        return adminRows
    }

    filterAdmins(str: string): void {
        console.log(str);
        let searchResults = this.state.admins.filter(admin => admin.username.includes(str));
        this.setState({
            filteredAdmins: searchResults,
            searchStr: str
        });
    }

    render() {
        if (this.state.adminPrivsChecked) {
            if (this.state.adminCanView) {
            return (
                    <div className="adminPageContainer">
                        <input name="search" placeholder="search" onChange={(e) => this.filterAdmins(e.target.value)}/>
                        <table className="adminTable">
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Allow Reject Admin Requests</th>
                            <th>Revoke Admin Access</th>
                            <th>Set Admin Privileges</th>
                            <th>Reset Non-admin Auth Info</th>
                            <th>Manage Payment Trasactions</th>
                            <th>Message User Email User</th>
                            <th>Deactivate Users</th>
                            <th>Create Remove Hugs</th>
                            <th>Create Remove Orgs</th>
                            <th>Edit Applications</th>
                            <th>Read Audit Trail</th>
                        </tr>
                        {this.getAdminRows()}
                    </table>
                </div>
            )
            } else {
                return (
                    <Redirect to="/NotFound"/>
                )
            }
        } else {
            return <span>Loading...</span>
        }
    }
}

export default AdminPrivilegesComponent;