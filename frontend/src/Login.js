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
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Check session when page loads (auto-login if session exists)
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/check_session`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.logged_in) {
          setIsLoggedIn(true);
          setUserData(res.data);
          handleRedirect(res.data.role);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // ✅ Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        { email, password },
        { withCredentials: true } // 🔒 ensures session cookie is stored
      );

      alert(res.data.message);
      setIsLoggedIn(true);
      setUserData(res.data);

      // ✅ Redirect based on role
      handleRedirect(res.data.role);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // ✅ Handle logout (clears session)
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserData(null);
      alert("Logged out successfully!");
    } catch {
      alert("Logout failed");
    }
  };

  // ✅ Function to redirect user after login
  const handleRedirect = (role) => {
    if (role === "admin") {
      window.location.href = "/admin-dashboard"; // 👈 redirect to admin page
    } else {
      window.location.href = "/user-dashboard"; // 👈 redirect to user page
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      ) : (
        <div className="after-login">
          <h2>Welcome, {userData?.name}</h2>
          <p>Email: {userData?.email}</p>
          <p>Role: {userData?.role}</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
