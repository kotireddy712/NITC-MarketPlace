import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate(); // ✅ Initialize the hook

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to NITC Marketplace</h2>
      <div className="actions">
        <div className="card">
          <h3>Buy Items</h3>
          <button onClick={() => navigate('/buy')}>Go to Buy</button> {/* ✅ Working button */}
        </div>
        <div className="card">
          <h3>Sell Items</h3>
          <button onClick={() => navigate('/sell')}>Go to Sell</button> 
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
