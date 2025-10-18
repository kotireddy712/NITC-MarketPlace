// AdminTickets.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminTickets.css'; // Assuming you'll create a simple CSS file

function AdminTickets() {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminComments, setAdminComments] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [message, setMessage] = useState('');
  
  const ticketStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchAllTickets();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [allTickets, filterStatus]);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/tickets`, { withCredentials: true });
      setAllTickets(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all tickets:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Failed to load tickets.');
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filterStatus === 'All') {
      setFilteredTickets(allTickets);
    } else {
      setFilteredTickets(allTickets.filter(ticket => ticket.status === filterStatus));
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminComments(ticket.admin_comments || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedTicket) return;

    try {
      const res = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/admin/tickets/${selectedTicket.ticket_id}`, {
        status: newStatus,
        admin_comments: adminComments,
      }, { withCredentials: true });

      setMessage(res.data.message);
      setSelectedTicket(null); // Close the modal
      fetchAllTickets(); // Refresh the list

    } catch (error) {
      console.error('Error updating ticket:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Failed to update ticket.');
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

  if (loading) return <div className="loading-state">Loading Admin Tickets...</div>;

  return (
    <div className="admin-tickets-container">
      <button className="back-button" onClick={() => navigate('/admin-dashboard')}>← Back to Dashboard</button>
      <h2 className="section-title">🎫 Manage Hostel Tickets</h2>

      {message && <p className="global-message">{message}</p>}

      <div className="tickets-control-bar">
        <label>Filter by Status: </label>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="All">All ({allTickets.length})</option>
          {ticketStatuses.map(status => (
            <option key={status} value={status}>
              {status} ({allTickets.filter(t => t.status === status).length})
            </option>
          ))}
        </select>
      </div>

      <table className="admin-tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Student</th>
            <th>Contact</th>
            <th>Raised On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length === 0 ? (
            <tr><td colSpan="7" className="no-data">No tickets found for status: {filterStatus}</td></tr>
          ) : (
            filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.ticket_id}</td>
                <td className="ticket-title-cell">{ticket.title}</td>
                <td>{ticket.student_name}</td>
                <td>{ticket.student_contact || ticket.student_email}</td>
                <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                <td><span className={`ticket-status-tag ${getStatusClass(ticket.status)}`}>{ticket.status}</span></td>
                <td>
                  <button onClick={() => handleTicketSelect(ticket)} className="btn-view-details">
                    View / Update
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Ticket Details/Update Modal */}
      {selectedTicket && (
        <div className="ticket-details-modal-overlay">
          <div className="ticket-details-modal">
            <h3>Update Ticket #{selectedTicket.ticket_id}</h3>
            <div className="ticket-info-display">
                <p><strong>Title:</strong> {selectedTicket.title}</p>
                <p><strong>Student:</strong> {selectedTicket.student_name} ({selectedTicket.student_email})</p>
                <p><strong>Contact:</strong> {selectedTicket.student_contact || 'N/A'}</p>
                <p><strong>Description:</strong> <pre>{selectedTicket.description}</pre></p>
                <p><strong>Raised On:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
                <p><strong>Resolved By:</strong> {selectedTicket.resolved_by_name || 'N/A'}</p>
            </div>

            <form onSubmit={handleUpdate} className="update-form">
                <label>Update Status:</label>
                <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                >
                    {ticketStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <label>Admin Comments:</label>
                <textarea
                    placeholder="Enter resolution notes or progress updates..."
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    rows="5"
                ></textarea>

                <div className="form-actions">
                    <button type="submit" className="btn-save">Save Update</button>
                    <button type="button" className="btn-cancel" onClick={() => setSelectedTicket(null)}>Cancel</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTickets;