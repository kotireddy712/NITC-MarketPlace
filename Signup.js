import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    contact_number: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/signup', form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input type="email" name="email" placeholder="NITC Email" onChange={handleChange} required />
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="text" name="contact_number" placeholder="Contact Number" onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

