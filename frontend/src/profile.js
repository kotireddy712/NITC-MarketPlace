import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const email = localStorage.getItem('user_email');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact_number: '',
    photo_url: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Message state
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/user/${email}`)
      .then((res) => setUserData(res.data))
      .catch((err) => {
        console.error('Error loading user data:', err);
        showMessage('Failed to load user data', 'error');
      });
  }, [email]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Profile Update
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('contact_number', userData.contact_number);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const profileRes = await axios.put(`http://localhost:5000/api/user/${email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 2. Password Update (if fields are filled)
      if (oldPassword || newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          showMessage("New passwords don't match", 'error');
          setLoading(false);
          return;
        }

        await axios.put('http://localhost:5000/api/user/change-password', {
          email,
          oldPassword,
          newPassword,
        });

        showMessage('Password updated successfully!', 'success');
      }

      setUserData(profileRes.data);
      setEditMode(false);
      setImageFile(null);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage('Profile updated!', 'success');
    } catch (error) {
      console.error('Error updating profile or password:', error);
      showMessage(
        'Failed to update profile or password: ' + (error.response?.data?.message || 'Unknown error'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-image">
        <img src={userData.photo_url || 'https://via.placeholder.com/150'} alt="Profile" />
        {editMode && (
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
        )}
      </div>

      <div className="profile-info">
        <label>Name:</label>
        {editMode ? (
          <input name="name" value={userData.name} onChange={handleChange} />
        ) : (
          <p>{userData.name}</p>
        )}

        <label>Email:</label>
        <p>{userData.email}</p>

        <label>Phone:</label>
        {editMode ? (
          <input name="contact_number" value={userData.contact_number} onChange={handleChange} />
        ) : (
          <p>{userData.contact_number}</p>
        )}
      </div>
      
      {editMode && (
        <div className="password-change-section">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      )}

      <div className="profile-buttons">
        {editMode ? (
          <>
            <button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)} disabled={loading}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>

      {/* Bottom message display */}
      {message && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: messageType === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 9999,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Profile;
