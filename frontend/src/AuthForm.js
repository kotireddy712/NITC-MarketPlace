import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function AuthForm() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    contact_number: ''
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check localStorage for theme
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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      alert(res.data.message);

      if (isLogin) {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
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
      position: 'relative'  // Optional, can help with absolute children
    }}
  >
    {/* Dark mode toggle fixed in corner */}
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

    {/* Auth container remains centered */}
    <div className="auth-container">
      <h2>NITC Marketplace</h2>
      <div className="tab">
        <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
        <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Signup</button>
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
    </div>
  </div>
);
}
export default AuthForm;