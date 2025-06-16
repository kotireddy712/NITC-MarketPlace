import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password, role });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      
      <div>
        <label>
          <input
            type="radio"
            value="user"
            checked={role === 'user'}
            onChange={() => setRole('user')}
          />
          User
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={role === 'admin'}
            onChange={() => setRole('admin')}
          />
          Admin
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  );
}