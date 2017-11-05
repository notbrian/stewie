import React, { Component } from 'react';
import Entry from '../Entry.js';
import Goal from '../Goal.js';
import './report.css';
import character from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/character.png';
import base from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/base.js';

class Report extends Component {

  render() {
    return (
      <div className="report-body">

        <div className="header">
          <div className="report-image">
            <img className="report-icon" src={character} />
          </div>
          <div className="report-content">
            <h1> STEWIE'S REPORT </h1>
            <h2> a collection of your successes and failures </h2>
          </div>
       </div>

      <Entry date="Nov 04"/>

      </div>
    );
  }
}

export default Report;
