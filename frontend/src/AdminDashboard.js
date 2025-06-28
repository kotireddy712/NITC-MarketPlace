import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate

  const [categoryCounts, setCategoryCounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemDetails, setItemDetails] = useState(null);
  const [items, setItems] = useState([]);


  // Pagination and selection states for Users
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Changed default to 10 for users table
  const [selectedUsers, setSelectedUsers] = useState([]);

  // New states for Feedback section
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);
  const [feedbackEntriesPerPage, setFeedbackEntriesPerPage] = useState(10);
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');
  const [feedbackTotalCount, setFeedbackTotalCount] = useState(0);

  useEffect(() => {
    fetchCategoryCounts();
    fetchUsers();
    fetchPendingItems();
  }, []);

  // Fetch feedbacks when the feedback section is shown or pagination/search changes
  useEffect(() => {
    if (showFeedbackSection) {
      fetchFeedbacks();
    }
  }, [showFeedbackSection, feedbackCurrentPage, feedbackEntriesPerPage, feedbackSearchQuery]);


  const fetchCategoryCounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/category-counts');
      setCategoryCounts(res.data);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    }
  };
 const handleCategoryClick = async (categoryId) => {
    console.log("Category clicked:", categoryId); // 🔥 Debug line
    try {
        const res = await axios.get(`http://localhost:5000/admin/items-by-category/${categoryId}`);
        setItems(res.data);
    } catch (error) {
        console.error('Error fetching items for this category:', error);
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

  // --- New Feedback Fetching Function ---
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/feedbacks', {
        params: {
          page: feedbackCurrentPage,
          limit: feedbackEntriesPerPage,
          search: feedbackSearchQuery
        }
      });
      setFeedbacks(res.data.feedbacks);
      setFeedbackTotalCount(res.data.total_feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
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

  const disapproveItem = async (itemId) => {
  try {
    await axios.post('http://localhost:5000/admin/disapprove-item', { item_id: itemId });
    alert('Item disapproved and deleted successfully');
    fetchPendingItems(); // Refresh the pending items list
  } catch (error) {
    alert(`Error disapproving item: ${error.message}`);
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

  const disapproveAllItems = async () => {
  if (!window.confirm("Disapprove (Delete) all pending items? This cannot be undone.")) return;
  try {
    await axios.delete('http://localhost:5000/admin/disapprove-all-items');
    fetchPendingItems();
  } catch (error) {
    alert(`Error disapproving all items: ${error.message}`);
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

  // Search filter for Users
  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.contact_number || '').includes(searchQuery)
  );

  // Pagination logic for Users
  const indexOfLastUser = currentPage * entriesPerPage;
  const indexOfFirstUser = indexOfLastUser - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / entriesPerPage);

  const goToNextUserPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalUserPages));
  const goToPrevUserPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToUserPage = (pageNumber) => setCurrentPage(pageNumber);

  // Selection logic for Users
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAllUsers = () => {
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

  // Pagination logic for Feedbacks
  const feedbackTotalPages = Math.ceil(feedbackTotalCount / feedbackEntriesPerPage);
  const goToNextFeedbackPage = () => setFeedbackCurrentPage((prev) => Math.min(prev + 1, feedbackTotalPages));
  const goToPrevFeedbackPage = () => setFeedbackCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFeedbackPage = (pageNumber) => setFeedbackCurrentPage(pageNumber);

  // Function to navigate to the LandingPage
  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Return to Home Button */}
      <button className="return-home-button" onClick={handleReturnHome}>
        Return to Home 🏠
      </button>

      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Admin Actions */}
      <section className="dashboard-section admin-actions-grid">
        <button
          className={`admin-action-button ${!showFeedbackSection ? 'active-section-button' : ''}`}
          onClick={() => setShowFeedbackSection(false)}
        >
          Manage Users & Items
        </button>
        <button
          className={`admin-action-button ${showFeedbackSection ? 'active-section-button' : ''}`}
          onClick={() => setShowFeedbackSection(true)}
        >
          View Feedbacks
        </button>
      </section>

      {!showFeedbackSection ? (
        <>
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
                {pendingItems.length > 0 && (
      <button className="btn-disapprove-all" onClick={disapproveAllItems}>
  Disapprove All
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
                  <button className="btn-disapprove" onClick={() => disapproveItem(item.item_id)}>
                    Disapprove
                  </button>
                </li>
              ))}
            </ul>
          )}


          </section>
          {items.length > 0 && (
  <section className="dashboard-section">
    <h3>Items in Selected Category</h3>
    <div className="items-grid">
      {items.map((item) => (
        <div key={item.item_id} className="item-card">
          <h4>{item.title}</h4>
          <p>Price: ₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Condition: {item.item_condition}</p>
          {item.image_url && <img src={item.image_url} alt={item.title} />}
        </div>
      ))}
    </div>
  </section>
)}


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
                  setSelectedUsers([]); // Reset selected users when search changes
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
                          onChange={toggleSelectAllUsers}
                          checked={currentUsers.length > 0 && currentUsers.every(user => selectedUsers.includes(user.user_id))}
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
                  <button onClick={goToPrevUserPage} disabled={currentPage === 1} className="pagination-button">
                    ◀ Prev
                  </button>
                  {[...Array(totalUserPages)].map((_, index) => (
                    <button
                      key={`user-page-${index + 1}`}
                      onClick={() => goToUserPage(index + 1)}
                      className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={goToNextUserPage} disabled={currentPage === totalUserPages} className="pagination-button">
                    Next ▶
                  </button>
                </div>
              </>
            )}
          </section>
        </>
      ) : (
        // {/* --- Feedbacks Section --- */ }
        <section className="dashboard-section">
          <h3>Customer Feedbacks</h3>
          <div className="search-pagination-control">
            <input
              type="text"
              placeholder="Search feedbacks by name, email, contact, or text..."
              value={feedbackSearchQuery}
              onChange={(e) => {
                setFeedbackSearchQuery(e.target.value);
                setFeedbackCurrentPage(1); // Reset to first page on new search
              }}
              className="search-bar"
            />
            <div className="entries-control">
              <label>Show </label>
              <select
                value={feedbackEntriesPerPage}
                onChange={(e) => {
                  setFeedbackEntriesPerPage(parseInt(e.target.value));
                  setFeedbackCurrentPage(1); // Reset to first page on entries per page change
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <label> entries per page</label>
            </div>
          </div>

          {feedbacks.length === 0 && !feedbackSearchQuery ? (
            <p>No feedbacks submitted yet.</p>
          ) : feedbacks.length === 0 && feedbackSearchQuery ? (
            <p>No feedbacks found matching your search.</p>
          ) : (
            <>
              <table className="admin-table feedback-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Feedback</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map(feedback => (
                    <tr key={feedback.feedback_id}>
                      <td>{feedback.feedback_id}</td>
                      <td>{feedback.user_name}</td>
                      <td>{feedback.user_email}</td>
                      <td>{feedback.user_contact_number || 'N/A'}</td>
                      <td className="feedback-text-cell">{feedback.feedback_text}</td>
                      <td>{new Date(feedback.submission_timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button onClick={goToPrevFeedbackPage} disabled={feedbackCurrentPage === 1} className="pagination-button">
                  ◀ Prev
                </button>
                {[...Array(feedbackTotalPages)].map((_, index) => (
                  <button
                    key={`feedback-page-${index + 1}`}
                    onClick={() => goToFeedbackPage(index + 1)}
                    className={`pagination-button ${feedbackCurrentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={goToNextFeedbackPage} disabled={feedbackCurrentPage === feedbackTotalPages} className="pagination-button">
                  Next ▶
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
