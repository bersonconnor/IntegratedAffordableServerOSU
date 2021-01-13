import { AffordableAdminClient } from "affordable-client";
import React, { Component } from "react";
import { UserInfo, AdminPages } from "affordable-shared-models";
import { Redirect } from "react-router-dom";

interface props {
    client: AffordableAdminClient;
    adminId: number;
    adminPage: AdminPages;
}
interface state {
    isAdmin: boolean;
    isAdminChecked: boolean;
}

class AdminPortal extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            isAdminChecked: false
        }
    }
    componentDidMount() {
        this.props.client.getUserInfo(this.props.adminId).then((res: UserInfo) => {
            console.log("userInfo: ", res)
            this.setState({
                isAdmin: res.userType == "admin",
                isAdminChecked: true
            })
        })
    }

    render() {
        if (this.state.isAdminChecked) {
            if (this.state.isAdmin) {
                return (
                    <div>This is an admin</div>
                )
            }else {
                return (
                <Redirect to="/NotFound"/>
                )
            }
        }else {
            return (
                <div>Loading...</div>
            )
        }

    }
}

export default AdminPortal;