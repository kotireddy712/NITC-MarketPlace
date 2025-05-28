import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Assuming this contains your styling

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setDarkMode(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: '', password: '', name: '', contact_number: '' });
    setMessage('');
    setIsSuccess(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      setMessage(res.data.message);
      setIsSuccess(true);

      if (isLogin && res.data.user_id) { // Check if it's a login and user_id is returned
        // Store user details in localStorage
        localStorage.setItem('user_id', res.data.user_id);
        localStorage.setItem('user_name', res.data.name);
        localStorage.setItem('user_email', res.data.email);
        setTimeout(() => navigate('/dashboard'), 1500); // Redirect after a short delay
      } else if (!isLogin) { // After successful signup, you might want to switch to login tab
        setTimeout(() => {
          setIsLogin(true);
          setForm({ email: form.email, password: '', name: '', contact_number: '' }); // Pre-fill email for login
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

  return (
    <div
      className="App"
      style={{
        backgroundImage: "url('/p1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <button
        id="toggle-theme"
        onClick={handleToggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '8px 14px',
          borderRadius: '20px',
          fontWeight: '600',
          cursor: 'pointer',
          border: '1px solid var(--btn-bg)',
          backgroundColor: 'transparent',
          color: 'var(--btn-bg)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = 'var(--btn-bg)';
          e.target.style.color = 'var(--btn-text)';
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = 'var(--btn-bg)';
        }}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="auth-container">
        <h2>NITC Marketplace</h2>
        <div className="tab">
          <button className={isLogin ? 'active' : ''} onClick={toggleMode}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={toggleMode}>Signup</button>
        </div>

        <form onSubmit={handleSubmit}>
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
          <div
            style={{
              marginTop: '20px',
              padding: '10px',
              color: isSuccess ? 'green' : 'red',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;