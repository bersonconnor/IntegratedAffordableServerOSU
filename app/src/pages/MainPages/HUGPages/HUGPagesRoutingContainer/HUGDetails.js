import React, { Component} from "react";
import ReactTable from "react-table";
import { LinkContainer } from "react-router-bootstrap";
import ProgressBar from 'react-bootstrap/ProgressBar';

import "./scss/HUGDetails.scss";
import DonateButton from "../../../../components/Modal/DonateButton";

class HUGDetails extends Component {
    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
    
    constructor(props) {
        super(props);
        this.state = {
            HUGName: sessionStorage.getItem("hugName"),
            HUGID:0,
            HUGDescription: "",
            HUGBalance: 0,
            HUGGoal: 0,
            progressBarPercentage: 0
        };
    }

    // Do this stuff after page loads
    async componentDidMount() {
        console.log(sessionStorage.getItem("hugName"));
        var some_HUG_ID = sessionStorage.getItem("hugName");

        // Update every 5 secs
        var time = 5000;
        this.checkAll = setInterval(() => this.getHUG(some_HUG_ID), time);
        this.getHUG(some_HUG_ID);
    }

    // Do this stuff when leaving the page
    async componentWillUnmount() {
        // Stop updating
        clearInterval(this.checkAll);
    }

    // Return only those HUGs of HUGList which have "Pending" status
    extractPendingHUGs = (HUGList) => {
        let filteredHUGList = [];

        for (let HUG of HUGList) {
            if (HUG.Status == "Pending") {
                filteredHUGList.push(HUG);
            }
        }

        return filteredHUGList;
    }

    // Return all HUGs from the backend with
    // server/src/services/StripeService.ts getAllHUGs()
    getAllHUGs = async () => {
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getAllHUGs", {
                method: "GET"
            });
            if (!response.ok) {
                console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js BAD RESPONSE:");
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();
            console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js SUCCESS:");
            // console.log(json)

            return json;
        } catch (error) {
            console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js ERROR:");
            // console.log(error);

            return [];
        }
    }

    // Populates the component's state with the given HUG's info from the
    // backend using server/src/services/StripeService.ts getHUG()
    getHUG = async (HUGName) => {
        console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js this.state.HUGID:");
        console.log(HUGName);

        const data = new FormData();
        data.append("HUGName", HUGName);
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getHUG", {
                method: "POST",
                body: data
            });
            if (!response.ok) {
                console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js BAD RESPONSE:");
                throw Error(response.statusText);
            }
            const json = await response.json();

            console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js SUCCESS:");
            console.log(json)
            this.setState({ HUGName: json.HUGInfo[0].HUGName });
            this.setState({ HUGDescription: json.HUGInfo[0].HUGDescription });
            this.setState({ HUGBalance: json.HUGInfo[0].Balance });
            this.setState({ HUGGoal: json.HUGInfo[0].fundingGoal });
            this.setState({ HUGID: json.HUGInfo[0].HUGID });
            this.setState({ progressBarPercentage: (this.state.HUGBalance / this.state.HUGGoal) * 100 });
        } catch (error) {
            console.log("app/src/pages/MainPages/HUGPages/HUGPagesRoutingContainer/HUGDetails.js ERROR:");
            console.log(error);
        }
    }

    render() {
        return (
            <div id="HUG-details-container">
                <div id="HUG-title">
                    {
                        this.state.HUGName != null ?
                        this.state.HUGName.toLocaleUpperCase()
                        :
                        this.state.HUGName
                    }
                </div>
                <div id="HUG-description">
                    {this.state.HUGDescription}
                </div>
                <div id="progress-action-container">
                    <div id="HUG-progress">
                        <span id="progress">
                            Progress: ${this.state.HUGBalance}
                        </span>
                        <span id="goal">
                            Goal: ${this.state.HUGGoal}
                        </span>
                        <div id="progress-bar">
                            <ProgressBar animated variant="success" now={this.state.progressBarPercentage} label={`${this.state.progressBarPercentage}%`} />
                        </div>
                    </div>
                </div>
                <div id="HUG-action-button">
                    <DonateButton HUGName={this.state.HUGName}/>
                </div>
            </div>
        );
    }
}

export default HUGDetails;
