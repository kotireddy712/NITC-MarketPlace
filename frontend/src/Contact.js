import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div style={styles.container}>
      {/* Home Button */}
      <div style={styles.homeButtonContainer}>
        <Link to="/" style={styles.homeButton}>
          🏠 Home
        </Link>
      </div>

      <h1 style={styles.title}>📞 Contact Us</h1>

      <div style={styles.card}>
        <h2 style={styles.subTitle}>Student Support</h2>
        <div style={styles.contactBlock}>
          <p><strong>Yangala Reddy Sekhar</strong></p>
          <p>Email: <a href="mailto:yangala_b231346cs@nitc.ac.in" style={styles.link}>yangala_b231346cs@nitc.ac.in</a></p>
          <p>Phone: <a href="tel:9440208178" style={styles.link}>9440208178</a></p>
        </div>
        <div style={styles.contactBlock}>
          <p><strong>KasiReddy KotiReddy</strong></p>
          <p>Email: <a href="mailto:kasireddy_b230373cs@nitc.ac.in" style={styles.link}>kasireddy_b230373cs@nitc.ac.in</a></p>
          <p>Phone: <a href="tel:8374400562" style={styles.link}>8374400562</a></p>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.subTitle}>Official Campus Contact</h2>
        <p>
          For any campus-related queries, visit the official contact page:
        </p>
        <a
          href="https://nitc.ac.in/contact"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.link, fontWeight: '600', fontSize: '1.05rem' }}
        >
          👉 NITC Official Contact Page
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '50px auto',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    color: '#333',
    fontFamily: 'Segoe UI, sans-serif',
    position: 'relative',
  },
  homeButtonContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  homeButton: {
    backgroundColor: '#0066cc',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1em',
    transition: 'background-color 0.3s',
  },
  title: {
    textAlign: 'center',
    color: '#0066cc',
    marginBottom: '30px',
    fontSize: '2.5rem',
  },
  subTitle: {
    color: '#444',
    marginBottom: '15px',
    fontSize: '1.7rem',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  contactBlock: {
    marginBottom: '20px',
  },
  link: {
    color: '#0077cc',
    textDecoration: 'none',
  },
};

export default Contact;