import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth & Dashboard
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import Buy from './buy';
import Sell from './sell';
import Listings from './Listings';
import Profile from './profile';
import RulesAndRegulations from './RulesAndRegulations';
import AdminDashboard from './AdminDashboard';
import ProtectedAdminRoute from './ProtectedAdminRoute'; // ✅ for admin-only pages

// Existing New components
import BuySellDashboard from './BuySellDashboard';

// Lost & Found components
import LostFoundDashboard from './LostFoundDashboard';
import LostFoundForm from './LostFoundForm';
import LostFoundListings from './LostFoundListings';
import MyLostFoundListings from './MyLostFoundListings';

// Informational Pages
import LandingPage from './LandingPage';
import UnderConstruction from './UnderConstruction';
import TermsOfUse from './TermsOfUse';
import Announcements from './Announcements';
import Contact from './Contact';
import News from './News';
import Accessibility from './Accessibility';
import About from './About';
import Credits from './Credits';

// Placement Section
import PlacementsList from './PlacementsList';

// 🗓️ Events (NEW)
import EventCalendar from './EventCalender';      // student view
import EventManager from './EventManager';        // admin view

// Styles
import './App.css';
import './FeedbackModal.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page as the initial root path */}
        <Route path="/" element={<LandingPage />} />

        {/* AuthForm is now accessed via /login */}
        <Route path="/login" element={<AuthForm />} />

        {/* Core Application Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rules" element={<RulesAndRegulations />} />

        {/* ✅ Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/buy-sell" element={<BuySellDashboard />} />

        {/* Lost & Found */}
        <Route path="/lost-found" element={<LostFoundDashboard />} />
        <Route path="/lost-found/list" element={<LostFoundForm />} />
        <Route path="/lost-found/all" element={<LostFoundListings />} />
        <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} />

        {/* ✅ Placement Route */}
        <Route path="/placements" element={<PlacementsList />} />

        {/* ✅ Calendar Routes */}
        <Route path="/calendar" element={<EventCalendar />} />  {/* Student view */}
        <Route
          path="/admin/events"
          element={
            <ProtectedAdminRoute>
              <EventManager />
            </ProtectedAdminRoute>
          }
        />

        {/* Informational Pages */}
        <Route path="/news" element={<News />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/nitc-info" element={<UnderConstruction />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/about-site" element={<About />} />
        <Route path="/credits" element={<Credits />} />

      </Routes>
    </Router>
  );
}

export default App;
