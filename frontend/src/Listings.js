// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // <--- IMPORT AXIOS
// import { useNavigate } from 'react-router-dom'; // Assuming you might want to redirect if not logged in

// // This component will display the current user's items for sale
// function Listings() {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [userId, setUserId] = useState(null); // State to store the user ID
//     const navigate = useNavigate(); // Initialize navigate for redirection

//     // Effect hook to fetch user ID and then items when the component mounts
//     useEffect(() => {
//         const storedUserId = localStorage.getItem('userId');
//         console.log("DEBUG: Listings.js - userId from localStorage:", storedUserId); // <--- ADDED THIS LINE
        
//         if (storedUserId) {
//             setUserId(parseInt(storedUserId)); // Parse to integer if your backend expects int in path
//             fetchUserItems(parseInt(storedUserId)); // Pass parsed ID to fetch function
//         } else {
//             setError("User not logged in. Redirecting to login...");
//             setLoading(false);
//             // Redirect to login after a short delay
//             setTimeout(() => navigate('/login'), 2000); 
//         }
//     }, [navigate]); // Add navigate to dependency array

//     // Function to fetch items from the backend
//     const fetchUserItems = async (currentUserId) => {
//         setLoading(true);
//         setError(null); // Clear previous errors

//         try {
//             // --- CONVERTED TO AXIOS.GET ---
//             const response = await axios.get(`http://localhost:5000/user/${currentUserId}/items`, {
//                 withCredentials: true // IMPORTANT for sending cookies
//             });

//             setItems(response.data); // Axios puts the response body directly in .data

//         } catch (err) {
//             console.error("Failed to fetch user items:", err);
//             // Axios error handling: check err.response for backend error messages
//             const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred while fetching your listings.";
//             setError(errorMessage);
//         } finally {
//             setLoading(false); // Always set loading to false after fetch attempt
//         }
//     };

//     // Function to handle changing an item's sold status
//     const handleToggleSoldStatus = async (itemId, currentStatus) => {
//         if (!userId) {
//             setError("User not logged in. Cannot update status.");
//             return;
//         }

//         const newStatus = !currentStatus; // Toggle the status

//         try {
//             // --- CONVERTED TO AXIOS.PATCH ---
//             const response = await axios.patch(`http://localhost:5000/items/${itemId}/status`, {
//                 is_sold: newStatus,
//                 user_id: userId // Send user_id for authorization
//             }, {
//                 withCredentials: true
//             });

//             console.log("Item status updated:", response.data);

//             // Update the state to reflect the change immediately
//             setItems(prevItems =>
//                 prevItems.map(item =>
//                     item.item_id === itemId ? { ...item, is_sold: newStatus } : item
//                 )
//             );
//             alert("Item status updated successfully!");

//         } catch (err) {
//             console.error("Failed to update item status:", err);
//             const errorMessage = err.response?.data?.message || err.message || "Failed to update item status.";
//             alert(errorMessage);
//             setError(errorMessage); // Display error on UI
//         }
//     };

//     // Function to handle deleting an item
//     const handleDeleteItem = async (itemId) => {
//         if (!userId) {
//             setError("User not logged in. Cannot delete item.");
//             return;
//         }

//         if (window.confirm("Are you sure you want to delete this item?")) {
//             try {
//                 // --- CONVERTED TO AXIOS.DELETE ---
//                 const response = await axios.delete(`http://localhost:5000/items/${itemId}`, {
//                     data: { user_id: userId }, // For DELETE with body in axios, use 'data' key
//                     withCredentials: true
//                 });

//                 console.log("Item deleted:", response.data);

//                 // Remove the deleted item from the state
//                 setItems(prevItems => prevItems.filter(item => item.item_id !== itemId));
//                 alert("Item deleted successfully!");

//             } catch (err) {
//                 console.error("Failed to delete item:", err);
//                 const errorMessage = err.response?.data?.message || err.message || "Failed to delete item.";
//                 alert(errorMessage);
//                 setError(errorMessage); // Display error on UI
//             }
//         }
//     };

//     if (loading) {
//         return <div style={styles.container}>Loading your listings...</div>;
//     }

//     if (error) {
//         return <div style={styles.container}><p style={styles.errorMessage}>Error: {error}</p></div>;
//     }

//     return (
//         <div style={styles.container}>
//             <h2 style={styles.heading}>My Listings</h2>
//             {items.length === 0 ? (
//                 <p style={styles.noItemsMessage}>You have not listed any items yet.</p>
//             ) : (
//                 <div style={styles.grid}>
//                     {items.map((item) => (
//                         <div key={item.item_id} style={styles.card}>
//                             {item.image_url && (
//                                 <img src={item.image_url} alt={item.title} style={styles.itemImage} />
//                             )}
//                             <h3 style={styles.itemTitle}>{item.title}</h3>
//                             <p style={styles.itemDetail}><strong>Description:</strong> {item.description}</p>
//                             <p style={styles.itemDetail}><strong>Price:</strong> ₹{item.price}</p>
//                             <p style={styles.itemDetail}><strong>Quantity:</strong> {item.quantity}</p>
//                             <p style={styles.itemDetail}><strong>Condition:</strong> {item.item_condition}</p>
//                             <p style={styles.itemDetail}><strong>Category:</strong> {item.category_name}</p>
//                             <p style={styles.itemDetail}>
//                                 <strong>Status:</strong>{" "}
//                                 <span style={{ color: item.is_sold ? 'red' : 'green', fontWeight: 'bold' }}>
//                                     {item.is_sold ? "Sold" : "Available"}
//                                 </span>
//                             </p>
//                             <p style={styles.itemDetail}><strong>Posted On:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
//                             <div style={styles.buttonGroup}>
//                                 <button
//                                     onClick={() => handleToggleSoldStatus(item.item_id, item.is_sold)}
//                                     style={{ ...styles.button, backgroundColor: item.is_sold ? '#28a745' : '#ffc107' }}
//                                 >
//                                     Mark as {item.is_sold ? "Available" : "Sold"}
//                                 </button>
//                                 <button
//                                     onClick={() => handleDeleteItem(item.item_id)}
//                                     style={{ ...styles.button, backgroundColor: '#dc3545' }}
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// // Basic inline styles (consider using a CSS file or CSS-in-JS library in a real app)
// const styles = {
//     container: {
//         padding: '20px',
//         maxWidth: '1200px',
//         margin: '20px auto',
//         backgroundColor: '#f9f9f9',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     },
//     heading: {
//         textAlign: 'center',
//         color: '#333',
//         marginBottom: '30px',
//     },
//     grid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//         gap: '20px',
//     },
//     card: {
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '15px',
//         backgroundColor: '#fff',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//     },
//     itemImage: {
//         width: '100%',
//         maxHeight: '200px',
//         objectFit: 'cover',
//         borderRadius: '4px',
//         marginBottom: '15px',
//     },
//     itemTitle: {
//         color: '#007bff',
//         fontSize: '1.4em',
//         marginBottom: '10px',
//     },
//     itemDetail: {
//         fontSize: '0.95em',
//         color: '#555',
//         marginBottom: '5px',
//         width: '100%',
//         textAlign: 'left',
//     },
//     buttonGroup: {
//         marginTop: '15px',
//         display: 'flex',
//         gap: '10px',
//         width: '100%',
//         justifyContent: 'center',
//         flexWrap: 'wrap',
//     },
//     button: {
//         padding: '10px 15px',
//         borderRadius: '5px',
//         border: 'none',
//         color: 'white',
//         cursor: 'pointer',
//         fontSize: '0.9em',
//         transition: 'background-color 0.2s ease',
//         flexGrow: 1, // Allows buttons to grow to fill space
//         maxWidth: '150px', // Prevents buttons from becoming too wide
//     },
//     errorMessage: {
//         color: 'red',
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     noItemsMessage: {
//         textAlign: 'center',
//         color: '#666',
//         marginTop: '50px',
//         fontSize: '1.2em'
//     }
// };

// export default Listings;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Listings.css'; // Your styles

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
