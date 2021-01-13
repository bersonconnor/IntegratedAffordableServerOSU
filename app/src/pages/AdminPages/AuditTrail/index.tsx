import React, { Component, ReactElement } from 'react'
import { AffordableAdminClient } from 'affordable-client'
import { AuditTrail, UserInfo} from 'affordable-shared-models'
import { Dropdown, Container, Row, Col } from 'react-bootstrap';
import NotFound from '../../ErrorPages/NotFound';
import { Redirect } from 'react-router-dom';

interface props {
    client: AffordableAdminClient;
    adminId: number;
    admin: UserInfo;
}
interface state {
    trails: AuditTrail[],
    filteredTrails: AuditTrail[],
    trialsFilter: string, //Admin username dropdown filter
    adminCanView: boolean,
    adminPrivsChecked: boolean,
}

class AuditTrails extends Component<props, state> {
    constructor(props) {
        super(props);
        this.state = {
            trails: [],
            trialsFilter: "ALL",
            adminCanView: false,
            adminPrivsChecked: false,
            filteredTrails: []
        };
    this.getAuditTrailRows = this.getAuditTrailRows.bind(this);
    this.populateFilterDropdown = this.populateFilterDropdown.bind(this);
    }

    componentDidMount() {
        //Check User is Authorized to View Page
        this.checkAdminPrivileges();
        this.props.client.getAllAuditTrails({userId: this.props.adminId}).then((trails: AuditTrail[]) => {
            trails = trails.reverse();
            this.setState({
                trails: trails,
                filteredTrails: trails
            })
        })
    }

    checkAdminPrivileges() {
        this.props.client.checkPrivilege(this.props.adminId, "readAuditTrail").then(res => {
            let canView = res;
            this.setState({
                adminCanView: canView,
                adminPrivsChecked: true
            });
        });
    }

    getAuditTrailRows(): JSX.Element[] {
        let auditTrailRows: JSX.Element[] = [];
        let trails = this.state.filteredTrails;
        for (let [index, value] of trails.entries()) {
            let date = new Date(value.time)
            if (this.state.trialsFilter == "ALL" || this.state.trialsFilter === value.admin) {
                auditTrailRows.push(
                    <tr key={index}>
                        <td>{value.admin}</td>
                        <td>{value.action}</td>
                        <td>{`${date.getMonth()}/${date.getDay()}/${date.getFullYear()} : ${date.getHours()}:`}{date.getMinutes().toString().length == 1 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}</td> 
                    </tr>
                )
            }
        }
        return auditTrailRows
    }

    populateFilterDropdown(): JSX.Element[] {
        let options: JSX.Element[] = [];
        let uniqueUsernames: string[] = [];
        for (let auditTrail of this.state.trails) {
            if (!uniqueUsernames.includes(auditTrail.admin)) {
                uniqueUsernames.push(auditTrail.admin);
            }
        }
        options.push(<option value="ALL">ALL</option>);
        for (let username of uniqueUsernames) {
            options.push(<option value={username}>{username}</option>);
        }
        return options
    }

    changeFilter(event) {
        this.setState ({
            trialsFilter: event.target.value
        });
    }

    filterAuditTrail(e: React.ChangeEvent<HTMLInputElement>): void {
        console.log(e.target.value);
        let searchResults = this.state.trails.filter(admin => admin.admin.includes(e.target.value) || admin.action.includes(e.target.value));
        this.setState({
            filteredTrails: searchResults
        });
    }

    render() {
        return (
            <div className="adminPageContainer">
                <label className="auditTrailLabel" id="label">Select an Admin: </label>
                <br />
                <select className="auditTrailLabel" onChange={(e) => this.changeFilter(e)} id="admins">
                    {this.populateFilterDropdown()}
                </select>
                <br />
                <input name="search" placeholder="search" onChange={(e) => this.filterAuditTrail(e)}/>
                <table className="adminTable">
                    <tr>
                        <th>Admin</th>
                        <th>Action</th>
                        <th>Time</th>
                    </tr>
                    {this.getAuditTrailRows()}
                </table>
            </div>

        )
    }
}

export default AuditTrails;