// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* Add Buy and Sell components here */}
      </Routes>
    </Router>
  );
}

export default App;