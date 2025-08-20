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

// Lost & Found components
import LostFoundDashboard from './LostFoundDashboard';
import LostFoundForm from './LostFoundForm';
import LostFoundListings from './LostFoundListings';
import MyLostFoundListings from './MyLostFoundListings';

// Import the LandingPage and UnderConstruction components
import LandingPage from './LandingPage';
import UnderConstruction from './UnderConstruction';
import TermsOfUse from './TermsOfUse';
import Announcements from './Announcements';
import Contact from './Contact';
import News from './News';
import Accessibility from './Accessibility';
import About from './About';
import Credits from './Credits';
// Configure axios globally for all components
import axios from 'axios';

// Enable cookies for all requests
axios.defaults.withCredentials = true;

// Set base URL if needed
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
import './App.css'; // Your main app CSS
import './FeedbackModal.css'; // <--- NEW: Import the FeedbackModal CSS

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page as the initial root path */}
        <Route path="/" element={<LandingPage />} />
        {/* AuthForm is now accessed via /login */}
        <Route path="/login" element={<AuthForm />} />

        {/* Core Application Routes (accessible after login) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rules" element={<RulesAndRegulations />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/buy-sell" element={<BuySellDashboard />} />

        {/* Lost & Found Routes */}
        <Route path="/lost-found" element={<LostFoundDashboard />} />
        <Route path="/lost-found/list" element={<LostFoundForm />} />
        <Route path="/lost-found/all" element={<LostFoundListings />} />
        <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} />

        {/* Routes for informational pages (Under Construction) */}
        <Route path="/news" element={<News/>} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/nitc-info" element={<UnderConstruction />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/about-site" element={<About/>} />
        {/* <Route path="/feedback-info" element={<UnderConstruction />} />  */}
        <Route path="/credits" element={<Credits />} />

      </Routes>
    </Router>
  );
}

export default App;