import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import base from '../base.js';
import {ProgressBar} from '@shopify/polaris';


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class Landing extends Component {
  constructor() {
    super();

    this.sendSMS = this.sendSMS.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);

    this.state = {
      phoneNumber: undefined,
    }
  }

  sendSMS(e) {
    e.preventDefault();
    axios.post(`https://stewiebot.herokuapp.com/sendStart`,
       {phoneNumber: this.state.phoneNumber}).then(function(response) {
    }).catch(function(error) {
      console.log(error);
    });

    base.syncState(this.state.phoneNumber + "/isAuth", {
      context: this,
      state: 'auth'
    });
  }

  handleChangeName(event) {
    this.setState({phoneNumber: event.target.value});
  }

  render() {
    if (this.state.auth === true) {
      return(
        <Redirect to={{
         pathname: '/report',
         state: {phonenumber: this.state.phoneNumber}
       }}/>
      )

  }
  if(this.state.auth === false) {
    return(
      <div className="info vertical-center">
        <div className="image">
          <img className="icon" src={ require('../img/character.png') } alt="Stewie-Large" />
        </div>
        <div className="content">
          <h1> Stewie </h1>
          <p> Please check your phone to authenicate! </p>
          <ProgressBar
            progress={70}
            size="small"
          />
        </div>

      </div>
    )
  }
    return (
      <div className="info vertical-center">
        <div className="image">
          <img className="icon" src={ require('../img/character.png') } alt="Stewie-Large" />
        </div>
        <div className="content">
          <h1> Stewie </h1>
          <p> Discuss your goals with a personal assistant. </p>
          <form className="submission">
            <input onChange={this.handleChangeName} type="number" className="phone-number" placeholder="enter your number"/>
              <button type="submit" className="submit" onClick={this.sendSMS}><b>GO</b></button>
          </form>
        </div>

      </div>
    );
  }
}

export default Landing;
