import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemDetails, setItemDetails] = useState(null);

  // Pagination and selection states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [selectedUsers, setSelectedUsers] = useState([]);

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
      await axios.post('http://localhost:5000/admin/disable-user', { user_id: userId });
      fetchUsers();
    } catch (error) {
      alert(`Error disabling user: ${error.message}`);
    }
  };

  const enableUser = async (userId) => {
    if (!window.confirm('Are you sure you want to enable this user?')) return;
    try {
      await axios.post('http://localhost:5000/admin/enable-user', { user_id: userId });
      fetchUsers();
    } catch (error) {
      alert(`Error enabling user: ${error.message}`);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/admin/delete-user/${userId}`);
      fetchUsers();
    } catch (error) {
      alert(`Error deleting user: ${error.message}`);
    }
  };

  const deleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }
    if (!window.confirm(`Delete ${selectedUsers.length} user(s)?`)) return;
    try {
      await axios.post('http://localhost:5000/admin/delete-users', { user_ids: selectedUsers });
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      alert(`Error deleting users: ${error.message}`);
    }
  };

  const approveItem = async (itemId) => {
    try {
      await axios.post(`http://localhost:5000/admin/approve-item`, { item_id: itemId });
      fetchPendingItems();
    } catch (error) {
      alert(`Error approving item: ${error.message}`);
    }
  };

  const approveAllItems = async () => {
    if (!window.confirm("Approve all pending items?")) return;
    try {
      await axios.patch('http://localhost:5000/admin/approve-all-items');
      fetchPendingItems();
    } catch (error) {
      alert(`Error approving all items: ${error.message}`);
    }
  };

  const fetchItemDetails = async (itemId) => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/item-details/${itemId}`);
      setItemDetails(res.data);
    } catch (error) {
      alert(`Error fetching item details: ${error.message}`);
    }
  };

  // Search filter
  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.contact_number || '').includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * entriesPerPage;
  const indexOfFirstUser = indexOfLastUser - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // Selection logic
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
  const currentPageUserIds = currentUsers.map(user => user.user_id);
  const allSelected = currentPageUserIds.every(id => selectedUsers.includes(id));

  if (allSelected) {
    // Deselect all on current page
    setSelectedUsers(prev => prev.filter(id => !currentPageUserIds.includes(id)));
  } else {
    // Select all on current page
    setSelectedUsers(prev => [...new Set([...prev, ...currentPageUserIds])]);
  }
};


  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Category Summary */}
      <section className="dashboard-section">
        <h3>Items by Category</h3>
        <div className="card-grid">
          {categoryCounts.map(({ category, total_items }) => (
            <div className="admin-card" key={category}>
              <h4>{category}</h4>
              <p>{total_items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Items */}
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

      {/* Item Details Modal */}
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
            <img
              src={itemDetails.image_url}
              alt="Item"
              style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '10px' }}
            />
          )}
          <button className="btn-close" onClick={() => setItemDetails(null)}>
            Close
          </button>
        </div>
      )}

         

      {/* Users Section */}
      <section className="dashboard-section">
        <h3>All Users</h3>
        
        <div className="search-pagination-control">
          <input
          type="text"
          placeholder="Search users by name, email or contact..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
            setSelectedUsers([]); // ✅ Reset selected users when search changes
          }}
          className="search-bar"
        />
         {currentUsers.length > 0 && (
      <button
        className="btn-delete-selected"
        onClick={deleteSelectedUsers}
        disabled={selectedUsers.length === 0}
      >
        Delete Selected ({selectedUsers.length})
      </button>
    )}
          <div className="entries-control">
            <label>Show </label>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <label> entries per page</label>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <button className="btn-delete-multi" onClick={deleteSelectedUsers}>
            Delete Selected ({selectedUsers.length})
          </button>
        )}

        {currentUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={currentUsers.every(user => selectedUsers.includes(user.user_id))}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.user_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={() => toggleUserSelection(user.user_id)}
                      />
                    </td>
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
                      <button className="btn-delete" onClick={() => deleteUser(user.user_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={goToPrevPage} disabled={currentPage === 1} className="pagination-button">
                ◀ Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-button">
                Next ▶
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
