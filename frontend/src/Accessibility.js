import React from 'react';

const Accessibility = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Accessibility Statement</h1>
      <p style={styles.description}>
        At NITC Marketplace, we are committed to ensuring that our platform is accessible to all members of our community, including individuals with disabilities.
      </p>

      <h2 style={styles.subheading}>Our Commitment</h2>
      <p style={styles.text}>
        We strive to follow best practices for accessibility based on the Web Content Accessibility Guidelines (WCAG). This includes:
      </p>
      <ul style={styles.list}>
        <li>Providing clear and readable text with sufficient contrast.</li>
        <li>Ensuring keyboard navigation is smooth and complete.</li>
        <li>Adding alternative text for meaningful images.</li>
        <li>Supporting screen readers wherever possible.</li>
        <li>Maintaining simple and intuitive layouts for ease of use.</li>
      </ul>

      <h2 style={styles.subheading}>Feedback & Assistance</h2>
      <p style={styles.text}>
        If you experience any difficulty accessing content on the NITC Marketplace or have suggestions to improve accessibility, please contact us:
      </p>
      <ul style={styles.list}>
        <li>Email: <a href="mailto:yangala_b231346cs@nitc.ac.in">yangala_b231346cs@nitc.ac.in</a></li>
        <li>Email: <a href="mailto:kasireddy_b230373cs@nitc.ac.in">kasireddy_b230373cs@nitc.ac.in</a></li>
        <li>Phone: 9440208178 | 8374400562</li>
      </ul>

      <h2 style={styles.subheading}>Continuous Improvement</h2>
      <p style={styles.text}>
        We are constantly working to improve the accessibility and usability of the NITC Marketplace. Your feedback is invaluable in helping us create an inclusive platform for everyone.
      </p>

      <a
        href="https://nitc.ac.in/contact"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        👉 Contact NITC Official Support
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

export default Accessibility;