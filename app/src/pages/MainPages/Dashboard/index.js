import "./scss/dashboard.scss";
import React, { Component } from "react";
import { AffordableClient } from "affordable-client";
import {Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, CardColumns, ListGroup, ButtonGroup} from "react-bootstrap"
import {Container, Row, Col, Form} from "react-bootstrap"
import ReactTable from "react-table"; /*INSERT */
import { LinkContainer } from "react-router-bootstrap";/*INSERT */
import CollapseWithHeader from "../../../components/CollapseWithHeader";

import Blob from 'blob';
import axios from 'axios';


import Popup from "reactjs-popup";
import swal from "sweetalert";

import "../Settings/scss/settings.scss";
import "./scss/dashboard.scss";
import "../../../styles/buttons.css";/*INSERT */
import DepositButton from "../../../components/Modal/DepositButton";
import WithdrawButton from "../../../components/Modal/WithdrawButton";

import {UserType} from "affordable-shared-models";


class ViewApplicants extends Component{

    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

    constructor(props){
        super(props);
        this.client = new AffordableClient();
        this.state  = {
            index: -1,
            requestAmount: 0

        };

        this.rejectRequest = this.rejectRequest.bind(this);
        this.grantRequest = this.grantRequest.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
        this.downloadDocument = this.downloadDocument.bind(this);


    }

    handleAmount(e){
        this.setState({requestAmount: e.target.value});
    }

    closeModal(){
        this.props.closeModal();
    }

    async rejectRequest(){
        console.log(this.props.requestAmount);
        console.log(this.props.selected_requestName);
        console.log(this.props.reason);
        console.log(JSON.parse(sessionStorage.getItem('userInfo')).primaryEmail);

        console.log("reject");
        swal({title: "Do you want to reject " + this.props.selected_requestName + "?",
        buttons: {
            Cancel: true,
            Confirm: {
                text: "Confirm",
                value: "Confirm",
            },
        },
        closeOnClickOutside: false,
        icon: "success"})
            .then(async (value) =>{

            switch(value){
                case "Cancel":
                    break;

                case "Confirm":

                    await this.props.rejectApplicant(this.props.HUGID, this.props.recipientID, JSON.parse(sessionStorage.getItem('userInfo')).primaryEmail);
                    this.props.removeApplicant(this.props.selected_requestName, this.props.requestAmount, this.props.story);
                    this.props.closeModal();

                default:
                    break;
            }
            });
    }

    async grantRequest(){
        console.log(this.props.HUGID);
        console.log(this.props.recipientID);

        if(this.state.requestAmount != 0){
            console.log("Grant");
            swal({title: "Do you want to granted " + this.state.requestAmount + " to " + this.props.selected_requestName + "?",
            buttons: {
                Cancel: true,
                Confirm: {
                    text: "Confirm",
                    value: "Confirm",
                },
            },
            closeOnClickOutside: false,
            icon: "success"})
              .then(async (value) =>{

                switch(value){
                    case "Cancel":
                        console.log("Cancel grant");
                        break;

                    case "Confirm":
                        console.log(this.props.selected_requestName);
                        await this.props.awardHUG(this.props.HUGID, this.props.recipientID, this.state.requestAmount,JSON.parse(sessionStorage.getItem('userInfo')).primaryEmail);
                        this.props.removeApplicant(this.props.selected_requestName, this.props.requestAmount, this.props.story);
                        this.props.closeModal();

                    default:
                        break;
                }
              });
        }
        else{
            console.log("don't award");
            swal({title: "Please enter an amount to grant to " + this.props.selected_requestName,
            buttons: {
                close: {
                    text: "Close",
                    value: "Close",
                },
            },
            icon: "error"});
        }
    }

    async downloadDocument(){

        const map= new Map();
        map.set("file0", this.props.downloadDoc1);
        map.set("file1", this.props.downloadDoc2);
        map.set("file2", this.props.downloadDoc3);

        const i=0;
        for(i=0; i<3; i++){
            if(map.get("file"+i)!=null && map.get("file"+i)!=undefined ){
                const data= new FormData();
                var fileName=map.get("file"+i);
                data.append("fileName", fileName);

                var json = await this.client.fileDownload(data);
                console.log(json);

                const url = window.URL.createObjectURL(new Blob([json]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',fileName);
                document.body.appendChild(link);
                link.click();

        // await axios({
        //     url: process.env.REACT_APP_AF_BACKEND_URL + "/file/download",data,
        //     method: 'POST',
        //     responseType: 'blob',
        //   }).then((response) => {
        //       console.log(response);
        //     // const url = window.URL.createObjectURL(new Blob([response.data]));
        //     // const link = document.createElement('a');
        //     // link.href = url;
        //     // link.setAttribute('download',fileName);
        //     // document.body.appendChild(link);
        //     // link.click();
        //   });

              }
          }
    }

    render(){
        return (
        <Popup
            open={this.props.open}
            closeOnDocumentClick = {true}
            onClose={this.closeModal}>

              <a className="close" onClick={this.closeModal}>
                  &times;
              </a>
              <div className="header"> <p></p> </div>
              <div className="content">

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h4>Applicant: {this.props.selected_requestName}</h4>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Applicant Story</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <textarea cols={35} rows={5} value={this.props.story} />
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Willing to Share Their Story</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <p>{this.props.share}</p>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Applicant COVID Test Result</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <p>{this.props.covid}</p>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Applicant Monthly Income</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <p>{this.props.monthlyIncome}</p>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Request Amount</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                    <p>{this.props.requestAmount}</p>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Recommended Grant Amount</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                    <p>{((parseFloat(this.props.requestAmount) * 100) / 97.5).toFixed(2)}</p>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Request Documentation</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <Button block style={{width: 250}} size="1g" onClick={this.downloadDocument} >Download</Button>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <h6>Grant Amount:</h6>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <input
                            type="text"
                            id="amountNumber"
                            value={this.state.requestAmount}
                            onChange={this.handleAmount} />
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <Button block size="lg" onClick={this.rejectRequest} >Reject</Button>
                    </Col>
                    <Col style={{padding: "5px"}}>
                        <Button block size="lg" onClick={this.grantRequest}>Grant</Button>
                    </Col>
                </Row>

                <Row style={{width: "100%", margin: "0px"}}>
                </Row>

              </div>
              <div className="actions">
                  <div className="floats-right">
                  {/*Cancel the transaction */}
                  <button
                    className="submit-button"
                    onClick={this.closeModal}>
                      Cancel
                  </button>
                  </div>

                  { /* Submit the transaction*/ }
                  {/*NEED TO CHECK WHAT OTHER PEOPLE ARE USING TO DETERMINE USER */ }
              </div>
          </Popup>
        );
    }

}





class Dashboard extends Component {

    // -----------------------------------------------------------------------------------------------//
    // Below here are constructors and other essential code blocks //
    // -----------------------------------------------------------------------------------------------//
    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
    constructor(props) {
        super(props);

        console.log(props);

        this.client = new AffordableClient();
        this.state = {
            userId: this.props.userId,
            userName: this.props.userName,
            userType: this.props.userType,
            firstName: this.props.firstName,
            index: -1,
            selected_hug: "",
            selected_hugID: -1,
            display_remove: false,
            open: false,
            selected_recipient:"",
            buttonMessage: "",
            beenVerified: sessionStorage.getItem("Verified") === null,
            showVerified: sessionStorage.getItem("Verified") === null || sessionStorage.getItem("Verified") === "inProcess",
            //firstName: "Elan"
            hugs: [],
            covid: "",
            share:"",
            monthlyIncome: "",
            selected_requestName: "",
            requestAmount: 0,
            story: "",
            downloadDoc1: "",
            downloadDoc2: "",
            downloadDoc3: "",
            HUGID: -1,
            recipientID: "",
            requests: []
            // requests: [{recipientID: "d", HUGID: 2, covid: "Yes", desiredAmount: 30, fullName: "Nick", monthly_income: "3000-5000" , story: "COVID-19", file1: "1.zip", file2: "2.zip", file3: "3.zip"},
            // {recipientID: "Hello", HUGID: 3, covid: "No", desiredAmount: 100, fullName: "Sam J", monthly_income: "1000-3000" , story: "Broken Arm", file1: "2.zip", file2: "2.zip", file3: "2.zip"},
            // {recipientID: "Good", HUGID: 4, covid: "No", desiredAmount: 50, fullName: "Jack A", monthly_income: "4000-6000" , story: "Doctor Appointment", file1: "2.zip", file2: "2.zip", file3: "2.zip"},
            // {recipientID: "Bye", HUGID: 5, covid: "Yes", desiredAmount: 35, fullName: "Nick", monthly_income: "3000-5000" , story: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng]velit, sed quia non-numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipitlaboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui inea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? [33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non-provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non-recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat…", file1: "2.zip", file2: "2.zip", file3: "2.zip"}]

        };
        this.getBalance();


        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleSelectedRecipient = this.handleSelectedRecipient.bind(this);
        this.removeApplicant = this.removeApplicant.bind(this);
        this.getApplications = this.getApplications.bind(this);
    }

    getApplications = async (e)=>{
        var json = await this.client.getApplications("Pending");
        this.setState({requests: json.recipients});
    }

    removeApplicant(val1, val2, val3){
        console.log("RemoveApplicant");
        console.log(val1);
        console.log(val2);
        console.log(val3);
        let newRequest = this.state.requests.filter(applicant => (applicant.fullName !== val1 || applicant.desiredAmount !== val2 || applicant.story !== val3));
        this.setState({
            requests: newRequest
        });
    }

    handleSelectedRecipient(val){
        this.setState({
            selected_recipient: val
        });
    }

    closeModal(){
        this.setState({open:false});
    }

    async openModal(){
        if(this.state.selected_requestName != ""){
            {/*let v = await this.getHUGPendingApplicants(this.state.selected_hugID);*/}

            this.setState({
                open:true

            });
        }
        else{
            swal("Please select a request", "", "error");
            this.getDashboardHUGs();
        }
    }


    // Do this stuff after page loads
    async componentDidMount() {
        console.log(`Loaded dashboard with user information:
        id: ${this.state.userId}
        user: ${this.state.userName}
        type: ${this.state.userType}
        name: ${this.state.firstName}`);

        // Do these immediately upon load
        this.getBalance() // Update balance every
        this.getDashboardHUGs() // Get donor/recipient HUGs
        this.getApplications();

        if ("admin".localeCompare(this.state.userName) !== 0 && this.state.userType === UserType.RECIPIENT) {
            this.stripeOnboardingStatus();
        }

        // And then repeat on a polling interval (in milliseconds)
        //this.checkBalance=setInterval(() => this.getBalance(), 1000);
        // this.getDashboardHUGsInterval = setInterval(() => this.getDashboardHUGs(), 2000);
    }

    componentWillUnmount() {
        // Stop repeating Dashboard tasks
        clearInterval(this.checkBalance);
        clearInterval(this.getDashboardHUGsInterval);
  }

    // Get all the hugs to populate the dashboard. Different functions are called depending on usertype
    async getDashboardHUGs() {
        let hugs = [];

        if (this.state.userType === UserType.DONOR) {
            let returnObj0 = await this.getOwnedHUGs(this.state.userName);

            if (returnObj0 != null && returnObj0.length > 0) {
                hugs = this.extractPendingHUGs(returnObj0);
            }

            // console.log("Donor user's unawarded HUGs:");
            // console.log(hugs);
            this.setState({
                hugs: hugs
            });
        }
        else {
            let returnObj0 = await this.getRecipientAppliedHUGs(this.state.userName);

            if (returnObj0 != null && returnObj0.length > 0) {
                hugs = this.extractPendingHUGs(returnObj0);
            }

            // console.log("Recipient user's applied HUGs with \"Pending\" status:");
            // console.log(hugs);
            this.setState({
                hugs: hugs
            });
        }
    }

    stripeOnboardingStatus = async() => {
        console.log(this.state.userName, this.state.userType);
        const data = new FormData();
        data.append("username", this.state.userName);
        const usertype = null;

        // gets the usertype
        await fetch(this.REACT_APP_AF_BACKEND_URL +"/profile/get-user-type", {
            method: "POST",
            body: data
            })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Unable to get user type");
            }
         })
        .then(resData => {
            usertype = resData.usertype;
        });

        data.append("usertype", usertype);

        var accountID = null;
        var requirementsDue = false;
        // first attempts to get the Stripe Connected Account ID of the current user
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getCustomAccountID", {
                method: "POST",
                body: data
            });
            if(!response.ok) {
                console.error(response.statusText);
                throw Error(response.statusText);
            }

            const json = await response.json();

            // if no Connect Account was found, then send an alert
            // Though, this is not possible since both recipients and donors are given one
            if(json.success === "No Account Found") {
                alert("Error: No Withdraw Account Found!");
            } else {
                accountID = json.id;
                console.log("Account Found: " + accountID);

                data.append("accountID", accountID);
            }

        } catch(error) {
            console.error(error);
        }

        // checks if account needs to be verified
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/checkConnectRequirements", {
                method: "POST",
                body: data
            });
            if(!response.ok) {
                console.error(response.statusText);
                throw Error(response.statusText);
            }

            const json = await response.json();

            if(json.success === "STRIPE ERROR") {
                console.error(json.message);
            } else {
                if(json.status === "None") {
                    requirementsDue = false;
                }
                else {
                    const requirements = json.requirements;

                    requirementsDue = true;
                }
                console.log("Account Found: " + accountID);
                accountID = json.id;
            }

        } catch(error) {
            console.error(error);
        }

        if(requirementsDue){
            // First check of status
            if(sessionStorage.getItem("Verified") === null){
                this.setState({buttonMessage: "Get Verified"});
            } else if (sessionStorage.getItem("Verified") === "inProcess"){
                this.setState({buttonMessage: "We need more information"});
            } else {
                this.setState({ showVerified: false});
            }
        } else {
            this.setState({ showVerified: false});
        }
    }

    stripeOnboarding = async () => {
        console.log(this.state.userName, this.state.userType);
        const data = new FormData();
        data.append("username", this.state.userName);
        const usertype = null;

        // gets the usertype
        await fetch(this.REACT_APP_AF_BACKEND_URL +"/profile/get-user-type", {
            method: "POST",
            body: data
            })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Unable to get user type");
            }
         })
        .then(resData => {
            usertype = resData.usertype;
        });

        data.append("usertype", usertype);

        var accountID = null;
        var requirementsDue = false;
        // first attempts to get the Stripe Connected Account ID of the current user
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getCustomAccountID", {
                method: "POST",
                body: data
            });
            if(!response.ok) {
                console.error(response.statusText);
                throw Error(response.statusText);
            }

            const json = await response.json();

            // if no Connect Account was found, then send an alert
            // Though, this is not possible since both recipients and donors are given one
            if(json.success === "No Account Found") {
                alert("Error: No Withdraw Account Found!");
            } else {
                accountID = json.id;
                console.log("Account Found: " + accountID);

                data.append("accountID", accountID);
            }

        } catch(error) {
            console.error(error);
        }

        // checks if account needs to be verified
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/checkConnectRequirements", {
                method: "POST",
                body: data
            });
            if(!response.ok) {
                console.error(response.statusText);
                throw Error(response.statusText);
            }

            const json = await response.json();

            if(json.success === "STRIPE ERROR") {
                console.error(json.message);
            } else {
                if(json.status === "None") {
                    requirementsDue = false;
                }
                else {
                    const requirements = json.requirements;
                    if(requirements[0] === "external_account") {
                        alert("Please Add a Bank Account in Settings/Banking Information");
                        return;
                    }
                    requirementsDue = true;
                }
                console.log("Account Found: " + accountID);
                accountID = json.id;
            }

        } catch(error) {
            console.error(error);
        }

        //Change display
        if(requirementsDue === false){
            sessionStorage.setItem("Verified", "Verified");
            this.setState({
                showVerified:false
            });
        }
        else {
            data.append("successURL",window.location.href);
            data.append("failureURL", window.location.href);


            //alert("To enable withdraws, we need more information. Redirecting to form...");
            swal({title: "To enable withdraws, we need more information. Proceed to information form?",
                buttons: {
                    cancel: "Cancel",
                    proceed: {
                        text: "Proceed",
                        value: "proceed",
                    },
                },
              })
              .then(async (value) =>{
                // console.log(value + "hellllllooooo");

                switch(value){

                    case "proceed":
                        sessionStorage.setItem("Verified", "inProcess");
                        // console.log("Proceed1111111");
                        try {
                            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/onboardingInfoRequest", {
                                method: "POST",
                                body: data
                            });
                            if(!response.ok) {
                                throw Error(response.statusText);
                            }

                            const json = await response.json();

                            if(json.success == "STRIPE ERROR") {
                                alert("Can't reach Stripe")
                                console.error(json.message);
                            } else {
                                console.log(json.message)
                                window.location.replace(json.message.url);
                            }

                        } catch(error) {
                            console.error(error);
                        }
                        break;

                    default:
                        // console.log("Default3333333333");

                        break;
                }
              });
        }
    }

    // Return a list of HUGs owned by the donor with the given username with
    // server/src/services/StripeService.ts getOwnedHugs()
    getOwnedHUGs = async (username) => {
        const data = new FormData();
        data.append("username", username);

        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getOwnedHugs", {
                method: "POST",
                body: data
            });
            if (! response.ok) {
                console.log("Dashboard getOwnedHugs() BAD RESPONSE:");
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();

            if(json.success === "getOwnedHugs()"){
                return json.hugList;
            }
            else {
                return [];
            }
        } catch (error) {
            console.log("Dashboard getOwnedHugs() ERROR:");
            console.log(error);

            return [];
        }
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

    // Return a list of HUGs a recipient with the given username has applied to
    // with server/src/services/StripeService.ts getRecipientAppliedHUGs()
    //
    // Useful for recipient dashboards, listing all their applied-to HUGs
    getRecipientAppliedHUGs = async (recipientUsername) => {
        const data = new FormData();
        data.append("recipientUsername", recipientUsername);

        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL+"/stripe/getRecipientAppliedHUGs", {
                method: "POST",
                body: data
            });
            if (! response.ok) {
                console.log("Dashboard getRecipientAppliedHUGs() BAD RESPONSE:");
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
            console.log("Dashboard getRecipientAppliedHUGs() ERROR:");
            console.log(error);

            return [];
        }
    }

    // Return all a HUG's applicants with
    // server/src/services/StripeService.ts getHUGApplicants()
    //
    // Useful for donor dashboards, listing all the applicants to their HUG(s)
    getHUGApplicants = async (HUGID) => {
        const data = new FormData();
        data.append("HUGID", HUGID);

        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL+"/stripe/getHUGApplicants", {
                method: "POST",
                body: data
            });
            if (!response.ok) {
                console.log("Dashboard getHUGApplicants() BAD RESPONSE:");
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();
            console.log("Dashboard getHUGApplicants() SUCCESS:");
            // console.log(json)

            return json.applicants;
        } catch (error) {
            console.log("Dashboard getHUGApplicants() ERROR:");
            // console.log(error);

            return [];
        }
    }

    // Return all a HUG's pending applicants with
    // server/src/services/StripeService.ts getHUGApplicants()
    getHUGPendingApplicants = async (HUGID) => {
        const allApplicants = await this.getHUGApplicants(HUGID);
        let pendingApplicants = [];

        for (let applicant of allApplicants) {
            if (applicant.Status == "Pending") {
                pendingApplicants.push(applicant);
            }
        }

        return pendingApplicants;
    }

    formatBalance(pending, available) {
        var p = pending.toLocaleString(undefined, { minimumFractionDigits: 2 });
        var a = available.toLocaleString(undefined, { minimumFractionDigits: 2 });
        this.setState({
          pendingBalance: p,
          availableBalance: a
        });
      }

    getBalance = async () => {
        const data = new FormData();
        data.append("username", this.props.userName);
        data.append("usertype", this.props.userType);

        try {
          const response = await fetch(this.REACT_APP_AF_BACKEND_URL+"/transaction/balance", {
            method: "POST",
            body: data
          });
          if (!response.ok) {
            throw Error(response.statusText);
          }
          const json = await response.json();
          if (json.success === "Balance found") {
            this.formatBalance(json.pendingBalance, json.balance);
          }
        } catch (error) {
          console.error(error);
        }
      }

      // Award the HUG with the given HUGID to the applicant with the given username,
      // returning true if successful and false otherwise, using
      // server/src/services/StripeService.ts transferFundFromHUGToRecipient()
      awardHUG = async (HUGID, username, amount) => {
        var json = await this.client.awardHUG(HUGID, username, amount);
        console.log(json);
        if(json.success === "Updated Awarded status"){
            return true;
        }
        else {
            return false;
        }
      }

        // Reject the applicant with the given username for the HUG with the given
        // HUGID, returning true if successful and false otherwise, using
        // server/src/services/StripeService.ts rejectRecipient()
        rejectApplicant = async (HUGID, username) => {
            var json = await this.client.rejectApplicant(HUGID, username);
            console.log(json);
            if(json.success === "Updated Awarded status"){
                return true;
            }
            else {
                return false;
            }
        }

    render() {
        //console.log("User type is " + this.state.usertype);
        return (
        <div className="dash">
            {
                this.props.userName == "admin" ?
                    this.getDonorDash()
                :
                    this.getRecipientDash()
            }
        </div>
        )
    }

    // -----------------------------------------------------------------------------------------------//
    // Below here is the code for generating the recipient's dashboard //
    // -----------------------------------------------------------------------------------------------//

    getRecipientDash() {
        return (
        <Container style={{margin: "0px", maxWidth:"4000px"}}>
            {/* <text>This is a recipient dashboard</text> */}

            <Row>

                <Col style={{padding: "0px"}}>
                    {this.getRecipientActionCard()}
                </Col>

                <Col style={{padding: "0px"}}>
                    {this.getApplicationCard()}
                    {this.getAccountsCard()}
                </Col>

            </Row>

        </Container>
        )
    }

    getRecipientActionCard() {
        return (
        <Card style={{margin: "2px", marginBottom: "4px"}}>
            <Card.Body>
                <Card.Title>{this.getGreeting()}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    You can find important information here at a glance
                </Card.Subtitle>

                <Card.Text/>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "0px"}}>
                    <ListGroup horizontal width="100%">
                        <ListGroup.Item style={{width: "50%"}}>
                            <text>Your waiting grant funds:</text>
                            <h1>{
                                this.state.availableBalance === undefined?
                                "$__.__"
                                :
                                "$" + this.state.availableBalance
                            }</h1>
                        </ListGroup.Item>
                        <ListGroup.Item style={{width: "50%"}}>
                            {this.state.showVerified?
                                <button className ="btn btn-primary btn-block btn-lg" style={{width: "100%", height: "100%", margin: "0px",
                            size: "lg"}} onClick={this.stripeOnboarding}>{this.state.buttonMessage}</button>
                            :
                                <WithdrawButton buttonText="Claim Your Funds" buttonStyle={{width: "100%", height: "100%", margin: "0px",
                            size: "lg"}}/>
                            }
                        </ListGroup.Item>
                    </ListGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            this.state.availableBalance === undefined ?
                                <text style={{color: "red"}}>Sorry, we had trouble retrieving your information</text>
                            :
                            (this.state.availableBalance == 0 ?
                                <text style={{color: "red"}}>Your balance is zero. Try applying to more grants</text>
                            :
                                <text></text>
                            )
                        }
                    </Col>
                </Row>

                <Card.Text/>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "0px"}}>
                    <ListGroup horizontal width="100%">
                        <ListGroup.Item style={{width: "50%"}}>
                            <text>Applications Pending:</text>
                            <h1>
                            {
                                this.state.hugs === undefined ? 0
                                :
                                this.state.hugs.length
                            }
                            </h1>
                        </ListGroup.Item>
                        <ListGroup.Item style={{width: "50%"}}>
                            <Button size="lg" block style={{height: "100%"}} href="/hugbrowser">Apply For Grants</Button>
                        </ListGroup.Item>
                    </ListGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            this.state.hugs === undefined || this.state.hugs.length === 0 ?
                                <text style={{color: "red"}}>Click the button to apply for grant funds</text>
                            :
                                null
                        }
                    </Col>
                </Row>

                <Card.Text/>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "0px"}}>
                        <Card.Title>My Applications</Card.Title>

                        {/* Recipient's table of applied-to HUGs */}
                        <ReactTable
                                data={this.state.hugs}
                                columns={[
                                    {
                                        headerClassName: "apply-table-thead",
                                        Header: "Name",
                                        accessor: "HUGName",
                                        style: { whiteSpace: "unset" }
                                    },
                                    {
                                        headerClassName: "apply-table-thead",
                                        Header: "Award",
                                        accessor: "Balance",
                                        style: { whiteSpace: "unset" }
                                    },
                                    {
                                        headerClassName: "apply-table-thead",
                                        Header: "Status",
                                        accessor: "Status",
                                        style: { whiteSpace: "unset" }
                                    }
                                ]}
                                showPageSizeOptions={false}
                                defaultPageSize={5}
                            />
                    </Col>
                </Row>
                {/* <ButtonGroup vertical style={{width:"100%"}}>
                    <Button size="lg" block>Claim My Grants</Button>
                    <Button size="lg" block>View All Applications</Button>
                </ButtonGroup> */}


            </Card.Body>

        </Card>
        )
    }

    getAccountsCard() {
        return (
            <Card style={{margin: "2px", marginBottom: "4px"}}>
                <Card.Body>
                    <Card.Title>My Accounts</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        Review your banking information here
                    </Card.Subtitle>
                    <ReactTable
                                data={[]}
                                columns={[
                                    {
                                        headerClassName: "apply-table-thead",
                                        Header: "Sample Column",
                                        accessor: "something",
                                        style: { whiteSpace: "unset" }
                                    }
                                ]}
                                defaultPageSize={5}
                                showPagination={false}
                            />
                    <Button block>Add Bank Account</Button>
                </Card.Body>
            </Card>
            )
    }

    getApplicationCard() {
        return (
            <Card style={{margin: "2px", marginBottom: "4px"}}>
                <Card.Body>
                    <Card.Title>My Application</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        Please make sure your personal and medical information is up to date
                    </Card.Subtitle>
                    <h2>This section is under construction. We appreciate your patience</h2>
                </Card.Body>
            </Card>
            )
    }

    // -----------------------------------------------------------------------------------------------//
    // Below here is the code for generating the donor's dashboard //
    // -----------------------------------------------------------------------------------------------//

    getDonorDash() {
        return (
        <Container style={{margin: "0px", maxWidth:"4000px"}}>
            {/* <text>This is a recipient dashboard</text> */}
            <Row >

                <Col style={{padding: "0px"}}>
                    {this.getDonorActionCard({})}
                </Col>

    {/*            <Col style={{padding: "0px"}}>
                    {this.getDonationsCard()}
                    {this.getMyGrantsCard()}
                </Col>
    */}
            </Row>

        </Container>
        )
    }


    getDonorActionCard() {
        return (
        <Card style={{margin: "2px", marginBottom: "4px"}}>
            <Card.Body>
                <h3>{this.getGreeting()}</h3>
                <Card.Subtitle className="mb-2 text-muted">
                    You can find important information here at a glance
                </Card.Subtitle>

                <Card.Text/>

                {/* This Section generates the Acount Balance Box */}
    {/*            <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                    <h4>My Account</h4>
                    <ListGroup horizontal width="100%">
                        <ListGroup.Item style={{width: "50%"}}>
                            <text>Your account balance:</text>
                            <h1>{
                                this.state.availableBalance === undefined?
                                "$__.__"
                                :
                                "$" + this.state.availableBalance
                            }</h1>
                        </ListGroup.Item>
                        <ListGroup.Item style={{width: "50%"}}>
                            {/* <Button size="lg" block style={{height: "100%"}}>Donate Now</Button> }
                            <DepositButton buttonText="Deposit Now" buttonStyle={{width: "100%", height: "100%", margin: "0px",
                            size: "lg"}}/>
                        </ListGroup.Item>
                    </ListGroup>
                    </Col>
                </Row>
                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <Button block size="lg" href="/hugbrowser">Donate To Grants</Button>
                    </Col>
                </Row>
    */}
                {/* Show a helpfull message based on the user's account balance */}
    {/*            <Row>
                    <Col>
                        {
                            this.state.availableBalance === undefined ?
                                <text style={{color: "red"}}>Sorry, we had trouble retrieving your information</text>
                            :
                            (this.state.availableBalance == 0 ?
                                <text style={{color: "red"}}>You must deposit to your balance before donating to grants</text>
                            :
                                <text></text>
                            )
                        }

                    </Col>
                </Row>
    */}
                <Card.Text/>

                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                    <h4>Request Application</h4>

                    {/* Donor's table of owned HUGs and their applicants
                    (probably in a list pop-up accessed with a button in the applicants
                    column) */}
                    <ReactTable
                        data={this.state.requests}
                        columns={[
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Name",
                                accessor: "fullName",
                                style: { whiteSpace: "unset" }
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Request Amount",
                                accessor: "desiredAmount",
                                style: { whiteSpace: "unset" },
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "COVID-19 Status",
                                accessor: "covid",
                                style: { whiteSpace: "unset" },
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Reason",
                                accessor: "story",
                                style: { whiteSpace: "unset" },
                                show: false
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Monthly Income",
                                accessor: "monthly_income",
                                style: { whiteSpace: "unset" }
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Download1",
                                accessor: "file1",
                                style: { whiteSpace: "unset" },
                                show: false
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Download2",
                                accessor: "file2",
                                style: { whiteSpace: "unset" },
                                show: false
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Download3",
                                accessor: "file3",
                                style: { whiteSpace: "unset" },
                                show: false
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "HUGID",
                                accessor: "HUGID",
                                style: { whiteSpace: "unset" },
                                show: false
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "ID",
                                accessor: "recipientID",
                                style: { whiteSpace: "unset" },
                                show: false
                            },
                            {
                                headerClassName: "apply-table-thead",
                                Header: "Share",
                                accessor: "share",
                                style: { whiteSpace: "unset" },
                                show: false
                            }
                        ]}
                        getTrGroupProps={(state, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                              return {
                                onClick: (e) => {
                                  // Unselect
                                  if(this.state.display_remove && rowInfo.index === this.state.index){
                                    this.setState({
                                      display_remove:false,
                                      index:-1,
                                      covid: "",
                                      share:"",
                                      selected_requestName:"",
                                      requestAmount: 0,
                                      monthlyIncome: "",
                                      story: "",
                                      downloadDoc1: "",
                                      downloadDoc2: "",
                                      downloadDoc3: "",
                                      HUGID: -1,
                                      recipientID: ""
                                    });
                                  } else if(this.state.display_remove && rowInfo.index !== this.state.index){
                                      // Clicked on new row
                                      this.setState({
                                        index:rowInfo.index,
                                        covid: rowInfo.row.covid,
                                        share: rowInfo.row.share,
                                        selected_requestName:rowInfo.row.fullName,
                                        requestAmount: rowInfo.row.desiredAmount,
                                        story: rowInfo.row.story,
                                        monthlyIncome: rowInfo.row.monthly_income,
                                        downloadDoc1:rowInfo.row.file1,
                                        downloadDoc2:rowInfo.row.file2,
                                        downloadDoc3:rowInfo.row.file3,
                                        HUGID:rowInfo.row.HUGID,
                                        recipientID: rowInfo.row.recipientID
                                      });
                                  } else {
                                    this.setState({
                                      // First time click
                                      display_remove:true,
                                      index:rowInfo.index,
                                      covid: rowInfo.row.covid,
                                      share: rowInfo.row.share,
                                      selected_requestName:rowInfo.row.fullName,
                                      requestAmount: rowInfo.row.desiredAmount,
                                      story: rowInfo.row.story,
                                      monthlyIncome: rowInfo.row.monthly_income,
                                      downloadDoc1:rowInfo.row.file1,
                                      downloadDoc2:rowInfo.row.file2,
                                      downloadDoc3:rowInfo.row.file3,
                                      HUGID:rowInfo.row.HUGID,
                                      recipientID: rowInfo.row.recipientID

                                    });
                                  }
                                  console.log(rowInfo.row.requestAmount);
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
                        defaultPageSize={5}
                        showPageSizeOptions={false}
                    />
                    </Col>
                </Row>
                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <Button block size="lg" onClick={this.openModal}>View Applicants</Button>
                        <ViewApplicants
                        open={this.state.open}
                        covid={this.state.covid}
                        share={this.state.share}
                        selected_requestName={this.state.selected_requestName}
                        requestAmount = {this.state.requestAmount}
                        story = {this.state.story}
                        monthlyIncome= {this.state.monthlyIncome}
                        downloadDoc1={this.state.downloadDoc1}
                        downloadDoc2={this.state.downloadDoc2}
                        downloadDoc3={this.state.downloadDoc3}
                        HUGID= {this.state.HUGID}
                        recipientID={this.state.recipientID}
                        closeModal={this.closeModal}
                        removeApplicant={this.removeApplicant}
                        rejectApplicant = {this.rejectApplicant}
                        awardHUG = {this.awardHUG}


                         />
                    </Col>
                </Row>
{/*                <Row style={{width: "100%", margin: "0px"}}>
                    <Col style={{padding: "5px"}}>
                        <Button block size="lg" href="/createhug">Start Grant</Button>
                    </Col>
                </Row>
*/}
            </Card.Body>
        </Card>
        )
    }

    getDonationsCard(elements) {
        return (
            <Card style={{margin: "2px", marginBottom: "4px"}}>
            <Card.Body>
                <Card.Title>Recent Transactions</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    View your most recent donations and withdrawls
                </Card.Subtitle>

                <Card.Text>Here is a short list of your most recent transactions</Card.Text>
                <ReactTable
                    data={[]}
                    columns={[
                        {
                            headerClassName: "apply-table-thead",
                            Header: "Sample Column",
                            accessor: "something",
                            style: { whiteSpace: "unset" }
                        }
                    ]}
                    defaultPageSize={3}
                    showPagination={false}
                />
                <Card.Text>
                    Here is a button promting the user to go to the transactions page
                    for more information
                </Card.Text>

            </Card.Body>
        </Card>
        )
    }

    getMyGrantsCard() {
        return (
            <Card style={{margin: "2px", marginBottom: "4px"}}>
            <Card.Body>
                <Card.Title>My Grants</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    Here you can see a list of all your active grants
                </Card.Subtitle>

                <Card.Text>
                    Clicking on a grant will take you to its page
                </Card.Text>

                <ReactTable
                    data={[]}
                    columns={[
                        {
                            headerClassName: "apply-table-thead",
                            Header: "Sample Column",
                            accessor: "something",
                            style: { whiteSpace: "unset" }
                        }
                    ]}
                    defaultPageSize={6}
                    showPagination={false}
                />

            </Card.Body>
        </Card>
        )
    }

    // -----------------------------------------------------------------------------------------------//
    // Below here is the code for universal utility functions //
    // -----------------------------------------------------------------------------------------------//

    notificationsCard() {
        return (
            <Card style={{width : '18rem'}}>
                <Card.Body>
                    <Card.Title>{this.getGreeting()}</Card.Title>
                </Card.Body>
            </Card>
        )
    }

    getGreeting() {
        return typeof this.state.firstName === 'undefined' ?
                `Welcome ${this.state.userName}`
            :
                `Welcome ${this.state.firstName}`
    }

}



export default Dashboard;
