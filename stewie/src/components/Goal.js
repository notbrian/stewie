import React, { Component } from 'react';
import './Report/report.css';
import checkmark from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/checkmark.svg';
import x from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/x.svg';

class Goal extends Component {

  createState() {
    const checkmarkState = "x";
    //
    // if this.props.completionState == "checkmark" {
    //   checkmarkState = checkmark;
  }

  render() {
    return (
      <div className="goal-container">
        <img className="check-icon" src={checkmark} />
        <p className="goal-desc"> {this.props.description} </p>
      </div>
    );
  }
}

export default Goal;
