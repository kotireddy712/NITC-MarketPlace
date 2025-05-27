// import React, { useState, useEffect } from 'react';
// import './sell.css'; // Assuming you have this CSS file

// function Sell() {
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     quantity: 1,
//     condition: 'Used',
//     category_id: '',
//     image: null,
//   });
//   const [message, setMessage] = useState('');
//   // Retrieve userId from localStorage - this line runs when component first renders
//   const userId = localStorage.getItem('user_id'); 

//   // Debug: See userId immediately when Sell.js loads
//   useEffect(() => {
//     console.log('Sell.js component loaded. User ID from localStorage (on mount):', userId); 

//     // Fetch categories when the component mounts
//     fetch('http://localhost:5000/categories')
//       .then(res => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log('Fetched categories successfully:', data);
//         setCategories(data);
//       })
//       .catch(err => {
//         console.error('Failed to load categories:', err);
//         setMessage('Failed to load categories. Please try refreshing.');
//       });
//   }, []); // Empty dependency array means this runs once on mount

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData(prev => ({ ...prev, image: e.target.files[0] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Debug: Check userId right before submission
//     console.log('Submit button clicked in Sell.js. User ID from localStorage (on submit):', userId); 

//     if (!userId) {
//       setMessage('You must be logged in to sell an item. Please log in first.');
//       console.warn('Submission blocked: user_id is missing or null in localStorage.'); // Debug: Indicate why it's blocked
//       return;
//     }

//     const data = new FormData();
//     data.append('title', formData.title);
//     data.append('description', formData.description);
//     data.append('price', formData.price);
//     data.append('quantity', formData.quantity);
//     data.append('condition', formData.condition);
//     data.append('category_id', formData.category_id);
//     if (formData.image) {
//       data.append('image', formData.image);
//     }

//     console.log('Attempting to send item data with user_id header:', userId); // Debug: Confirm header value

//     try {
//       const response = await fetch('http://localhost:5000/items', {
//         method: 'POST',
//         headers: {
//           // Send the user_id as a header. FormData implicitly sets Content-Type.
//           'user_id': userId, 
//         },
//         body: data, 
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setMessage('Item listed for sale successfully!');
//         // Clear the form after successful submission
//         setFormData({
//           title: '', description: '', price: '', quantity: 1, condition: 'Used', category_id: '', image: null,
//         });
//         console.log('Item added successfully. Server response:', result); 
//       } else {
//         // Display specific error from backend
//         setMessage(result.error || 'Failed to list item. Please try again.');
//         console.error('Failed to list item. Server response:', result); 
//       }
//     } catch (error) {
//       console.error('Network Error during item submission:', error); // Log full network error
//       setMessage('Network error during item submission: ' + error.message);
//     }
//   };

//   return (
//     <div className="sell-container">
//       <h2>Sell an Item</h2>
//       {message && <p className="message">{message}</p>} {/* Display messages to the user */}
//       <form onSubmit={handleSubmit} className="sell-form" encType="multipart/form-data">
//         <label>
//           Title<span className="required">*</span>:
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Description:
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Price<span className="required">*</span>:
//           <input
//             type="number"
//             name="price"
//             step="0.01" 
//             min="0"
//             value={formData.price}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Quantity:
//           <input
//             type="number"
//             name="quantity"
//             min="1"
//             value={formData.quantity}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Condition:
//           <select
//             name="condition"
//             value={formData.condition}
//             onChange={handleChange}
//           >
//             <option value="New">New</option>
//             <option value="Good">Good</option>
//             <option value="Used">Used</option>
//           </select>
//         </label>

//         <label>
//           Category<span className="required">*</span>:
//           <select
//             name="category_id"
//             value={formData.category_id}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.length === 0 ? (
//               <option disabled>Loading categories...</option>
//             ) : (
//               categories.map(cat => (
//                 <option key={cat.category_id} value={cat.category_id}>
//                   {cat.name}
//                 </option>
//               ))
//             )}
//           </select>
//         </label>

//         <label>
//           Image:
//           <input
//             type="file"
//             name="image"
//             accept="image/*" 
//             onChange={handleFileChange}
//           />
//         </label>

//         <button type="submit" className="sell-button">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default Sell;
import React, { useState, useEffect } from 'react';
import './sell.css'; // Assuming you have this CSS file
import axios from 'axios'; // Use axios for consistency with login.js and for `withCredentials`

function Sell() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: 1,
    condition: 'Used',
    category_id: '',
    image: null,
  });
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [isLoading, setIsLoading] = useState(true); // New state to manage loading status

  useEffect(() => {
    // Check login status when component mounts
    axios.get('http://localhost:5000/check_session', { withCredentials: true }) // <-- ENSURE THIS HAS { withCredentials: true }
      .then(res => {
        if (res.data.logged_in) {
          setIsLoggedIn(true);
          console.log('User is logged in (session active). User ID:', res.data.user_id);
          setIsLoading(false); // Finished loading login status
        } else {
          setIsLoggedIn(false);
          setMessage('You must be logged in to sell an item. Redirecting to login...');
          setIsLoading(false); // Finished loading login status
          setTimeout(() => {
            window.location.href = '/login'; // Redirect after a short delay
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Error checking session:', err.response?.data || err.message, err);
        setIsLoggedIn(false);
        setMessage('Could not verify login status. Redirecting to login...');
        setIsLoading(false); // Finished loading login status
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      });

    // Fetch categories when the component mounts
    axios.get('http://localhost:5000/categories')
      .then(res => {
        console.log('Fetched categories successfully:', res.data);
        setCategories(res.data);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        setMessage('Failed to load categories. Please try refreshing.');
      });
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // This check is good as a safeguard, but the `useEffect` should ideally handle the redirect first.
    if (!isLoggedIn) {
      setMessage('You are not logged in. Please log in to sell an item.');
      console.warn('Submission blocked: User not logged in according to session check.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('condition', formData.condition);
    data.append('category_id', formData.category_id);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // No need to send user_id header; it's handled by the session cookie
      const response = await axios.post('http://localhost:5000/items', data, {
        withCredentials: true // <-- ENSURE THIS HAS { withCredentials: true }
      });

      setMessage('Item listed for sale successfully!');
      // Clear the form after successful submission
      setFormData({
        title: '', description: '', price: '', quantity: 1, condition: 'Used', category_id: '', image: null,
      });
      console.log('Item added successfully. Server response:', response.data); 
    } catch (error) {
      console.error('Error listing item:', error.response?.data || error.message, error); 
      setMessage(error.response?.data?.error || 'Failed to list item. Please try again.');
    }
  };

  // Display a loading message while checking login status
  if (isLoading) {
    return (
      <div className="sell-container">
        <h2>Sell an Item</h2>
        <p className="message">Checking login status...</p>
      </div>
    );
  }

  // If not logged in after checking, display message and redirect
  if (!isLoggedIn) {
    return (
      <div className="sell-container">
        <h2>Sell an Item</h2>
        <p className="message">{message}</p>
        <p>Please wait while we check your login status or redirect you...</p>
      </div>
    );
  }

  // If logged in, show the form
  return (
    <div className="sell-container">
      <h2>Sell an Item</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="sell-form" encType="multipart/form-data">
        <label>
          Title<span className="required">*</span>:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Price<span className="required">*</span>:
          <input
            type="number"
            name="price"
            step="0.01" 
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
          />
        </label>

        <label>
          Condition:
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Used">Used</option>
          </select>
        </label>

        <label>
          Category<span className="required">*</span>:
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.length === 0 ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </label>

        <label>
          Image:
          <input
            type="file"
            name="image"
            accept="image/*" 
            onChange={handleFileChange}
          />
        </label>

        <button type="submit" className="sell-button">Submit</button>
      </form>
    </div>
  );
}

export default Sell;