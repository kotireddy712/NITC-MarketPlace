// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './styles/Dashboard.css'; // Keep dashboard-specific CSS
// import FeedbackModal from './FeedbackModal'; // Import the new FeedbackModal component

// function Dashboard() {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState({
//     name: '',
//     photo_url: ''
//   });
//   // State for feedback modal visibility
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);

//   useEffect(() => {
//     const email = localStorage.getItem('user_email');
//     if (!email) {
//       navigate('/');
//       return;
//     }

//     // Fetch user data including name and photo_url
//     axios.get(`http://localhost:5000/api/user/${email}`)
//       .then((res) => {
//         setUserData({
//           name: res.data.name,
//           photo_url: res.data.photo_url
//         });
//       })
//       .catch((err) => {
//         console.error('Failed to load user data:', err);
//         // Fallback for user data if API fails
//         setUserData({ name: 'User', photo_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' });
//       });
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };

//   /**
//    * Handles the submission of feedback by sending it to the backend.
//    * This function is passed as a prop to the FeedbackModal.
//    * @param {string} feedbackText The text entered by the user in the modal.
//    */
//   const handleFeedbackSubmit = async (feedbackText) => {
//     const userEmail = localStorage.getItem('user_email');
//     if (!userEmail) {
//       console.error("User email not found in localStorage. Cannot submit feedback.");
//       throw new Error("User not logged in or email unavailable.");
//     }

//     try {
//       // Send feedback along with the user's email to the backend
//       // The backend will then retrieve name and contact_number from the users table
//       const response = await axios.post('http://localhost:5000/api/feedback', {
//         user_email: userEmail,
//         feedback: feedbackText,
//       });
//       console.log('Feedback submitted successfully via API:', response.data);
//       return response.data; // Return data for FeedbackModal to process (e.g., success message)
//     } catch (error) {
//       console.error('Error submitting feedback to backend:', error.response ? error.response.data : error.message);
//       // Re-throw the error so FeedbackModal can display an error message
//       throw error;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Profile Button */}
//       <div className="profile-button" onClick={() => navigate('/profile')}>
//         <img
//           src={userData.photo_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
//           alt="Profile"
//         />
//       </div>

//       {/* Feedback Button */}
//       <button className="feedback-button" onClick={() => setShowFeedbackModal(true)}>
//         ⭐ Give Feedback
//       </button>

//       <h2 className="dashboard-title">
//         <span className="title-greeting">Welcome to NITC Marketplace, </span>
//         <span className="user-name">{userData.name || 'User'}</span>!
//       </h2>

//       {/* Main Action Buttons */}
//       <div className="actions">
//         <div className="card">
//           <h3 className="card-title">Buy / Sell</h3>
//           <button onClick={() => navigate('/buy-sell')} className="action-button">
//             🛍️ Go to Buy/Sell
//           </button>
//         </div>

//         <div className="card">
//           <h3 className="card-title">Lost / Found</h3>
//           <button onClick={() => navigate('/lost-found')} className="action-button">
//             🧳 Lost & Found
//           </button>
//         </div>
//       </div>

//       <div className="dashboard-secondary-actions">
//         <button
//           onClick={() => navigate('/rules')}
//           className="rules-regulations-button"
//         >
//           📜 View Rules & Regulations
//         </button>
//       </div>

//       <button onClick={handleLogout} className="logout-button">
//         🚪 Logout
//       </button>

//       {/* Feedback Modal Component - Renders based on showFeedbackModal state */}
//       <FeedbackModal
//         show={showFeedbackModal}
//         onClose={() => setShowFeedbackModal(false)}
//         onSubmit={handleFeedbackSubmit} // Pass the API submission logic to the modal
//       />
//     </div>
//   );
// }

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Dashboard.css'; // Keep dashboard-specific CSS
import FeedbackModal from './FeedbackModal'; // Import the FeedbackModal component

function Dashboard() {
  const navigate = useNavigate(); // Get the navigate function
  const [userData, setUserData] = useState({
    name: '',
    photo_url: ''
  });
  // State for feedback modal visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (!email) {
      navigate('/');
      return;
    }

    // Fetch user data including name and photo_url
    axios.get(`http://localhost:5000/api/user/${email}`)
      .then((res) => {
        setUserData({
          name: res.data.name,
          photo_url: res.data.photo_url
        });
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
        // Fallback for user data if API fails
        setUserData({ name: 'User', photo_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' });
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  /**
   * Handles the submission of feedback by sending it to the backend.
   * This function is passed as a prop to the FeedbackModal.
   * @param {string} feedbackText The text entered by the user in the modal.
   */
  const handleFeedbackSubmit = async (feedbackText) => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
      console.error("User email not found in localStorage. Cannot submit feedback.");
      throw new Error("User not logged in or email unavailable.");
    }

    try {
      // Send feedback along with the user's email to the backend
      // The backend will then retrieve name and contact_number from the users table
      const response = await axios.post('http://localhost:5000/api/feedback', {
        user_email: userEmail,
        feedback: feedbackText,
      });
      console.log('Feedback submitted successfully via API:', response.data);
      return response.data; // Return data for FeedbackModal to process (e.g., success message)
    } catch (error) {
      console.error('Error submitting feedback to backend:', error.response ? error.response.data : error.message);
      // Re-throw the error so FeedbackModal can display an error message
      throw error;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Profile Button */}
      <div className="profile-button" onClick={() => navigate('/profile')}>
        <img
          src={userData.photo_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          alt="Profile"
        />
      </div>

      {/* Feedback Button */}
      <button className="feedback-button" onClick={() => setShowFeedbackModal(true)}>
        ⭐ Give Feedback
      </button>

      <h2 className="dashboard-title">
        <span className="title-greeting">Welcome to NITC Marketplace, </span>
        <span className="user-name">{userData.name || 'User'}</span>!
      </h2>

      {/* Main Action Buttons */}
      <div className="actions">
        <div className="card">
          <h3 className="card-title">Buy / Sell</h3>
          <button onClick={() => navigate('/buy-sell')} className="action-button">
            🛍️ Go to Buy/Sell
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">Lost / Found</h3>
          <button onClick={() => navigate('/lost-found')} className="action-button">
            🧳 Lost & Found
          </button>
        </div>
      </div>

      <div className="dashboard-secondary-actions">
        <button
          onClick={() => navigate('/rules')}
          className="rules-regulations-button"
        >
          📜 View Rules & Regulations
        </button>
      </div>

      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>

      {/* Feedback Modal Component - Renders based on showFeedbackModal state */}
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit} // Pass the API submission logic to the modal
        // Pass the navigate function to the FeedbackModal
        redirectAfterSubmit={() => navigate('/dashboard')}
      />
    </div>
  );
}

export default Dashboard;