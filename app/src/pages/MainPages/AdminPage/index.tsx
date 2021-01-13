import React, { Component } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import Privileges from './privileges'
import Requests from './requests'
import { AdminRegistrationResponse } from 'affordable-shared-models';

interface props {
    client: AffordableAdminClient
}

interface state {
    admins: []
    currentTab: string
}
class AdminPage extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            currentTab: "Privileges"
        };
        this.toggleAdminPrivilegesPage = this.toggleAdminPrivilegesPage.bind(this);
        this.toggleReistrationRequestPage = this.toggleReistrationRequestPage.bind(this);
    }
    toggleReistrationRequestPage(): void {
        this.setState({
            currentTab: "Registration"
        });
    }
    toggleAdminPrivilegesPage(): void {
        this.setState({
            currentTab: "Privileges"
        });
    }

    render() {
        let page;
        if (this.state.currentTab == "Privileges") {
            page = <Privileges/>
        }else {
            page = <Requests client={this.props.client}/>
        }
        return (
            <div>
                <button onClick={this.toggleReistrationRequestPage}>View Registration Requests</button>
                <button onClick={this.toggleAdminPrivilegesPage}>Modify Admin Privileges</button>
                {page}
            </div>
        )
    }
}

export default AdminPage;