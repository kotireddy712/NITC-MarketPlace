// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './styles/BuySellDashboard.css'; // New CSS file for Buy/Sell Dashboard

// function BuySellDashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="buy-sell-dashboard-container">
//       <h2 className="buy-sell-title">Marketplace 💰</h2>
//       <p className="buy-sell-description">
//         Buy and sell items within the community. Find great deals or list your unused belongings!
//       </p>

//       <div className="buy-sell-actions">
//         <div className="card">
//           <h3 className="card-title">Buy Items</h3>
//           <p>Explore a variety of items listed for sale by others.</p>
//           <button onClick={() => navigate('/buy')} className="action-button buy-button">
//             🛒 Browse Items
//           </button>
//         </div>

//         <div className="card">
//           <h3 className="card-title">Sell Items</h3>
//           <p>Post your items for sale and reach interested buyers.</p>
//           <button onClick={() => navigate('/sell')} className="action-button sell-button">
//             📦 List Item for Sale
//           </button>
//         </div>

//         <div className="card">
//           <h3 className="card-title">My Listings</h3>
//           <p>Manage the items you have listed for sale.</p>
//           <button onClick={() => navigate('/my-listings')} className="action-button my-listings-button">
//             📋 View My Listings
//           </button>
//         </div>
//       </div>

//       <button onClick={() => navigate('/dashboard')} className="back-button">
//         ⬅️ Back to Dashboard
//       </button>
//     </div>
//   );
// }

// export default BuySellDashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css'; // Reuse your Dashboard styles

export default function BuySellDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Buy/Sell Section</h2>
      
      <div className="actions">
        <div className="card">
          <h3 className="card-title buy-title">Buy Items</h3>
          <button onClick={() => navigate('/buy')} className="action-button buy-button">
            🛒 Go to Buy
          </button>
        </div>
        <div className="card">
          <h3 className="card-title sell-title">Sell Items</h3>
          <button onClick={() => navigate('/sell')} className="action-button sell-button">
            💰 Go to Sell
          </button>
        </div>
        <div className="card">
          <h3 className="card-title listings-title">Listed Items</h3>
          <button onClick={() => navigate('/listings')} className="action-button listings-button">
            📋 MY-LISTINGS
          </button>
        </div>
      </div>

      {/* Return to Dashboard Button */}
      <div className="return-button-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={() => navigate('/dashboard')} className="action-button return-button">
          🔙 Return to Dashboard
        </button>
      </div>
    </div>
  );
}

