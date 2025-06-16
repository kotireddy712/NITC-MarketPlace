import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css'; // Assuming your CSS is here
import backgroundImage from './p1.png'; // Assuming your background image is here

// Set axios to send cookies with all requests globally.
// This is CRUCIAL for session persistence between your frontend and Flask backend.
axios.defaults.withCredentials = true;

function AuthForm() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        contact_number: '',
        otp: ''
    });

    const [darkMode, setDarkMode] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null); // null for initial, true for success, false for error
    const [isAdmin, setIsAdmin] = useState(false); // To store admin status from login
    const [showAdminChoice, setShowAdminChoice] = useState(false); // To show admin/user choice after admin login

    // States for OTP flow
    const [otpSent, setOtpSent] = useState(false); // True after OTP is sent successfully
    const [showOtpVerification, setShowOtpVerification] = useState(false); // Controls visibility of OTP input field
    const [isOtpVerified, setIsOtpVerified] = useState(false); // True after OTP is successfully verified

    // States for UI feedback (loading/disabling buttons)
    const [otpCountdown, setOtpCountdown] = useState(0); // Countdown for OTP resend
    const [isVerifying, setIsVerifying] = useState(false); // For OTP verification button loading state
    const [isLoading, setIsLoading] = useState(false); // General loading state for main form submission

    // Effect to load theme preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    // Effect for OTP countdown timer
    useEffect(() => {
        let timer;
        if (otpCountdown > 0) {
            timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
        }
        // Cleanup timer on component unmount or if countdown finishes/resets
        return () => clearTimeout(timer);
    }, [otpCountdown]);

    // Toggles between Login and Signup modes, resetting form and states
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setForm({ email: '', password: '', name: '', contact_number: '', otp: '' });
        setMessage('');
        setIsSuccess(null);
        setIsAdmin(false);
        setShowAdminChoice(false);
        setShowOtpVerification(false);
        setIsOtpVerified(false);
        setOtpSent(false);
        setOtpCountdown(0);
        setIsLoading(false);
        setIsVerifying(false);
    };

    // Handles changes in form input fields
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- OTP Flow Functions ---

    // Sends an OTP to the user's email
    const sendOtp = async () => {
        if (!form.email) {
            setMessage('Please enter your email first.');
            setIsSuccess(false);
            return;
        }

        setIsLoading(true); // General loading for the form
        setMessage(''); // Clear previous messages
        setIsSuccess(null);

        try {
            const res = await axios.post('http://localhost:5000/send-otp', {
                email: form.email
            });

            setMessage(res.data.message);
            setIsSuccess(true);
            setShowOtpVerification(true); // Show OTP input field
            setOtpSent(true); // Mark OTP as sent
            setOtpCountdown(60); // Start 60-second countdown for resend
        } catch (err) {
            console.error("Error sending OTP:", err); // Log full error for debugging
            setMessage(err.response?.data?.message || err.message || 'Failed to send OTP.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Verifies the entered OTP
    const verifyOtp = async () => {
        if (!form.otp) {
            setMessage('Please enter the OTP.');
            setIsSuccess(false);
            return;
        }

        setIsVerifying(true); // Specific loading for OTP verification
        setMessage('');
        setIsSuccess(null);

        try {
            const res = await axios.post('http://localhost:5000/verify-otp', {
                email: form.email,
                otp: form.otp
            });

            if (res.data.verified) {
                setMessage(res.data.message);
                setIsSuccess(true);
                setIsOtpVerified(true); // Mark OTP as verified
                setShowOtpVerification(false); // Hide OTP section
                setOtpSent(false); // Reset OTP sent state
                setForm({ ...form, otp: '' }); // Clear OTP input
            } else {
                setMessage(res.data.message || 'OTP verification failed.');
                setIsSuccess(false);
            }
        } catch (err) {
            console.error("Error verifying OTP:", err); // Log full error for debugging
            setMessage(err.response?.data?.message || err.message || 'OTP verification failed.');
            setIsSuccess(false);
        } finally {
            setIsVerifying(false);
        }
    };

    // --- Main Form Submission Handler (Login and Signup) ---
    const handleLoginOrSignup = async (e) => {
        e.preventDefault(); // Prevent default form submission reload
        setIsLoading(true); // General loading for the form submission
        setMessage(''); // Clear previous messages
        setIsSuccess(null);

        if (isLogin) {
            // --- Login Logic ---
            try {
                const res = await axios.post('http://localhost:5000/login', {
                    email: form.email,
                    password: form.password
                });

                const data = res.data;

                setMessage(data.message);
                setIsSuccess(true);

                if (data.user_id) {
                    // Store user data in localStorage (consider Redux/Context for larger apps)
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('user_name', data.name);
                    localStorage.setItem('user_email', data.email);
                    localStorage.setItem('is_admin', data.is_admin);
                    setIsAdmin(data.is_admin);

                    if (data.is_admin) {
                        setShowAdminChoice(true); // Show admin/user choice
                    } else {
                        // Navigate to user dashboard
                        setTimeout(() => navigate('/dashboard'), 1500);
                    }
                }
            } catch (err) {
                console.error("Error during login:", err); // Log full error for debugging
                setMessage(err.response?.data?.message || err.message || 'Login failed.');
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            // --- Signup Flow Logic ---
            // This button's text changes based on the state of the signup flow
            if (!otpSent && !isOtpVerified) {
                // If OTP not sent, send it
                await sendOtp();
            } else if (otpSent && !isOtpVerified) {
                // If OTP sent but not verified, try to verify it
                await verifyOtp();
            } else {
                // If OTP verified, proceed with full signup details
                if (!form.name || !form.password || !form.contact_number) {
                    setMessage('Please fill in all signup details (Full Name, Password, Contact Number).');
                    setIsSuccess(false);
                    setIsLoading(false); // Stop loading if fields are missing
                    return;
                }

                try {
                    const res = await axios.post('http://localhost:5000/signup', {
                        email: form.email,
                        password: form.password,
                        name: form.name,
                        phone: form.contact_number // Backend expects 'phone'
                    });

                    setMessage(res.data.message);
                    setIsSuccess(true);

                    // Redirect to login after successful signup
                    setTimeout(() => {
                        setIsLogin(true); // Switch to login view
                        setForm({ email: form.email, password: '', name: '', contact_number: '', otp: '' }); // Clear sensitive fields
                        setMessage('Signup successful! Please log in with your new password.');
                        setIsSuccess(true);
                        // Reset all signup-related states
                        setShowOtpVerification(false);
                        setIsOtpVerified(false);
                        setOtpSent(false);
                    }, 1500);
                } catch (err) {
                    console.error("Error during signup:", err); // Log full error for debugging
                    setMessage(err.response?.data?.message || err.message || 'Signup failed.');
                    setIsSuccess(false);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    // Toggles dark/light mode
    const handleToggleTheme = () => {
        if (darkMode) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            setDarkMode(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            setDarkMode(true);
        }
    };

    // Handles admin choice after login
    const handleAdminChoice = (choice) => {
        setShowAdminChoice(false);
        if (choice === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="app-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <button id="toggle-theme" onClick={handleToggleTheme} className="theme-toggle-button">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="auth-container">
                <h2>NITC Marketplace</h2>
                <div className="tab">
                    <button className={isLogin ? 'active' : ''} onClick={toggleMode}>Login</button>
                    <button className={!isLogin ? 'active' : ''} onClick={toggleMode}>Signup</button>
                </div>

                <form onSubmit={handleLoginOrSignup} className="auth-form">
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="Email (use @nitc.ac.in)"
                        onChange={handleChange}
                        required
                        // Disable email input during signup flow after OTP is sent/verified
                        disabled={!isLogin && (otpSent || isOtpVerified || isLoading)}
                    />

                    {/* OTP Verification Section (only visible during signup, after OTP sent, before verified) */}
                    {!isLogin && showOtpVerification && !isOtpVerified && (
                        <div className="otp-section">
                            <div className="otp-input-container">
                                <input
                                    type="text"
                                    name="otp"
                                    value={form.otp}
                                    placeholder="Enter 6-digit OTP"
                                    onChange={handleChange}
                                    maxLength="6"
                                    required
                                    className="otp-input"
                                    disabled={isVerifying || isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={verifyOtp}
                                    disabled={isVerifying || form.otp.length !== 6 || isLoading}
                                    className="verify-otp-btn"
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={sendOtp} // This re-sends OTP
                                disabled={otpCountdown > 0 || isLoading}
                                className="resend-otp-btn"
                            >
                                {otpCountdown > 0 ? `Resend OTP (${otpCountdown}s)` : 'Resend OTP'}
                            </button>
                        </div>
                    )}

                    {/* Signup Details Section (only visible during signup, after OTP verified) */}
                    {!isLogin && isOtpVerified && (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                                disabled={isLoading} // Disable if overall form is loading
                            />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                name="contact_number"
                                value={form.contact_number}
                                placeholder="Contact Number"
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* Password Input for Login Mode */}
                    {isLogin && (
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    )}

                    {/* Main Submit Button - text changes based on context */}
                    <button type="submit" disabled={isLoading || (isVerifying && !isLogin && showOtpVerification)}>
                        {isLoading || (isVerifying && !isLogin && showOtpVerification) ? 'Processing...' :
                         isLogin ? 'Login' :
                         (isOtpVerified ? 'Sign Up' : 'Send OTP')}
                    </button>

                    {/* Message Display Area */}
                    {message && (
                        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                </form>

                {/* Admin Choice after Login */}
                {showAdminChoice && (
                    <div className="admin-choice">
                        <p>Proceed as:</p>
                        <button onClick={() => handleAdminChoice('admin')}>Admin</button>
                        <button onClick={() => handleAdminChoice('user')}>User</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthForm;