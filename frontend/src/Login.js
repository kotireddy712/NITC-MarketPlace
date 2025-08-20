// import React, { useState } from 'react';
// import axios from 'axios';
// import './Login.css';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, password, role });
//       alert(res.data.message);
//       setIsLoggedIn(true);
//     } catch (err) {
//       alert(err.response?.data?.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="container">
//       {!isLoggedIn ? (
//         <form onSubmit={handleSubmit}>
//           <h2>Login</h2>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//           />

//           <div className="role-buttons">
//             <button
//               type="button"
//               className={`role-button ${role === 'user' ? 'selected' : ''}`}
//               onClick={() => setRole('user')}
//             >
//               User
//             </button>
//             <button
//               type="button"
//               className={`role-button ${role === 'admin' ? 'selected' : ''}`}
//               onClick={() => setRole('admin')}
//             >
//               Admin
//             </button>
//           </div>

//           <button type="submit" className="submit-btn">Login</button>
//         </form>
//       ) : (
//         <div className="after-login">
//           <h2>Login successful!</h2>
//           <p>Proceed as:</p>
//           <div className="role-buttons">
//             <button className="role-button">Admin</button>
//             <button className="role-button">User</button>
//           </div>
//           <button className="back-btn" onClick={() => setIsLoggedIn(false)}>Back to Home</button>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

// Configure axios to send cookies with all requests
axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/check-session`);
      
      if (response.data.logged_in) {
        setIsLoggedIn(true);
        setUserInfo(response.data);
        console.log('Existing session found:', response.data);
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsLoggedIn(false);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { 
        email, 
        password,
        role // Note: Your backend doesn't seem to use this role field in login, but keeping it
      });
      
      // Backend returns user info on successful login
      const userData = response.data;
      
      // Update component state
      setIsLoggedIn(true);
      setUserInfo({
        user_id: userData.user_id,
        name: userData.name,
        email: userData.email,
        is_admin: userData.is_admin,
        logged_in: true
      });
      
      alert(userData.message || 'Login successful!');
      
      // Clear form
      setPassword('');
      
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`);
      
      // Clear component state
      setIsLoggedIn(false);
      setUserInfo(null);
      setEmail('');
      setPassword('');
      setRole('user');
      
      alert('Logged out successfully');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if logout request fails
      setIsLoggedIn(false);
      setUserInfo(null);
      alert('Logged out (with errors)');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking session
  if (loading && !isLoggedIn) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Checking session...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email (@nitc.ac.in)"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={loading}
          />

          <div className="role-buttons">
            <button
              type="button"
              className={`role-button ${role === 'user' ? 'selected' : ''}`}
              onClick={() => setRole('user')}
              disabled={loading}
            >
              User
            </button>
            <button
              type="button"
              className={`role-button ${role === 'admin' ? 'selected' : ''}`}
              onClick={() => setRole('admin')}
              disabled={loading}
            >
              Admin
            </button>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div className="after-login">
          <h2>Welcome back!</h2>
          <div className="user-info">
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
            <p><strong>Role:</strong> {userInfo?.is_admin ? 'Admin' : 'User'}</p>
            <p><strong>User ID:</strong> {userInfo?.user_id}</p>
          </div>
          
          <div className="dashboard-buttons">
            {userInfo?.is_admin ? (
              <button className="role-button admin-btn">
                Admin Dashboard
              </button>
            ) : (
              <button className="role-button user-btn">
                User Dashboard
              </button>
            )}
          </div>
          
          <button 
            className="back-btn" 
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}