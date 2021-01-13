import React, { Component } from "react";
import ReactTable from "react-table";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect, Route } from "react-router-dom";

import CollapseWithHeader from "../../../components/CollapseWithHeader";
import {OrganizationMembership, UserType, UserInfo} from "affordable-shared-models";
import swal from "sweetalert";



const FormGroup = ({ labelName, value, handleChange }) => {
    return (
        <div className="form-group row">
            <div className="col-1" />
            <label
                htmlFor={labelName.replace(/\s+/g, "-")}
                className="col-2 col-form-label"
            >
                {labelName}
            </label>
            <div className="col-8">
                <input
                    type="text"
                    className="form-control"
                    id={labelName.replace(/\s+/g, "-")}
                    value={value}
                    onChange={handleChange}
                />
            </div>
            <div className="col-1" />
        </div>
    );
};

class HUGSearchBar extends Component {
    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
    constructor(props) {
        super(props);
        this.state = {
          hugName: "", // the name of the HUG
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

      /*Handle Event Functions*/
    handleChange = key => {
        return event => {
        this.setState({ [key]: event.target.value });
        };
    }

    nonAppliedHUGS = async () => {
        const data = new FormData();
        data.append("recipientUsername", this.props.username);

        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getRecipientAppliedHUGs", {
                method: "POST",
                body: data
            });
            if (! response.ok) {
                console.log("HUGBrowser getRecipientAppliedHUGs() BAD RESPONSE:");
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();

            if(json.success === "getRecipientAppliedHUGs()"){
                return json.HUGIDs;
            }
        } catch (error) {
            console.log("HUGBrowser getRecipientAppliedHUGs() ERROR:");
            console.log(error);

            return [];
        }
    }

    handleSearch = async (e) => {
        const data = new FormData();
        data.append("HUGName", this.state.hugName);
        try {
        const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/transaction/searchHugs", {
            method: "POST",
            body: data
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        const json = await response.json();

        if(json.success === "Hugs Found"){
            if(JSON.parse(sessionStorage.userInfo).userType === UserType.DONOR ){
                var hugs = [];
                for(let hug of json.hugList){
                    if(hug.recipientID === null){
                        hugs.push(hug);
                    }
                }
                this.props.addToTable(hugs);
            } else {
                let recipientAppliedHUGs = await this.getRecipientAppliedHUGs;
                let recipientHUGS = [];
                for (let HUG of recipientAppliedHUGs){
                    if(HUG.recipientID ===  this.props.username){
                        recipientHUGS.push(HUG.HUGID);
                    }
                }
                var hugs = [];
                for(let hug of json.hugList){
                    if(!recipientHUGS.includes(hug.HUGID)){
                        hugs.push(hug);
                    }
                }
                this.props.addToTable(hugs);
            }

        }
        } catch (error) {
        console.error(error);
        }
    }

    render() {
        return (
            <div className="col">
                <div className="row mt-5">
                    <div className="col">
                        <FormGroup
                            labelName="HUG Name"
                            value={this.state.hugName}
                            handleChange={this.handleChange("hugName")}
                        />
                        <div className="form-group row">
                            <div className="col-6" />
                                <button className="submit-button" onClick={this.handleSearch}>
                                {" "}
                                Search{" "}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

        );
    }
}

class HUGBrowserPanel extends Component {
    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
    constructor(props) {
        super(props);
        this.state = {
            username:JSON.parse(sessionStorage.userInfo).username,
            hugs:[],
            display_selected:false,
            selected_hug:"",
            url:"/hug-details?",
            updated_url:"",
            index:-1
        };
        this.addToTable = this.addToTable.bind(this);
    }

    // Do this stuff after page loads
    async componentDidMount() {
        let HUGsToShow;

        //update every 5 secs
        var time = 5000;
        this.checkAll = setInterval(() => this.syncAll(), time);

        JSON.parse(sessionStorage.userInfo).userType === UserType.DONOR ?
                HUGsToShow = await this.getAllUnawardedHUGs()
            :
                HUGsToShow = await this.getRecipientHUGs();

        this.addToTable(HUGsToShow);
    }

    componentWillUnmount() {
        //stop updating
        clearInterval(this.checkAll);
    }

    async syncAll() {
        let HUGsToShow;

        JSON.parse(sessionStorage.userInfo).userType === UserType.DONOR ?
                HUGsToShow = await this.getAllUnawardedHUGs()
            :
                HUGsToShow = await this.getRecipientHUGs();

        this.addToTable(HUGsToShow);
    }

    addToTable(list){
        var updateHugs = [];
        for(let i = 0; i < list.length; i++){
            var name = list[i].HUGName;
            var balance = list[i].Balance;
            var goal = list[i].fundingGoal;
            balance = balance.toLocaleString(undefined, { minimumFractionDigits: 2 });
            goal = goal.toLocaleString(undefined, { minimumFractionDigits: 2 });

            updateHugs.push({name:name, amount: "$"+balance, goal: "$"+goal});
        }
        this.setState({
            hugs:updateHugs
        });
    }

    // Return all HUGs from the backend with
    // server/src/services/StripeService.ts getAllHUGs()
    getAllHUGs = async () => {
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getAllHUGs", {
                method: "GET"
            });
            if (!response.ok) {
                console.log("HUGBrowser getAllHUGs() BAD RESPONSE:");
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();
            if(json.success === "getAllHUGs()"){
                // this.addToTable(json.HUGInfo);
                return json.HUGInfo;
            }
        } catch (error) {
            console.log("HUGBrowser getAllHUGs() ERROR:");
            console.log(error);

            return [];
        }
    }

    // Return all unawarded HUGs
    getAllUnawardedHUGs = async () => {
        let allHUGs = await this.getAllHUGs();
        let HUGsToReturn = [];

        for (let HUG of allHUGs) {
            if (HUG.recipientID == null) {
                HUGsToReturn.push(HUG);
            }
        }

        return HUGsToReturn;
    }

    // Return a list of HUG IDs of the HUGs the recipient with the given username
    // has applied to with
    // server/src/services/StripeService.ts getRecipientAppliedHUGs()
    getRecipientAppliedHUGs = async (recipientUsername) => {
        const data = new FormData();
        data.append("recipientUsername", recipientUsername);

        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getRecipientAppliedHUGs", {
                method: "POST",
                body: data
            });
            if (! response.ok) {
                console.log("HUGBrowser getRecipientAppliedHUGs() BAD RESPONSE:");
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();

            if(json.success === "getRecipientAppliedHUGs()"){
                return json.hugList;
            }
            else {
                return [];
            }
        } catch (error) {
            console.log("HUGBrowser getRecipientAppliedHUGs() ERROR:");
            console.log(error);

            return [];
        }
    }

    // Return all unawarded HUGs that have met their goal and that the current
    // recipient has not yet applied to
    getRecipientHUGs = async () => {
        let recipientAppliedHUGs = await this.getRecipientAppliedHUGs(this.state.username);
        let unawardedHUGS = await this.getAllUnawardedHUGs();
        let appliedHUGS = [];
        let HUGsToReturn = [];

        // Filter applied HUGs
        if (recipientAppliedHUGs != []) {
            for (let HUG of recipientAppliedHUGs) {
                if (HUG.recipientID === this.state.username) {
                    appliedHUGS.push(HUG.HUGID);
                }
            }
        }

        if (unawardedHUGS != []) {
            // Filter unawarded HUGs and HUGs that haven't met their funding goal
            for (let HUG of unawardedHUGS) {
                if (HUG.Balance >= HUG.fundingGoal && !appliedHUGS.includes(HUG.HUGID)) {
                    HUGsToReturn.push(HUG);
                }
            }
        }

        return HUGsToReturn;
    }

    handleApply = async () => {
        const data = new FormData();
        data.append("username", this.state.username);
        data.append("HUGName", this.state.selected_hug);
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/applyHUG", {
                method: "POST",
                body: data
            });
            if (! response.ok) {
                throw Error(response.statusText);
            }
            const json = await response.json();
            console.log(json);
            swal(
                "Application Successful!!",
                "You have applied to " + this.state.selected_hug,
                "success"
              );
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="col">
                <HUGSearchBar addToTable={this.addToTable} username={this.state.username}/>
                <div id="table-skelleton">
                    <CollapseWithHeader title="Health Utilizing Grant" open={true}>
                        <ReactTable
                            data = {this.state.hugs}
                            columns={[
                                {
                                    headerClassName: "apply-table-thead",
                                    Header: "Name",
                                    accessor: "name",
                                    style: { whiteSpace: "unset" }
                                },
                                {
                                    headerClassName: "apply-table-thead",
                                    Header: "Current Balance",
                                    accessor: "amount",
                                    style: { whiteSpace: "unset" }
                                },
                                {
                                    headerClassName: "apply-table-thead",
                                    Header: "Funding Goal",
                                    accessor: "goal",
                                    style: { whiteSpace: "unset" }
                                }
                            ]}
                            defaultPageSize={10}
                            className="-striped -highlight"
                            style={{
                                height: "400px"
                            }}
                            getTrGroupProps={(state, rowInfo) => {
                                if (rowInfo && rowInfo.row) {
                                  return {
                                    onClick: (e) => {
                                      // Unselect
                                      if(this.state.display_remove && rowInfo.index === this.state.index){
                                        var url = this.state.url;
                                        sessionStorage.setItem("hugName", "");
                                        this.setState({
                                          display_remove:false,
                                          index:-1,
                                          selected_hug:"",
                                          updated_url:url
                                        })
                                      } else if(this.state.display_remove && rowInfo.index !== this.state.index){
                                          // Clicked on new row
                                          var url = this.state.url;
                                          sessionStorage.setItem("hugName", rowInfo.row.name);
                                          this.setState({
                                            index:rowInfo.index,
                                            selected_hug:rowInfo.row.name,
                                            updated_url:url+rowInfo.row.name
                                          })
                                      } else {
                                          var url = this.state.url;
                                          sessionStorage.setItem("hugName", rowInfo.row.name);
                                        this.setState({
                                          // First time click
                                          display_remove:true,
                                          index:rowInfo.index,
                                          selected_hug:rowInfo.row.name,
                                          updated_url:url+rowInfo.row.name
                                        })
                                      }
                                    },
                                    style:{
                                      background: rowInfo.index === this.state.index?"#f0e3d2c":'',
                                      color:rowInfo.index === this.state.index?"#3771ce":'',
                                      border: rowInfo.index === this.state.index? "2px solid #3771ce":'',
                                    }
                                  }
                                }
                              }
                            }
                        />
                    </CollapseWithHeader>
                </div>
                <div className="text-right" align="right">
                    {JSON.parse(sessionStorage.userInfo).userType === UserType.DONOR && this.state.display_remove?
                        <LinkContainer to={this.state.url}>
                            <a className="prev_next"> Details</a>
                        </LinkContainer>
                    : JSON.parse(sessionStorage.userInfo).userType === UserType.DONOR ?
                    <></>
                    : this.state.display_remove?
                        <button className="submit-button" onClick={this.handleApply}> Apply</button>
                    :
                    <></>
                    }
                </div>
            </div>
        );
    }
}

export default HUGBrowserPanel;
