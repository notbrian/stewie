import React, { Component } from 'react';
import Report from './Report/Report';
import '@shopify/polaris/styles.css';
import '../css/App.css';
import '../css/landing.css';

class App extends Component {
  render() {
    return (
    <Report phonenumber={this.props.location.state.phonenumber}/>

    );
  }
}

export default App;
