// import { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//     name: '',
//     contact_number: ''
//   });

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setForm({ email: '', password: '', name: '', contact_number: '' });
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const endpoint = isLogin ? '/login' : '/signup';
//     try {
//       const res = await axios.post(`http://localhost:5000${endpoint}`, form);
//       alert(res.data.message);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>NITC Portal</h2>
//       <div className="tab">
//         <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
//         <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Signup</button>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <input type="email" name="email" value={form.email} placeholder="Email (use @nitc.ac.in)" onChange={handleChange} required />
//         <input type="password" name="password" value={form.password} placeholder="Password" onChange={handleChange} required />

//         {!isLogin && (
//           <>
//             <input type="text" name="name" value={form.name} placeholder="Full Name" onChange={handleChange} required />
//             <input type="text" name="contact_number" value={form.contact_number} placeholder="Contact Number" onChange={handleChange} required />
//           </>
//         )}
//         <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
//       </form>
//     </div>
//   );
// }

// export default AuthForm;
// -------------------------------------------------
// import React, { useState } from 'react';
// import './AuthForm.css';

// function AuthForm() {
//   const [tab, setTab] = useState('login');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     contact_number: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url = tab === 'login' ? '/login' : '/signup';

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData)
//     });

//     const data = await response.json();
//     alert(data.message);
//   };

//   return (
//     <div className="auth-container">
//       <div className="tab">
//         <button
//           className={tab === 'login' ? 'active' : ''}
//           onClick={() => setTab('login')}
//         >
//           Login
//         </button>
//         <button
//           className={tab === 'signup' ? 'active' : ''}
//           onClick={() => setTab('signup')}
//         >
//           Signup
//         </button>
//       </div>

//       <h2>{tab === 'login' ? 'Login' : 'Sign Up'}</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="NITC Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />

//         {tab === 'signup' && (
//           <>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               name="contact_number"
//               placeholder="Contact Number"
//               value={formData.contact_number}
//               onChange={handleChange}
//               required
//             />
//           </>
//         )}

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">{tab === 'login' ? 'Login' : 'Sign Up'}</button>
//       </form>
//     </div>
//   );
// }

// export default AuthForm;
// -----------------
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function AuthForm() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      alert(res.data.message);
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

