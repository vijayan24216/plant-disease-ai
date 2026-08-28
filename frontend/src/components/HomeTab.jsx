import React, { useState } from 'react';

export default function HomeTab({
    setActiveTab,
    selectedCrop,
    setSelectedCrop,
    startCamera,
    triggerGalleryPicker,
    t
}) {
    const [showScanOptions, setShowScanOptions] = useState(false);
    const activeCropName = typeof selectedCrop === 'string' ? selectedCrop : selectedCrop?.name || 'Paddy (Rice)';

    return (
        <div className="home-dashboard-container">
            {/* 1. PRIMARY CTA CARD: Large filled green button positioned FIRST directly below header */}
            <div className="glass-card prominent-scan-block">
                <button
                    className="btn-prominent-scan"
                    onClick={() => setShowScanOptions(!showScanOptions)}
                >
                    <span className="scan-icon-large">📷</span>
                    <div className="scan-text-wrapper">
                        <span className="scan-main-title">Take a pic or upload pic</span>
                        <span className="scan-sub-title">Scan your crop leaf to check for disease</span>
                    </div>
                    <span className="scan-arrow">{showScanOptions ? '▲' : '▼'}</span>
                </button>

                {showScanOptions && (
                    <div className="scan-options-drawer animate-fade-in">
                        <button
                            className="btn btn-scan-option camera-option"
                            onClick={() => {
                                setShowScanOptions(false);
                                startCamera();
                            }}
                        >
                            <span className="option-icon">📸</span>
                            <div>
                                <span className="option-title">Open Camera</span>
                                <span className="option-desc">Take instant leaf photo in field</span>
                            </div>
                        </button>

                        <button
                            className="btn btn-scan-option gallery-option"
                            onClick={() => {
                                setShowScanOptions(false);
                                triggerGalleryPicker();
                            }}
                        >
                            <span className="option-icon">🖼️</span>
                            <div>
                                <span className="option-title">Upload from Gallery</span>
                                <span className="option-desc">Select leaf photo from device storage</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Quick Stats Row: 3 side-by-side stat cards */}
            <div className="quick-stats-row">
                <div className="stat-card" onClick={() => setActiveTab('cropcare')}>
                    <span className="stat-icon">🌾</span>
                    <div className="stat-meta">
                        <span className="stat-label">Active Crop</span>
                        <span className="stat-value">{activeCropName.split(' ')[0]}</span>
                    </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('weather')}>
                    <span className="stat-icon">⚠️</span>
                    <div className="stat-meta">
                        <span className="stat-label">Disease Risk</span>
                        <span className="badge-pill badge-red">High</span>
                    </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('weather')}>
                    <span className="stat-icon">🌧️</span>
                    <div className="stat-meta">
                        <span className="stat-label">Rain Chance</span>
                        <span className="badge-pill badge-amber">68%</span>
                    </div>
                </div>
            </div>

            {/* 3. Crop Plan Card */}
            <div className="glass-card home-card">
                <div className="card-header-title">
                    <span>📋</span> Crop Plan — {activeCropName}
                </div>
                <p className="card-sub-text">
                    Daily NPK nutrition schedule and irrigation alerts configured for your active <strong>{activeCropName}</strong> field.
                </p>

                {/* Structured Agronomy Action Grid */}
                <div className="crop-plan-info-grid" style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>🌱 Growth Stage & Progress</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: 3 }}>Fruit & Canopy Development</div>
                        <div style={{ background: '#cbd5e1', borderRadius: 4, height: 6, width: '100%', marginTop: 8, overflow: 'hidden' }}>
                            <div style={{ background: '#00796b', height: '100%', width: '48%', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block', fontWeight: 600 }}>Day 48 of 120 Days Cycle</span>
                    </div>

                    <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 10, border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>🧪 Today's NPK Nutrition</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#14532d', marginTop: 3 }}>Potash (MOP) + Zinc Sulphate</div>
                        <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: 4 }}>Dose: 15kg/acre Urea + 5kg Zinc (Foliar spray)</div>
                    </div>

                    <div style={{ background: '#fefce8', padding: 12, borderRadius: 10, border: '1px solid #fef08a' }}>
                        <div style={{ fontSize: '0.72rem', color: '#854d0e', fontWeight: 800, textTransform: 'uppercase' }}>💧 Irrigation & Soil Moisture</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#713f12', marginTop: 3 }}>Moisture: 68% (Optimal Zone)</div>
                        <div style={{ fontSize: '0.76rem', color: '#a16207', marginTop: 4 }}>Next Watering: Scheduled in 2 Days</div>
                    </div>
                </div>

                <div className="card-footer-row" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('cropcare')}>
                        🔄 Change Crop
                    </button>
                    <button className="link-btn" onClick={() => setActiveTab('calculator')}>
                        Plan Yield & Dosage ➔
                    </button>
                </div>
            </div>

            {/* 4. Market Rates Preview Card (Active Crop Only) */}
            <div className="glass-card home-card">
                <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-header-title" style={{ margin: 0 }}>
                        <span>📊</span> Market Rates ({activeCropName})
                    </div>
                    <span className="live-pill">LIVE FEED</span>
                </div>

                <div className="market-rates-preview-list" style={{ marginTop: 12 }}>
                    <div className="preview-rate-item">
                        <div>
                            <div className="rate-item-title">Paddy - Common (MSP)</div>
                            <div className="rate-item-mandi">Karnal Mandi / Tiruvarur APMC</div>
                        </div>
                        <div className="rate-item-price-block">
                            <strong>₹ 21.83 / kg</strong>
                            <span className="badge-pill badge-green">+1.5%</span>
                        </div>
                    </div>

                    <div className="preview-rate-item">
                        <div>
                            <div className="rate-item-title">Paddy - Grade A</div>
                            <div className="rate-item-mandi">Guntur APMC</div>
                        </div>
                        <div className="rate-item-price-block">
                            <strong>₹ 22.03 / kg</strong>
                            <span className="badge-pill badge-green">+2.1%</span>
                        </div>
                    </div>

                    <div className="preview-rate-item">
                        <div>
                            <div className="rate-item-title">Paddy - Basmati 1121</div>
                            <div className="rate-item-mandi">Amritsar Mandi</div>
                        </div>
                        <div className="rate-item-price-block">
                            <strong>₹ 43.50 / kg</strong>
                            <span className="badge-pill badge-green">+4.8%</span>
                        </div>
                    </div>
                </div>

                <button className="btn btn-secondary full-width-btn" style={{ marginTop: 12 }} onClick={() => setActiveTab('market')}>
                    View All Market Rates ➔
                </button>
            </div>

            {/* 5. Agri Bulletin Card (1 Headline Only) */}
            <div className="glass-card home-card">
                <div className="card-header-title">
                    <span>📰</span> Agri Bulletin
                </div>
                <div className="bulletin-single-headline">
                    <span className="bulletin-tag-mini">CROP ADVISORY</span>
                    <h4 className="headline-title">
                        Higher Maize & Grain Prices Impacting Winter Poultry Feed Rates
                    </h4>
                </div>
                <button className="link-btn" style={{ marginTop: 10, display: 'inline-block' }} onClick={() => setActiveTab('bulletin')}>
                    View All News ➔
                </button>
            </div>

            {/* 6. Weather Summary Card */}
            <div className="glass-card home-card">
                <div className="card-header-title">
                    <span>🌤️</span> Weather & Risk Warning
                </div>

                <div className="weather-mini-stats-row">
                    <div className="weather-mini-item">
                        <span className="weather-mini-icon">🌡️</span>
                        <span className="weather-mini-val">27.5°C</span>
                        <span className="weather-mini-lbl">Temp</span>
                    </div>

                    <div className="weather-mini-item">
                        <span className="weather-mini-icon">💧</span>
                        <span className="weather-mini-val">84%</span>
                        <span className="weather-mini-lbl">Humidity</span>
                    </div>

                    <div className="weather-mini-item">
                        <span className="weather-mini-icon">🌧️</span>
                        <span className="weather-mini-val">68%</span>
                        <span className="weather-mini-lbl">Rain</span>
                    </div>
                </div>

                <div className="weather-warning-alert-row" style={{ marginTop: 10 }}>
                    <span className="alert-icon">⚡</span>
                    <span className="alert-text">High humidity elevates spore germination for early & late blights today.</span>
                </div>

                <button className="btn btn-secondary full-width-btn" style={{ marginTop: 12 }} onClick={() => setActiveTab('weather')}>
                    View Full Weather Forecast ➔
                </button>
            </div>

            {/* 7. Ask Agri-Bot AI Card */}
            <div className="glass-card home-card agribot-cta-card">
                <div className="card-header-title">
                    <span>👨‍🌾</span> Farm Voice & AI Assistant
                </div>
                <p className="card-sub-text">
                    Have questions about pest treatments or crop nutrition? Ask our Agronomy AI assistant.
                </p>
                <button className="btn btn-agri-primary full-width-btn" style={{ marginTop: 12 }} onClick={() => setActiveTab('agribot')}>
                    🤖 Ask Agri-Bot AI ➔
                </button>
            </div>
        </div>
    );
}
