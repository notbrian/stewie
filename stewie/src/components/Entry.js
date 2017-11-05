import React, { Component } from 'react';
import './Report/report.css';
import Goal from './Goal.js';

class Entry extends Component {

  render() {
    return (
      <div className="entry">
        <div className="date-container">
          <h3 className="date rotate"> {this.props.date} </h3>
        </div>

        <Goal
          completionState="checkmark"
          description="clean dishes"
        />

      </div>
    );
  }
}

export default Entry;
