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
        <span className="title-greeting">Welcome TO NITC-MARKET PLACE, </span>
        <span className="user-name">{userData.name || 'User'}</span>!
      </h2>

      <div className="actions">
        <div className="card">
          <h3 className="card-title buy-title">Buy Items</h3>
          {/* ✅ Emoji added */}
          <button onClick={() => navigate('/buy')} className="action-button buy-button">
            🛒 Go to Buy
          </button>
        </div>
        <div className="card">
          <h3 className="card-title sell-title">Sell Items</h3>
          {/* ✅ Emoji added */}
          <button onClick={() => navigate('/sell')} className="action-button sell-button">
            💰 Go to Sell
          </button>
        </div>
        <div className="card">
          <h3 className="card-title listings-title">Listed Items</h3>
          {/* ✅ Emoji added */}
          <button onClick={() => navigate('/listings')} className="action-button listings-button">
            📋 MY-LISTINGS
          </button>
        </div>
      </div>

      <div className="dashboard-secondary-actions">
        {/* ✅ Emoji added */}
        <button
          onClick={() => navigate('/rules')}
          className="rules-regulations-button"
        >
          📜 View Rules & Regulations
        </button>
      </div>

      {/* ✅ Emoji added */}
      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </div>
  );
}

export default Dashboard;
