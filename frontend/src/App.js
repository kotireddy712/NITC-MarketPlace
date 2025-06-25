// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthForm from './AuthForm';
// import Dashboard from './Dashboard';
// import Buy from './buy';
// import Sell from './sell';
// import Listings from './Listings'; // Your Listings component
// import Profile from './profile';
// import RulesAndRegulations from './RulesAndRegulations';
// import AdminDashboard from './AdminDashboard';

// // Existing New components
// import BuySellDashboard from './BuySellDashboard';

// // Lost & Found components
// import LostFoundDashboard from './LostFoundDashboard';
// import LostFoundForm from './LostFoundForm';
// import LostFoundListings from './LostFoundListings';
// import MyLostFoundListings from './MyLostFoundListings';

// // Import the LandingPage and UnderConstruction components
// import LandingPage from './LandingPage';
// import UnderConstruction from './UnderConstruction'; 

// import './App.css'; // Your main app CSS

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 {/* Landing Page as the initial root path */}
//                 <Route path="/" element={<LandingPage />} />
//                 {/* AuthForm is now accessed via /login */}
//                 <Route path="/login" element={<AuthForm />} /> 

//                 {/* Core Application Routes (accessible after login) */}
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/buy" element={<Buy />} />
//                 <Route path="/sell" element={<Sell />} />
//                 <Route path="/my-listings" element={<Listings />} /> {/* THIS ROUTE IS CORRECT IN APP.JS */}
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/rules" element={<RulesAndRegulations />} />
//                 <Route path="/admin-dashboard" element={<AdminDashboard />} />
//                 <Route path="/buy-sell" element={<BuySellDashboard />} />

//                 {/* Lost & Found Routes */}
//                 <Route path="/lost-found" element={<LostFoundDashboard />} />
//                 <Route path="/lost-found/list" element={<LostFoundForm />} />
//                 <Route path="/lost-found/all" element={<LostFoundListings />} />
//                 <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} />

//                 {/* Routes for informational pages (Under Construction) */}
//                 <Route path="/news" element={<UnderConstruction />} />
//                 <Route path="/announcements" element={<UnderConstruction />} />
//                 <Route path="/contact" element={<UnderConstruction />} />
//                 <Route path="/nitc-info" element={<UnderConstruction />} /> 
//                 <Route path="/terms" element={<UnderConstruction />} />
//                 <Route path="/accessibility" element={<UnderConstruction />} />
//                 <Route path="/about-site" element={<UnderConstruction />} />
//                 <Route path="/feedback-info" element={<UnderConstruction />} /> 
//                 <Route path="/credits" element={<UnderConstruction />} />

//             </Routes>
//         </Router>
//     );
// }

// export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthForm from './AuthForm';
// import Dashboard from './Dashboard';
// import Buy from './buy';
// import Sell from './sell';
// import Listings from './Listings';
// import Profile from './profile';
// import RulesAndRegulations from './RulesAndRegulations';
// import AdminDashboard from './AdminDashboard';

// // Existing New components
// import BuySellDashboard from './BuySellDashboard';
// // No longer needed to import UnderConstruction for my-listings route
// // import UnderConstruction from './UnderConstruction';

// // New components for Lost & Found
// import LostFoundDashboard from './LostFoundDashboard';
// import LostFoundForm from './LostFoundForm';
// import LostFoundListings from './LostFoundListings';
// import MyLostFoundListings from './MyLostFoundListings'; // ✅ NEW: Import the new component

// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AuthForm />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/buy" element={<Buy />} />
//         <Route path="/sell" element={<Sell />} />
//         <Route path="/listings" element={<Listings />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/rules" element={<RulesAndRegulations />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         {/* Existing Marketplace Routes */}
//         <Route path="/buy-sell" element={<BuySellDashboard />} />

//         {/* Lost & Found Routes */}
//         <Route path="/lost-found" element={<LostFoundDashboard />} />
//         <Route path="/lost-found/list" element={<LostFoundForm />} />
//         <Route path="/lost-found/all" element={<LostFoundListings />} />
//         <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} /> {/* ✅ UPDATED ROUTE */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// src/App.js
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

import './App.css'; // Your main app CSS

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
        <Route path="/news" element={<UnderConstruction />} />
        <Route path="/announcements" element={<UnderConstruction />} />
        <Route path="/contact" element={<UnderConstruction />} />
        <Route path="/nitc-info" element={<UnderConstruction />} /> 
        <Route path="/terms" element={<UnderConstruction />} />
        <Route path="/accessibility" element={<UnderConstruction />} />
        <Route path="/about-site" element={<UnderConstruction />} />
        <Route path="/feedback-info" element={<UnderConstruction />} /> 
        <Route path="/credits" element={<UnderConstruction />} />

      </Routes>
    </Router>
  );
}

export default App;
