import React from 'react';

export default function LandingPage({ onGetStarted, onSeeDemo, onOpenLogin, t }) {
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
                    <a href="#stories" className="nav-link-item">Success Stories</a>
                    <button className="nav-btn-login" onClick={onOpenLogin}>Login</button>
                    <button className="nav-btn-getstarted" onClick={onGetStarted}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero-section">
                {/* Left Text Column */}
                <div className="hero-text-col">
                    <div className="hero-badge-pill">
                        <span className="badge-pulse-dot" />
                        50,000+ FARMS ACROSS INDIA
                    </div>

                    <h1 className="hero-main-title">
                        Your farm.<br />
                        <span className="gradient-text">Smarter every</span><br />
                        single day.
                    </h1>

                    <p className="hero-subtitle">
                        Crops, AI disease diagnosis, weather risk, and live mandi prices — all in one place.
                        Built for Indian farmers who don't have time to explore complicated software.
                    </p>

                    <div className="hero-cta-group">
                        <button className="btn-hero-primary" onClick={onGetStarted}>
                            Get Started →
                        </button>
                        <button className="btn-hero-secondary" onClick={onSeeDemo}>
                            See a Demo 📱
                        </button>
                    </div>

                    {/* Trust Badges Row */}
                    <div className="hero-trust-row">
                        <div className="trust-item">
                            <strong>99.4%</strong>
                            <span>AI Accuracy</span>
                        </div>
                        <div className="trust-divider" />
                        <div className="trust-item">
                            <strong>150+</strong>
                            <span>Mandis Linked</span>
                        </div>
                        <div className="trust-divider" />
                        <div className="trust-item">
                            <strong>8+</strong>
                            <span>Languages</span>
                        </div>
                    </div>
                </div>

                {/* Right Visual Floating Cards Column */}
                <div className="hero-cards-col">
                    {/* 1. Live Weather Card */}
                    <div className="preview-card weather-preview-card">
                        <div className="preview-card-header">
                            <div>
                                <span className="location-name">Nashik, Maharashtra</span>
                                <h3 className="temp-display">28.0°C</h3>
                            </div>
                            <div className="weather-icon-sun">⛅</div>
                        </div>
                        <div className="weather-weekly-mini">
                            <div className="day-item"><span>Mon</span><strong>26°</strong></div>
                            <div className="day-item"><span>Tue</span><strong>27°</strong></div>
                            <div className="day-item active"><span>Wed</span><strong>28°</strong></div>
                            <div className="day-item"><span>Thu</span><strong>29°</strong></div>
                            <div className="day-item"><span>Fri</span><strong>30°</strong></div>
                        </div>
                    </div>

                    {/* 2. Farm Health Gauge Card */}
                    <div className="preview-card health-preview-card">
                        <div className="card-top-row">
                            <span className="preview-label">Farm Health Score</span>
                            <span className="badge-pill badge-green">↑ Good Condition</span>
                        </div>

                        <div className="health-score-gauge-row">
                            <div className="radial-score-ring">
                                <span className="score-num">78</span>
                                <span className="score-denom">/100</span>
                            </div>
                            <div className="health-breakdown-list">
                                <div className="breakdown-item">
                                    <span className="lbl">Soil Moisture</span>
                                    <div className="progress-bar"><div className="fill" style={{ width: '82%', background: '#22c55e' }} /></div>
                                    <strong className="val">82%</strong>
                                </div>
                                <div className="breakdown-item">
                                    <span className="lbl">Crop Canopy</span>
                                    <div className="progress-bar"><div className="fill" style={{ width: '74%', background: '#f59e0b' }} /></div>
                                    <strong className="val">74%</strong>
                                </div>
                                <div className="breakdown-item">
                                    <span className="lbl">Water Index</span>
                                    <div className="progress-bar"><div className="fill" style={{ width: '80%', background: '#3b82f6' }} /></div>
                                    <strong className="val">80%</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Live Mandi Prices Preview Card */}
                    <div className="preview-card mandi-preview-card">
                        <div className="mandi-header">
                            <span className="preview-label">Live Mandi Price Alert</span>
                            <span className="live-dot-tag">● LIVE</span>
                        </div>
                        <div className="mandi-item-row">
                            <div className="crop-info">
                                <span className="crop-icon">🌾</span>
                                <div>
                                    <strong>Paddy (Rice) - Grade A</strong>
                                    <span className="mandi-loc">Karnal Mandi / APMC</span>
                                </div>
                            </div>
                            <div className="price-info">
                                <strong>₹2,240 / qtl</strong>
                                <span className="trend-up">+2.7% ↑</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Highlight Grid Section */}
            <section className="landing-features-section" id="features">
                <div className="section-header text-center">
                    <span className="section-subtitle">SMART FARMING POWERED BY AI</span>
                    <h2 className="section-title">Everything you need to grow healthier crops</h2>
                </div>

                <div className="features-grid-3col">
                    <div className="feature-card">
                        <div className="feature-icon-box">🔬</div>
                        <h3>Instant AI Disease Scan</h3>
                        <p>Upload a leaf photo or use your smartphone camera for 99.4% instant pest & fungal diagnosis.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">📊</div>
                        <h3>Live Mandi Market Rates</h3>
                        <p>Real-time price tracking across 150+ APMC mandis with 7-day trend forecasts to maximize crop profits.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">🌧️</div>
                        <h3>Weather Risk & Outbreaks</h3>
                        <p>Hyperlocal rainfall forecasts & automated disease outbreak alerts based on humidity and temperature.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">🧮</div>
                        <h3>Agronomy Dosage Calculator</h3>
                        <p>Calculate exact NPK fertilizer, Urea, and spray tank ratios tailored to your exact field size.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">🤖</div>
                        <h3>Agri-Bot AI Voice Assistant</h3>
                        <p>Ask questions in 8+ Indian regional languages via voice or text for 24/7 expert farming advice.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">📜</div>
                        <h3>Government Advisory Bulletin</h3>
                        <p>Stay updated with official Krishi Vigyan Kendra advisories, subsidies, and modern farming techniques.</p>
                    </div>
                </div>

                {/* Final Call to Action Banner */}
                <div className="landing-bottom-cta-banner">
                    <h2>Ready to transform your farm?</h2>
                    <p>Join over 50,000+ farmers managing their crops with AgriPulse AI.</p>
                    <button className="btn-hero-primary cta-large" onClick={onGetStarted}>
                        Start Free Mobile Login →
                    </button>
                </div>
            </section>
        </div>
    );
}
