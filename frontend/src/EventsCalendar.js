import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Component for all authenticated users to view events
const EventsCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // API endpoint secured by @login_required in events_routes.py
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events`, { withCredentials: true });
      // Map API data to include a date object for easy comparison in the calendar
      const formattedEvents = response.data.map(event => ({
        ...event,
        start_date: new Date(event.start_date),
        end_date: event.end_date ? new Date(event.end_date) : null,
        // Convert to YYYY-MM-DD string for comparison logic
        dateKey: new Date(event.start_date).toISOString().split('T')[0] 
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
      // Optionally redirect if unauthorized, although Flask login_required handles most of this
    }
  };

  // Function to determine which dates have events for marking on the calendar
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toISOString().split('T')[0];
      const hasEvent = events.some(event => event.dateKey === dateKey);
      
      if (hasEvent) {
        return 'event-marker'; // Custom CSS class defined in EventsCalendar.css
      }
    }
    return null;
  };
  
  // Filter events for the currently selected day
  const dailyEvents = events.filter(event => 
    event.start_date.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.start_date - b.start_date); // Sort by time

  // Function to format the date/time display
  const formatTime = (date) => 
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatDate = (date) => 
    date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="events-calendar-container">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2 className="events-title">NITC Events Calendar</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="calendar-grid">
        <div className="calendar-display-panel">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            locale="en-US"
            className="react-calendar-override"
          />
          <p className="calendar-caption">Click a date to see events.</p>
        </div>

        <div className="event-list-panel">
          <h3 className="event-list-header">
            Events on {formatDate(selectedDate)}
          </h3>
          
          <div className="event-list-scroller">
            {dailyEvents.length === 0 ? (
              <p className="no-events-message">No events scheduled for this day. Enjoy the peace! 🍃</p>
            ) : (
              dailyEvents.map(event => (
                <div key={event.event_id} className="event-card">
                  <h4 className="event-card-title">{event.title}</h4>
                  <p className="event-card-time">
                    <span role="img" aria-label="clock">🕒</span> {formatTime(event.start_date)}
                    {event.end_date && ` - ${formatTime(event.end_date)}`}
                  </p>
                  {event.description && <p className="event-card-description">{event.description}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
