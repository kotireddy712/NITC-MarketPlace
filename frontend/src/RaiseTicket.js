// RaiseTicket.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RaiseTicket.css'; // Assuming you'll create a simple CSS file

function RaiseTicket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      // Should ideally check session first, but relies on localStorage from Dashboard.js logic
      navigate('/login'); 
      return;
    }
    fetchUserTickets();
  }, [userId, navigate]);

  const fetchUserTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tickets/user/${userId}`, { withCredentials: true });
      setUserTickets(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setMessage('Failed to load your tickets.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !description) {
      setMessage('Title and description cannot be empty.');
      return;
    }
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tickets`, {
        title,
        description,
      }, { withCredentials: true });

      setMessage(res.data.message);
      setTitle('');
      setDescription('');
      fetchUserTickets(); // Refresh the list of tickets

    } catch (error) {
      console.error('Error raising ticket:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Failed to raise ticket. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
      case 'Closed':
        return 'status-closed';
      default:
        return '';
    }
  };

  return (
    <div className="ticket-page-container">
      <button className="back-button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      
      <div className="ticket-form-section">
        <h2 className="section-title">🎫 Raise a New Hostel Ticket</h2>
        <form onSubmit={handleSubmit} className="ticket-form">
          <input
            type="text"
            placeholder="Issue Title (e.g., Broken fan in room 201)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="150"
            required
          />
          <textarea
            placeholder="Detailed Description of the Issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          ></textarea>
          <button type="submit" className="submit-ticket-button">Submit Ticket</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
      
      <div className="ticket-list-section">
        <h2 className="section-title">My Tickets History</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : userTickets.length === 0 ? (
          <p>You have not raised any tickets yet.</p>
        ) : (
          <ul className="ticket-list">
            {userTickets.map((ticket) => (
              <li key={ticket.ticket_id} className="ticket-item">
                <div className="ticket-header">
                  <strong>Ticket #{ticket.ticket_id}: {ticket.title}</strong>
                  <span className={`ticket-status ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                </div>
                <p className="ticket-description">
                  {ticket.description}
                </p>
                <p className="ticket-meta">
                  <small>Raised on: {new Date(ticket.created_at).toLocaleString()}</small> | 
                  <small> Last Update: {new Date(ticket.updated_at).toLocaleString()}</small>
                </p>
                {ticket.admin_comments && (
                  <div className="admin-response">
                    <strong>Admin Comment:</strong> 
                    <p>{ticket.admin_comments}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RaiseTicket;