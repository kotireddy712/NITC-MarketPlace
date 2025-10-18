import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
// ✅ 1. Added back FaSyncAlt import for the Retry button
import { FaSyncAlt } from 'react-icons/fa'; 
// ✅ 3. Ensure CSS is imported for the calendar to display correctly
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    setError(null);
    // The API URL looks correct: /api/events
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events`, { withCredentials: true })
      .then(res => {
        const formatted = res.data.map(ev => ({
          id: ev.event_id,
          title: ev.title,
          start: new Date(ev.start_date),
          // Ensure end date defaults gracefully if not provided
          end: new Date(ev.end_date || ev.start_date), 
          allDay: !ev.end_date, // Treat as all day if no end time
        }));
        setEvents(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        // ❌ 2. Replaced the forbidden alert() with state-based error message
        setError("Failed to load events. Please ensure the server is running and you are logged in.");
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '10px', color: '#1f2937' }}>📅 Events Calendar</h2>
      
      {loading && <p style={{ textAlign: 'center', color: '#3b82f6' }}>Loading events...</p>}
      
      {error && (
        <div style={{ 
          padding: '15px', 
          marginBottom: '20px', 
          borderRadius: '5px', 
          backgroundColor: '#fee2e2', 
          color: '#991b1b',
          border: `1px solid #fca5a5`,
          textAlign: 'center'
        }}>
          {error}
          <button 
            onClick={fetchEvents} 
            style={{ 
                marginLeft: '15px', 
                padding: '5px 10px', 
                backgroundColor: '#fef3c7', 
                color: '#92400e', 
                border: '1px solid #fcd34d', 
                borderRadius: '4px',
                cursor: 'pointer'
            }}
          >
            <FaSyncAlt style={{ marginRight: '5px' }} /> Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ height: "80vh" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            // Use 100% height to fill the parent 80vh container
            style={{ height: "100%" }} 
          />
        </div>
      )}
    </div>
  );
}
