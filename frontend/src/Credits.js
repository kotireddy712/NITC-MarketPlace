import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import kotiImg from './koti.jpg';
import reddyImg from './reddy.jpg';

const Credits = () => {
  return (
    <div style={styles.container}>
      {/* Home Button */}
      <div style={styles.homeButtonContainer}>
        <Link to="/" style={styles.homeButton}>
          🏠 Home
        </Link>
      </div>

      <h1 style={styles.heading}>Credits & Acknowledgements</h1>

      <p style={styles.text}>
        The <strong>NITC Marketplace</strong> is the result of immense dedication, teamwork, and a vision to bring positive change to the NITC campus community.
      </p>

      <h2 style={styles.subheading}>✨ Developers Behind This Project</h2>

      <div style={styles.profileContainer}>
        {/* Reddy */}
        <div style={styles.card}>
          <img 
            src={reddyImg} 
            alt="Yangala Reddy Sekhar" 
            style={styles.profileImage}
          />
          <h3 style={styles.name}>Yangala Reddy Sekhar</h3>
          <p style={styles.role}>Frontend & Backend Developer</p>
          <p style={styles.description}>
            Handled UI/UX design, React development, backend management, and deployment. Focused on delivering a clean, intuitive, and efficient user experience.
          </p>
        </div>

        {/* Koti */}
        <div style={styles.card}>
          <img 
            src={kotiImg} 
            alt="Kasireddy KotiReddy" 
            style={styles.profileImage}
          />
          <h3 style={styles.name}>Kasireddy KotiReddy</h3>
          <p style={styles.role}>Database & Systems Developer</p>
          <p style={styles.description}>
            Managed the database architecture, system design, data integrity, and worked tirelessly on backend optimization to ensure smooth performance.
          </p>
        </div>
      </div>

      <h2 style={styles.subheading}>💡 Our Vision</h2>
      <p style={styles.text}>
        Our goal is to make buying, selling, and exchanging items within NITC simple, efficient, and safe. We believe this platform not only reduces waste but also strengthens the campus community.
      </p>

      <h2 style={styles.subheading}>🌟 A Note of Thanks</h2>
      <p style={styles.text}>
        Special thanks to the students, faculty, and the entire NITC community for inspiring us to build something meaningful. Your support and feedback are what drive continuous improvements.
      </p>

      <h2 style={styles.subheading}>🚀 The Change We Aim For</h2>
      <p style={styles.text}>
        - Promote sustainable reuse on campus. <br />
        - Provide a trusted platform for students. <br />
        - Foster connections within the NITC community. <br />
        - Encourage student-led initiatives that make an impact.
      </p>

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
    maxWidth: '1000px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#fefefe',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    position: 'relative', // Make relative for absolute positioning of home button
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
    fontSize: '2.7em',
    marginBottom: '20px',
    textAlign: 'center',
  },
  subheading: {
    color: '#004080',
    fontSize: '1.8em',
    margin: '30px 0 15px 0',
  },
  profileContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '15px',
    width: '350px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.07)',
    textAlign: 'center',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
    border: '3px solid #004080',
  },
  name: {
    color: '#222',
    fontSize: '1.5em',
    marginBottom: '5px',
  },
  role: {
    color: '#555',
    fontSize: '1em',
    marginBottom: '8px',
  },
  description: {
    color: '#555',
    fontSize: '1em',
    lineHeight: '1.6',
  },
  text: {
    color: '#555',
    fontSize: '1.1em',
    lineHeight: '1.6',
  },
  link: {
    backgroundColor: '#004080',
    color: '#fff',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1em',
    display: 'inline-block',
    marginTop: '25px',
    transition: 'background-color 0.3s',
  },
};

export default Credits;
