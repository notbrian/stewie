import React, { Component } from 'react';
import Entry from './Entry.js';
import '../css/report.css';
import character from '../img/character-reading.svg';
import base from '../base.js';

class Report extends Component {
  constructor() {
    super();

    this.state = {
      goals: {}
    };
  }

  componentWillMount(){
    base.syncState(this.props.location.state.phonenumber + "/goals", {
      context: this,
      state: 'goals'
    });
  }

  render() {

    return (
      <div className="report-body">

        <div className="header">
          <div className="report-image">
            <img className="report-icon" src={character} alt="Stewie" />
          </div>
          <div className="report-content">
            <h1> STEWIE'S REPORT </h1>
            <h2> a showcase of all your completed/incompleted goals </h2>
          </div>
       </div>
       {
          Object
            .keys(this.state.goals)
            .map(key => <Entry key={key} date={key} goals={this.state.goals}/>).reverse()
        }
      </div>
    );
  }
}

export default Report;
