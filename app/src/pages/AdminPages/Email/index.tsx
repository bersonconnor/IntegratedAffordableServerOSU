import React, { Component, ReactElement } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import { AdminPrivileges, UserInfo, UserType, AdminEmailRequest, Actions } from 'affordable-shared-models'
import { Dropdown, Container, Row, Col } from 'react-bootstrap';
import NotFound from '../../ErrorPages/NotFound';
import { Redirect } from 'react-router-dom';
import swal from "sweetalert";

interface props {
    client: AffordableAdminClient;
    adminId: number;
    admin: UserInfo;
}
interface state {
    users: UserInfo[];
    filteredUsers: UserInfo[];
    selectedUserId: number;
    adminCanView: boolean;
    adminPrivsChecked: boolean;
}

class Email extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            filteredUsers: [],
            selectedUserId: -1,
            adminCanView: false,
            adminPrivsChecked: false
        };
        this.emailUser = this.emailUser.bind(this);
        this.selectUser = this.selectUser.bind(this);
    }

    componentDidMount() {
        //Check User is Authorized to View Page
        this.checkAdminPrivileges();
        console.log("THIS ADMIN ID: ", this.props.adminId);
        console.log("state:", this.state);

        this.getUsers();
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "messageUserEmailUser").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    selectUser(event) {
        this.setState({
            selectedUserId: event.target.value
        })
    }

    getUsers(): void {
        let request = { userId: this.props.adminId }
        this.props.client.getAllUsers(request).then(res => {
            console.log("get users res: ", res);
            this.setState({
                users: res,
                filteredUsers: res
            });
        });
    }

    populateUsersSelection(): JSX.Element[] {
        let userOptions: JSX.Element[] = []
        userOptions.push(<option value=""></option>);
        if (this.state.filteredUsers) {
            for (let user of this.state.filteredUsers) {
                userOptions.push(<option value={user.id}>{user.username}</option>);
            }
        }
        return userOptions;
    }

    emailUser(event) {
        event.preventDefault();

        let emailBody: string = "";
        let subjectText: string = "";
        if (document.getElementById("subject") !== undefined) {
            subjectText = (document.getElementById("subject") as HTMLInputElement).value;
        }
        if (document.getElementById("email") !== undefined) {
            emailBody = (document.getElementById("email") as HTMLInputElement).value;
        }

        let userId = this.state.selectedUserId;
        let request: AdminEmailRequest = {
            adminId: this.props.adminId,
            userId: userId,
            subject: subjectText,
            body: emailBody,
        }

        console.log(request);
        this.props.client.sendUserEmail(request).then(resp => {
            console.log(`Email call has returned`);
            
            this.props.client.recordAuditTrails(this.props.admin.username, `${this.props.admin.username} ${Actions.EmailedUser} with id ${userId}`);
            
            swal(
                "Success!",
                "The email has been sent.",
                "success"
              );
        }).catch(resp => {
            swal("Error", "The email has not been sent.", "error");
        });
    }

    filterUsers(e: React.ChangeEvent<HTMLInputElement>): void {
        let searchResults = this.state.users.filter(user => user.username.includes(e.target.value) || user.primaryEmail?.includes(e.target.value));
        this.setState({
            filteredUsers: searchResults
        });
    }

    render() {
        return (
            <div id="email-container">
                <Container>
                    <form onSubmit={this.emailUser}>
                        <Row>
                            <Col xs lg="3" id="header">
                                <label id="label">Select a User: </label>
                                <input className="emailInput" name="search" placeholder="search" onChange={(e) => this.filterUsers(e)}/>
                                <br />
                                <select onChange={this.selectUser} id="users">
                                    {this.populateUsersSelection()}
                                </select>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs lg="12" id="email-subject">
                                <input type="text" id="subject" placeholder="Enter email subject" />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <textarea id="email" placeholder="Enter email to selected user."></textarea>
                            </Col>
                        </Row>
                        <Row>
                            <Col id="submit-col"><input id="submit" type="submit" onClick={(e) => this.emailUser(e)}/></Col>
                        </Row>
                    </form>
                </Container>
            </div>
        )
    }
}

export default Email;