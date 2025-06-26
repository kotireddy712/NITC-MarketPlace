import React from 'react';

const Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: '⚠️ Maintenance Notice',
      date: 'June 26, 2025',
      content:
        'The marketplace will undergo scheduled maintenance on June 28th from 10 PM to 12 AM. Please avoid listing or editing items during this time.',
    },
    {
      id: 2,
      title: '🚀 New Feature: Wishlist',
      date: 'June 20, 2025',
      content:
        'You can now add items to your wishlist! Just click on the heart icon on any item to save it for later.',
    },
    {
      id: 3,
      title: '📢 Reminder: Follow Marketplace Rules',
      date: 'June 10, 2025',
      content:
        'Please ensure your listings follow the Terms of Use. Misuse such as spam, irrelevant posts, or academic material violations can lead to account suspension.',
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📢 Announcements</h1>

      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <div key={announcement.id} style={styles.card}>
            <h2 style={styles.cardTitle}>{announcement.title}</h2>
            <p style={styles.date}>{announcement.date}</p>
            <p style={styles.content}>{announcement.content}</p>
          </div>
        ))
      ) : (
        <p style={styles.noAnnouncements}>No announcements at this time. Stay tuned!</p>
      )}
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
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    color: '#333',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#0066cc',
    marginBottom: '30px',
    fontSize: '2.5rem',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    color: '#444',
    marginBottom: '5px',
    fontSize: '1.5rem',
  },
  date: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '10px',
  },
  content: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  noAnnouncements: {
    textAlign: 'center',
    color: '#777',
    fontSize: '1.1rem',
  },
};

export default Announcements;