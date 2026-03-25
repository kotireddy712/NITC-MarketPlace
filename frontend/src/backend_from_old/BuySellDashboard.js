import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Reuse your Dashboard styles

export default function BuySellDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Buy/Sell Section</h2>
      
      <div className="actions">
        <div className="card">
          <h3 className="card-title buy-title">Buy Items</h3>
          <button onClick={() => navigate('/buy')} className="action-button buy-button">
            🛒 Go to Buy
          </button>
        </div>
        <div className="card">
          <h3 className="card-title sell-title">Sell Items</h3>
          <button onClick={() => navigate('/sell')} className="action-button sell-button">
            💰 Go to Sell
          </button>
        </div>
        <div className="card">
          <h3 className="card-title listings-title">Listed Items</h3>
          <button onClick={() => navigate('/listings')} className="action-button listings-button">
            📋 MY-LISTINGS
          </button>
        </div>
      </div>

      {/* Return to Dashboard Button */}
      <div className="return-button-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={() => navigate('/dashboard')} className="action-button return-button">
          🔙 Return to Dashboard
        </button>
      </div>
    </div>
  );
}
