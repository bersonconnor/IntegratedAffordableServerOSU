import React, { Component } from "react";
import ReactTable from 'react-table';
import CollapseWithHeader from '../../../../components/CollapseWithHeader';
import "../../../../styles/buttons.css";
import './scss/fundraising.scss';
import 'react-table/react-table.css'


const FormGroup = ({ labelName, value, handleChange }) => {
    return (
        <div className="form-group row">
            <div className="col-1" />
            <label htmlFor={labelName.replace(/\s+/g, '-')} className="col-2 col-form-label">{labelName}</label>
            <div className="col-8">
                <input type="text" className="form-control" id={labelName.replace(/\s+/g, '-')} value={value} onChange={handleChange} />
            </div>
            <div className="col-1" />
        </div>
    );
}

class Fundraising extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateStart: '',              // the date fundraising begins
            fundraisingOptions:'',      // How they will fundraise
            hugDistribution:'',         // How the HUG will be destroyed
            dateEnd: '',                // the date fundraising ends
            numberSupported: '',        // How many people can receive the HUG
            fundingPerPerson: '',       // How much money each person receives
            hugDistributionTwo: '',     // Another field named Hug distribution
            totalHugBudget:'',          // The total amount to be raised
            paymentMethod:''            // How payments will be sent
        };

        this.handleChange = this.handleChange.bind(this);
    }


    /*Handle Event Functions*/
    handleChange = (key) => {
        return (event) => {
            this.setState({ [key]: event.target.value });
        };
    };


    handleSubmit = e => {
        e.preventDefault();
    };

      componentDidMount() {
          if (!window.location.hash) {
              //setting window location
              window.location = window.location + '#loaded';
              //using reload() method to reload web page
              // window.location.reload();
          }
      }

      render() {
        if (this.props.currentStep !== 4) { // Prop: The current step
            return null
          }
            return (
              <div className="col">
              <div className="col-8">
                </div>
                <div className="row mt-5">
                  <div className="col">

                    <div className="form-group row">
                      <div className="col-1" />
                      <label htmlFor="Active Dates" className="col-2 col-form-label">Active Dates</label>
                      <div className="col-3">
                        <input id="dateStart" className="form-control" value={this.state.dateStart} placeholder="MM/DD/YYYY" onChange={this.handleChange('dateStart')} />
                      </div>-
                      <div className="col-3">
                        <input id="dateEnd" className="form-control" value={this.state.dateEnd} placeholder="MM/DD/YYYY" onChange={this.handleChange('dateEnd')} />
                      </div>
                    </div>

                    <FormGroup labelName="Fundraising Options" value={this.state.fundraisingOptions} placeholder="select..."  handleChange={this.handleChange('fundraisingOptions')} />
                    <FormGroup labelName="HUG Distribution Timeline" value={this.state.hugDistribution} placeholder="select..." handleChange={this.handleChange('hugDistribution')}/>
                    <FormGroup labelName="Funding Per Person" value={this.state.fundingPerPerson} placeholder="min $100,000" handleChange={this.handleChange('fundingPerPerson')} />
                      <FormGroup labelName="Number Supported " value={this.state.numberSupported} placeholder="min 1" handleChange={this.handleChange('numberSupported')} />

                    <FormGroup labelName="Total HUG Budget" value={this.state.totalHugBudget} placeholder="min $105,000" handleChange={this.handleChange('totalHugBudget')} />
                    <FormGroup labelName="HUG Distribution" value={this.state.hugDistributionTwo} handleChange={this.handleChange('hugDistributionTwo')} />

                    <FormGroup labelName="Sponsor Contribution" value={this.state.sponsorContribution} placeholder="min $10,000" handleChange={this.handleChange('sponsorContribution')} />
                    <FormGroup labelName="Payment Method" value={this.state.paymentMethod} placeholder="select..." handleChange={this.handleChange('paymentMethod')} />
                    <div className="form-group row">
                    <div className="col-2" />
                      Bank Info
                    </div>

                    <FormGroup labelName="Send From" value={this.state.sendFrom} placeholder="linked bank account"  handleChange={this.handleChange('sendFrom')} />
                    <FormGroup labelName="Send On" value={this.state.sendOn} placeholder="MM/DD/YYYY" handleChange={this.handleChange('sendOn')} />
                    <FormGroup labelName="Frequency" value={this.state.frequency} placeholder="select..." handleChange={this.handleChange('frequency')} />
                    <div className="form-group row">
                    <div className="col-2" />
                      Credit/Debit Card
                    </div>
                    <FormGroup labelName="Name on Card" value={this.state.nameOnCard} handleChange={this.handleChange('nameOnCard')} />
                    <FormGroup labelName="Card Type" value={this.state.cardType} handleChange={this.handleChange('cardType')} />
                    <FormGroup labelName="Card Number" value={this.state.cardNumber} handleChange={this.handleChange('cardNumber')} />
                    <FormGroup labelName="Expiration Date" value={this.state.expirationDate} handleChange={this.handleChange('expirationDate')} />
                    <FormGroup labelName="CCV Security Code" value={this.state.ccvSecurityCode} handleChange={this.handleChange('ccvSecurityCode')} />
                    <div className="form-group row">
                      <div className="col-1" />
                      <label htmlFor="saveCreditCard" className="col-2 col-form-label" />
                      <div className="col-8">
                        <ul>
                          <li>
                            <label>
                              <input
                                type="radio"
                                value="saveCreditCard"
                                checked={this.state.saveCreditCard === "saveCreditCard"}
                                onChange={this.handleChange("saveCreditCard")}
                              />
                              Save Credit Card Information
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div className="col-1" />
                    </div>
                    <div className="form-group row">
                    <div className="col-2" />
                      Billing Info
                    </div>
                    <div className="form-group row">
                      <div className="col-1" />
                      <label htmlFor="sameAsAccount" className="col-2 col-form-label" />
                      <div className="col-8">
                        <ul>
                          <li>
                            <label>
                              <input
                                type="radio"
                                value="sameAsAccount"
                                checked={this.state.sameAsAccount === "sameAsAccount"}
                                onChange={this.handleChange("sameAsAccount")}
                              />
                              Same as listed on account information
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div className="col-1" />
                    </div>
                    <FormGroup
                      labelName="Address Line 1"
                      value={this.state.addressLine1}
                      handleChange={this.handleChange("addressLine1")}
                    />
                    <FormGroup
                      labelName="Address Line 2"
                      value={this.state.addressLine2}
                      handleChange={this.handleChange("addressLine2")}
                    />
                    <FormGroup
                      labelName="City"
                      value={this.state.city}
                      handleChange={this.handleChange("city")}
                    />

                    <div className="form-group row">
                      <div className="col-1" />

                      <label htmlFor="State" className="col-2 col-form-label">
                        State
                      </label>
                      <div className="col">
                        <select
                          id="State"
                          placeholder="Select State..."
                          value={this.state.state}
                          className="form-control"
                          onChange={this.handleChange("state")}
                        >
                          <option value="" disabled selected>
                            Select State...
                          </option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="DC">District Of Columbia</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                      </div>

                      <label htmlFor="Zip" className="col-1 col-form-label">
                        Zip
                      </label>
                      <div className="col">
                        <input
                          id="Zip"
                          className="form-control"
                          type="zip"
                          value={this.state.zip}
                          onChange={this.handleChange("zip")}
                        />
                      </div>
                      <div className="col-1" />
                    </div>

                    </div>

                  </div>
                  <div className="form-group row">
                      <div className="col-2" />
                      <input type="submit" onClick={this.props.previousFunction} value="Previous" className="submit-button"/>
                      <div className="col-6" />
                      <input type="submit" id="createHug" onClick={()=>{this.props.submitFunction(this.state)}} value="Submit"  className="submit-button"/>
                  </div>

              </div>
            );
          }
        }
export default Fundraising;
