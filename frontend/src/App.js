// // File: src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthForm from './AuthForm';
// import Dashboard from './Dashboard';
// import Buy from './Buy';
// import Sell from './Sell'; // Import the new Sell component
// // import Listings from './Listings';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AuthForm />} />
//         <Route path="/Dashboard" element={<Dashboard />} />
//         <Route path="/buy" element={<Buy />} />
//         <Route path="/sell" element={<Sell />} /> {/* New Sell route */}
//         {/* <Route path = "/Listings" element={<Listings />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import Buy from './Buy';
import Sell from './Sell';
import Listings from './Listings'; // Import the new Listings component
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/Dashboard" element={<Dashboard />} /> {/* Keeping /Dashboard as per your existing code */}
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/listings" element={<Listings />} /> {/* New route for Listings */}
      </Routes>
    </Router>
  );
}

export default App;