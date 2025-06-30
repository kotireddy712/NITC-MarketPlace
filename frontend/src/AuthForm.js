import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

axios.defaults.withCredentials = true; // Essential for sending/receiving cookies

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
    const [isSuccess, setIsSuccess] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminChoice, setShowAdminChoice] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [otpCountdown, setOtpCountdown] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Effect to set initial theme from localStorage
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
        return () => clearTimeout(timer); // Cleanup timer on unmount or if otpCountdown changes
    }, [otpCountdown]);

    // Toggles between Login and Signup modes, resetting form and state
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

    // Handles input changes for the form fields
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Sends OTP to the provided email
    const sendOtp = async () => {
        if (!form.email) {
            setMessage('Please enter your email first.');
            setIsSuccess(false);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsSuccess(null);

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send-otp`, {
                email: form.email
            });

            setMessage(res.data.message);
            setIsSuccess(true);
            setShowOtpVerification(true); // Show OTP input field
            setOtpSent(true); // Indicate OTP has been sent
            setOtpCountdown(60); // Start countdown for resend
        } catch (err) {
            console.error("Error sending OTP:", err);
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

        setIsVerifying(true); // Indicate OTP verification in progress
        setMessage('');
        setIsSuccess(null);

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify-otp`, {
                email: form.email,
                otp: form.otp
            });

            if (res.data.verified) {
                setMessage(res.data.message);
                setIsSuccess(true);
                setIsOtpVerified(true); // OTP successfully verified
                setShowOtpVerification(false); // Hide OTP section
                setOtpSent(false); // Reset otpSent as verification is complete
                setForm({ ...form, otp: '' }); // Clear OTP field
            } else {
                setMessage(res.data.message || 'OTP verification failed.');
                setIsSuccess(false);
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setMessage(err.response?.data?.message || err.message || 'OTP verification failed.');
            setIsSuccess(false);
        } finally {
            setIsVerifying(false);
        }
    };

    // Handles the overall login/signup submission based on current mode and state
    const handleLoginOrSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true); // General loading state for the form submission
        setMessage('');
        setIsSuccess(null);

        if (isLogin) {
            // --- Login Flow ---
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                    email: form.email,
                    password: form.password
                });

                const data = res.data;
                setMessage(data.message);
                setIsSuccess(true);

                if (data.user_id) {
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('user_name', data.name);
                    localStorage.setItem('user_email', data.email);
                    localStorage.setItem('is_admin', data.is_admin);
                    setIsAdmin(data.is_admin);

                    if (data.is_admin) {
                        setShowAdminChoice(true); // Show choice for admin login
                    } else {
                        setTimeout(() => navigate('/dashboard'), 1500); // Redirect regular users
                    }
                }
            } catch (err) {
                console.error("Error during login:", err);
                setMessage(err.response?.data?.message || err.message || 'Login failed.');
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            // --- Signup Flow ---
            if (!isOtpVerified) {
                // If OTP is not yet verified, initiate or complete the OTP flow
                if (!otpSent) {
                    // If OTP hasn't been sent, send it
                    await sendOtp();
                } else if (otpSent && showOtpVerification) {
                    // If OTP was sent and verification section is shown, try to verify it
                    await verifyOtp();
                }
                setIsLoading(false); // Reset loading as we're waiting for user input for OTP
                return; // Exit function, wait for next submit or OTP input
            }

            // If OTP is verified, proceed with full signup details submission
            if (isOtpVerified) {
                if (!form.name || !form.password || !form.contact_number) {
                    setMessage('Please fill in all signup details (Full Name, Password, Contact Number).');
                    setIsSuccess(false);
                    setIsLoading(false);
                    return;
                }

                try {
                    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
                        email: form.email,
                        password: form.password,
                        name: form.name,
                        phone: form.contact_number // Backend expects 'phone'
                    });

                    setMessage(res.data.message);
                    setIsSuccess(true);

                    // Redirect to login after successful signup
                    setTimeout(() => {
                        setIsLogin(true); // Switch to login mode
                        setForm({ email: form.email, password: '', name: '', contact_number: '', otp: '' }); // Clear most fields, keep email
                        setMessage('Signup successful! Please log in with your new password.');
                        setIsSuccess(true);
                        // Reset OTP-related states to ensure clean slate for future signups
                        setShowOtpVerification(false);
                        setIsOtpVerified(false);
                        setOtpSent(false);
                    }, 1500);
                } catch (err) {
                    console.error("Error during signup:", err);
                    setMessage(err.response?.data?.message || err.message || 'Signup failed.');
                    setIsSuccess(false);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    // Toggles between Dark and Light theme
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

    // Handles admin/user choice after login
    const handleAdminChoice = (choice) => {
        setShowAdminChoice(false);
        if (choice === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div>
            {/* Theme Toggle Button */}
            <button id="toggle-theme" onClick={handleToggleTheme} className="theme-toggle-button">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="auth-container">
                <h2>NITC Marketplace</h2>
                {/* Login/Signup Tabs */}
                <div className="tab">
                    <button className={isLogin ? 'active' : ''} onClick={toggleMode}>Login</button>
                    <button className={!isLogin ? 'active' : ''} onClick={toggleMode}>Signup</button>
                </div>

                <form onSubmit={handleLoginOrSignup} className="auth-form">
                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="Email (use @nitc.ac.in)"
                        onChange={handleChange}
                        required
                        // Disable email input after OTP is sent or verified for signup flow
                        disabled={!isLogin && (otpSent || isOtpVerified || isLoading || showOtpVerification)}
                    />

                    {/* OTP Verification Section (visible during signup if OTP sent but not verified) */}
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
                                onClick={sendOtp}
                                disabled={otpCountdown > 0 || isLoading}
                                className="resend-otp-btn"
                            >
                                {otpCountdown > 0 ? `Resend OTP (${otpCountdown}s)` : 'Resend OTP'}
                            </button>
                        </div>
                    )}

                    {/* Signup Details Fields (visible only if NOT login AND OTP is verified) */}
                    {!isLogin && isOtpVerified && (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                placeholder="Full Name"
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
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* Password field for Login (visible only if in Login mode) */}
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

                    {/* Main Submit Button - text changes based on state */}
                    <button type="submit" disabled={isLoading}>
                        {isLoading
                            ? 'Processing...'
                            : isLogin
                                ? 'Login'
                                : isOtpVerified
                                    ? 'Complete Signup' // After OTP verified, button for final signup
                                    : otpSent
                                        ? 'Verify OTP' // After OTP sent, button for verification
                                        : 'Send OTP'}
                    </button>

                    {/* Message Display (success/error) */}
                    {message && (
                        <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>
                    )}
                </form>

                {/* Admin Choice after Login (if admin) */}
                {showAdminChoice && (
                    <div className="admin-choice">
                        <p>Login as:</p>
                        <button onClick={() => handleAdminChoice('admin')}>Admin</button>
                        <button onClick={() => handleAdminChoice('user')}>User</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthForm;
