import React, { Component } from "react";
import ReactTable from "react-table";

import CollapseWithHeader from "../../../components/CollapseWithHeader";
import AddBankAccountButton from "../../../components/Modal/AddBankAccountButton";
import AddCreditDebitButton from "../../../components/Modal/AddCreditDebitButton";
import AddBankAccountTest from "../../../components/Modal/AddBankAccountTest";

import {UserType} from "affordable-shared-models";
import {AffordableClient} from "affordable-client";

import "./scss/settings.scss";
import "./scss/bankingInfoTab.scss";
import "../../../styles/apply-table.css";
import "../../../styles/buttons.css";
import "../../../styles/collapse-with-header.css";
import { AffordableAdminClient } from "affordable-client";

const path = (window.REACT_APP_AF_BACKEND_URL || process.env.REACT_APP_AF_BACKEND_URL) +"/";


class AdditionPaymentPannel extends Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  render() {
    return (
      <div className="sidebyside-buttons">
        {/*Donor vs recipient buttons on bottom*/}
        {
          this.props.usertype === UserType.DONOR ?
            <div className="sidebyside-buttons">
              <div className="float-right">
                <AddBankAccountButton  />
              </div>
              <div className="float-right">
                <AddCreditDebitButton />
              </div>
            </div>
            :
            <div className="float-right">
              {/* <AddBankAccountButton /> */}
              <AddBankAccountTest/>
            </div>
        }
      </div>
    );
  }
}

class BankingInfoTab extends Component {
  constructor(props) {
    super(props);

    this.client = new AffordableClient();
    this.state = {
      user: this.props.user,
      usertype: this.props.usertype,
      display_remove: false,
      index: -1,
      payments: [],
      remove_payment:{}
    }
    this.addToTable = this.addToTable.bind(this);
    this.deleteFromTable = this.deleteFromTable.bind(this);
    
    this.getCards();
    this.getBanks();
    this.getConnectedBanks();
  }

  async componentDidMount() {
    var time = 5000;
    //update every 5 secs   
    this.checkAll = setInterval(() => this.syncAll(), time);

  }

  componentWillUnmount() {
    //stop updating
    clearInterval(this.checkAll);
  }

  syncAll(){
    this.getCards();
    this.getBanks();
    this.getConnectedBanks();
  }
  
  checkDuplicates (cur, newer){
    var type = newer[0]["type"];
    
    // Get all those with that type
    var list = cur.filter((val, index)=>{
      return val["type"] === type;
    });

    // Remove duplicates
    var result = newer.filter(
      function(val){
        return list.every(
          function(obj){
            return obj["date"] !== val["date"] 
          }
        )
      }
    );

    return result;
  }

  // Add items to table
  addToTable(name,type) {
    var updatedPayments = this.state.payments;
    
    var obj = {
      accountType: type,
      accountName: name
    };
    
    var included = updatedPayments.some(
      function(val){
        return val["accountType"] === obj["accountType"] && val["accountName"] === obj["accountName"]
      }
    );
    if(!included){
      updatedPayments.push(obj);
    }
    
    this.setState({
      payments: updatedPayments
    });
  }

  deleteFromTable(){
    var type = this.state.remove_payment.type;
    var name = this.state.remove_payment.name;
    
    // Remove from tables
    if(type === 'Credit' || type === 'Debit'){
      // Remove from cards
      this.removeCard();
    } else {
      // Remove from bankAccount
      this.removeBank();
    }
  }

  successfulDelete(){
    // Remove from payment state
    var index = this.state.index;
    var item = this.state.payments[index];
    var updatedPayments = this.state.payments.filter(
      function(val, index){
        return item !== val;
      }
    );

    this.setState({
      payments: updatedPayments,
      display_remove: false,
      index:-1
    });
  }

  getCards = async (e) => {
    var json = await this.client.getPaymentMethod(this.state.user, true, false);
    if (json.success === "Cards Found") {
      for(let i = 0; i < json.cardList.length; i++){
        var name = json.cardList[i].cardName;
        var type = json.cardList[i].cardType;
        this.addToTable(name,type);
      }  
    }
  }

  getBanks = async (e) => {
    var json = await this.client.getPaymentMethod(this.state.user, false, false);
    if (json.success === "Bank Account Found") {
      for(let i = 0; i < json.bankList.length; i++){
        var name = json.bankList[i].bankName;
        var type = json.bankList[i].bankType;
        this.addToTable(name,type);
      } 
    }
  }

  getConnectedBanks = async (e) => {
    var json = await this.client.getPaymentMethod(this.state.user, false, true);
    if (json.success === "Bank Account Found") {
      for(let i = 0; i < json.bankList.length; i++){
        var name = json.bankList[i].bankName;
        var type = json.bankList[i].bankType;
        this.addToTable(name,type);
      } 
    }
  }

  removeCard = async (e) => {
    var type = this.state.remove_payment.type;
    var name = this.state.remove_payment.name;

    var json = await this.client.removePaymentMethod(this.state.user, type, name,this.state.usertype);
    console.log(json);
    this.successfulDelete();
  }

  removeBank = async (e) => {
    var name = this.state.remove_payment.name;

    var json = await this.client.removePaymentMethod(this.state.user, 'Bank', name, this.state.usertype);
    console.log(json);
    this.successfulDelete();
  }

  render() {
    return (
      <div>
        <CollapseWithHeader title="Banking" open={true}>
          <ReactTable
            data={this.state.payments}
            columns={[
              {
                headerClassName: "apply-table-thead",
                Header: "Account Type",
                accessor: "accountType",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                Header: "Account Name",
                accessor: "accountName",
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
                      this.setState({
                        display_remove:false,
                        index:-1,
                        remove_payment:{}
                      })
                    } else if(this.state.display_remove && rowInfo.index !== this.state.index){
                        // Clicked on new row
                        this.setState({
                          index:rowInfo.index,
                          remove_payment:{name:rowInfo.row.accountName, type:rowInfo.row.accountType}
                        })
                    } else {
                      this.setState({
                        // First time click
                        display_remove:true,
                        index:rowInfo.index,
                        remove_payment:{name:rowInfo.row.accountName, type:rowInfo.row.accountType}
                      })
                    }
                  }, style:{
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
        {
          this.state.display_remove ?
          <div className="float-right">
            <button className="submit-button" onClick={this.deleteFromTable}>
              Remove
            </button>
          </div>
          :
          <AdditionPaymentPannel usertype={this.state.usertype} />
        }
      </div>
    );
  }
}

export default BankingInfoTab;