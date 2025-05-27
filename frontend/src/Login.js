// import React, { useState } from 'react';
// import axios from 'axios';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/login', { email, password });
      
//       console.log('Login Response from Backend:', res.data); // Debug: Full response
//       console.log('User ID from response:', res.data.user?.user_id); // Debug: User ID from response

//       alert(res.data.message);

//       if (res.data.user && res.data.user.user_id) {
//         localStorage.setItem('user_id', res.data.user.user_id);
//         console.log('User ID stored in localStorage:', res.data.user.user_id); // Debug: Stored ID
//         // Redirect to sell page after login
//         window.location.href = '/sell';
//       } else {
//         console.warn('Login successful, but user_id was not returned or was null/undefined in response. Check backend.'); 
//       }
//     } catch (err) {
//       console.error("Login Error:", err.response?.data || err.message, err); // Improved error logging with full error object
//       alert(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
//       <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }
import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    try {
      const res = await axios.post('http://localhost:5000/login', 
        { email, password },
        { withCredentials: true } // Crucial: Send cookies with the request
      );
      
      console.log('Login Response from Backend:', res.data); 
      setMessage(res.data.message);

      // No need to store user_id in localStorage anymore. 
      // The session cookie is handled by the browser.
      
      // Redirect to sell page after login
      window.location.href = '/sell';
      
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message, err); 
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}