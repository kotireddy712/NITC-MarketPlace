import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Assuming you use the same basic styling

function HostelTicketDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hostel Maintenance Tickets</h1>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Main Dashboard
        </button>
      </header>
      
      <div className="dashboard-primary-actions" style={{ gap: '20px' }}>
        
        {/* Button to Raise a New Ticket */}
        <div className="card ticket-action-card">
          <h3 className="card-title">Raise a New Ticket</h3>
          <p>Report a maintenance issue in your room or hostel area.</p>
          <button onClick={() => navigate('/hostel-tickets/raise')} className="action-button primary">
            📝 Raise Ticket
          </button>
        </div>

        {/* Button to View Ticket Status */}
        <div className="card ticket-action-card">
          <h3 className="card-title">View Status</h3>
          <p>Check the progress, status, and admin remarks for your raised tickets.</p>
          <button onClick={() => navigate('/hostel-tickets/status')} className="action-button secondary">
            👀 View Status
          </button>
        </div>

      </div>
    </div>
  );
}

export default HostelTicketDashboard;