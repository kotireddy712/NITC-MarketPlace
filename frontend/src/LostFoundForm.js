import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LostFoundForm.css'; // You'll create this CSS file

function LostFoundForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    listing_type: 'Lost', // Default to 'Lost'
    item_name: '',
    description: '',
    location_details: '',
    date_time_lost_found: '',
    image: null, // For file input
  });
  const [user, setUser] = useState(null); // To store user_id from local storage
  const [previewImage, setPreviewImage] = useState(null); // To display image preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    if (!userId || !userName) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    setUser({ user_id: userId, name: userName });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (!user || !user.user_id) {
      setMessage('User not authenticated. Please log in.');
      setIsError(true);
      setLoading(false);
      return;
    }

    // Basic validation
    if (!formData.item_name || !formData.listing_type || !formData.date_time_lost_found) {
      setMessage('Please fill in all required fields (Item Name, Listing Type, Date/Time).');
      setIsError(true);
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('user_id', user.user_id);
    data.append('listing_type', formData.listing_type);
    data.append('item_name', formData.item_name);
    data.append('description', formData.description);
    data.append('location_details', formData.location_details);
    data.append('date_time_lost_found', formData.date_time_lost_found);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lost_found/items`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'Item listed successfully!');
      setIsError(false);
      // Clear form or navigate
      setFormData({
        listing_type: 'Lost',
        item_name: '',
        description: '',
        location_details: '',
        date_time_lost_found: '',
        image: null,
      });
      setPreviewImage(null);
      setTimeout(() => navigate('/lost-found'), 2000); // Go back to lost/found dashboard
    } catch (error) {
      console.error('Error listing lost/found item:', error);
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to list item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lost-found-form-container">
      <h2 className="lost-found-form-title">Post a Lost or Found Item</h2>

      {message && (
        <div className={`form-message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="lost-found-form">
        <div className="form-group">
          <label htmlFor="listing_type">Listing Type:</label>
          <select
            id="listing_type"
            name="listing_type"
            value={formData.listing_type}
            onChange={handleChange}
            required
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="item_name">Item Name:</label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            placeholder="e.g., Blue Water Bottle, Gold Ring"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Detailed description, distinguishing marks, etc."
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="location_details">Location Details (optional):</label>
          <input
            type="text"
            id="location_details"
            name="location_details"
            value={formData.location_details}
            onChange={handleChange}
            placeholder="e.g., Near Main Library, C-Block Parking Lot"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_time_lost_found">Date & Time Lost/Found:</label>
          <input
            type="datetime-local"
            id="date_time_lost_found"
            name="date_time_lost_found"
            value={formData.date_time_lost_found}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image (optional):</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Image Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Post Listing'}
        </button>
      </form>

      <button onClick={() => navigate('/lost-found')} className="back-button">
        ⬅️ Back to Lost & Found Hub
      </button>
    </div>
  );
}

export default LostFoundForm;
