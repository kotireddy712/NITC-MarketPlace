import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LostFoundDashboard.css'; // You'll create this CSS file

function LostFoundDashboard() {
  const navigate = useNavigate();

  return (
    <div className="lost-found-dashboard-container">
      <h2 className="lost-found-title">Lost & Found Hub 🧳</h2>
      <p className="lost-found-description">
        Help reunite lost items with their owners, or list something you've misplaced.
      </p>

      <div className="lost-found-actions">
        <div className="card">
          <h3 className="card-title">List an Item</h3>
          <p>Have you lost something or found an item on campus?</p>
          <button onClick={() => navigate('/lost-found/list')} className="action-button">
            📝 Post New Listing
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">All Listings</h3>
          <p>Browse all active lost and found items posted by others.</p>
          <button onClick={() => navigate('/lost-found/all')} className="action-button">
            👀 View All Items
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">My Listings</h3>
          <p>Manage the lost or found items you've posted.</p>
          <button onClick={() => navigate('/lost-found/my-listings')} className="action-button">
            📦 My Posted Items
          </button>
        </div>
      </div>

      <button onClick={() => navigate('/dashboard')} className="back-button">
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

export default LostFoundDashboard;