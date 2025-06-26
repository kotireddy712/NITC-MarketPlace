import React from 'react';

const TermsOfUse = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NITC Marketplace – Terms & Regulations</h1>

      <p style={styles.paragraph}>
        Welcome to the <strong>NITC Marketplace</strong>! Our goal is to create a safe, fair, and respectful environment for all users.
        Please review and adhere to the following rules and regulations:
      </p>

      <div style={styles.importantNote}>
        <strong>Important:</strong> Posting abusive content, irrelevant photos, or spam listings/messages will result in a report and may lead to account suspension or banning.
      </div>

      <Section title="1. Honesty and Accuracy">
        <ul>
          <li>List items with truthful and accurate descriptions.</li>
          <li>Clearly mention the item's condition (e.g., new, like new, used, minor defects).</li>
          <li>Disclose any flaws, damages, or issues honestly.</li>
        </ul>
      </Section>

      <Section title="2. Prohibited Items">
        <p>The following items are strictly prohibited:</p>
        <ul>
          <li>Illegal substances or items.</li>
          <li>Weapons, firearms, explosives.</li>
          <li>Stolen goods.</li>
          <li>Counterfeit or replica products.</li>
          <li>Hazardous materials.</li>
          <li>Alcohol, tobacco, or related items.</li>
          <li>Academic materials that violate academic integrity (e.g., assignments, exam papers).</li>
          <li>Any services that violate campus policies.</li>
        </ul>
      </Section>

      <Section title="3. Respectful Conduct">
        <ul>
          <li>Maintain respectful and polite communication.</li>
          <li>Harassment, hate speech, or offensive behavior will not be tolerated.</li>
          <li>Do not spam or post irrelevant content.</li>
        </ul>
      </Section>

      <Section title="4. Transactions & Safety">
        <ul>
          <li>NITC Marketplace only connects buyers and sellers. We do not mediate transactions.</li>
          <li>Arrange payments and exchanges independently and responsibly.</li>
          <li>Meet in safe, well-lit, public places on campus (e.g., near security posts or common areas).</li>
          <li>Avoid oversharing personal information. Share only necessary details.</li>
          <li>Inspect items thoroughly before completing any purchase.</li>
          <li>Report suspicious behavior, scams, or violations to admins or campus security.</li>
        </ul>
      </Section>

      <Section title="5. Account Responsibility">
        <ul>
          <li>You are responsible for all actions made under your account.</li>
          <li>Keep your login credentials confidential.</li>
          <li>Only verified NITC students, faculty, and staff are allowed to use this platform.</li>
        </ul>
      </Section>

      <Section title="6. Item Listings">
        <ul>
          <li>Upload clear, high-quality photos of your items.</li>
          <li>Set fair and reasonable prices.</li>
          <li>Remove listings promptly once the item is sold or unavailable.</li>
          <li><strong>Note:</strong> Please mark items as sold in the <em>My Listings</em> section to help maintain marketplace accuracy.</li>
        </ul>
      </Section>

      <Section title="7. Disputes">
        <ul>
          <li>Buyers and sellers should resolve disputes directly and amicably.</li>
          <li>NITC Marketplace is not liable for disputes, transactions, or any losses incurred.</li>
        </ul>
      </Section>

      <Section title="8. Compliance with NITC Policies">
        <ul>
          <li>All users must comply with NITC's official policies, rules, and codes of conduct.</li>
        </ul>
      </Section>

      <Section title="9. Updates to Terms">
        <ul>
          <li>Rules and regulations are subject to change at any time.</li>
          <li>It is the user's responsibility to stay informed of the latest terms.</li>
        </ul>
      </Section>

      <div style={styles.conclusion}>
        <p>
          By using the <strong>NITC Marketplace</strong>, you agree to follow these rules and regulations.
          Violations may result in warnings, temporary suspension, or permanent bans.
        </p>
        <p>Let's work together to build a safe and supportive community for all!</p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </>
);

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '50px auto',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    lineHeight: 1.8,
    color: '#333',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#0066cc',
    marginBottom: '30px',
    fontSize: '2.5rem',
  },
  paragraph: {
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#444',
    marginTop: '30px',
    fontSize: '1.7rem',
  },
  importantNote: {
    backgroundColor: '#ffe6e6',
    color: '#a10000',
    padding: '15px',
    borderRadius: '8px',
    margin: '20px 0',
    borderLeft: '5px solid #a10000',
  },
  conclusion: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginTop: '30px',
  },
};

export default TermsOfUse;
