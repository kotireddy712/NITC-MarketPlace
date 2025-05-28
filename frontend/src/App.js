// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import Buy from './buy';
import Sell from './sell'; // Import the new Sell component
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} /> {/* New Sell route */}
      </Routes>
    </Router>
  );
}

export default App;