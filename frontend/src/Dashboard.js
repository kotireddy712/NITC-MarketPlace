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

    // Fetch user data including photo_url
    axios.get(`http://localhost:5000/api/user/${email}`)
      .then((res) => {
        setUserData({
          name: res.data.name,
          photo_url: res.data.photo_url
        });
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
        navigate('/');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Profile Button with backend photo_url */}
      <div className="profile-button" onClick={() => navigate('/profile')}>
        <img
          src={userData.photo_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          alt="Profile"
        />
      </div>

      <h2 className="dashboard-title">
        Welcome TO NITC-MARKET PLACE, {userData.name || 'User'}!
      </h2>

      <div className="actions">
        <div className="card">
          <h3>Buy Items</h3>
          <button onClick={() => navigate('/buy')}>Go to Buy</button>
        </div>
        <div className="card">
          <h3>Sell Items</h3>
          <button onClick={() => navigate('/sell')}>Go to Sell</button>
        </div>
        <div className="card">
          <h3>Listed Items</h3>
          <button onClick={() => navigate('/listings')}>MY-LISTINGS</button>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard;
