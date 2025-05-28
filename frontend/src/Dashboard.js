// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
// import './Dashboard.css';

// function Dashboard() {
//   const navigate = useNavigate(); // ✅ Initialize the hook

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">Welcome to NITC Marketplace</h2>
//       <div className="actions">
//         <div className="card">
//           <h3>Buy Items</h3>
//           <button onClick={() => navigate('/buy')}>Go to Buy</button> {/* ✅ Working button */}
//         </div>
//         <div className="card">
//           <h3>Sell Items</h3>
//           <button onClick={() => navigate('/sell')}>Go to Sell</button> 
//         </div>
//          <div className="card">
//           <h3>Listed Items</h3>
//           <button onClick={() => navigate('/Listings')}>MY-LISTINGS</button> {/* ✅ Working button */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
// src/Dashboard.js
import React, { useEffect, useState } from 'react'; // Added useEffect and useState
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(''); // State to hold user's name

  useEffect(() => {
    // Fetch user's name from localStorage on component mount
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      // If no user is logged in, redirect to auth form
      navigate('/');
    }
  }, [navigate]); // Dependency array to re-run effect if navigate changes (unlikely)

  const handleLogout = () => {
    localStorage.clear(); // Clear all user data from localStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome TO NITC-MARKET PLACE, {userName || 'User'}!</h2> {/* Display user's name */}
      <div className="actions">
        <div className="card">
          <h3>Buy Items</h3>
          <button onClick={() => navigate('/buy')}>Go to Buy</button>
        </div>
        <div className="card">
          <h3>Sell Items</h3>
          <button onClick={() => navigate('/sell')}>Go to Sell</button>
        </div>
        <div className="card">
          <h3>Listed Items</h3>
          {/* Changed path to lowercase '/listings' for consistency */}
          <button onClick={() => navigate('/listings')}>MY-LISTINGS</button>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button> {/* Added Logout button */}
    </div>
  );
}

export default Dashboard;