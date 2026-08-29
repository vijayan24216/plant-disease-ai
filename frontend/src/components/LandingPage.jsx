import React, { useState, useEffect } from 'react';

export default function LandingPage({ onGetStarted, onSeeDemo, onOpenLogin, t }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Track scroll position for 3D perspective effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY || 0);
        };
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            setMousePos({
                x: (clientX - centerX) / 40,
                y: (clientY - centerY) / 40
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Calculate 3D tilt transformation based on scroll & cursor movement
    const tiltStyle = {
        transform: `perspective(1000px) rotateX(${Math.min(Math.max(mousePos.y + scrollY * 0.02, -15), 15)}deg) rotateY(${Math.min(Math.max(-mousePos.x, -15), 15)}deg) translateZ(10px)`,
        transition: 'transform 0.15s ease-out'
    };

    const handleQuickLogin = (e) => {
        e.preventDefault();
        onGetStarted();
    };

    return (
        <div className="landing-page-wrapper animate-fade-in">
            {/* Top Navigation Bar */}
            <nav className="landing-nav-bar">
                <div className="landing-nav-brand">
                    <div className="landing-logo-badge">🌱</div>
                    <span className="landing-brand-name">AgriPulse <span className="ai-badge">AI</span></span>
                </div>

                <div className="landing-nav-links">
                    <a href="#features" className="nav-link-item">Features</a>
                    <a href="#3d-showcase" className="nav-link-item">3D Smart Farming</a>
                    <button className="nav-btn-login" onClick={onOpenLogin}>🔑 Login</button>
                    <button className="nav-btn-getstarted" onClick={onGetStarted}>🚀 Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero-section">
                {/* Left Text & Quick Login Column */}
                <div className="hero-text-col">
                    <div className="hero-badge-pill">
                        <span className="badge-pulse-dot" />
                        50,000+ INDIAN FARMERS TRUST AGRIPULSE AI
                    </div>

                    <h1 className="hero-main-title">
                        Smarter Farming.<br />
                        <span className="gradient-text">Higher Yields.</span><br />
                        Zero Hassle.
                    </h1>

                    <p className="hero-subtitle">
                        AI crop disease scanner, weather risk alerts, and live mandi market prices. Built with a simple interface designed for every farmer.
                    </p>

                    {/* Integrated Simplified Mobile Login Box */}
                    <div className="hero-quick-login-card">
                        <span className="login-card-title">📱 Quick Mobile Login</span>
                        <form onSubmit={handleQuickLogin} className="quick-login-form">
                            <div className="quick-input-group">
                                <span className="flag-prefix">🇮🇳 +91</span>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit mobile number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    maxLength="10"
                                />
                            </div>
                            <button type="submit" className="btn-quick-otp">
                                Send OTP ➔
                            </button>
                        </form>
                        <div className="quick-login-footer">
                            <button className="btn-demo-link" onClick={onSeeDemo}>
                                ⚡ Or Explore Instant Demo Dashboard →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Visual 3D Tilt Card Column */}
                <div className="hero-cards-col-3d" style={tiltStyle}>
                    {/* Main Featured 3D Agricultural Showcase Card */}
                    <div className="agri-3d-card hero-image-card">
                        <div className="agri-card-img-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                                alt="Lush Green Agricultural Farm"
                                className="agri-bg-img"
                            />
                            <div className="img-overlay-gradient" />
                            <div className="floating-scan-badge">
                                <span className="scan-beam" />
                                <span>🎯 AI Leaf Scan Active</span>
                            </div>
                        </div>

                        {/* Floating Live Data Pill */}
                        <div className="floating-pill-3d weather-pill">
                            <span className="pill-icon">⛅</span>
                            <div>
                                <strong>28°C Optimal</strong>
                                <span>Nashik, APMC</span>
                            </div>
                        </div>

                        <div className="floating-pill-3d health-pill">
                            <span className="pill-icon">💚</span>
                            <div>
                                <strong>94% Crop Health</strong>
                                <span>Paddy Field 1.5 Acre</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3D Scroll Interactive Showcase Section */}
            <section className="landing-3d-section" id="3d-showcase">
                <div className="section-header text-center">
                    <span className="section-subtitle">3D INTERACTIVE SMART FARMING</span>
                    <h2 className="section-title">Experience AI Agricultural Intelligence</h2>
                    <p className="section-desc">Scroll down to explore 3D field telemetry, disease diagnosis, and live market pricing.</p>
                </div>

                <div className="cards-grid-3d">
                    {/* Card 1: 3D Disease Scanner */}
                    <div className="card-3d-item" style={{
                        transform: `perspective(1000px) rotateY(${Math.min(scrollY * 0.015, 12)}deg)`,
                        transition: 'transform 0.2s ease-out'
                    }}>
                        <div className="card-3d-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80"
                                alt="AI Crop Leaf Health Diagnostic Scan"
                            />
                            <span className="badge-3d-overlay">🌿 AI Diagnosis</span>
                        </div>
                        <div className="card-3d-content">
                            <h3>Instant AI Disease Scanner</h3>
                            <p>Snap a leaf photo to diagnose pests, blight, and fungal infections in under 2 seconds with 99.4% precision.</p>
                        </div>
                    </div>

                    {/* Card 2: 3D Weather Risk */}
                    <div className="card-3d-item" style={{
                        transform: `perspective(1000px) rotateY(${Math.max(-scrollY * 0.015, -12)}deg)`,
                        transition: 'transform 0.2s ease-out'
                    }}>
                        <div className="card-3d-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
                                alt="Smart Agriculture Field Weather Radar"
                            />
                            <span className="badge-3d-overlay">🌦️ Weather Radar</span>
                        </div>
                        <div className="card-3d-content">
                            <h3>Hyperlocal Weather & Risk</h3>
                            <p>Receive rain forecasts and humidity outbreak alerts before fungal spores spread across your field.</p>
                        </div>
                    </div>

                    {/* Card 3: 3D Mandi Intelligence */}
                    <div className="card-3d-item" style={{
                        transform: `perspective(1000px) rotateY(${Math.min(scrollY * 0.015, 12)}deg)`,
                        transition: 'transform 0.2s ease-out'
                    }}>
                        <div className="card-3d-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80"
                                alt="Mandi Market Grain Harvest"
                            />
                            <span className="badge-3d-overlay">📊 Live Mandi</span>
                        </div>
                        <div className="card-3d-content">
                            <h3>Live Mandi Rate Trends</h3>
                            <p>Track real-time market prices across 150+ APMC mandis to sell your harvest at peak market value.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Highlight Section with Rich Agricultural Imagery */}
            <section className="landing-features-section" id="features">
                <div className="section-header text-center">
                    <span className="section-subtitle">SIMPLE & POWERFUL</span>
                    <h2 className="section-title">Designed for Indian Agriculture</h2>
                </div>

                <div className="features-grid-3col">
                    <div className="feature-card feature-card-with-img">
                        <div className="feature-img-box">
                            <img
                                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80"
                                alt="Instant AI Disease Leaf Scanning"
                            />
                            <div className="feature-img-badge">🔬 Instant AI Scanner</div>
                        </div>
                        <div className="feature-card-body">
                            <h3>Instant AI Disease Scan</h3>
                            <p>Upload a leaf photo or snap with camera for 99.4% instant diagnosis & pesticide prescription.</p>
                        </div>
                    </div>

                    <div className="feature-card feature-card-with-img">
                        <div className="feature-img-box">
                            <img
                                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80"
                                alt="Indian APMC Mandi Grain Market"
                            />
                            <div className="feature-img-badge">📊 Mandi Rates</div>
                        </div>
                        <div className="feature-card-body">
                            <h3>Live Mandi Market Rates</h3>
                            <p>Real-time price updates across 150+ mandis with 7-day trend forecasts to maximize profits.</p>
                        </div>
                    </div>

                    <div className="feature-card feature-card-with-img">
                        <div className="feature-img-box">
                            <img
                                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80"
                                alt="Agronomy NPK Fertilizer Spray"
                            />
                            <div className="feature-img-badge">🧮 Dosage Calculator</div>
                        </div>
                        <div className="feature-card-body">
                            <h3>Agronomy Dosage Calculator</h3>
                            <p>Calculate exact NPK fertilizer, Urea, and spray tank ratios tailored to your acre field size.</p>
                        </div>
                    </div>
                </div>

                {/* Final Call to Action Banner */}
                <div className="landing-bottom-cta-banner">
                    <h2>Ready to transform your farm?</h2>
                    <p>Join over 50,000+ farmers managing their crops with AgriPulse AI.</p>
                    <button className="btn-hero-primary cta-large" onClick={onGetStarted}>
                        Start Mobile Login →
                    </button>
                </div>
            </section>
        </div>
    );
}

