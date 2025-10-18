import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlusCircle } from 'react-icons/fa';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", start_date: "", end_date: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events`, { withCredentials: true });
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setMessage("Failed to load events.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/events`, form, { withCredentials: true });
      setMessage(`Success: ${res.data.message}`);
      setForm({ title: "", description: "", start_date: "", end_date: "" });
      fetchEvents();
    } catch (error) {
      console.error("Failed to add event:", error);
      setMessage(`Error: ${error.response?.data?.message || "Failed to add event."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/events/${id}`, { withCredentials: true });
      setMessage(`Success: ${res.data.message}`);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      setMessage(`Error: ${error.response?.data?.message || "Failed to delete event."}`);
    }
  };

  // Inline Styles
  const formContainerStyle = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '15px'
  };

  const buttonStyle = {
    backgroundColor: loading ? '#9ca3af' : '#3b82f6',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const deleteButtonStyle = {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9em'
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eee',
    marginBottom: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px'
  };

  const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const successStyle = {
    ...messageStyle,
    backgroundColor: '#d1fae5',
    color: '#065f46'
  };

  const errorStyle = {
    ...messageStyle,
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  };

  return (
    <div style={{ padding: "20px", maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '10px', color: '#1f2937', marginBottom: '30px' }}>
        🛠️ Event Manager (Admin)
      </h2>

      {message && (
        <div style={message.startsWith('Success') ? successStyle : errorStyle}>
          {message}
        </div>
      )}

      <div style={formContainerStyle}>
        <h3>Add New Event</h3>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Event Title (e.g., Guest Lecture on AI)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Event Description (Optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px' }}
          />
          <label style={{ display: 'block', fontSize: '0.85em', color: '#4b5563', marginBottom: '5px' }}>Start Date & Time (Required):</label>
          <input
            type="datetime-local"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            required
            style={inputStyle}
          />
          <label style={{ display: 'block', fontSize: '0.85em', color: '#4b5563', marginBottom: '5px' }}>End Date & Time (Optional):</label>
          <input
            type="datetime-local"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Adding..." : (<><FaPlusCircle /> Add Event</>)}
          </button>
        </form>
      </div>

      <h3>Existing Events</h3>
      {events.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No events found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {events.map((e) => (
            <li key={e.event_id} style={listItemStyle}>
              <div>
                <strong style={{ display: 'block', color: '#1f2937' }}>{e.title}</strong>
                <span style={{ fontSize: '0.9em', color: '#4b5563' }}>
                  {new Date(e.start_date).toLocaleString()} - {e.end_date ? new Date(e.end_date).toLocaleString() : 'N/A'}
                </span>
                {e.description && <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#6b7280' }}>{e.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(e.event_id)}
                style={deleteButtonStyle}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
