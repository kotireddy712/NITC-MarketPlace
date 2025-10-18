// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Auth & Dashboard
// import AuthForm from './AuthForm';
// import Dashboard from './Dashboard';
// import Buy from './buy';
// import Sell from './sell';
// import Listings from './Listings';
// import Profile from './profile';
// import RulesAndRegulations from './RulesAndRegulations';
// import AdminDashboard from './AdminDashboard';
// import ProtectedAdminRoute from './ProtectedAdminRoute';

// // Existing New components
// import BuySellDashboard from './BuySellDashboard';

// // Lost & Found components
// import LostFoundDashboard from './LostFoundDashboard';
// import LostFoundForm from './LostFoundForm';
// import LostFoundListings from './LostFoundListings';
// import MyLostFoundListings from './MyLostFoundListings';

// // Informational Pages
// import LandingPage from './LandingPage';
// import UnderConstruction from './UnderConstruction';
// import TermsOfUse from './TermsOfUse';
// import Announcements from './Announcements';
// import Contact from './Contact';
// import News from './News';
// import Accessibility from './Accessibility';
// import About from './About';
// import Credits from './Credits';

// // Placement Section
// import PlacementsList from './PlacementsList';

// // Styles
// import './App.css';
// import './FeedbackModal.css';

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* Landing Page */}
//         <Route path="/" element={<LandingPage />} />

//         {/* Auth */}
//         <Route path="/login" element={<AuthForm />} />

//         {/* Core App Routes */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/buy" element={<Buy />} />
//         <Route path="/sell" element={<Sell />} />
//         <Route path="/listings" element={<Listings />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/rules" element={<RulesAndRegulations />} />

//         {/* Admin Dashboard */}
//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboard />
//             </ProtectedAdminRoute>
//           }
//         />

//         {/* Buy & Sell Dashboard */}
//         <Route path="/buy-sell" element={<BuySellDashboard />} />

//         {/* Lost & Found */}
//         <Route path="/lost-found" element={<LostFoundDashboard />} />
//         <Route path="/lost-found/list" element={<LostFoundForm />} />
//         <Route path="/lost-found/all" element={<LostFoundListings />} />
//         <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} />

//         {/* Placements */}
//         <Route path="/placements" element={<PlacementsList />} />

//         {/* Informational Pages */}
//         <Route path="/news" element={<News />} />
//         <Route path="/announcements" element={<Announcements />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/nitc-info" element={<UnderConstruction />} />
//         <Route path="/terms" element={<TermsOfUse />} />
//         <Route path="/accessibility" element={<Accessibility />} />
//         <Route path="/about-site" element={<About />} />
//         <Route path="/credits" element={<Credits />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;
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
import ProtectedAdminRoute from './ProtectedAdminRoute';

// Existing New components
import BuySellDashboard from './BuySellDashboard';

// Lost & Found components
import LostFoundDashboard from './LostFoundDashboard';
import LostFoundForm from './LostFoundForm';
import LostFoundListings from './LostFoundListings';
import MyLostFoundListings from './MyLostFoundListings';

// Calendar Components <<<--- ADDED IMPORTS ---
import EventsCalendar from './EventsCalendar';
import AdminEvents from './AdminEvents';

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

// Styles
import './App.css';
import './FeedbackModal.css';
import './EventsCalendar.css'; // <<<--- ADDED CSS IMPORT ---

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<AuthForm />} />

        {/* Core App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rules" element={<RulesAndRegulations />} />
        
        {/* Calendar Routes <<<--- ADDED CALENDAR ROUTES ---*/}
        {/* User View: Publicly available to all logged-in users */}
        <Route path="/calendar" element={<EventsCalendar />} /> 
        
        {/* Admin Management: Protected by the Admin Route */}
        <Route 
            path="/admin/events" 
            element={
                <ProtectedAdminRoute>
                    <AdminEvents />
                </ProtectedAdminRoute>
            } 
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Buy & Sell Dashboard */}
        <Route path="/buy-sell" element={<BuySellDashboard />} />

        {/* Lost & Found */}
        <Route path="/lost-found" element={<LostFoundDashboard />} />
        <Route path="/lost-found/list" element={<LostFoundForm />} />
        <Route path="/lost-found/all" element={<LostFoundListings />} />
        <Route path="/lost-found/my-listings" element={<MyLostFoundListings />} />

        {/* Placements */}
        <Route path="/placements" element={<PlacementsList />} />

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
