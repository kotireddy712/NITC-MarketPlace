import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/MyLostFoundListings.css'; // You'll create this CSS file

function MyLostFoundListings() {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // For success/error messages
  const [isError, setIsError] = useState(false); // To style messages

  const userId = localStorage.getItem('user_id');

  // Function to fetch user's listings
  const fetchMyListings = async () => {
    if (!userId) {
      // Redirect if user_id is not found (not logged in)
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/lost_found/user/${userId}`);
      setMyListings(response.data);
    } catch (err) {
      console.error('Error fetching my lost and found listings:', err);
      setError('Failed to load your listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings on component mount and when userId/navigate changes
  useEffect(() => {
    fetchMyListings();
  }, [userId, navigate]);

  // Function to handle changing the status of a listing
  const handleStatusChange = async (itemId, newStatus) => {
    if (!userId) {
      setMessage('User not authenticated. Please log in.');
      setIsError(true);
      return;
    }

    // Add a confirmation dialog for status changes
    if (!window.confirm(`Are you sure you want to change the status of this item to "${newStatus}"?`)) {
      return; // User cancelled
    }

    setMessage(''); // Clear previous messages
    setIsError(false);

    try {
      const response = await axios.patch(`http://localhost:5000/lost_found/items/${itemId}/status`, {
        user_id: userId, // Send user ID for authorization check on backend
        new_status: newStatus,
      });
      setMessage(response.data.message);
      setIsError(false);
      fetchMyListings(); // Refresh listings after successful update
    } catch (err) {
      console.error('Error updating item status:', err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Failed to update item status.');
    }
  };

  // Function to handle deleting a listing
  const handleDeleteListing = async (itemId) => {
    if (!userId) {
      setMessage('User not authenticated. Please log in.');
      setIsError(true);
      return;
    }

    // Add a confirmation dialog for deletion
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return; // User cancelled
    }

    setMessage(''); // Clear previous messages
    setIsError(false);

    try {
      // For DELETE requests, send data in the 'data' property
      const response = await axios.delete(`http://localhost:5000/lost_found/items/${itemId}`, {
        data: { user_id: userId }, // Send user_id in the request body for verification
      });
      setMessage(response.data.message);
      setIsError(false);
      fetchMyListings(); // Refresh listings after successful deletion
    } catch (err) {
      console.error('Error deleting listing:', err);
      setIsError(true);
      setMessage(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  if (loading) {
    return (
      <div className="my-lost-found-listings-container">
        <p>Loading your lost and found items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-lost-found-listings-container error-message">
        <p>{error}</p>
        <button onClick={() => navigate('/lost-found')} className="back-button">
          ⬅️ Back to Lost & Found Hub
        </button>
      </div>
    );
  }

  return (
    <div className="my-lost-found-listings-container">
      <h2 className="my-lost-found-listings-title">My Lost & Found Listings 📋</h2>

      {/* Display messages for success/error */}
      {message && (
        <div className={`status-message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {myListings.length === 0 ? (
        <p className="no-listings-message">You haven't posted any lost or found items yet.</p>
      ) : (
        <div className="listings-grid">
          {myListings.map((item) => (
            <div key={item.item_id} className="listing-card">
              <div className={`listing-type ${item.listing_type.toLowerCase()}`}>
                {item.listing_type}
              </div>
              {item.image_url && (
                <img src={item.image_url} alt={item.item_name} className="listing-image" />
              )}
              <h3 className="listing-name">{item.item_name}</h3>
              <p className="listing-description">
                {item.description || 'No detailed description provided.'}
              </p>
              <p className="listing-details">
                <strong>When:</strong> {new Date(item.date_time_lost_found).toLocaleString()}
              </p>
              <p className="listing-details">
                <strong>Where:</strong> {item.location_details || 'N/A'}
              </p>
              <p className="listing-details">
                <strong>Posted On:</strong> {new Date(item.posted_at).toLocaleString()}
              </p>
              <p className="listing-details">
                <strong>Current Status:</strong> <span className={`status-${item.status.toLowerCase()}`}>{item.status}</span>
              </p>

              {/* Action Buttons */}
              <div className="card-actions">
                {item.status === 'Active' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(item.item_id, 'Claimed')}
                      className="action-button mark-claimed"
                    >
                      Mark as Claimed
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.item_id, 'Returned')}
                      className="action-button mark-returned"
                    >
                      Mark as Returned
                    </button>
                  </>
                )}
                {/* Option to reactivate if needed */}
                {(item.status === 'Claimed' || item.status === 'Returned') && (
                   <button
                   onClick={() => handleStatusChange(item.item_id, 'Active')}
                   className="action-button mark-active"
                 >
                   Mark as Active Again
                 </button>
                )}
                <button
                  onClick={() => handleDeleteListing(item.item_id)}
                  className="action-button delete-button"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate('/lost-found')} className="back-button">
        ⬅️ Back to Lost & Found Hub
      </button>
    </div>
  );
}

export default MyLostFoundListings;