import React, { Component } from 'react';
import '../css/App.css';
import '../css/landing.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Landing extends Component {

  render() {
    return (
      <div className="info vertical-center">
        <div className="image">
          <img className="icon" src={ require('../character.png') } />
        </div>
        <div className="content">
          <h1> Stewie </h1>
          <p> Discuss your goals with a personal assistant. </p>
          <div className="submission">
            <input type="number" className="phone-number" type="text" placeholder="enter your number"/>
            <Link to="/report">
              <button type="submit" className="submit"><b>GO</b></button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
