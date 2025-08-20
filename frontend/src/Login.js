import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, password, role });
      alert(res.data.message);
      setIsLoggedIn(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <div className="role-buttons">
            <button
              type="button"
              className={`role-button ${role === 'user' ? 'selected' : ''}`}
              onClick={() => setRole('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`role-button ${role === 'admin' ? 'selected' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>
      ) : (
        <div className="after-login">
          <h2>Login successful!</h2>
          <p>Proceed as:</p>
          <div className="role-buttons">
            <button className="role-button">Admin</button>
            <button className="role-button">User</button>
          </div>
          <button className="back-btn" onClick={() => setIsLoggedIn(false)}>Back to Home</button>
        </div>
      )}
    </div>
  );
}
