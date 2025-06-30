import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './buy.css';

export default function Buy() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // 🔥 Added
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showContactForItemId, setShowContactForItemId] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/categories`);
                setCategories(res.data);
                fetchItems();
            } catch (err) {
                setError('Failed to load categories. Please try again.');
                console.error(err);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchItems();
    }, [selectedCategory]);

    const fetchItems = async () => {
        setLoading(true);
        setError('');
        try {
            let url = '${process.env.REACT_APP_BACKEND_URL}/items`;
            if (selectedCategory) {
                url += `?category_id=${selectedCategory}`;
            }
            const res = await axios.get(url);
            setItems(res.data);
            setShowContactForItemId(null);
        } catch (err) {
            setError('Failed to load items. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleContactClick = (itemId) => {
        setShowContactForItemId(prevId => (prevId === itemId ? null : itemId));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 🔍 Filter items based on search term (title or description)
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="buy-page-container">
            <h2>Browse Available Items</h2>

            <div className="filters-container">
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
                {/* 🔥 Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {loading && <p className="loading-message">Loading items...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && filteredItems.length === 0 && !error && (
                <p className="no-items-message">No items found matching your search.</p>
            )}

            <div className="items-grid">
                {filteredItems.map((item) => (
                    <div key={item.item_id} className={`item-card ${item.is_sold ? 'sold-item' : ''}`}>
                        {item.image_url && (
                            <img src={item.image_url} alt={item.title} className="item-image" />
                        )}
                        <h3 className="item-title">{item.title}</h3>
                        <p
  className={`item-approved ${item.is_approved ? 'approved' : 'not-approved'}`}
>
  {item.is_approved ? '✅ Admin Approved' : '❌ Not Approved by Admin'}
</p>

                        <p className="item-description">{item.description}</p>
                        <p className="item-price">Price: ₹{item.price}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                        <p className="item-condition">Condition: {item.item_condition}</p>
                        <p className="item-category">Category: {item.category_name}</p>
                        <p className="item-seller">Seller: {item.seller_name}</p>
                        <p className="item-posted-date">Posted: {new Date(item.created_at).toLocaleDateString()}</p>
                        <p className="item-sold-status">Status: {item.is_sold ? 'SOLD' : 'Available'}</p>

                        {!item.is_sold && (
                            <button
                                className="contact-seller-button"
                                onClick={() => handleContactClick(item.item_id)}
                            >
                                {showContactForItemId === item.item_id ? 'Hide Contact' : 'Contact Seller'}
                            </button>
                        )}

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
