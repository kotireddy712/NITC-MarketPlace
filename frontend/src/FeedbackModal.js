// import React, { useState, useEffect } from 'react';
// import './styles/FeedbackModal.css';

// /**
//  * FeedbackModal Component
//  * A reusable modal for collecting user feedback.
//  * It takes 'show' (boolean), 'onClose' (function), and 'onSubmit' (async function) props.
//  * The onSubmit function is expected to handle the API call for feedback submission.
//  */
// function FeedbackModal({ show, onClose, onSubmit }) {
//   const [feedbackText, setFeedbackText] = useState('');
//   const [submissionMessage, setSubmissionMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Effect to reset modal state when it is shown
//   useEffect(() => {
//     if (show) {
//       setFeedbackText('');
//       setSubmissionMessage('');
//       setIsSubmitting(false);
//       // When 'show' becomes true, add the 'active' class after a short delay
//       // to allow the component to render first, then trigger the transition.
//       // This part is crucial for the animation.
//       document.querySelector('.feedback-modal-overlay')?.classList.add('active');
//     } else {
//       // When 'show' becomes false, remove the 'active' class
//       document.querySelector('.feedback-modal-overlay')?.classList.remove('active');
//     }
//   }, [show]); // Depend on 'show' prop

//   // Handles the submission of the feedback form
//   const handleSubmit = async () => {
//     if (!feedbackText.trim()) {
//       setSubmissionMessage('Please enter your feedback before submitting.');
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmissionMessage('Submitting feedback...');

//     try {
//       // Call the onSubmit prop passed from the parent (Dashboard.js)
//       // The parent will handle the actual API call to the backend
//       await onSubmit(feedbackText);
//       setSubmissionMessage('Thank you for your valuable feedback!');
//       setFeedbackText(''); // Clear the text area after successful submission
//       // Optionally, you can automatically close the modal after a short delay:
//       // setTimeout(onClose, 2000); // If you want to auto-close
//     } catch (error) {
//       console.error('Feedback submission error in modal:', error);
//       setSubmissionMessage('Failed to submit feedback. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // If the modal is not meant to be shown, return null to render nothing
//   // This helps prevent rendering the modal elements when not needed, improving performance.
//   if (!show) {
//     return null;
//   }

//   return (
//     // Note: The 'active' class will be added/removed by the useEffect.
//     // The initial render state is still based on `show`.
//     <div className="feedback-modal-overlay">
//       <div className="feedback-modal-content card-base">
//         <button className="close-modal-button" onClick={onClose} aria-label="Close feedback modal">
//           &times;
//         </button>
//         <h3>We'd Love Your Feedback!</h3>
//         <p>Please share your review or suggestions for improvement.</p>
//         <textarea
//           className="feedback-textarea"
//           placeholder="Your feedback here..."
//           value={feedbackText}
//           onChange={(e) => setFeedbackText(e.target.value)}
//           rows="6"
//           // Disable textarea while submitting or after successful submission
//           disabled={isSubmitting || submissionMessage.includes('Thank you')}
//           aria-label="Feedback text input"
//         ></textarea>
//         {submissionMessage && (
//           <p className={`submission-message ${submissionMessage.includes('Thank you') ? 'success' : 'error'}`} role="alert">
//             {submissionMessage}
//           </p>
//         )}
//         <button
//           className="submit-feedback-button"
//           onClick={handleSubmit}
//           // Disable button while submitting or after successful submission
//           disabled={isSubmitting || submissionMessage.includes('Thank you')}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default FeedbackModal;
import React, { useState, useEffect } from 'react';
import './styles/FeedbackModal.css';

/**
 * FeedbackModal Component
 * A reusable modal for collecting user feedback.
 * It takes 'show' (boolean), 'onClose' (function), 'onSubmit' (async function),
 * and 'redirectAfterSubmit' (function) props.
 */
function FeedbackModal({ show, onClose, onSubmit, redirectAfterSubmit }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to reset modal state and handle CSS class for animation when it is shown/hidden
  useEffect(() => {
    const modalOverlay = document.querySelector('.feedback-modal-overlay');
    if (show) {
      setFeedbackText('');
      setSubmissionMessage('');
      setIsSubmitting(false);
      // Add 'active' class after a short delay for animation, if the element exists
      if (modalOverlay) {
        // Use requestAnimationFrame for smoother transition after render
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
          });
        });
      }
    } else {
      // Remove 'active' class when modal is hidden
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    }
  }, [show]); // Depend on 'show' prop

  // Handles the submission of the feedback form
  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      setSubmissionMessage('Please enter your feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage('Submitting feedback...');

    try {
      await onSubmit(feedbackText); // Call the onSubmit prop (from Dashboard)
      setSubmissionMessage('Thank you for your valuable feedback!');
      setFeedbackText(''); // Clear text area after submission

      // --- NEW: Redirect after showing thank you message ---
      setTimeout(() => {
        onClose(); // Close the modal first
        if (redirectAfterSubmit) {
          redirectAfterSubmit(); // Then redirect to the dashboard
        }
      }, 2000); // Wait for 2 seconds after showing the message
      // --- END NEW ---

    } catch (error) {
      console.error('Feedback submission error in modal:', error);
      setSubmissionMessage('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render the modal JSX if 'show' is true
  if (!show) {
    return null;
  }

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal-content card-base">
        <button className="close-modal-button" onClick={onClose} aria-label="Close feedback modal">
          &times;
        </button>
        <h3>We'd Love Your Feedback!</h3>
        <p>Please share your review or suggestions for improvement.</p>
        <textarea
          className="feedback-textarea"
          placeholder="Your feedback here..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows="6"
          disabled={isSubmitting || submissionMessage.includes('Thank you')}
          aria-label="Feedback text input"
        ></textarea>
        {submissionMessage && (
          <p className={`submission-message ${submissionMessage.includes('Thank you') ? 'success' : 'error'}`} role="alert">
            {submissionMessage}
          </p>
        )}
        <button
          className="submit-feedback-button"
          onClick={handleSubmit}
          disabled={isSubmitting || submissionMessage.includes('Thank you')}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
}

export default FeedbackModal;