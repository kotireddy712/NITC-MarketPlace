import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

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
    const [isSuccess, setIsSuccess] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminChoice, setShowAdminChoice] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const [otpCountdown, setOtpCountdown] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    useEffect(() => {
        let timer;
        if (otpCountdown > 0) {
            timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [otpCountdown]);

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
            setShowOtpVerification(true);
            setOtpSent(true);
            setOtpCountdown(60);
        } catch (err) {
            console.error("Error sending OTP:", err);
            setMessage(err.response?.data?.message || err.message || 'Failed to send OTP.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!form.otp) {
            setMessage('Please enter the OTP.');
            setIsSuccess(false);
            return;
        }

        setIsVerifying(true);
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
                setIsOtpVerified(true);
                setShowOtpVerification(false);
                setOtpSent(false);
                setOtpCountdown(0);
                setForm({ ...form, otp: '' });
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

    const handleLoginOrSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsSuccess(null);

        if (isLogin) {
            // Login Flow
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
                        setShowAdminChoice(true);
                    } else {
                        setTimeout(() => navigate('/dashboard'), 1000);
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
            // Signup Flow
            if (!isOtpVerified) {
                setMessage('Please verify your email with OTP before signing up.');
                setIsSuccess(false);
                setIsLoading(false);
                return;
            }

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
                    phone: form.contact_number
                });

                setMessage(res.data.message);
                setIsSuccess(true);

                setTimeout(() => {
                    setIsLogin(true);
                    setForm({ email: form.email, password: '', name: '', contact_number: '', otp: '' });
                    setMessage('Signup successful! Please log in with your new password.');
                    setIsSuccess(true);
                    setShowOtpVerification(false);
                    setIsOtpVerified(false);
                    setOtpSent(false);
                }, 1000);
            } catch (err) {
                console.error("Error during signup:", err);
                setMessage(err.response?.data?.message || err.message || 'Signup failed.');
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        }
    };

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
                        disabled={!isLogin && (otpSent || isOtpVerified || isLoading)}
                    />

                    {/* OTP Section */}
                    {!isLogin && otpSent && !isOtpVerified && (
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

                    {/* Send OTP Button */}
                    {!isLogin && !otpSent && !isOtpVerified && (
                        <button
                            type="button"
                            onClick={sendOtp}
                            disabled={isLoading}
                            className="send-otp-btn"
                        >
                            Send OTP
                        </button>
                    )}

                    {/* Signup Fields */}
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

                    {/* Login Password */}
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

                    <button type="submit" disabled={isLoading}>
                        {isLoading
                            ? 'Processing...'
                            : isLogin
                                ? 'Login'
                                : isOtpVerified
                                    ? 'Complete Signup'
                                    : otpSent
                                        ? 'Verify OTP'
                                        : 'Send OTP'}
                    </button>

                    {message && (
                        <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>
                    )}
                </form>

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
