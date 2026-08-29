import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, t }) {
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Resend countdown timer logic
    useEffect(() => {
        let interval = null;
        if (step === 'otp' && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, resendTimer]);

    if (!isOpen) return null;

    // Handle Phone Form Submit -> Send OTP
    const handleSendOTP = (e) => {
        if (e) e.preventDefault();
        const cleanPhone = phoneNumber.replace(/\D/g, '');

        if (cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        setError('');
        setLoading(true);

        // Simulate API call to send OTP
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
            setResendTimer(30);
            setCanResend(false);
        }, 800);
    };

    // Auto Fill Demo Phone Number
    const fillDemoPhone = () => {
        setPhoneNumber('9876543210');
        setError('');
    };

    // Auto Fill Demo OTP
    const fillDemoOTP = () => {
        setOtpDigits(['1', '2', '3', '4', '5', '6']);
        setError('');
    };

    // Handle OTP Input Change
    const handleOtpChange = (index, value) => {
        const val = value.replace(/\D/g, '');
        const updated = [...otpDigits];

        if (val.length > 1) {
            // User pasted full OTP
            const digits = val.slice(0, 6).split('');
            for (let i = 0; i < 6; i++) {
                updated[i] = digits[i] || '';
            }
            setOtpDigits(updated);
            return;
        }

        updated[index] = val;
        setOtpDigits(updated);

        // Auto focus next box
        if (val && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle Backspace navigation in OTP boxes
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Handle Verify OTP
    const handleVerifyOTP = (e) => {
        if (e) e.preventDefault();
        const enteredOtp = otpDigits.join('');

        if (enteredOtp.length < 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }

        // Demo OTP check or any 6 digit input accepted
        if (enteredOtp !== '123456' && enteredOtp.length === 6) {
            // Allow any 6 digits or default demo 123456
        }

        setError('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setStep('success');

            const userData = {
                phone: `${countryCode} ${phoneNumber.replace(/\D/g, '') || '9876543210'}`,
                name: 'Verified Farmer',
                loggedInAt: new Date().toISOString()
            };

            setTimeout(() => {
                onLoginSuccess(userData);
                onClose();
                // Reset state
                setStep('phone');
                setOtpDigits(['', '', '', '', '', '']);
            }, 1000);
        }, 900);
    };

    // Handle Quick Demo Login
    const handleQuickDemoLogin = () => {
        setLoading(true);
        setTimeout(() => {
            const userData = {
                phone: '+91 98765 43210',
                name: 'AgriPulse Demo Farmer',
                loggedInAt: new Date().toISOString()
            };
            setLoading(false);
            onLoginSuccess(userData);
            onClose();
        }, 500);
    };

    const handleResendOTP = () => {
        if (!canResend) return;
        setOtpDigits(['', '', '', '', '', '']);
        setError('');
        setResendTimer(30);
        setCanResend(false);
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
                {/* Close X Button */}
                <button className="auth-modal-close" onClick={onClose} title="Close">
                    ✕
                </button>

                {/* Left/Top Branding Banner (Green AgriX Style) */}
                <div className="auth-brand-header">
                    <div className="auth-logo-badge">🌱</div>
                    <div>
                        <h3 className="auth-brand-title">AgriPulse AI</h3>
                        <p className="auth-brand-sub">Smart Farm & Crop Intelligence Suite</p>
                    </div>
                </div>

                {/* STEP 1: MOBILE PHONE ENTRY */}
                {step === 'phone' && (
                    <div className="auth-body">
                        <div className="auth-heading-block">
                            <h4>Welcome to AgriPulse! 👋</h4>
                            <p>Enter your 10-digit mobile number to receive a one-time password (OTP).</p>
                        </div>

                        {error && <div className="auth-error-banner">⚠️ {error}</div>}

                        <form onSubmit={handleSendOTP}>
                            <label className="auth-input-label">Mobile Number</label>
                            <div className="phone-input-group">
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="country-code-select"
                                >
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+971">🇦🇪 +971</option>
                                </select>

                                <input
                                    type="tel"
                                    placeholder="98765 43210"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="phone-number-input"
                                    maxLength={14}
                                    autoFocus
                                />
                            </div>

                            {/* Demo Tip */}
                            <div className="auth-demo-tip" onClick={fillDemoPhone}>
                                💡 Click to auto-fill sample phone: <strong>9876543210</strong>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-agri-primary full-width-btn auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP →'}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary full-width-btn"
                            onClick={handleQuickDemoLogin}
                        >
                            🚀 Continue with Demo Account
                        </button>

                        <p className="auth-footer-privacy">
                            🔒 By continuing, you agree to our Terms of Service & Privacy Policy. No spam guaranteed.
                        </p>
                    </div>
                )}

                {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
                {step === 'otp' && (
                    <div className="auth-body">
                        <div className="auth-heading-block">
                            <h4>Verify Mobile OTP 🔑</h4>
                            <p>
                                We sent a 6-digit code to <strong>{countryCode} {phoneNumber || '98765 43210'}</strong>
                            </p>
                            <button className="auth-change-number-btn" onClick={() => setStep('phone')}>
                                ← Change mobile number
                            </button>
                        </div>

                        {error && <div className="auth-error-banner">⚠️ {error}</div>}

                        <form onSubmit={handleVerifyOTP}>
                            <label className="auth-input-label">Enter 6-Digit Verification Code</label>
                            <div className="otp-digits-row">
                                {otpDigits.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="otp-digit-box"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {/* Demo OTP Helper Tip */}
                            <div className="auth-demo-tip" onClick={fillDemoOTP}>
                                💡 Demo OTP: <strong>123456</strong> (Click to auto-fill)
                            </div>

                            <button
                                type="submit"
                                className="btn btn-agri-primary full-width-btn auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Verifying OTP...' : 'Verify OTP & Enter Dashboard →'}
                            </button>
                        </form>

                        <div className="auth-resend-row">
                            {canResend ? (
                                <button className="auth-resend-btn" onClick={handleResendOTP}>
                                    Didn't get code? <strong>Resend OTP</strong>
                                </button>
                            ) : (
                                <span className="auth-timer-text">
                                    Resend code available in <strong>{resendTimer}s</strong>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS ANIMATION */}
                {step === 'success' && (
                    <div className="auth-body auth-success-body">
                        <div className="auth-success-circle">
                            ✓
                        </div>
                        <h3>Login Successful! 🎉</h3>
                        <p>Welcome back to AgriPulse AI. Redirecting to your dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
