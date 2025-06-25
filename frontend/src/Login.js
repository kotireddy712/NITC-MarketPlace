// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// export default function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('user'); // State for selected role
//     const [loginError, setLoginError] = useState(null); // State for displaying login errors
//     const navigate = useNavigate(); // Initialize useNavigate hook

//     const handleSubmit = async e => {
//         e.preventDefault();
//         setLoginError(null); // Clear any previous errors

//         try {
//             // Using axios.post. Axios automatically serializes the body to JSON.
//             const res = await axios.post('http://localhost:5000/login', {
//                 email,
//                 password,
//                 role // Send the selected role to the backend
//             }, {
//                 withCredentials: true // IMPORTANT: This tells axios to send cookies/sessions
//             });

//             // If the request was successful (status 2xx), res.data contains the response body
//             // Your Flask backend should return: { message: "Login successful!", user_id: ..., name: ..., role: ... }
//             console.log("Login successful! Response data from backend:", res.data); // Keep this console.log

//             if (res.data.user_id) {
//                 // --- CRUCIAL: Store user_id and other relevant data in localStorage ---
//                 localStorage.setItem('userId', res.data.user_id);
//                 localStorage.setItem('userName', res.data.name || 'User'); // Store user's name
//                 localStorage.setItem('userRole', res.data.role || 'user'); // Store user's role

//                 // <--- ADD THESE NEW CONSOLE.LOGS ---
//                 console.log("DEBUG: Login.js - userId AFTER setting in localStorage:", localStorage.getItem('userId'));
//                 console.log("DEBUG: Login.js - userName AFTER setting in localStorage:", localStorage.getItem('userName'));
//                 console.log("DEBUG: Login.js - userRole AFTER setting in localStorage:", localStorage.getItem('userRole'));
//                 // --- END NEW CONSOLE.LOGS ---

//                 alert(res.data.message); // Still show an alert for immediate feedback
                
//                 // --- IMPORTANT: Redirect to the dashboard or home page ---
//                 navigate('/dashboard'); // Or '/my-listings', or '/' based on your app's flow
//             } else {
//                 setLoginError("Login successful, but no user ID received from the server. Please contact support.");
//             }

//         } catch (err) {
//             console.error('Login failed:', err);
//             // Axios errors typically have an err.response object for HTTP errors
//             const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.';
//             setLoginError(errorMessage); // Set the error message to display on the form
//             alert(errorMessage); // Also show an alert for immediate feedback
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h2 style={styles.heading}>Login</h2>
//             <form onSubmit={handleSubmit} style={styles.form}>
//                 <div style={styles.formGroup}>
//                     <label htmlFor="email" style={styles.label}>Email:</label>
//                     <input
//                         type="email"
//                         id="email"
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                         placeholder="Email"
//                         required
//                         style={styles.input}
//                     />
//                 </div>
//                 <div style={styles.formGroup}>
//                     <label htmlFor="password" style={styles.label}>Password:</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={e => setPassword(e.target.value)}
//                         placeholder="Password"
//                         required
//                         style={styles.input}
//                     />
//                 </div>

//                 {/* Role selection radio buttons */}
//                 <div style={styles.formGroup}>
//                     <label style={styles.label}>Login As:</label>
//                     <div style={styles.radioGroup}>
//                         <label style={styles.radioLabel}>
//                             <input
//                                 type="radio"
//                                 value="user"
//                                 checked={role === 'user'}
//                                 onChange={() => setRole('user')}
//                                 style={styles.radioInput}
//                             />
//                             User
//                         </label>
//                         <label style={styles.radioLabel}>
//                             <input
//                                 type="radio"
//                                 value="admin"
//                                 checked={role === 'admin'}
//                                 onChange={() => setRole('admin')}
//                                 style={styles.radioInput}
//                             />
//                             Admin
//                         </label>
//                     </div>
//                 </div>

//                 {loginError && <p style={styles.errorMessage}>{loginError}</p>}
//                 <button type="submit" style={styles.button}>Login</button>
//             </form>
//         </div>
//     );
// }

// // Basic inline styles (consider using a CSS file or CSS-in-JS library in a real app)
// const styles = {
//     container: {
//         padding: '20px',
//         maxWidth: '400px',
//         margin: '50px auto',
//         backgroundColor: '#f9f9f9',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         textAlign: 'center',
//     },
//     heading: {
//         color: '#333',
//         marginBottom: '20px',
//     },
//     form: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '15px',
//     },
//     formGroup: {
//         textAlign: 'left',
//     },
//     label: {
//         marginBottom: '5px',
//         display: 'block',
//         color: '#555',
//         fontWeight: 'bold',
//     },
//     input: {
//         width: '100%',
//         padding: '10px',
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//         boxSizing: 'border-box', // Include padding in the element's total width and height
//     },
//     radioGroup: {
//         display: 'flex',
//         gap: '15px',
//         marginTop: '5px',
//     },
//     radioLabel: {
//         display: 'flex',
//         alignItems: 'center',
//         cursor: 'pointer',
//     },
//     radioInput: {
//         marginRight: '5px',
//     },
//     button: {
//         padding: '12px 20px',
//         backgroundColor: '#007bff',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         fontSize: '1em',
//         marginTop: '10px',
//         transition: 'background-color 0.2s ease',
//     },
//     buttonHover: {
//         backgroundColor: '#0056b3',
//     },
//     errorMessage: {
//         color: 'red',
//         marginBottom: '10px',
//         fontSize: '0.9em',
//     }
// };
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