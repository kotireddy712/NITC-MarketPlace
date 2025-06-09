import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    photo_url: ''
  });

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (!email) {
      navigate('/');
      return;
    }

    axios.get(`http://localhost:5000/api/user/${email}`)
      .then((res) => {
        setUserData({
          name: res.data.name,
          photo_url: res.data.photo_url
        });
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="profile-button" onClick={() => navigate('/profile')}>
        <img
          src={userData.photo_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          alt="Profile"
        />
      </div>

      <h2 className="dashboard-title">
        <span className="title-greeting">Welcome to NITC Marketplace, </span>
        <span className="user-name">{userData.name || 'User'}</span>!
      </h2>

      {/* ✅ MAIN TWO BUTTONS ONLY */}
      <div className="actions">
        <div className="card">
          <h3 className="card-title">Buy / Sell</h3>
          <button onClick={() => navigate('/buy-sell')} className="action-button">
            🛍️ Go to Buy/Sell
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">Lost / Found</h3>
          <button onClick={() => navigate('/lost-found')} className="action-button">
            🧳 Lost & Found
          </button>
        </div>
      </div>

      <div className="dashboard-secondary-actions">
        <button
          onClick={() => navigate('/rules')}
          className="rules-regulations-button"
        >
          📜 View Rules & Regulations
        </button>
      </div>

      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </div>
  );
}

export default Dashboard;
