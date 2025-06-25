import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import Buy from './buy';
import Sell from './sell';
import Listings from './Listings';
import Profile from './profile';
import RulesAndRegulations from './RulesAndRegulations';
import AdminDashboard from './AdminDashboard';

// Existing New components
import BuySellDashboard from './BuySellDashboard';
// No longer needed to import UnderConstruction for my-listings route
// import UnderConstruction from './UnderConstruction';

// New components for Lost & Found
import LostFoundDashboard from './LostFoundDashboard';
import LostFoundForm from './LostFoundForm';
import LostFoundListings from './LostFoundListings';
import MyLostFoundListings from './MyLostFoundListings'; // ✅ NEW: Import the new component

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rules" element={<RulesAndRegulations />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Existing Marketplace Routes */}
        <Route path="/buy-sell" element={<BuySellDashboard />} />

        {/* Lost & Found Routes */}
        <Route path="/lost-found" element={<LostFoundDashboard />} />
        <Route path="/lost-found/list" element={<LostFoundForm />} />
        <Route path="/lost-found/all" element={<LostFoundListings />} />
        <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} /> {/* ✅ UPDATED ROUTE */}
      </Routes>
    </Router>
  );
}

export default App;