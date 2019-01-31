import React, { Component } from 'react';
import './App.css';

import Image from './Image'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Image id="FIRST" src="sample.jpg" style={{width: '100vw'}} alt="dog" />
          <img src="dog.jpg" width={400} alt="dog" />
        </header>
      </div>
    );
  }
}

export default App;
