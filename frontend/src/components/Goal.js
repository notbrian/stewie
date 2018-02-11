import React, { Component } from 'react';
import '../css/landing.css';
import checkmark from '../img/checkmark.svg';
import x from '../img/x.svg';

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
