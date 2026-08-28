import React, { useState, useEffect } from 'react';

export default function WeatherRiskTab({ t, apiBaseUrl, selectedCrop }) {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    const activeCropName = typeof selectedCrop === 'string' ? selectedCrop : selectedCrop?.name || 'Paddy (Rice)';

    useEffect(() => {
        fetchWeatherRisk();
    }, []);

    const fetchWeatherRisk = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${apiBaseUrl}/weather-risk`);
            if (res.ok) {
                const json = await res.json();
                setWeatherData(json);
            }
        } catch (err) {
            console.error('Weather risk fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="weather-tab-container">
            {/* 1. Header Card */}
            <div className="glass-card weather-hero-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="card-header-title" style={{ margin: 0 }}>
                            <span>🌤️</span> Weather Intelligence
                        </h2>
                        <p className="card-sub-text" style={{ marginTop: 2 }}>
                            Micro-climate forecast & automated disease risk advisories
                        </p>
                    </div>
                    <span className="location-pin-pill">
                        📍 Central Farm Sector
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="glass-card empty-state">
                    <div className="spinner" style={{ margin: '0 auto 12px auto', width: 36, height: 36 }} />
                    <p>Analyzing satellite micro-climate models...</p>
                </div>
            ) : weatherData ? (
                <div className="weather-content-wrapper">
                    {/* 2. CURRENT CONDITIONS CARD */}
                    <div className="glass-card current-conditions-card">
                        <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="current-cond-title">Current Field Weather</span>
                            <span className="badge-pill badge-red">
                                OVERALL RISK: HIGH ({weatherData.risk_score}/100)
                            </span>
                        </div>

                        <div className="temp-hero-row" style={{ marginTop: 12 }}>
                            <div className="temp-large-display">
                                {weatherData.temperature}°C
                            </div>
                            <div className="location-subtitle-text">
                                📍 {weatherData.location}
                            </div>
                        </div>

                        {/* 3 Icon Stat Blocks in a Row */}
                        <div className="weather-stats-three-row" style={{ marginTop: 14 }}>
                            <div className="weather-stat-block">
                                <span className="stat-block-icon">💧</span>
                                <span className="stat-block-val">{weatherData.humidity}%</span>
                                <span className="stat-block-lbl">Humidity</span>
                            </div>

                            <div className="weather-stat-block">
                                <span className="stat-block-icon">🌧️</span>
                                <span className="stat-block-val">{weatherData.precipitation_chance}%</span>
                                <span className="stat-block-lbl">Rain Chance</span>
                            </div>

                            <div className="weather-stat-block">
                                <span className="stat-block-icon">💨</span>
                                <span className="stat-block-val">{weatherData.wind_speed}</span>
                                <span className="stat-block-lbl">Wind Speed</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. MICRO-CLIMATE DISEASE RISK CARD */}
                    <div className="glass-card disease-risks-card" style={{ marginTop: 12 }}>
                        <div className="card-header-title">
                            <span>⚠️</span> Disease Outbreak Risk Analysis ({activeCropName})
                        </div>
                        <p className="card-sub-text">
                            Automated pathogen threat levels based on leaf wetness and humidity triggers:
                        </p>

                        <div className="disease-risk-mini-cards" style={{ marginTop: 12 }}>
                            {/* Row 1: Fungal Diseases */}
                            <div className="risk-mini-card critical-risk">
                                <div className="risk-card-head">
                                    <span className="risk-cat-title">🍄 Fungal Diseases (Blight, Mildew)</span>
                                    <span className="badge-pill badge-red">Critical (88%)</span>
                                </div>
                                <div className="risk-why-line">
                                    <strong>Why:</strong> High humidity ({weatherData.humidity}%) + warm temperatures (25-30°C).
                                </div>
                                <div className="risk-action-line">
                                    <span>🧪 <strong>Action:</strong> Spray bio-fungicide or copper octanoate before rain onset.</span>
                                </div>
                            </div>

                            {/* Row 2: Bacterial Spot & Rot */}
                            <div className="risk-mini-card moderate-risk">
                                <div className="risk-card-head">
                                    <span className="risk-cat-title">🦠 Bacterial Spot & Rot</span>
                                    <span className="badge-pill badge-amber">Moderate (62%)</span>
                                </div>
                                <div className="risk-why-line">
                                    <strong>Why:</strong> Rain splashing & leaf wetness lasting &gt; 6 hours.
                                </div>
                                <div className="risk-action-line">
                                    <span>🚿 <strong>Action:</strong> Avoid overhead sprinkler irrigation; prune low touching leaves.</span>
                                </div>
                            </div>

                            {/* Row 3: Insect Vector Transmission */}
                            <div className="risk-mini-card low-risk">
                                <div className="risk-card-head">
                                    <span className="risk-cat-title">🦟 Insect Vectors (Aphids / Whitefly)</span>
                                    <span className="badge-pill badge-amber">Low to Moderate (45%)</span>
                                </div>
                                <div className="risk-why-line">
                                    <strong>Why:</strong> Moderate wind currents carrying aphid vectors.
                                </div>
                                <div className="risk-action-line">
                                    <span>🪤 <strong>Action:</strong> Deploy yellow sticky traps along field perimeter.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. 3-DAY FORECAST: 3 Equal-Width Side-by-Side Cards */}
                    <div className="glass-card forecast-section-card" style={{ marginTop: 12 }}>
                        <div className="card-header-title">
                            <span>📅</span> 3-Day Micro-Climate Forecast
                        </div>

                        <div className="forecast-three-cards-row" style={{ marginTop: 12 }}>
                            {weatherData.forecast_3day?.map((day, idx) => {
                                const riskLower = day.risk.toLowerCase();
                                const badgeClass = riskLower === 'critical' || riskLower === 'high' ? 'badge-red' : riskLower === 'moderate' ? 'badge-amber' : 'badge-green';
                                const weatherIcon = day.condition.includes('Rain') ? '🌧️' : day.condition.includes('Cloud') ? '⛅' : '☀️';

                                return (
                                    <div key={idx} className="forecast-side-card">
                                        <span className="forecast-card-day">{day.day}</span>
                                        <span className="forecast-card-icon">{weatherIcon}</span>
                                        <span className="forecast-card-temp">{day.temp}</span>
                                        <span className="forecast-card-cond">{day.condition}</span>
                                        <span className={`badge-pill ${badgeClass} forecast-card-badge`}>
                                            {day.risk}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
