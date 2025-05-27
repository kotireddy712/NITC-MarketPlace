// // File: src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthForm from './AuthForm';
// import Dashboard from './Dashboard';
// import Buy from './buy';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AuthForm />} />
//         <Route path="/Dashboard" element={<Dashboard />} />
//         <Route path="/buy" element={<Buy />} />
//         {/* Add Buy and Sell components here */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// File: src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthForm from './AuthForm';
// import Dashboard from './Dashboard';
// import Buy from './buy';
// import Sell from './sell';  // <-- Make sure this component exists!
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AuthForm />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/buy" element={<Buy />} />
//         <Route path="/sell" element={<Sell />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import Buy from './buy';
import Sell from './sell';
import './App.css';

function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

