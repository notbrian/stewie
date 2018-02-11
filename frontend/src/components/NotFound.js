import React from 'react';
import '../css/font.css';
import '../css/notfound.css';

class NotFound extends React.Component {
  render() {
    return (
      <div className="vertical-center info not-found">
        <img className="icon" src={ require('../img/character-404.png') } alt="No Found Stewie" />
        <h1> This page was not found! </h1>
      </div>

    )
  }
}

export default NotFound;
