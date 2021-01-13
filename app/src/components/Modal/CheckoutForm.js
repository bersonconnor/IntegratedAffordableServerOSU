import React, { Component } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import { NavLink } from "react-router-dom";

import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Fade } from 'react-bootstrap';

import { config } from "dotenv";
config();


const CheckoutForm = (props) => {

  const stripe = useStripe();
  const elements = useElements();
  var cardType = props.cardType;
  var name;
  var cardName = props.cardName;
  var nameError= false;


  const handleChangeCardType=(e) =>{
        props.handleChangeCardType(e.target.value);
  }

  const handleChangeCardName=(e) =>{
      props.handleChangeCardName(e.target.value);
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", JSON.parse(sessionStorage.getItem('userInfo')).username);

    var json = await this.client.getPaymentMethod(JSON.parse(sessionStorage.getItem('userInfo')).username, true, false);
    var method=[];
      for(let i = 0; i < json.cardList.length; i++){
        var name = json.cardList[i].cardName;
        method.push(name);
      }


      if((json.cardList.length != 0 && method.indexOf(cardName) >= 0) || cardName == "" || cardType == "--"){
        console.log("don't add card");
        props.handleNameError(true);

        if(method.indexOf(cardName) >= 0 || cardName == ""){
          props.handleNameError(true);
        }
        else{
          props.handleNameError(false);
        }

        if(cardType == "--"){
          props.handleCardTypeError(true);
        }
        else{
          props.handleCardTypeError(false);
        }
        console.log(cardType);


      }else{
        props.handleNameError(false);

        console.log(cardType);

        const {error, token} = await stripe.createToken(elements.getElement(CardElement));
        
        var json = await this.client.stripeSaveCard(JSON.parse(sessionStorage.getItem('userInfo')).username,
        token.id,cardType,cardName);
        props.handlehadSubmitted(true);

        // await fetch(process.env.REACT_APP_AF_BACKEND_URL +'/stripe/saveCard',{
        //   method: "POST",
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({username: JSON.parse(sessionStorage.getItem('userInfo')).username,
        //   "tokenId":token.id,"cardType":cardType,"cardName":cardName})
        // }).then(response => {
        //   if (response.ok) {
        //     props.handlehadSubmitted(true);
        //     return response.json();
        //   }
        // })
        // .then(() => { });

      }


    // try {
    //   const response = await fetch(process.env.REACT_APP_AF_BACKEND_URL +"/transaction/cards", {
    //     method: "POST",
    //     body: data
    //   });
    //   if (!response.ok) {
    //     throw Error(response.statusText);
    //   }
    //   const json = await response.json();

    //   var method=[];
    //   for(let i = 0; i < json.cardList.length; i++){
    //     var name = json.cardList[i].cardName;
    //     method.push(name);
    //   }


    //   if((json.cardList.length != 0 && method.indexOf(cardName) >= 0) || cardName == "" || cardType == "--"){
    //     console.log("don't add card");
    //     props.handleNameError(true);

    //     if(method.indexOf(cardName) >= 0 || cardName == ""){
    //       props.handleNameError(true);
    //     }
    //     else{
    //       props.handleNameError(false);
    //     }

    //     if(cardType == "--"){
    //       props.handleCardTypeError(true);
    //     }
    //     else{
    //       props.handleCardTypeError(false);
    //     }
    //     console.log(cardType);


    //   }else{
    //     props.handleNameError(false);

    //     console.log(cardType);

    //     const {error, token} = await stripe.createToken(elements.getElement(CardElement));

    //     await fetch(process.env.REACT_APP_AF_BACKEND_URL +'/stripe/saveCard',{
    //       method: "POST",
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({username: JSON.parse(sessionStorage.getItem('userInfo')).username,
    //       "tokenId":token.id,"cardType":cardType,"cardName":cardName})
    //     }).then(response => {
    //       if (response.ok) {
    //         props.handlehadSubmitted(true);
    //         return response.json();
    //       }
    //     })
    //     .then(() => { });

    //   }

    // } catch (error) {
    //   console.error(error);
    // }

}


  return (
    <form onSubmit={handleSubmit}>

                       <label className="label">Card Type:
                            <select
                                className="cardType"
                                onChange={handleChangeCardType} >
                                <option value="--">Select</option>
                                <option value="credit">Credit Card</option>
                                <option value="debit">Debit Card</option>
                            </select>
                            { props.cardTypeError ? <p>Please select a card type.</p> : <div></div>}
                        </label><br /><br />


                        <label className="label">Nickname for the card:
                            <input
                                type="text"
                                id="nameField"
                                onChange={handleChangeCardName} />
                                { props.nameError ? <p>Please enter a unique nickname for the card</p> : <div></div>}
                        </label><br /><br />
                        <CardElement />

      <button className="submit-button" type="submit">
        Submit
      </button>
    </form>
  );
};




export default CheckoutForm;
