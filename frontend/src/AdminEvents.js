import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Component for Admins to view, add, and delete events
const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State for new event form
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '', // Will store ISO string
    endDate: '',   // Will store ISO string
  });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Fetch Logic ---
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetches events using the public /events route
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events`, { withCredentials: true });
      const formattedEvents = response.data.map(event => ({
        ...event,
        start_date: new Date(event.start_date),
        end_date: event.end_date ? new Date(event.end_date) : null,
        dateKey: new Date(event.start_date).toISOString().split('T')[0] 
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Check your network or admin status.");
    } finally {
        setLoading(false);
    }
  };

  // --- Add Logic ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.startDate) {
        alert("Please provide at least a title and a start date/time.");
        return;
    }

    try {
        setLoading(true);
        // Uses the secured /admin/events POST route
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/events`, {
            title: newEvent.title,
            description: newEvent.description,
            start_date: newEvent.startDate,
            end_date: newEvent.endDate,
        }, { withCredentials: true });

        alert("Event added successfully!");
        setNewEvent({ title: '', description: '', startDate: '', endDate: '' });
        setIsAdding(false);
        fetchEvents(); // Refresh list
    } catch (err) {
        console.error("Error adding event:", err.response || err);
        alert(`Failed to add event: ${err.response?.data?.message || err.message}`);
    } finally {
        setLoading(false);
    }
  };

  // --- Delete Logic ---
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to permanently delete this event?")) return;
    try {
        setLoading(true);
        // Uses the secured /admin/events/<id> DELETE route
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/events/${eventId}`, { withCredentials: true });
        
        alert("Event deleted successfully!");
        fetchEvents(); // Refresh list
    } catch (err) {
        console.error("Error deleting event:", err.response || err);
        alert(`Failed to delete event: ${err.response?.data?.message || err.message}`);
    } finally {
        setLoading(false);
    }
  };

  // --- Utility functions ---
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toISOString().split('T')[0];
      const hasEvent = events.some(event => event.dateKey === dateKey);
      if (hasEvent) return 'event-marker';
    }
    return null;
  };
  
  const dailyEvents = events.filter(event => 
    event.start_date.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.start_date - b.start_date);

  const formatTime = (date) => 
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  const formatDate = (date) => 
    date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Handle date click on calendar
  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    // Optionally pre-populate the start date field when a date is clicked
    const defaultStartTime = new Date(date);
    defaultStartTime.setHours(10, 0, 0, 0); // Default to 10:00 AM
    setNewEvent(prev => ({
        ...prev, 
        startDate: defaultStartTime.toISOString().slice(0, 16) 
    }));
  };

  return (
    <div className="events-calendar-container admin-events-container">
      <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
        ← Back to Admin Dashboard
      </button>

      <h2 className="events-title">Admin Events Management</h2>
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading events...</p>}

      <button className="add-event-toggle-button" onClick={() => setIsAdding(!isAdding)}>
        {isAdding ? 'Close Event Form' : '➕ Add New Event'}
      </button>
      
      {/* --- Add Event Form --- */}
      {isAdding && (
          <form className="add-event-form" onSubmit={handleAddEvent}>
            <h3>Add New Event</h3>
            <div className="form-group">
                <label>Title:</label>
                <input 
                    type="text" 
                    value={newEvent.title} 
                    onChange={(e) => setNewEvent(prev => ({...prev, title: e.target.value}))}
                    required
                />
            </div>
            <div className="form-group">
                <label>Description (Optional):</label>
                <textarea 
                    value={newEvent.description} 
                    onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
                />
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Start Date/Time:</label>
                    <input 
                        type="datetime-local" 
                        value={newEvent.startDate} 
                        onChange={(e) => setNewEvent(prev => ({...prev, startDate: e.target.value}))}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Date/Time (Optional):</label>
                    <input 
                        type="datetime-local" 
                        value={newEvent.endDate} 
                        onChange={(e) => setNewEvent(prev => ({...prev, endDate: e.target.value}))}
                    />
                </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Adding...' : 'Save Event'}
            </button>
          </form>
      )}

      <div className="calendar-grid">
        {/* Calendar View */}
        <div className="calendar-display-panel">
          <Calendar
            onChange={handleCalendarChange}
            value={selectedDate}
            tileClassName={tileClassName}
            locale="en-US"
            className="react-calendar-override"
          />
        </div>

        {/* Daily Events List (with Delete Button) */}
        <div className="event-list-panel">
          <h3 className="event-list-header">
            Events on {formatDate(selectedDate)}
          </h3>
          
          <div className="event-list-scroller">
            {dailyEvents.length === 0 ? (
              <p className="no-events-message">No events scheduled for this day.</p>
            ) : (
              dailyEvents.map(event => (
                <div key={event.event_id} className="event-card admin-event-card">
                    <div>
                        <h4 className="event-card-title">{event.title}</h4>
                        <p className="event-card-time">
                            <span role="img" aria-label="clock">🕒</span> {formatTime(event.start_date)}
                            {event.end_date && ` - ${formatTime(event.end_date)}`}
                        </p>
                        {event.description && <p className="event-card-description">{event.description}</p>}
                    </div>
                    <button 
                        onClick={() => handleDeleteEvent(event.event_id)} 
                        disabled={loading}
                        className="btn-delete-event"
                    >
                        🗑️ Delete
                    </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
