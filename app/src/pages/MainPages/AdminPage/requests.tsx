import React, { Component } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import { AdminRegistrationResponse, AdminRegistrationRequest } from 'affordable-shared-models';
import { Button } from 'react-bootstrap';

interface Props {
    client: AffordableAdminClient
}

interface State {
    requests: AdminRegistrationResponse[]
}
class Requests extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            requests: []
        };
        this.denyAdminRequest = this.denyAdminRequest.bind(this);
        this.acceptAdminRequest = this.acceptAdminRequest.bind(this);
    }

    componentDidMount() {
        this.props.client.getAdminRegistrationRequests().then((res) => {
            console.log(res);
            this.setState({
                requests: res
            });
        });
    }

    denyAdminRequest(userId: number) {
        let request = {userId: userId} as AdminRegistrationRequest
        this.props.client.rejectAdminRegistration(request);
    }

    acceptAdminRequest(userId: number): void {
        let request = {userId: userId} as AdminRegistrationRequest
        this.props.client.acceptAdminRegistration(request);
    }

    render() {
        const items: JSX.Element[] = []
        for (const [index, value] of this.state.requests.entries()) {
        items.push(<div key={index}>id {value.userId} user {value.username} Admin Accepted? {value.isAccepted} ---
        <Button variant="primary" onClick={(e) => this.acceptAdminRequest(value.userId)}>V</Button>
        <Button variant="danger" onClick={(e) => this.denyAdminRequest(value.userId)}>X</Button></div>)
          }

        return (
            // <table>
            //     <tr>ID</tr>
            //     <tr>Username</tr>
            // </table>
            <div>
                <p>Hello!</p>
                {items}
            </div>
        )
    }
    
}

export default Requests;