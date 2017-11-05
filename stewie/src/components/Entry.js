import React, { Component } from 'react';
import './Report/report.css';
import Goal from './Goal.js';
import base from '/Users/JevinSidhu/Desktop/goals-reminder-app/stewie/src/base.js';

class Entry extends Component {
  constructor() {
    super();

    this.state = {
      goals: {}
    };
  }

  componentWillMount(){
    base.syncState(`4169049147`, {
      context: this,
      state: 'goals'
    });
  }

  render() {
    return (
      <div className="entry">
        <div className="date-container">
          <h3 className="date rotate"> {this.props.date.toUpperCase()} </h3>
        </div>

        {
          Object
            .keys(this.state.goals[`${this.props.date}`]["goals"])
            .map(key => <Goal
              key={key}
              description={this.state.goals[`${this.props.date}`]["goals"][key]["goal"]}
              completionState={this.state.goals[`${this.props.date}`]["goals"][key]["isCompleted"]}
            />)
        }
        {/* <Goal description={this.state.goals[`${this.props.date}`]["goals"][0]["goal"]}/> */}
      </div>
    );
  }
}

export default Entry;
