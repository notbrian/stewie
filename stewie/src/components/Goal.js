import React, { Component } from 'react';
import './Report/report.css';
import checkmark from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/checkmark.svg';
import x from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/x.svg';

class Goal extends Component {

  render() {
      var checkmarkState = checkmark;
      if (this.props.completionState === false) {
        checkmarkState = x;
      }
    return (
      <div className="goal-container">
        <img className="check-icon" src={checkmarkState} alt="checkmarked state"/>
        <p className="goal-desc"> {this.props.description} </p>
      </div>
    );
  }
}

export default Goal;
