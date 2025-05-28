import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './buy.css';

function Buy() {
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (category) {
      axios
        .get(`http://localhost:5000/items?category=${category}`)
        .then((res) => {
          console.log('Fetched items:', res.data);
          setItems(res.data);
        })
        .catch((err) => console.error('Error fetching items:', err));
    }
  }, [category]);

  const handleBuy = (itemId) => {
    alert(`Buy functionality for item ${itemId} not implemented yet.`);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    'Electronics',
    'Books & Study Materials',
    'Hostel Essentials',
    'Clothing & Accessories',
    'Bicycles & Transportation',
    'Event Tickets & Passes',
    'Services',
    'Car',
    'Bike',
  ];

  return (
    <div className="buy-page">
      <h2 className="select-category-title">🎯 Select a Category</h2>
      <select
        className="category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">-- Choose a category --</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {items.length > 0 && (
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by item name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {category && items.length === 0 && (
        <p className="no-items">❌ No items found in this category.</p>
      )}

      <div className="items-list">
       {filteredItems.map((item) => (
  <div className="item-card" key={item.item_id}>
    <img
      src={item.image_url}
      alt={item.title}
      className="item-image"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/150'; // fallback image
      }}
    />
    <h4>{item.title}</h4>
    <p>{item.description}</p>
    <p>₹{item.price}</p>
    <button onClick={() => handleBuy(item.item_id)}>Buy</button>
  </div>
))}

      </div>
    </div>
  );
}

export default Buy;

