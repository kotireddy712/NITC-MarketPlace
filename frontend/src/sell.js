// src/Sell.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Sell.css'; // You can create this for styling

export default function Sell() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [itemCondition, setItemCondition] = useState('Used');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch categories when the component mounts
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/categories');
                setCategories(res.data);
                if (res.data.length > 0) {
                    setSelectedCategory(res.data[0].category_id); // Set default selected category
                }
            } catch (err) {
                setError('Failed to fetch categories.');
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
            setError('User not logged in. Please log in to sell an item.');
            setLoading(false);
            navigate('/'); // Redirect to login
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('item_condition', itemCondition);
        formData.append('category_id', selectedCategory);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await axios.post('http://localhost:5000/sell_item', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(res.data.message);
            // Optionally, clear form or redirect
            setTitle('');
            setDescription('');
            setPrice('');
            setQuantity('1');
            setItemCondition('Used');
            setImage(null);
            setSelectedCategory(categories.length > 0 ? categories[0].category_id : '');
            // navigate('/dashboard'); // uncomment to redirect to dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to list item.');
            console.error('Error listing item:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sell-item-container">
            <h2>List a New Item</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4"></textarea>
                </div>

                <div className="form-group">
                    <label>Price ($):</label>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Quantity:</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required />
                </div>

                <div className="form-group">
                    <label>Condition:</label>
                    <select value={itemCondition} onChange={(e) => setItemCondition(e.target.value)} required>
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Used">Used</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                        {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Listing...' : 'List Item'}
                </button>
            </form>
            <button onClick={() => navigate('/dashboard')} className="back-button">Back to Dashboard</button>
        </div>
    );
}