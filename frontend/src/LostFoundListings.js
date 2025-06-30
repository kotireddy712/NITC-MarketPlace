import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LostFoundListings.css'; // Ensure this CSS file exists and is linked

function LostFoundListings() {
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState([]); // Stores all fetched listings
  const [filteredListings, setFilteredListings] = useState([]); // Stores listings after search/filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NEW: State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Lost', 'Found'

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Backend already handles fetching all active items, which is good.
        // If you later need to send filter parameters to backend, you'd modify this axios call.
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/lost_found/all`);
        setAllListings(response.data);
        setFilteredListings(response.data); // Initially, all listings are displayed
      } catch (err) {
        console.error('Error fetching lost and found listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // ✅ NEW: useEffect to apply filters whenever searchTerm or filterType changes
  useEffect(() => {
    let currentFiltered = allListings;

    // Apply type filter first
    if (filterType !== 'All') {
      currentFiltered = currentFiltered.filter(
        (item) => item.listing_type === filterType
      );
    }

    // Apply search term filter
    if (searchTerm) {
      currentFiltered = currentFiltered.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredListings(currentFiltered);
  }, [searchTerm, filterType, allListings]); // Depend on allListings to re-filter if data changes

  if (loading) {
    return (
      <div className="lost-found-listings-container">
        <p>Loading lost and found items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lost-found-listings-container error-message">
        <p>{error}</p>
        <button onClick={() => navigate('/lost-found')} className="back-button">
          ⬅️ Back to Lost & Found Hub
        </button>
      </div>
    );
  }

  return (
    <div className="lost-found-listings-container">
      <h2 className="lost-found-listings-title">All Lost & Found Items 🔍</h2>

      {/* ✅ NEW: Search and Filter Controls */}
      <div className="listings-controls">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Items</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>
      </div>

      {filteredListings.length === 0 && !loading ? (
        <p className="no-listings-message">
          {searchTerm || filterType !== 'All'
            ? 'No items match your search/filter criteria.'
            : 'No lost or found items posted yet. Be the first to list one!'}
        </p>
      ) : (
        <div className="listings-grid">
          {filteredListings.map((item) => (
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
                <strong>Posted By:</strong> {item.user_name}
              </p>
              <p className="listing-details">
                <strong>Contact:</strong> {item.user_contact_number}
              </p>
              <p className="listing-details">
                <strong>Email:</strong> <a href={`mailto:${item.user_email}`}>{item.user_email}</a>
              </p>
              <p className="listing-details">
                <strong>Status:</strong> <span className={`status-${item.status.toLowerCase()}`}>{item.status}</span>
              </p>
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

export default LostFoundListings;
