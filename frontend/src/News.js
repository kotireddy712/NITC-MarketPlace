import React from 'react';

const News = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>NITC News & Events</h1>
      <p style={styles.description}>
        Stay updated with the latest news, events, and announcements from the National Institute of Technology Calicut.
      </p>
      <a 
        href="https://nitc.ac.in/news-and-events" 
        target="_blank" 
        rel="noopener noreferrer"
        style={styles.link}
      >
        👉 Visit Official NITC News & Events Page
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
    textAlign: 'center'
  },
  heading: {
    color: '#004080',
    fontSize: '2.5em',
    marginBottom: '20px'
  },
  description: {
    color: '#555',
    fontSize: '1.1em',
    marginBottom: '25px'
  },
  link: {
    backgroundColor: '#004080',
    color: '#fff',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1em',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  }
};

export default News;
