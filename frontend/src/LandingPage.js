import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-title-group">
            <img 
              src="/logo.png"
              alt="NITC Logo"
              className="nitc-logo"
              width="600"
              height="600"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/600x600/0c4383/ffffff?text=NITC+Logo";
              }}
            />
            <h1 className="site-title" onClick={() => navigate('/')}>NITC Marketplace</h1>
          </div>
        </div>

        <nav className="landing-nav">
          <ul className="nav-list">
            <li><div onClick={() => navigate('/')}>Home</div></li>
            <li><div onClick={() => navigate('/news')}>News</div></li>
            <li><div onClick={() => navigate('/announcements')}>Announcements</div></li>
            <li><div onClick={() => navigate('/contact')}>Contact Us</div></li>
            <li><div onClick={() => navigate('/credits')}>Credits</div></li>
          </ul>
        </nav>
      </header>

      <div className="landing-main-content">
        <main className="main-sections">
          <section className="hero-section">
            <h2>Connect. Share. Thrive.</h2>
            <p>
              The NITC Marketplace is a student-led initiative providing a trusted platform for buying, selling, and lost & found services within the NIT Calicut campus. Simplify your campus life by connecting with your peers for all your needs.
            </p>
            <div className="explore-button-container">
              <button onClick={handleExplore} className="explore-button">Explore Marketplace</button>
            </div>
          </section>

          <section className="about-section">
            <h2>About NITC Marketplace</h2>
            <p>
              Dedicated to fostering a vibrant and resourceful student community, our platform facilitates safe and accessible exchanges. From academic materials and electronics to daily essentials and lost items, find what you need or give a new home to what you don't. Our goal is to create a seamless and reliable environment for all NITC students.
            </p>
          </section>

          <div className="vision-mission-container">
            <section className="vision-section">
              <h3>Our Vision</h3>
              <p>To be the premier digital hub for student exchange and collaborative community building at NIT Calicut, enhancing the campus experience for everyone.</p>
            </section>
            <section className="mission-section">
              <h3>Our Mission</h3>
              <p>Empowering NITC students with a reliable, secure, and user-friendly platform for all their buying, selling, and lost & found needs, promoting sustainability and peer support.</p>
            </section>
          </div>

          <section className="features-section">
            <h2>Key Features</h2>
            <ul className="features-list">
              <li><span role="img" aria-label="market">🛒</span> Intuitive Buy & Sell Listings</li>
              <li><span role="img" aria-label="lost and found">🔍</span> Efficient Lost & Found Section</li>
              <li><span role="img" aria-label="secure">🔒</span> Secure User Authentication</li>
              <li><span role="img" aria-label="community">🤝</span> Community-Driven & Supported</li>
              <li><span role="img" aria-label="notification">🔔</span> Real-time Updates</li>
              <li><span role="img" aria-label="support">💬</span> Dedicated Support</li>
            </ul>
          </section>
        </main>

        <aside className="landing-sidebar">
          <h3>Quick Access</h3>
          <ul>
            <li onClick={() => navigate('/login')}>Login / Register</li>
            <li onClick={() => navigate('/rules')}>Rules & Regulations</li>
          </ul>

          <h3>Important Information</h3>
          <p>This platform is exclusively designed for the students and faculty of National Institute of Technology Calicut.</p>
          <p>Please review our <span className="link-text" onClick={() => navigate('/terms')}>Terms of Use</span> and <span className="link-text" onClick={() => navigate('/rules')}>Rules & Regulations</span> before engaging with the marketplace.</p>
        </aside>
      </div>

      <footer className="landing-footer">
        <div className="footer-links">
          <div 
            onClick={() => window.open('https://nitc.ac.in/', '_blank')} 
            className="nitc-link">
            National Institute of Technology Calicut
          </div>
          <div onClick={() => navigate('/terms')}>Terms of Use</div>
          <div onClick={() => navigate('/accessibility')}>Accessibility Statement</div>
          <div onClick={() => navigate('/about-site')}>About the Site</div>

          {/* GitHub Link */}
          <div 
            className="github-link" 
            onClick={() => window.open('https://github.com/kotireddy712/NITC-MarketPlace/tree/main', '_blank')}
          >
            <img 
              src="/github.png" 
              alt="GitHub Repository" 
              className="github-logo"
            />
            GitHub
          </div>
        </div>

        <p className="copyright">&copy; 2025 NITC Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
