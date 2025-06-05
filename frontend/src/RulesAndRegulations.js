// src/components/RulesAndRegulations.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RulesAndRegulations.css'; // Ensure this CSS file is linked

function RulesAndRegulations() {
  const navigate = useNavigate();

  return (
    <div className="rules-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>NITC Marketplace - Rules & Regulations</h1>

      <div className="rules-content">
        <p>Welcome to the NITC Marketplace! To ensure a safe, fair, and respectful environment for all users, please adhere to the following rules and regulations:</p>

        <p className="important-warning">
          <strong>Important: Posting abusive or irrelevant photos, or creating spam listings/messages, will be reported and may lead to your account being banned.</strong>
        </p>

        <h2>1. Honesty and Accuracy:</h2>
        <ul>
          <li>All items listed must be described truthfully and accurately. Misleading descriptions, images, or pricing are prohibited.</li>
          <li>Clearly state the condition of the item (e.g., new, used, like new, minor defects).</li>
          <li>Disclose any known flaws or issues with the item.</li>
        </ul>

        <h2>2. Prohibited Items:</h2>
        {/* ... (content of Prohibited Items) ... */}
        <p>The following items are strictly prohibited from being listed or sold on the NITC Marketplace:</p>
        <ul>
          <li>Illegal substances or items.</li>
          <li>Weapons, firearms, or explosives.</li>
          <li>Stolen goods.</li>
          <li>Counterfeit or replica items.</li>
          <li>Hazardous materials.</li>
          <li>Alcohol, tobacco, and related products (unless compliant with specific campus policies and age restrictions, which are typically not allowed in student marketplaces).</li>
          <li>Academic materials that violate academic integrity (e.g., completed assignments, exam papers).</li>
          <li>Services that violate campus policies.</li>
        </ul>


        <h2>3. Respectful Conduct:</h2>
        {/* ... (content of Respectful Conduct) ... */}
        <ul>
          <li>All interactions between buyers and sellers must be respectful and courteous.</li>
          <li>Harassment, discrimination, hate speech, or any form of offensive behavior will not be tolerated.</li>
          <li>Do not spam other users or post irrelevant content.</li>
        </ul>

        <h2>4. Transactions and Safety:</h2>
        {/* ... (content of Transactions and Safety) ... */}
        <ul>
          <li>NITC Marketplace is a platform to connect buyers and sellers. We are not directly involved in transactions.</li>
          <li>Users are responsible for arranging payments and exchanges.</li>
          <li><strong>For your safety, we strongly recommend meeting in well-lit, public places on campus for exchanges (e.g., near security posts, common areas).</strong></li>
          <li>Avoid sharing excessive personal information. Only share what is necessary for the transaction.</li>
          <li>Inspect items thoroughly before completing a purchase.</li>
          <li>Report any suspicious activity, scams, or rule violations to the marketplace administrators (if applicable) or campus security.</li>
        </ul>

        <h2>5. Account Responsibility:</h2>
        {/* ... (content of Account Responsibility) ... */}
        <ul>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>Keep your login credentials secure.</li>
          <li>Only NITC students, faculty, and staff with valid credentials should use this platform (assuming this is the target audience).</li>
        </ul>

        <h2>6. Item Listings:</h2>
        <ul>
          <li>Provide clear and high-quality photos of the item.</li>
          <li>Set a reasonable price.</li>
          <li>Remove your listing promptly once the item is sold or no longer available.</li>
        </ul>
        {/* ✅ ADDED NEW CAUTION HERE */}
        <p className="caution-notice">
          <strong>Caution: After your product has been sold, please promptly update its availability status in your 'MY-LISTINGS' section. This helps keep the marketplace accurate for everyone.</strong>
        </p>

        <h2>7. Disputes:</h2>
        {/* ... (content of Disputes) ... */}
        <ul>
          <li>In case of a dispute, buyers and sellers should attempt to resolve the issue amicably.</li>
          <li>NITC Marketplace is not responsible for mediating disputes or for any losses incurred.</li>
        </ul>

        <h2>8. Compliance with NITC Policies:</h2>
        {/* ... (content of Compliance with NITC Policies) ... */}
        <ul>
          <li>All activities on the NITC Marketplace must comply with the prevailing rules, regulations, and codes of conduct of NITC.</li>
        </ul>

        <h2>9. Updates to Rules:</h2>
        {/* ... (content of Updates to Rules) ... */}
        <ul>
          <li>These rules and regulations may be updated from time to time. It is your responsibility to stay informed about the current rules.</li>
        </ul>

        <p>By using the NITC Marketplace, you agree to abide by these rules and regulations. Failure to comply may result in warnings, temporary suspension, or permanent banning from the platform.</p>
        <p>Let's make this a great place for our community to buy and sell!</p>
      </div>
    </div>
  );
}

export default RulesAndRegulations;