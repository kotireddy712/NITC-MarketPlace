import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Listings.css'; // Your styles

function MyListings() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (!userId) {
            setMessage("You must be logged in to view your listings.");
            setMessageType('error');
            navigate('/');
            return;
        }

        const fetchListings = async () => {
            setIsLoading(true);
            setError('');
            setMessage('');
            try {
                const response = await fetch(`http://localhost:5000/user/${userId}/items`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || `Error: ${response.status}`);
                }
                const data = await response.json();
                setListings(data);
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, [userId, navigate]);

    const handleToggleStatus = async (itemId, currentStatus) => {
        const newStatus = !currentStatus;
        setMessage('');
        setMessageType('');
        try {
            const response = await fetch(`http://localhost:5000/items/${itemId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    is_sold: newStatus,
                    user_id: parseInt(userId)
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update status');
            }

            setListings(prev => 
                prev.map(item => item.item_id === itemId ? { ...item, is_sold: newStatus } : item)
            );

            setMessage(`Item status updated to ${newStatus ? 'Unavailable (Sold)' : 'Available'}.`);
            setMessageType('success');
        } catch (err) {
            console.error("Error updating item status:", err);
            setMessage(`Error: ${err.message}`);
            setMessageType('error');
        }
    };

    const handleDeleteItem = async (itemId) => {
        setMessage('');
        setMessageType('');
        if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: parseInt(userId) }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to delete item');
            }

            setListings(prev => prev.filter(item => item.item_id !== itemId));
            setMessage("Item deleted successfully.");
            setMessageType('success');
        } catch (err) {
            console.error("Error deleting item:", err);
            setMessage(`Error: ${err.message}`);
            setMessageType('error');
        }
    };

    if (isLoading) return <p className="loading-message">Loading your listings...</p>;
    if (error) return <p className="error-message">Error fetching listings: {error}</p>;

    return (
        <div className="my-listings-container">
            <h2>My Listed Items</h2>
            
            {message && (
                <div className={`message-box ${messageType === 'success' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {listings.length === 0 ? (
                <p>You haven't listed any items yet. <button onClick={() => navigate('/sell')}>Sell an Item</button></p>
            ) : (
                <div className="listings-grid">
                    {listings.map(item => (
                        <div key={item.item_id} className="listing-card">
                            <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.title} className="listing-image" />
                            <h3>{item.title}</h3>
                            <p>Price: ₹{item.price}</p>
                            <p>Condition: {item.item_condition}</p>
                            <p>Status: <span className={item.is_sold ? 'status-sold' : 'status-available'}>
                                {item.is_sold ? 'Unavailable (Sold)' : 'Available'}
                            </span></p>
                            <p>Category: {item.category_name}</p>
                            <div className="listing-actions">
                                <button 
                                    onClick={() => handleToggleStatus(item.item_id, item.is_sold)}
                                    className="status-toggle-button"
                                >
                                    Mark as {item.is_sold ? 'Available' : 'Unavailable (Sold)'}
                                </button>
                                <button 
                                    onClick={() => handleDeleteItem(item.item_id)}
                                    className="delete-button"
                                >
                                    Delete Item
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => navigate('/dashboard')} className="back-dashboard-button">Back to Dashboard</button>
        </div>
    );
}

export default MyListings;
