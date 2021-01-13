import React, { Component } from "react";
import swal from "sweetalert";
import axios from 'axios';

import {AffordableClient} from "affordable-client";
import "./scss/application.scss";

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

class Application extends Component {
    constructor(props) {
        super(props);
        this.client = new AffordableClient();
        this.state = {
            client: this.props.client,
          email:this.props.email,
          firstName:this.props.firstName === undefined? "" : this.props.firstName,
          lastName:this.props.lastName === undefined? "" : this.props.lastName,
          covid: "",
          monthly:"",
          amount:0,
          HugId:[],
          hugList:[],
          file1: null,
          file2: null,
          file3: null,
          timeStamp:[],
          story: "", 
          text: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFileChange1 = this.handleFileChange1.bind(this);
        this.handleFileChange2 = this.handleFileChange2.bind(this);
        this.handleFileChange3 = this.handleFileChange3.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.sendApplication = this.sendApplication.bind(this);
        this.addApplication = this.addApplication.bind(this);
        this.upload = this.upload.bind(this);

    }

    handleChange = key => {
        return event => {
        this.setState({ [key]: event.target.value });
        };
    }
    
    handleFileChange1(event) {
        this.setState({ file1: event.target.files[0] });
    }

    handleFileChange2(event) {
        this.setState({ file2: event.target.files[0] });
    }
    
    handleFileChange3(event) {
        this.setState({ file3: event.target.files[0] });
    }
    
    handleChecked(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

    async upload(){
        const formData = new FormData();
        let files= new Array();

        files.push(this.state.file1);
        files.push(this.state.file2);
        files.push(this.state.file3);
        console.log(files, files.length);

        var i=0;
        var fileCount=0;
        var ts;
        this.setState({ timeStamp: []});
        for(i=0; i<files.length; i++){
            if(files[i]!=null){
                fileCount++;
                formData.append("file", files[i]);
                
                ts=new Date().getTime().toString()
                console.log(this.props.userName+"-"+i+"-"+ts+"-"+files[i].name)
                this.state.timeStamp.push(this.props.userName+"-"+i+"-"+ts+"-"+files[i].name);
                formData.append("file"+i, ""+this.props.userName+"-"+i+"-"+ts+"-"+files[i].name); 
            }
        }
        formData.append("fileCount", fileCount);

        var json = await this.client.fileUpload(formData);
        console.log(json);
        // try {
        //    const response= await axios.post(process.env.REACT_APP_AF_BACKEND_URL + "/file/upload",formData, {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //           },
           
        //     });
        //     if (!response.ok) {
        //         throw Error(response.statusText);
        //     }   
        //     const json = await response.json();
        //     console.log(json)

        // } catch (error) {
        //   console.log(error);
        // }

    }
    
    addApplication = async () => {
        var files = [];
        for(var i=0; i<3; i++){
            if(this.state.timeStamp[i] !== undefined){
                files.push(this.state.timeStamp[i]);
            } else {
                files.push(null);
            }
        }
        var app = this.client.addApplication(this.props.userName, this.state.covid, this.state.monthly
            , this.state.amount, this.state.firstName +" "+ this.state.lastName
            , this.state.text, files[0], files[1], files[2], this.state.story);
    }

    sendApplication = async () => {
        //Have they filled out everything
        var fullName = this.state.firstName === "" || this.state.lastName === "";
        var amount = this.state.amount === 0;
        var covid = this.state.covid === "";
        var monthly = this.state.monthly === "";
        var share = this.state.story === "";
        var text = this.state.text === "";
        var strAmount = this.state.amount.toString().match("^[0-9]+([.][0-9]{0,2})?$") === null ;

        if(fullName || amount || covid || monthly|| share || text ||strAmount){
            swal(
                "Error",
                "You have not filled out all elements marked with an *.",
                "error"
              );
        } else {
            //Add to application table
            this.upload();
            this.addApplication();

            //Add to legal name

            swal(
                "Success!",
                "Your application has been sent.",
                "success"
            ).then(async (value) =>{
                this.setState({
                    amount:0,
                    text:""
                });
                document.getElementById('subject').value = "";
                });
        }
    }

    render () {
        return (
            <div className="col">
            <div className="row mt-5">
                <div className="col">
                 
                    <FormGroup
                        labelName="Email Address*"
                        value={this.state.email}
                    />
                    <FormGroup
                        labelName="First Name*"
                        value={this.state.firstName}
                        handleChange={this.handleChange("firstName")}
                    />

                    <FormGroup
                        labelName="Last Name*"
                        value={this.state.lastName}
                        handleChange={this.handleChange("lastName")}
                    />

                    <div className="form-group row">
                        <div className="col-1" />
                            <label  className="col-2" for="reason">Have you tested positive for Covid-19?*</label>
                        <div className="col-8">
                            <label className="col-3 col-form-label">Yes
                            <input name="covid" id="filter" value="yes" type="radio" onClick={this.handleChecked} />

                            </label>

                            <label className="col-3 col-form-label">No
                            <input name="covid" id="filter" value="no" type="radio" onClick={this.handleChecked} />

                            </label>

                            <label className="col-3 col-form-label">Maybe
                            <input name="covid" id="filter" value="maybe" type="radio" onClick={this.handleChecked} />

                            </label>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col-1" />
                            <label  className="col-2 col-form-label" for="reason">What is your monthly income?* </label>
                        <div className="col-8">
                            <label className="col-4 col-form-label">{">"}$5000
                            <input name="monthly" id="filter" value="5000" type="radio" onClick={this.handleChecked} />
                            </label>
                            
                            <label className="col-4 col-form-label">$3000-$5000
                            <input name="monthly" id="filter" value="3000-5000" type="radio" onClick={this.handleChecked} />
                            </label>
                            <br></br>
                            <label className="col-4 col-form-label">$2000-$3000
                            <input name="monthly" id="filter" value="2000-3000" type="radio" onClick={this.handleChecked} />
                            </label>

                            <label className="col-4 col-form-label">$1000-$2000
                            <input name="monthly" id="filter" value="1000-2000" type="radio" onClick={this.handleChecked} />
                            </label>
                            <br></br>
                            <label className="col-4 col-form-label">$0-$1000 
                            <input name="monthly" id="filter" value="1000" type="radio" onClick={this.handleChecked} />
                            </label>

                        </div>
                    </div>

                    <FormGroup
                        labelName="Desired Amount*"
                        value={this.state.amount}
                        handleChange={this.handleChange("amount")}
                    />

                    <div className="form-group row">
                        <div className="col-1" />
                        <label  className="col " for="reason">
                            Would you be willing to share your story? 
                            We will use this information to promote fundraising efforts for you and others in this program. 
                        </label>
                        <div className="col-1" />                        
                    </div>
                    <div className="form-group row">
                    <div className="col-1" />
                    <div className="col-2" />
                        <div className="col-8">
                            <label className="col-3 col-form-label">Yes
                            <input name="story" id="filter" value="yes" type="radio" onClick={this.handleChecked} />
                            </label>

                            <label className="col-3 col-form-label">No
                            <input name="story" id="filter" value="no" type="radio" onClick={this.handleChecked} />
                            </label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-1" />
                        <label  className="col-2" for="reason">
                            Please explain your situation and how you intend to use this financial aid*.
                        </label>
                        <div className="col-8">
                            <textarea id="subject" name="text" onChange={this.handleChange("text")}>
                            </textarea>
                        </div>
                        <div className="col-1" />
                   </div>

                   <div className="form-group row">
                        <div className="col-1" />
                        {/* <div className="col-2">
                            <button className="submit-button" onClick={this.sendApplication}>Add Files</button> 
                        </div> */}
                        <div className="col-8">
                         <p>Please upload an image of a photo ID.</p> 
                         <p>Please provide evidence of COVID-19 screening. This can be a diagnosis, lab test, screen from online portal from a medical provider, etc. Ensure that the image has your name to confirm your identity with the forms.</p>  
                        <p>Please upload an image your medical bill. This can be an insurance deductible, copayment, hospital stay, medication, lab tests, imaging, etc.</p>
                        <input 
                            type="file"
                            onChange={this.handleFileChange1}
                         />
                           <input 
                            type="file"
                            onChange={this.handleFileChange2}
                           />
                           <input 
                            type="file"
                            onChange={this.handleFileChange3}
                           />

                        </div>
                        <div className="col-1" />
                   </div>
                    
                    
                    <div className="form-group row">
                        <div className="col-6" />
                            <button className="submit-button" onClick={this.sendApplication}>
                            {" "}
                            Send Application{" "}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Application;
