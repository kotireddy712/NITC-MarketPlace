import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Configure axios globally for all components
import axios from 'axios';

// Enable cookies for all requests
axios.defaults.withCredentials = true;

// Set base URL if needed
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
