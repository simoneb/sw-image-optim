import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <img src="sample.jpg" width={400} alt="dog" />
          <img src="dog.jpg" width={400} alt="dog" />
        </header>
      </div>
    );
  }
}

export default App;
