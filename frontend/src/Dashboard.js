import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to NITC Marketplace</h2>
      <div className="actions">
        <div className="card">
          <h3>Buy Items</h3>
          <button>Go to Buy</button>
        </div>
        <div className="card">
          <h3>Sell Items</h3>
          <button>Go to Sell</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
