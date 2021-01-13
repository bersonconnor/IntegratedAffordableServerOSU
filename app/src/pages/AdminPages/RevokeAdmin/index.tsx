import React, { Component, ReactElement } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import { Admin, UserInfo, Actions } from 'affordable-shared-models'
import { Dropdown } from 'react-bootstrap';
import NotFound from '../../ErrorPages/NotFound';
import { Redirect } from 'react-router-dom';

interface Props {
    client: AffordableAdminClient;
    adminId: number;
    admin: UserInfo;

}
interface State {
    admins: Array<UserInfo>;
    filteredAdmins: Array<UserInfo>;
    adminCanView: boolean;
    adminPrivsChecked: boolean;
}

class RevokeAdminComponent extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            admins: new Array<UserInfo>(),
            filteredAdmins: new Array<UserInfo>(),
            adminCanView: false,
            adminPrivsChecked: false
        };
    }

    componentDidMount() {
        //Check User is Authorized to View Page
        this.checkAdminPrivileges();
        
        this.props.client.getAdmins({userId: this.props.adminId}).then((res: Array<UserInfo>) => {
            res = res.filter(admin => admin.id !== this.props.adminId && admin.username !== 'admin' && !admin.isDeactivate)
            this.setState({
                admins: res,
                filteredAdmins: res
            });
        });
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "revokeAdminAccess").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    revokeUserAccess(userId: number, username: string) {
        this.props.client.revokeAdminAccess({
            adminId: this.props.adminId,
            userId: userId
        }).then(res => {
            this.props.client.recordAuditTrails(this.props.admin.username, `${this.props.admin.username} ${Actions.RevokeAdminAccess} for ${username}`)
            this.componentDidMount();
        })
    }

    getAdminRow(admin: UserInfo): JSX.Element {
        return (
                <tr key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.username}</td>
                    <td>{admin.primaryEmail}</td>  
                    <td>
                    <button 
                        onClick={ (e) => this.revokeUserAccess(admin.id, admin.username) } 
                        type="button" 
                        className="btn btn-danger adminButton"
                        data-toggle="tooltip" 
                        data-placement="bottom" 
                        title={"Revoke"}>
                            Revoke
                    </button>
                    </td>                  
                </tr>
            )
    }

    filterAdmins(e: React.ChangeEvent<HTMLInputElement>): void {
        let searchResults = this.state.admins.filter(admin => admin.username.includes(e.target.value) || admin.primaryEmail?.includes(e.target.value));
        this.setState({
            filteredAdmins: searchResults
        });
    }

    render() {
        if (this.state.adminPrivsChecked) {
            if (this.state.adminCanView) {
            return (
                <div className="adminPageContainer">
                    <input name="search" placeholder="search" onChange={(e) => this.filterAdmins(e)}/>
                    <table className="adminTable">
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Revoke Admin Access</th>
                        </tr>
                        {this.state.filteredAdmins.map(admin => {
                            return this.getAdminRow(admin);
                        })}
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

export default RevokeAdminComponent;