import React, { Component } from 'react';
import axios from 'axios';
import '../css/App.css';
import '../css/landing.css';
import { Link } from 'react-router-dom';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class Landing extends Component {
  constructor() {
    super();

    this.sendSMS = this.sendSMS.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);

    this.state = {
      phoneNumber: undefined
    }
  }

  sendSMS() {
    axios.post(`https://stewiebot.herokuapp.com/sendStart`, {
    phoneNumber: this.state.phoneNumber
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleChangeName(event) {
    this.setState({phoneNumber: event.target.value});
  }

  render() {
    return (
      <div className="info vertical-center">
        <div className="image">
          <img className="icon" src={ require('../character.png') } alt="Stewie-Large" />
        </div>
        <div className="content">
          <h1> Stewie </h1>
          <p> Discuss your goals with a personal assistant. </p>
          <div className="submission">
            <input onChange={this.handleChangeName} type="number" className="phone-number" placeholder="enter your number"/>
            <Link to={{
    pathname: '/report',
    state: { phonenumber: this.state.phoneNumber }   }}>
              <button type="submit" className="submit" onClick={this.sendSMS}><b>GO</b></button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
