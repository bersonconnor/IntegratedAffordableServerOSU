import React, { Component} from "react";

import Popup from "reactjs-popup";

import "../../../components/Modal/scss/modal.scss";
import "../../../styles/buttons.css";

class ComfirmHUGCreation extends Component {

    REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

    constructor(props) {
        super(props);

        this.closeModal = this.closeModal.bind(this);
    }

    closeModal(){
        this.props.closeModal();
    }

    render() {
        return (
            <div>
                <Popup
                    open={this.props.open}
                    closeOnDocumentClick={false}
                    onClose={this.closeModal}>
                    <div className="header">
                        <p>Your HUG has been successfully created!!</p>
                    </div>
                    <div className="action">

                        {/* Close the transaction modal*/}
                        <div className="floats-right">
                            <button
                                className="submit-button"
                                onClick={this.closeModal}>
                                Close
                       </button>
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
}


class InputField extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e){
        this.props.handleChange(e.target.value);
    }

    render(){
        const divPadding = {
            paddingTop: 10,
            paddingLeft: 30,
            paddingBottom: 10
          };

        return(
            <div className="form-group row">
                <div className="col-1" />
                <label
                    htmlFor={this.props.label}
                    className="col-2 col-form-label"
                > {this.props.label}
                </label>
                <div className="col-8">
                    <div style={divPadding}>
                        <input
                        type="text"
                        className="form-control"
                        id={this.props.label}
                        value={this.props.val}
                        onChange={this.handleChange}
                        style={{backgroundColor:this.props.fieldColor}}
                        />
                        {this.props.errorState ? <p>{this.props.errorMessage}</p> : <div></div>}
                    </div>

                </div>
                <div className="col-1" />
            </div>
        );
    }

}

//Please enter a valid amount above 0.


class CreateHUG extends Component{
    constructor(props) {
        super(props);
        this.state = {
          hugName: "",       // the name of the HUG
          hugDescription: "",
          hugTargetAmount: "",
          amountError: false,
          nameError: false,
          descriptionError: false,
          open: false,
          fieldColor1: '#FFFFFF',
          fieldColor2: '#FFFFFF',
          fieldColor3: '#FFFFFF',
          notIniqueName: false

        };

        this.handleChangeHugName = this.handleChangeHugName.bind(this);
        this.handleChangeTargetAmount = this.handleChangeTargetAmount.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    // Return all HUGs from the backend with
    // server/src/services/StripeService.ts getAllHUGs()
    getAllHUGs = async () => {
        try {
            const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/getAllHUGs", {
                method: "GET"
            });
            if (!response.ok) {
                // console.log("CreateHUG getAllHUGs() BAD RESPONSE:"); // DEBUG
                throw Error(response.statusText);

                return [];
            }
            const json = await response.json();
            if(json.success === "getAllHUGs()"){
                return json.HUGInfo;
            }
            // console.log("CreateHUG getAllHUGs() SUCCESS:"); // DEBUG
            // console.log(json)

            return json;
        } catch (error) {
            // console.log("CreateHUG getAllHUGs() ERROR:"); // DEBUG
            console.log(error);

            return [];
        }
    }

    // Check whether a HUG name is unique among all currently active HUGs
    // (Because we store all past HUGs in the db as of this writing, we don't
    // want dead HUGs to forever restrict the possible names of new HUGs --
    // we only want to make sure that no two ACTIVE (unawarded) HUGs don't have
    // the same name.)
    ActiveHUGNameUnique = async (newHUGName) => {
        const allHUGs = await this.getAllHUGs();

        for (const HUG of allHUGs) {
            // If there's a HUG with the same name as newHUGName,
            if (HUG.HUGName == newHUGName) {
                return false;
            }
        }
        return true;
    }

    handleChangeHugName(val){
        this.setState({hugName: val});
    }

    handleChangeTargetAmount(val){
        this.setState({ hugTargetAmount: val});
    }

    handleChangeDescription(val){
        this.setState({hugDescription: val});
    }

    async handleSubmit(){

        let amountStr = typeof this.state.hugTargetAmount === "number" ?
        this.state.hugTargetAmount.toString() :
        this.state.hugTargetAmount;

        let cond1 = this.state.hugName.length;
        let cond2 = this.state.hugDescription.length;
        let cond3 = amountStr.match("^[0-9]+([.][0-9]{0,2})?$") != null &&
        parseFloat(amountStr) > 0;
        console.log(amountStr);

        if(cond1 == 0){
            this.setState({
                nameError: true,
                fieldColor1: '#f36684'
            });
        }
        else{
            this.setState({
                nameError: false,
                fieldColor1: '#FFFFFF'
            });
        }
        if(cond2 == 0){
            this.setState({
                descriptionError: true,
                fieldColor3: '#f36684'
            });
        }
        else{
            this.setState({
                descriptionError: false,
                fieldColor3: '#FFFFFF'
            });
        }
        if(!cond3){
            this.setState({
                amountError: true,
                fieldColor2: '#f36684'
            });
        }
        else{
            this.setState({
                amountError: false,
                fieldColor2: '#FFFFFF'
            });
        }

        // Only proceed if the HUG name is unique among all currently active HUGs
        if (await this.ActiveHUGNameUnique(this.state.hugName) == false || this.state.hugName == "") {
            // Turn name input red and put error message in text nearby
            console.log("ActiveHUGNameUnique FAILURE"); // DEBUG
            this.setState({
                fieldColor1: '#f36684',
                nameError: true
            });
        }
        else {
            console.log("ActiveHUGNameUnique Success"); // DEBUG

            if(cond1 > 0 && cond2 > 0 && cond3){
                this.setState({
                    descriptionError: false,
                    nameError: false,
                    amountError: false,
                    fieldColor1: '#FFFFFF',
                    fieldColor2: '#FFFFFF',
                    fieldColor3: '#FFFFFF'
                });

                const data = new FormData();
                data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);
                data.append("hugName", this.state.hugName);
                data.append("description", this.state.hugDescription);
                data.append("desiredAmount", this.state.hugTargetAmount);

                try {
                    const response = await fetch(this.REACT_APP_AF_BACKEND_URL +"/stripe/makeHUG", {
                        method: "POST",
                        body: data
                    });
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }

                    this.setState({
                        open:true,
                        hugName: "",
                        hugDescription: "",
                        hugTargetAmount: "",
                        amountError: false,
                        nameError: false,
                        descriptionError: false,

                    });

                    console.log("Confirmed that HUG had been created")

                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    closeModal(){
        this.setState({open: false})
    }

    render() {
      return (
        <div className="row mt-5">
            <div className="col">

                <InputField
                 label="HUG Name"
                 val={this.state.hugName}
                 errorState={this.state.nameError}
                 errorMessage="Please enter a unique HUG name."
                 handleChange={this.handleChangeHugName}
                 fieldColor={this.state.fieldColor1}
                 />

                <InputField
                 label="Target Amount"
                 val={this.state.hugTargetAmount}
                 errorState={this.state.amountError}
                 errorMessage="Please enter a valid amount above 0."
                 handleChange={this.handleChangeTargetAmount}
                 fieldColor={this.state.fieldColor2}
                 />

                 <InputField
                 label="HUG Description"
                 val={this.state.hugDescription}
                 errorState={this.state.descriptionError}
                 errorMessage="Please enter a description of your HUG."
                 handleChange={this.handleChangeDescription}
                 fieldColor={this.state.fieldColor3}
                 />

                <div className="form-group row">
                    <div className="col-6" />
                    <button
                    className="submit-button"
                    onClick={this.handleSubmit}> Submit </button>
                </div>
                <ComfirmHUGCreation open={this.state.open} closeModal={this.closeModal}/>
            </div>
        </div>
      );
    }
}

export default CreateHUG;
