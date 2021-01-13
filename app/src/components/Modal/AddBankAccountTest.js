import React, { Component, useState } from "react";
import Popup from "reactjs-popup";
import PropTypes from 'prop-types'
import {AffordableClient} from "affordable-client";
import "../../styles/buttons.css";
import {Modal, Button,Form} from 'react-bootstrap'
import Stripe from 'stripe'
const dotenv_1 = require("dotenv");
dotenv_1.config();


const client = new AffordableClient();

//The popup component to register bank info
const AddBankAccountTest = props => {
    const REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [holderName,setHolderName] = useState(''); 
    const [accountNum,setAccountNum] = useState(''); 
    const [routeNum,setRouteNum] = useState(''); 

    const submit=() =>{
        const api = REACT_APP_AF_BACKEND_URL + "/stripe" + "/customer";
        const username = JSON.parse(sessionStorage.getItem('userInfo')).username;
        const email = JSON.parse(sessionStorage.getItem('userInfo')).primaryEmail;
        const userID = JSON.parse(sessionStorage.getItem('userInfo')).id;
        fetch(api, { //will call the POST: Customer api
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                email: email,
                id: userID
            })
        }).then(res => { //converts the response of customer api to json
            return res.json()
        }).then(customer_data =>{//pass customer info to POST: bank api call
            fetch(REACT_APP_AF_BACKEND_URL + "/stripe" + "/bank", { //will call the POST: Customer api
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    customer_id: customer_data.id,
                    account_holder_name: holderName,
                    routing_number: routeNum,
                    account_number: accountNum,
                    id:userID //Affordable ID
                })
            })
        })
        setShow(false)
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
            Add Bank
            </Button>
            <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>
                <Modal.Title>Add Bank Account</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Form>
                <Form.Group controlId="formHolderName">
                    <Form.Label>Account Holder Name</Form.Label>
                    <Form.Control type="text" value = {holderName} onChange ={e => setHolderName(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formAccountNum">
                    <Form.Label>Bank Account Number</Form.Label>
                    <Form.Control type="text" value = {accountNum} onChange ={e => setAccountNum(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formRouteNum">
                    <Form.Label>Routing Number</Form.Label>
                    <Form.Control type="text" value = {routeNum} onChange ={e => setRouteNum(e.target.value)}/>
                </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="primary" type= "submit" onClick={submit}>
                Add Account
                </Button>
            </Modal.Footer>

            </Modal>
        </div>
    )
}

export default AddBankAccountTest
