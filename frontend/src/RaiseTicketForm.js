import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // For common container/button styles

function RaiseTicketForm() {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState({
    hostel_number: '',
    room_no: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Simple validation
    if (!ticketData.hostel_number || !ticketData.room_no || !ticketData.description) {
        setMessage('Please fill in all fields.');
        setLoading(false);
        return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      // POST /api/tickets is the endpoint defined in app.py
      const response = await axios.post(`${backendUrl}/api/tickets`, ticketData, {
        withCredentials: true // Important for sending session cookies
      });

      setMessage(`Ticket raised successfully! ID: ${response.data.ticket_id}`);
      setTicketData({ hostel_number: '', room_no: '', description: '' }); // Clear form
      
      // Redirect to status page after a delay
      setTimeout(() => navigate('/hostel-tickets/status'), 2000); 

    } catch (error) {
      console.error('Ticket submission error:', error);
      // Backend error messages from app.py are critical here (e.g., "Please update your profile...")
      setMessage(error.response?.data?.message || 'Failed to raise ticket. Please ensure you are logged in and your profile is complete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Raise a New Maintenance Ticket</h1>
        <button onClick={() => navigate('/hostel-tickets')} className="back-button">
          &larr; Back to Ticket Dashboard
        </button>
      </header>

      <form onSubmit={handleSubmit} className="ticket-form">
        <label htmlFor="hostel_number">Hostel Number/Name:</label>
        <input
          type="text"
          id="hostel_number"
          name="hostel_number"
          value={ticketData.hostel_number}
          onChange={handleChange}
          required
        />

        <label htmlFor="room_no">Room Number:</label>
        <input
          type="text"
          id="room_no"
          name="room_no"
          value={ticketData.room_no}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description of Issue:</label>
        <textarea
          id="description"
          name="description"
          value={ticketData.description}
          onChange={handleChange}
          rows="5"
          placeholder="e.g., The tap in the washroom is leaking. The ceiling fan is making a noise."
          required
        ></textarea>

        <button type="submit" disabled={loading} className="action-button primary">
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>

        {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
      </form>
    </div>
  );
}

export default RaiseTicketForm;