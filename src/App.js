import React, { Component } from 'react';
// import logo from './logo.svg';
import BattleZone from './repoView';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="page-title">
          <span className="page-title__small">The Battle of</span>
          GitHub Repos
        </h1>
        <BattleZone />

      </div>
    );
  }
}

export default App;
