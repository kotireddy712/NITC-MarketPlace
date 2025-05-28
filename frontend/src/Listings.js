// src/Listings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Listings.css'; // Create this CSS file for styling

function Listings() {
  const navigate = useNavigate();

  return (
    <div className="listings-container">
      <h2 className="listings-title">My Listed Items</h2>
      <div className="under-construction-message">
        <p>This page is currently under construction.</p>
        <p>Please check back later for your listed items!</p>
      </div>
      <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">
        Back to Dashboard
      </button>
    </div>
  );
}

export default Listings;