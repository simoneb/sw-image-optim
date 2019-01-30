import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(process.env.PUBLIC_URL + '/optimization-service-worker.js')
    .then(() => {
      console.log('Registered service worker')
    })
    .catch(() => console.error('Could not register service worker'))  
  })
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
