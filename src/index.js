import React from 'react';
import ReactDOM from 'react-dom';
// import './styles/index.scss';
import './styles/index.css';
import AppProvider from './context/context-provider';
import reportWebVitals from './reportWebVitals';
// import Amplify from 'aws-amplify';
// import config from './auth-config';
import mixpanel from 'mixpanel-browser';

mixpanel.init('6e42aa7487ee22e48b064f155a467a8d');
mixpanel.track('test');


// config.oauth.domain = "auth.votingblock.io";


// Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode> 
    <AppProvider />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
