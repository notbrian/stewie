import React, { Component } from 'react';
import '../css/report.css';
import Goal from './Goal.js';
import base from '../base.js';

class Entry extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="entry">
        <div className="date-container">
          <h3 className="date rotate"> {this.props.date.toUpperCase()} </h3>
        </div>
        <div class="goals">
          {
            Object
              .keys(this.props.goals[`${this.props.date}`])
              .map(key => <Goal
                key={key}
                description={this.props.goals[`${this.props.date}`][key]["goal"]}
                completionState={this.props.goals[`${this.props.date}`][key]["isCompleted"]}
              />)
          }
      </div>
      </div>
    );
  }
}

export default Entry;
