import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // For basic styling

function ViewTicketStatus() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      // GET /api/tickets/user is the endpoint defined in app.py
      const response = await axios.get(`${backendUrl}/api/tickets/user`, {
        withCredentials: true
      });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.response?.data?.message || 'Failed to load tickets. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved': return 'status-resolved';
      case 'In Progress': return 'status-in-progress';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Your Ticket Status</h1>
        <button onClick={() => navigate('/hostel-tickets')} className="back-button">
          &larr; Back to Ticket Dashboard
        </button>
      </header>

      {loading && <p>Loading your tickets...</p>}
      {error && <p className="message error">{error}</p>}
      
      {!loading && !error && (
        tickets.length === 0 ? (
          <p>You have not raised any tickets yet.</p>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.ticket_id} className="ticket-card">
                <div className="ticket-header">
                  <h3>Ticket #{ticket.ticket_id}</h3>
                  <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p><strong>Hostel/Room:</strong> {ticket.hostel_number} / {ticket.room_no}</p>
                <p><strong>Description:</strong> {ticket.description}</p>
                <p><strong>Raised On:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
                
                {(ticket.status !== 'Pending' && ticket.admin_remarks) && (
                    <div className="admin-remarks-section">
                        <h4>Admin Remarks:</h4>
                        <p>{ticket.admin_remarks}</p>
                    </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ViewTicketStatus;