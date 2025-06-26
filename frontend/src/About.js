import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const About = () => {
  return (
    <div style={styles.container}>
      {/* Home Button */}
      <div style={styles.homeButtonContainer}>
        <Link to="/" style={styles.homeButton}>
          🏠 Home
        </Link>
      </div>

      <h1 style={styles.heading}>About NITC Marketplace</h1>

      <p style={styles.description}>
        Welcome to <strong>NITC Marketplace</strong> — a platform built exclusively for the students, faculty, and staff of the National Institute of Technology Calicut.
      </p>

      <h2 style={styles.subheading}>Purpose</h2>
      <p style={styles.text}>
        This marketplace is designed to help the NITC community buy, sell, and exchange goods easily within campus. From books and electronics to furniture and accessories, you can list or discover items that fellow students and staff no longer need but others might find useful.
      </p>

      <h2 style={styles.subheading}>Why This Platform?</h2>
      <ul style={styles.list}>
        <li>🌟 Promote sustainable reuse and reduce waste on campus.</li>
        <li>💰 Enable affordable deals between students.</li>
        <li>📚 Provide a safe and trusted platform for campus members.</li>
        <li>💡 Encourage community interaction within NITC.</li>
      </ul>

      <h2 style={styles.subheading}>Who Can Use It?</h2>
      <p style={styles.text}>
        Any valid member of the NITC community — students, faculty, or staff — can create an account and start listing or purchasing items.
      </p>

      <h2 style={styles.subheading}>Disclaimer</h2>
      <p style={styles.text}>
        This is a student-developed initiative and is not an official commercial platform of NITC. Transactions are carried out between users at their own responsibility. The platform does not handle payments or guarantees.
      </p>

      <h2 style={styles.subheading}>Contact Us</h2>
      <p style={styles.text}>
        Have questions or suggestions? Reach out to the developers:
      </p>
      <ul style={styles.list}>
        <li>📧 yangala_b231346cs@nitc.ac.in | 📱 9440208178</li>
        <li>📧 kasireddy_b230373cs@nitc.ac.in | 📱 8374400562</li>
      </ul>

      <a 
        href="https://nitc.ac.in" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={styles.link}
      >
        👉 Visit NITC Official Website
      </a>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative', // For absolute positioning of Home button
  },
  homeButtonContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  homeButton: {
    backgroundColor: '#004080',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1em',
    transition: 'background-color 0.3s',
  },
  heading: {
    color: '#004080',
    fontSize: '2.5em',
    marginBottom: '20px',
  },
  subheading: {
    color: '#004080',
    fontSize: '1.6em',
    margin: '20px 0 10px 0',
  },
  description: {
    color: '#555',
    fontSize: '1.1em',
    marginBottom: '25px',
    lineHeight: '1.6',
  },
  text: {
    color: '#555',
    fontSize: '1em',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  list: {
    textAlign: 'left',
    paddingLeft: '20px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  link: {
    backgroundColor: '#004080',
    color: '#fff',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1em',
    display: 'inline-block',
    transition: 'background-color 0.3s',
  },
};

export default About;
