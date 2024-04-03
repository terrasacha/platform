import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// AWS amplify modules
import '@aws-amplify/ui-react/styles.css';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
const cors = require('cors');
const whitelist = ['http://localhost/3000'];

root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
