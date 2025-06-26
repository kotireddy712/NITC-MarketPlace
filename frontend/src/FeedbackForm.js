import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackForm.css';

function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@nitc.ac.in')) {
      setErrorMsg('Email must be a valid @nitc.ac.in address');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, feedback }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setErrorMsg('');
      } else {
        setErrorMsg(data.error || 'Something went wrong');
      }
    } catch (err) {
      setErrorMsg('Server error');
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-box">
        {!submitted ? (
          <>
            <h2>Submit Your Feedback</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your NITC Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                placeholder="Write your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <button type="submit">Submit</button>
            </form>
            {errorMsg && <div className="error-msg">{errorMsg}</div>}
          </>
        ) : (
          <div className="thank-you">
            <h3>Thanks for your feedback!</h3>
            <button onClick={() => navigate('/')}>Return to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackForm;
