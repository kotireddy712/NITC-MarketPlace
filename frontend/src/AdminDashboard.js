import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    fetchCategoryCounts();
    fetchUsers();
    fetchPendingItems();
  }, []);

  const fetchCategoryCounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/category-counts');
      setCategoryCounts(res.data);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPendingItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/pending-items');
      setPendingItems(res.data);
    } catch (error) {
      console.error('Error fetching pending items:', error);
    }
  };

  const disableUser = async (userId) => {
    if (!window.confirm('Are you sure you want to disable this user?')) return;
    try {
      const res = await axios.post('http://localhost:5000/admin/disable-user', { user_id: userId });
      console.log(res.data.message); // Log success message
      fetchUsers(); // Re-fetch users to update the UI
    } catch (error) {
      console.error('Error disabling user:', error.response ? error.response.data : error.message);
      alert(`Error disabling user: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const enableUser = async (userId) => {
    if (!window.confirm('Are you sure you want to enable this user?')) return;
    try {
      const res = await axios.post('http://localhost:5000/admin/enable-user', { user_id: userId });
      console.log(res.data.message); // Log success message
      fetchUsers(); // Re-fetch users to update the UI
    } catch (error) {
      console.error('Error enabling user:', error.response ? error.response.data : error.message);
      alert(`Error enabling user: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const approveItem = async (itemId) => {
    try {
      const res = await axios.post(`http://localhost:5000/admin/approve-item`, { item_id: itemId });
      console.log(res.data.message);
      fetchPendingItems();
    } catch (error) {
      console.error('Error approving item:', error.response ? error.response.data : error.message);
      alert(`Error approving item: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const approveAllItems = async () => {
    if (!window.confirm("Approve all pending items?")) return;
    try {
      const res = await axios.patch('http://localhost:5000/admin/approve-all-items');
      console.log(res.data.message);
      fetchPendingItems();
    } catch (error) {
      console.error('Error approving all items:', error.response ? error.response.data : error.message);
      alert(`Error approving all items: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const fetchItemDetails = async (itemId) => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/item-details/${itemId}`);
      setItemDetails(res.data);
    } catch (error) {
      console.error('Error fetching item details:', error.response ? error.response.data : error.message);
      alert(`Error fetching item details: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.contact_number || '').includes(searchQuery)
  );

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      <section className="dashboard-section">
        <h3>Items by Category</h3>
        <div className="card-grid">
          {Array.isArray(categoryCounts) && categoryCounts.map(({ category, total_items }) => (
            <div className="admin-card" key={category}>
              <h4>{category}</h4>
              <p>{total_items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Pending Items for Approval</h3>
        {pendingItems.length > 0 && (
          <button className="btn-approve-all" onClick={approveAllItems}>
            Approve All
          </button>
        )}
        {pendingItems.length === 0 ? (
          <p>No items pending approval.</p>
        ) : (
          <ul className="pending-list">
            {pendingItems.map(item => (
              <li key={item.item_id} className="pending-item">
                <strong
                  className="clickable-title"
                  onClick={() => fetchItemDetails(item.item_id)}
                >
                  {item.title}
                </strong>{" "}
                - {item.category}
                <button className="btn-approve" onClick={() => approveItem(item.item_id)}>
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {itemDetails && (
        <div className="item-details-modal">
          <h4>Item Details</h4>
          <p><strong>Title:</strong> {itemDetails.title}</p>
          <p><strong>Description:</strong> {itemDetails.description}</p>
          <p><strong>Price:</strong> ₹{itemDetails.price}</p>
          <p><strong>Quantity:</strong> {itemDetails.quantity}</p>
          <p><strong>Condition:</strong> {itemDetails.item_condition}</p>
          <p><strong>Uploaded by:</strong> {itemDetails.uploaded_by}</p>
          <p><strong>Category:</strong> {itemDetails.category}</p>
          <p><strong>Posted on:</strong> {new Date(itemDetails.created_at).toLocaleDateString()}</p>
          {itemDetails.image_url && (
            <div>
              <img
                src={itemDetails.image_url}
                alt="Item"
                style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '10px' }}
              />
            </div>
          )}
          <button className="btn-close" onClick={() => setItemDetails(null)}>
            Close
          </button>
        </div>
      )}

      <section className="dashboard-section">
        <h3>All Users</h3>
        <input
          type="text"
          placeholder="Search users by name, email or contact..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.user_id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contact_number}</td>
                  <td>{user.is_disabled ? 'Disabled' : 'Active'}</td>
                  <td>
                    {user.is_disabled ? (
                      <button className="btn-enable" onClick={() => enableUser(user.user_id)}>Enable</button>
                    ) : (
                      <button className="btn-danger" onClick={() => disableUser(user.user_id)}>Disable</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
