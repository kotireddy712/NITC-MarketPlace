import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import './profile.css';

function Profile() {
  const email = localStorage.getItem('user_email');
  const navigate = useNavigate(); // ✅ initialize navigate

  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact_number: '',
    photo_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/${email}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.error('Error loading user data:', err));
  }, [email]);

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
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('contact_number', userData.contact_number);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axios.put(`http://localhost:5000/api/user/${email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUserData(res.data);
      setEditMode(false);
      setImageFile(null);
      alert('Profile updated!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile');
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

      <div className="profile-buttons">
        <button onClick={() => navigate('/Dashboard')}>Return to Dashboard</button> {/* ✅ added button */}

        {editMode ? (
          <>
            <button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)} disabled={loading}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}

export default Profile;
