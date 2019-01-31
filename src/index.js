import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register(
        process.env.PUBLIC_URL + `/optimization-service-worker.js?data=${
          encodeURIComponent(JSON.stringify([200, 600, 800, 1440]))
        }`
      )

      console.log('Service worker registered successfully')
    } catch(err) {
      console.error('Service worker registration failed', err)
    }
  })
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
