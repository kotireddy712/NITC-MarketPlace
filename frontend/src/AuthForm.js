import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';
import backgroundImage from './p1.png';

function AuthForm() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    contact_number: ''
  });

  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminChoice, setShowAdminChoice] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: '', password: '', name: '', contact_number: '' });
    setMessage('');
    setIsSuccess(null);
    setIsAdmin(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      const data = res.data;

      setMessage(data.message);
      setIsSuccess(true);

      if (isLogin && data.user_id) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('is_admin', data.is_admin);
        setIsAdmin(data.is_admin);

        if (data.is_admin) {
          setShowAdminChoice(true); // Show modal for admin choice
        } else {
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } else if (!isLogin) {
        setTimeout(() => {
          setIsLogin(true);
          setForm({ email: form.email, password: '', name: '', contact_number: '' });
          setMessage('Signup successful! Please log in.');
          setIsSuccess(true);
        }, 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
      setIsSuccess(false);
      console.error("Auth error:", err.response?.data?.message || err.message);
    }
  };

  const handleToggleTheme = () => {
    if (darkMode) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleAdminChoice = (choice) => {
    setShowAdminChoice(false);
    if (choice === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="app-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <button
        id="toggle-theme"
        onClick={handleToggleTheme}
        className="theme-toggle-button"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="auth-container">
        <h2>NITC Marketplace</h2>
        <div className="tab">
          <button className={isLogin ? 'active' : ''} onClick={toggleMode}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={toggleMode}>Signup</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email (use @nitc.ac.in)"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                value={form.name}
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contact_number"
                value={form.contact_number}
                placeholder="Contact Number"
                onChange={handleChange}
                required
              />
            </>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div className={`message-box ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Admin Info Message */}
        {isSuccess && isAdmin && !showAdminChoice && (
          <div className="admin-banner">Logged in as Admin</div>
        )}

        {/* Admin Navigation Modal */}
        {isAdmin && isSuccess && showAdminChoice && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Welcome, Admin!</h3>
              <p>Where would you like to go?</p>
              <div className="modal-buttons">
                <button onClick={() => handleAdminChoice('admin')}>Admin Dashboard</button>
                <button onClick={() => handleAdminChoice('user')}>User Dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
