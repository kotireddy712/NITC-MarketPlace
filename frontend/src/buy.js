import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Buy.css'; // Keep this CSS file for styling

export default function Buy() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // New state to track which item's contact details are currently visible
    const [showContactForItemId, setShowContactForItemId] = useState(null);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/categories');
                setCategories(res.data);
                fetchItems(); // Fetch all items initially
            } catch (err) {
                setError('Failed to load categories. Please try again.');
                console.error('Error fetching categories:', err);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch items whenever selectedCategory changes
    useEffect(() => {
        if (categories.length > 0 || selectedCategory === '') {
            fetchItems();
        }
    }, [selectedCategory, categories]);

    const fetchItems = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:5000/items';
            if (selectedCategory) {
                url += `?category_id=${selectedCategory}`;
            }
            const res = await axios.get(url);
            setItems(res.data);
            setShowContactForItemId(null); // Hide contact details when new items are loaded
        } catch (err) {
            setError('Failed to load items. Please try again.');
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // New handler for showing/hiding contact details
    const handleContactClick = (itemId) => {
        // Toggle visibility: if already showing for this item, hide it; otherwise, show it.
        setShowContactForItemId(prevId => (prevId === itemId ? null : itemId));
    };

    return (
        <div className="buy-page-container">
            <h2>Browse Available Items</h2>

            <div className="category-selection">
                <label htmlFor="category-select">Filter by Category:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="loading-message">Loading items...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && items.length === 0 && !error && (
                <p className="no-items-message">No items found in this category.</p>
            )}

            <div className="items-grid">
                {items.map((item) => (
                    <div key={item.item_id} className={`item-card ${item.is_sold ? 'sold-item' : ''}`}>
                        {item.image_url && (
                            <img src={item.image_url} alt={item.title} className="item-image" />
                        )}
                        <h3 className="item-title">{item.title}</h3>
                        <p className="item-description">{item.description}</p>
                        <p className="item-price">Price: ₹{item.price}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                        <p className="item-condition">Condition: {item.item_condition}</p>
                        <p className="item-category">Category: {item.category_name}</p>
                        <p className="item-seller">Seller: {item.seller_name}</p>
                        <p className="item-posted-date">Posted: {new Date(item.created_at).toLocaleDateString()}</p>
                        <p className="item-sold-status">Status: {item.is_sold ? 'SOLD' : 'Available'}</p> {/* Display is_sold */}

                        {/* Contact Seller Button */}
                        {!item.is_sold && ( // Only show contact if not sold
                            <button
                                className="contact-seller-button"
                                onClick={() => handleContactClick(item.item_id)}
                            >
                                {showContactForItemId === item.item_id ? 'Hide Contact' : 'Contact Seller'}
                            </button>
                        )}

                        {/* Contact Details Display */}
                        {showContactForItemId === item.item_id && (
                            <div className="contact-details">
                                <h4>Seller Contact:</h4>
                                <p>Email: {item.seller_email}</p>
                                <p>Phone: {item.seller_contact_number}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">
                Back to Dashboard
            </button>
        </div>
    );
}