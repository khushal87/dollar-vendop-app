import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "antd/dist/antd.css";
import axios from 'axios';
import { apiUrl } from './config';
import firebaseConfig from './firebase';
import firebase from 'firebase';

axios.defaults.baseURL = apiUrl;

axios.interceptors.request.use(request => {
  // Edit request config
  return request;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  // Edit response config
  return response;
}, error => {
  return Promise.reject(error);
});

class MainApp extends Component {
  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
  }
  render() {
    return (
      <App />
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
