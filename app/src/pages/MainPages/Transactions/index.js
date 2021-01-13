import React, { Component } from "react";
import ReactTable from "react-table";
import { AffordableClient } from "affordable-client";
import CollapseWithHeader from "../../../components/CollapseWithHeader";
import WithdrawButton from "../../../components/Modal/WithdrawButton";

import "../Settings/scss/settings.scss";
import "./scss/transactions.scss";
import "../../../styles/buttons.css";

import { UserType } from "affordable-shared-models";

class WithdrawButtonPannel extends Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  render() {
    return (
      <div>
        {/*Donor vs recipient buttons on bottom*/}
        {
          this.props.usertype === UserType.DONOR ?
            <div className="text-right" align="right">
              <WithdrawButton addToTable={this.props.addToTable} usertype={this.props.usertype} />
            </div>
            :
            <div />
        }
      </div>
    );
  }
}

class FilterByPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usertype: this.props.usertype,
    };

    this.handleChecked = this.handleChecked.bind(this);
  }

  handleChecked(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    var add = {};

    switch (value) {
      case 'filterDeposit':
        add = { id: 'type', value: 'Deposit' };
        break;
      case 'filterDonate':
        add = { id: 'type', value: 'Donation' };
        break;
      case 'filterWithdraw':
        add = { id: 'type', value: 'Withdraw' };
        break;
      case 'filterAwarded':
        add = { id: 'type', value: 'Awarded' };
        break;
    };

    this.props.changeFilter(add);
  }

  render() {
    return (
      <div className="filterBy">
        <p>Filter By Type</p>
        {/*Donor vs recipient buttons on bottom*/}
        {this.props.usertype === UserType.DONOR ?
          <div className="filterBox">
            <label className="radioContainer">All
              <input name="filter" value="any" type="radio" defaultChecked onClick={this.handleChecked} />
              <span className="checkmark"></span>
            </label>
            <label className="radioContainer">Deposit
              <input name="filter" value="filterDeposit" type="radio" onClick={this.handleChecked} />
              <span className="checkmark"></span>
            </label>

            <label className="radioContainer">Donation
              <input name="filter" value="filterDonate" type="radio" onClick={this.handleChecked} />
              <span className="checkmark"></span>
            </label>

            <label className="radioContainer">Withdraw
              <input name="filter" value="filterWithdraw" type="radio" onClick={this.handleChecked} />
              <span className="checkmark"></span>
            </label>
          </div>

          : this.props.usertype === UserType.RECIPIENT ?
            <div className="filterBox">
              <label className="radioContainer">All
              <input name="filter" value="any" type="radio" defaultChecked onClick={this.handleChecked} />
                <span className="checkmark"></span>
              </label>
              <label className="radioContainer">Awarded
                <input name="filter" value="filterAwarded" type="radio" onClick={this.handleChecked} />
                <span className="checkmark"></span>
              </label>

              <label className="radioContainer">Withdraw
                <input name="filter" value="filterWithdraw" type="radio" onClick={this.handleChecked} />
                <span className="checkmark"></span>
              </label>
            </div>

            : <div />
        }
      </div>
    );
  }
}

class BalancePannel extends Component {
  constructor(props) {
    super(props);
    this.client = new AffordableClient();
    this.state = {
      client: AffordableClient,
      username: this.props.username,
      usertype: this.props.usertype,
      pendingBalance: 0,
      availableBalance: 0
    };
    this.getBalance();  
  }

  async componentDidMount() {
    //update balance every 5 secs   
    this.checkBalance = setInterval(() => this.getBalance(), 5000);
  }

  componentWillUnmount() {
    //stop updating balance when component unmounts
    clearInterval(this.checkBalance);
  }

  formatBalance(pending, available) {
    var p = pending.toLocaleString(undefined, { minimumFractionDigits: 2 });
    var a = available.toLocaleString(undefined, { minimumFractionDigits: 2 });
    this.setState({
      pendingBalance: p,
      availableBalance: a
    });
  }

  getBalance = async (e) => {
    var balance = await this.client.getBalance(this.state.username, this.state.usertype);
    if(balance.success === "Balance found"){
      this.formatBalance(balance.pendingBalance, balance.balance);
    }
  }

  render() {
    return (
      <div className="balance">
        <div className="pendingBalance">
          <p>Pending Balance</p>
          <div id="balance">
            <span>${this.state.pendingBalance}</span>
          </div>
        </div>
        <div className="availableBalance">
          <p>Available Balance</p>
          <div id="balance">
            <span>${this.state.availableBalance}</span>
          </div>
        </div>
      </div>
    );
  }
}

class Transactions extends Component {
  constructor(props) {
    super(props);

    this.client = new AffordableClient();
    this.state = {
      userID: this.props.userId,
      username: this.props.user,
      usertype: this.props.userType,
      transactions: [],
      filter: [], 
      show: false
    };

    this.addToTable = this.addToTable.bind(this);
    this.changeFilter = this.changeFilter.bind(this);

    if (this.state.usertype === UserType.DONOR) {
      this.getDonations();
      this.getCardDeposit();
      this.getBankDeposit();
    }
    if (this.state.usertype === UserType.RECIPIENT) {
      this.getAwarded();
    }

    if ("admin".localeCompare(this.state.username) === 0){
      console.log("Show")
      this.setState({show: true});
      this.getAdminAwarded();
    }
    this.getWithdraw();
    this.getBankWithdraw();
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

  syncAll() {
    if (this.state.usertype === UserType.DONOR) {
      this.getDonations();
      this.getCardDeposit();
      this.getBankDeposit();
    }
    if (this.state.usertype === UserType.RECIPIENT) {
      this.getAwarded();
    }
    if ("admin".localeCompare(this.state.userName) === 0){
      this.getAdminAwarded();
    }
    this.getWithdraw();
    this.getBankWithdraw();
  }

  getDonations = async (e) => {
    var json = await this.client.getDonations(this.state.username);
    if (json.success === "Donations found") {
      this.addToTable(json.donations);
    }
  }

  getAdminAwarded = async (e) => {
    var json = await this.client.getAdminAwarded();
    if (json.success === "Awarded found") {
      this.addToTable(json.awarded);
    }
  }

  getAwarded = async (e) => {
    var json = await this.client.getAwarded(this.state.username);
    if (json.success === "Awarded found") {
      this.addToTable(json.awarded);
    }
  }

  getCardDeposit = async (e) => {
    var json = await this.client.getDeposit(this.state.username, true);
    if (json.success === "Card Deposits found") {
      this.addToTable(json.deposit);
    }
  }

  getBankDeposit = async (e) => {
    var json = await this.client.getDeposit(this.state.username, false);
    if (json.success === "Bank Deposits found") {
      this.addToTable(json.deposit);
    }
  }

  getWithdraw = async (e) => {
    var json = await this.client.getWithdraw(this.state.username, this.state.usertype, true);
    if (json.success === "Withdrawals found") {
      this.addToTable(json.withdraw);
    }
  }

  getBankWithdraw = async (e) => {
    var json = await this.client.getWithdraw(this.state.username, this.state.usertype, false);
    if (json.success === "Withdrawals found") {
      this.addToTable(json.withdraw);
    }
  }

  formatTimestamp(item) {
    for (let i = 0; i < item.length; i++) {
      let splitting = item[i].date.split('T');
      let date = splitting[0];
      let time = splitting[1].split('.')[0];

      item[i].date = date + " " + time;
    }
  }

  formatAmount(item) {
    for (let i = 0; i < item.length; i++) {
      let amount = item[i].amount;
      let dollar = amount.toLocaleString(undefined, { minimumFractionDigits: 2 });;

      item[i].amount = "$" + dollar;
    }
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

  // Add items to transaction table
  addToTable(newTransactions) {
    var currentTransactions = this.state.transactions;

    // Formatting 
    this.formatTimestamp(newTransactions);
    this.formatAmount(newTransactions);

    // Removing duplicates
    newTransactions = this.checkDuplicates(currentTransactions, newTransactions);
    
    // Updating
    var updatedTransactions = newTransactions.concat(currentTransactions);
    this.setState({
      transactions: updatedTransactions
    });
  }

  changeFilter(item) {
    this.setState({
      filter: [item]
    });
  }

  render() {
    return (
      <div className="col">
        <div className="move-right">
          <div className="sectionBarStyle">
            <FilterByPannel usertype={this.state.usertype} changeFilter={this.changeFilter} />
            <BalancePannel username={this.state.username} usertype={this.state.usertype} />
            <div className="infoPanel">
              <div>INFORMATION</div>
              <p>
                Before attempting to commit a transaction, make sure to have a
                saved payment method in the Banking Information tab in the
                Settings page.
                </p>
            </div>
          </div>
        </div>
        <div className="bot-col">
          <CollapseWithHeader title="Transaction History" open={true}>
            {"admin".localeCompare(this.state.username) === 0? 
            <ReactTable
              data={this.state.transactions}
              columns={[
                {
                  headerClassName: "apply-table-thead",
                  Header: "Date",
                  accessor: "date",
                  style: { whiteSpace: "unset" }
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Type",
                  accessor: "type",
                  style: { whiteSpace: "unset" }
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Name",
                  accessor: "name",
                  style: { whiteSpace: "unset" },
                  show: true
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Amount",
                  accessor: "amount",
                  style: { whiteSpace: "unset" }
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Status",
                  accessor: "status",
                  style: { whiteSpace: "unset" }
                }
              ]}
              showPageSizeOptions={false}
              defaultPageSize={10}

              filtered={this.state.filter}
              sorting={0}
              sortable={true}

              className="-striped -highlight"
              style={{
                height: "400px",
              }}
            />
            :
            <ReactTable
              data={this.state.transactions}
              columns={[
                {
                  headerClassName: "apply-table-thead",
                  Header: "Date",
                  accessor: "date",
                  style: { whiteSpace: "unset" }
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Type",
                  accessor: "type",
                  style: { whiteSpace: "unset" }
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Amount",
                  accessor: "amount",
                  style: { whiteSpace: "unset" }
                },
                {
                  headerClassName: "apply-table-thead",
                  Header: "Status",
                  accessor: "status",
                  style: { whiteSpace: "unset" }
                }
              ]}
              showPageSizeOptions={false}
              defaultPageSize={10}

              filtered={this.state.filter}
              sorting={0}
              sortable={true}

              className="-striped -highlight"
              style={{
                height: "400px",
              }}
            />
            }
          </CollapseWithHeader>
          <WithdrawButtonPannel usertype={this.state.usertype} />
        </div>

      </div>
    );
  }
}

export default Transactions;