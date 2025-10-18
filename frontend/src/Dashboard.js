import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import FeedbackModal from './FeedbackModal';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    photo_url: ''
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (!email) {
      navigate('/');
      return;
    }

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${email}`)
      .then((res) => {
        setUserData({
          name: res.data.name,
          photo_url: res.data.photo_url
        });
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
        setUserData({
          name: 'User',
          photo_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        });
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleFeedbackSubmit = async (feedbackText) => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
      console.error("User email not found in localStorage. Cannot submit feedback.");
      throw new Error("User not logged in or email unavailable.");
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/feedback`, {
        user_email: userEmail,
        feedback: feedbackText,
      });
      console.log('Feedback submitted successfully via API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback to backend:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  return (
    <div className="dashboard-container">

      {/* Profile Button */}
      <div className="profile-button" onClick={() => navigate('/profile')}>
        <img
          src={userData.photo_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          alt="Profile"
        />
      </div>

      {/* Feedback Button */}
      <button className="feedback-button" onClick={() => setShowFeedbackModal(true)}>
        ⭐ Give Feedback
      </button>

      <h2 className="dashboard-title">
        <span className="title-greeting">Welcome to NITC Marketplace, </span>
        <span className="user-name">{userData.name || 'User'}</span>!
      </h2>

      {/* Main Action Buttons Section */}
      <div className="actions">

        {/* Buy/Sell */}
        <div className="card">
          <h3 className="card-title">Buy / Sell</h3>
          <button onClick={() => navigate('/buy-sell')} className="action-button">
            🛍️ Go to Buy/Sell
          </button>
        </div>

        {/* Lost/Found */}
        <div className="card">
          <h3 className="card-title">Lost / Found</h3>
          <button onClick={() => navigate('/lost-found')} className="action-button">
            🧳 Lost & Found
          </button>
        </div>

        {/* Placements */}
        <div className="card">
          <h3 className="card-title">Placements</h3>
          <button onClick={() => navigate('/placements')} className="action-button">
            🎓 Check Placements
          </button>
        </div>

        {/* Events / Calendar */}
        <div className="card">
          <h3 className="card-title">Events</h3>
          <button onClick={() => navigate('/calendar')} className="action-button">
            📅 View Events
          </button>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="dashboard-secondary-actions">
        <button
          onClick={() => navigate('/rules')}
          className="rules-regulations-button"
        >
          📜 View Rules & Regulations
        </button>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        redirectAfterSubmit={() => navigate('/dashboard')}
      />
    </div>
  );
}

export default Dashboard;
