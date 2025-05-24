import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import axios from 'axios';
import './App.css';

function AuthForm() {
  const navigate = useNavigate(); // ✅ Init navigate hook

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    contact_number: ''
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: '', password: '', name: '', contact_number: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Combined and fixed version
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      alert(res.data.message);

      // ✅ Navigate to dashboard only if login is successful
      if (isLogin) {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
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
        alignItems: 'center'
      }}
    >
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
