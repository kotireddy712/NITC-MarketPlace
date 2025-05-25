// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import Buy from './buy';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        {/* Add Buy and Sell components here */}
      </Routes>
    </Router>
  );
}

export default App;