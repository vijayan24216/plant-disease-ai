import React, { useState, useEffect } from 'react';

export default function MarketAnalyticsTab({
    t,
    apiBaseUrl,
    selectedCrop,
    setSelectedCrop
}) {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllCrops, setShowAllCrops] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Row expansion state for 30-day price trend
    const [expandedRowId, setExpandedRowId] = useState(null);

    // Price alert state
    const [alertPrice, setAlertPrice] = useState('23.50');
    const [alertSet, setAlertSet] = useState(false);

    const activeCropName = typeof selectedCrop === 'string' ? selectedCrop : selectedCrop?.name || 'Paddy (Rice)';

    useEffect(() => {
        fetchMarketData();
    }, []);

    const fetchMarketData = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const res = await fetch(`${apiBaseUrl}/market`);
            if (res.ok) {
                const json = await res.json();
                setMarketData(json.data || []);
            } else {
                setErrorMsg('Failed to load market rates.');
            }
        } catch (err) {
            setErrorMsg('Network error connecting to mandi pricing engine.');
        } finally {
            setLoading(false);
        }
    };

    const selectedCropMatches = marketData.filter((item) => {
        const cropKey = activeCropName.toLowerCase().split(' ')[0];
        return item.crop.toLowerCase().includes(cropKey);
    });

    const otherCrops = marketData.filter((item) => {
        const cropKey = activeCropName.toLowerCase().split(' ')[0];
        return !item.crop.toLowerCase().includes(cropKey);
    });

    // Calculate highest price among selected crop matches for "Best Price Nearby" highlight
    const maxPrice = selectedCropMatches.length > 0
        ? Math.max(...selectedCropMatches.map(i => i.current_price))
        : 0;

    const toggleRowExpansion = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    // Regional Mandi Price State
    const [selectedPlace, setSelectedPlace] = useState('Karnal (Haryana)');
    const [selectedRegionalCrop, setSelectedRegionalCrop] = useState(activeCropName);
    const [regionalData, setRegionalData] = useState(null);
    const [loadingRegional, setLoadingRegional] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const REGIONAL_PLACES = [
        'Karnal (Haryana)',
        'Azadpur APMC (Delhi)',
        'Lasalgaon / Nashik (Maharashtra)',
        'Amritsar (Punjab)',
        'Guntur (Andhra Pradesh)',
        'Mandya (Karnataka)',
        'Rajkot (Gujarat)',
        'Indore (Madhya Pradesh)',
        'Kolkata (West Bengal)',
        'Tiruvarur (Tamil Nadu)',
        'Patna (Bihar)',
        'Lucknow (Uttar Pradesh)'
    ];

    const COMMODITY_CROPS = [
        'Paddy (Rice)',
        'Wheat',
        'Tomato',
        'Potato',
        'Onion',
        'Maize (Corn)',
        'Cotton',
        'Chilli (Red)',
        'Soybean',
        'Mustard',
        'Apple (Shimla)'
    ];

    useEffect(() => {
        fetchMarketData();
    }, []);

    const fetchRegionalPrice = async (place, crop) => {
        try {
            setLoadingRegional(true);
            const res = await fetch(`${apiBaseUrl}/market/region?place=${encodeURIComponent(place)}&crop=${encodeURIComponent(crop)}`);
            if (res.ok) {
                const json = await res.json();
                setRegionalData(json);
                setHasSearched(true);
            }
        } catch (err) {
            console.error('Error fetching regional price:', err);
        } finally {
            setLoadingRegional(false);
        }
    };

    const handleRegionalSearch = (e) => {
        if (e) e.preventDefault();
        fetchRegionalPrice(selectedPlace, selectedRegionalCrop);
    };

    const handleQuickSelect = (place, crop) => {
        setSelectedPlace(place);
        setSelectedRegionalCrop(crop);
        fetchRegionalPrice(place, crop);
    };

    return (
        <div className="market-tab-container">
            {/* 1. Header Card */}
            <div className="glass-card market-hero-card">
                <div>
                    <h2 className="card-header-title" style={{ margin: 0 }}>
                        <span>📊</span> Mandi Market & Price Analytics
                    </h2>
                    <p className="card-sub-text" style={{ marginTop: 2 }}>
                        Select your crop & market region to view official APMC prices, 24h trends & buyers
                    </p>
                </div>
                <div className="live-ticker-status" style={{ marginTop: 6 }}>
                    <span className="pulse-dot" /> LIVE APMC FEED: 28 AUG 2026
                </div>
            </div>

            {/* 2. INITIAL CROP & PLACE INTAKE CARD (Shown at first before price lookup) */}
            {!hasSearched ? (
                <div className="glass-card mandi-intake-card animate-fade-in" style={{
                    background: '#ffffff',
                    border: '2px solid #00796b',
                    padding: 24,
                    borderRadius: 20,
                    marginTop: 14,
                    boxShadow: '0 8px 24px rgba(0, 77, 64, 0.08)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 6 }}>🌾🏛️</span>
                        <h3 style={{ margin: 0, color: '#004d40', fontSize: '1.25rem', fontWeight: 900 }}>
                            Select Crop & Place to Check Mandi Prices
                        </h3>
                        <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                            Choose your crop and market location below to get live APMC rates, price trends, and verified regional buyers.
                        </p>
                    </div>

                    <form onSubmit={handleRegionalSearch} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 540, margin: '0 auto' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#004d40', marginBottom: 6 }}>
                                🌾 Step 1: Select Crop / Commodity:
                            </label>
                            <select
                                value={selectedRegionalCrop}
                                onChange={(e) => setSelectedRegionalCrop(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: 12,
                                    border: '2px solid #cbd5e1',
                                    fontSize: '0.92rem',
                                    background: '#f8fafc',
                                    fontWeight: 700,
                                    color: '#0f172a'
                                }}
                            >
                                {COMMODITY_CROPS.map((c, idx) => (
                                    <option key={idx} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#004d40', marginBottom: 6 }}>
                                🏛️ Step 2: Select State / Mandi Region:
                            </label>
                            <select
                                value={selectedPlace}
                                onChange={(e) => setSelectedPlace(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: 12,
                                    border: '2px solid #cbd5e1',
                                    fontSize: '0.92rem',
                                    background: '#f8fafc',
                                    fontWeight: 700,
                                    color: '#0f172a'
                                }}
                            >
                                {REGIONAL_PLACES.map((p, idx) => (
                                    <option key={idx} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-agri-primary"
                            style={{
                                height: 48,
                                borderRadius: 12,
                                fontSize: '1rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #004d40 0%, #00796b 100%)',
                                color: '#ffffff',
                                border: 'none',
                                marginTop: 8,
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(0,77,64,0.25)'
                            }}
                            disabled={loadingRegional}
                        >
                            {loadingRegional ? '⏳ Fetching Mandi Data...' : '🔍 Check Live Mandi Prices ➔'}
                        </button>
                    </form>

                    {/* Quick Selection Chips */}
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed #e2e8f0', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            ⚡ Or Select Popular Regional Mandis:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleQuickSelect('Karnal (Haryana)', 'Paddy (Rice)')}>
                                🌾 Paddy in Karnal
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleQuickSelect('Guntur (Andhra Pradesh)', 'Chilli (Red)')}>
                                🌶️ Chilli in Guntur
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleQuickSelect('Lasalgaon / Nashik (Maharashtra)', 'Onion')}>
                                🧅 Onion in Nashik
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleQuickSelect('Azadpur APMC (Delhi)', 'Tomato')}>
                                🍅 Tomato in Delhi
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* 3. SEARCH RESULTS VIEW (Shown AFTER user selects Crop & Place) */
                <div className="market-results-wrapper animate-fade-in">
                    {/* Top Selection & Re-search Header Bar */}
                    <div className="glass-card active-region-bar" style={{
                        background: '#ffffff',
                        border: '1px solid #00796b',
                        padding: '12px 18px',
                        borderRadius: 14,
                        marginTop: 12,
                        display: 'flex',
                        justify- content: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.4rem' }}>📍</span>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Active Mandi Search:</span>
                            <h3 style={{ margin: 0, color: '#004d40', fontSize: '1.05rem', fontWeight: 900 }}>
                                {selectedRegionalCrop} <span style={{ color: '#00796b' }}>in {selectedPlace}</span>
                            </h3>
                        </div>
                    </div>

                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setHasSearched(false)}
                        style={{ fontWeight: 800, color: '#004d40', border: '1px solid #cbd5e1' }}
                    >
                        🔄 Change Crop / Place
                    </button>
                </div>

                    {/* Regional Price Display Box */}
            {regionalData && (
                <div className="regional-price-result-box animate-fade-in" style={{ marginTop: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 18, borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 800 }}>
                                📍 APMC MANDI LOCATION: {regionalData.place}
                            </span>
                            <h2 style={{ margin: '4px 0 0 0', color: '#004d40', fontSize: '1.5rem', fontWeight: 900 }}>
                                {regionalData.crop}
                            </h2>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#004d40', lineHeight: 1 }}>
                                ₹ {regionalData.price_per_q.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#475569' }}>/ Quintal</span>
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '3px 10px', borderRadius: 12, marginTop: 4, display: 'inline-block' }}>
                                ₹ {regionalData.current_price.toFixed(2)} / kg ({regionalData.change_24h} 24h)
                            </span>
                        </div>
                    </div>

                    {/* Price Range & Arrivals Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14, background: '#ffffff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Min Bidding Rate</span>
                            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1e293b', marginTop: 2 }}>₹ {regionalData.min_price_q.toLocaleString()} / Q</strong>
                        </div>
                        <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Max Bidding Rate</span>
                            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#15803d', marginTop: 2 }}>₹ {regionalData.max_price_q.toLocaleString()} / Q</strong>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Today's Arrival Volume</span>
                            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0284c7', marginTop: 2 }}>📦 {regionalData.arrival_volume}</strong>
                        </div>
                    </div>

                    {/* Regional Advisory Note */}
                    <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#1e293b', background: '#ffffff', padding: 12, borderRadius: 10, borderLeft: '4px solid #00796b' }}>
                        💡 <strong>Regional Advisory:</strong> {regionalData.advisory}
                    </div>

                    {/* Verified Regional Buyers & Mandis */}
                    {regionalData.buyers && regionalData.buyers.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#004d40', fontWeight: 800 }}>
                                🏬 Verified APMC Buyers & Millers in {regionalData.place.split('(')[0]}:
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {regionalData.buyers.map((buyer, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                                        <div>
                                            <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>{buyer.name}</strong>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                                                {buyer.type} • {buyer.distance} away
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#15803d', display: 'block' }}>
                                                Offer: {buyer.rate_offer}
                                            </span>
                                            <a href={`tel:${buyer.phone}`} style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                                                📞 Call {buyer.phone}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div className="glass-card empty-state">
                    <div className="spinner" style={{ margin: '0 auto 12px auto', width: 36, height: 36 }} />
                    <p>Loading live Mandi pricing tables...</p>
                </div>
            )}

            {errorMsg && (
                <div className="warning-banner error-banner" style={{ margin: '12px 0' }}>
                    ⚠️ {errorMsg}
                </div>
            )}

            {!loading && (
                <div className="market-sections-wrapper">
                    {/* 3. Rates Table */}
                    <div className="glass-card market-section-card">
                        <h3 className="section-subtitle-dark" style={{ margin: '0 0 10px 0' }}>
                            🌱 Market Rates for {activeCropName}
                        </h3>

                        {selectedCropMatches.length > 0 ? (
                            <div className="table-responsive">
                                <table className="market-table">
                                    <thead>
                                        <tr>
                                            <th>Crop & Variety</th>
                                            <th>Primary Mandi</th>
                                            <th>Price</th>
                                            <th>24h Change</th>
                                            <th>7-Day Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCropMatches.map((item) => {
                                            const isBestPrice = item.current_price === maxPrice;
                                            const isExpanded = expandedRowId === item.id;

                                            return (
                                                <React.Fragment key={item.id}>
                                                    <tr
                                                        className={`market-table-row ${isBestPrice ? 'best-price-row' : ''}`}
                                                        onClick={() => toggleRowExpansion(item.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>
                                                            <div className="crop-name-cell">
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                    <strong>{item.crop}</strong>
                                                                    {isBestPrice && (
                                                                        <span className="best-price-badge" title="Highest price among local mandis">
                                                                            ⭐ Best Price
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="crop-cat-tag">{item.category}</span>
                                                            </div>
                                                        </td>
                                                        <td className="mandi-region-cell">
                                                            {item.mandi_prices?.[0]?.region || 'Regional APMC'}
                                                        </td>
                                                        <td className="price-cell">
                                                            <strong>₹ {item.current_price.toFixed(2)}</strong>
                                                            <span className="unit-sub"> / {item.unit}</span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge-pill ${item.trend === 'up' ? 'badge-green' : 'badge-red'}`}>
                                                                {item.change_24h}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="sparkline-icon">{item.trend === 'up' ? '📈 Up' : '📉 Down'}</span>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded 30-Day Trend Chart Row */}
                                                    {isExpanded && (
                                                        <tr className="expanded-trend-row">
                                                            <td colSpan="5">
                                                                <div className="expanded-trend-box animate-fade-in">
                                                                    <div className="trend-box-header">
                                                                        <span>📊 30-Day Price History — {item.crop}</span>
                                                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>High: ₹{item.high_price} | Low: ₹{item.low_price}</span>
                                                                    </div>
                                                                    <div className="simulated-trend-bars">
                                                                        <div className="bar-item" style={{ height: '40%' }}><span>₹20</span></div>
                                                                        <div className="bar-item" style={{ height: '55%' }}><span>₹21</span></div>
                                                                        <div className="bar-item" style={{ height: '70%' }}><span>₹21.5</span></div>
                                                                        <div className="bar-item highlight-bar" style={{ height: '90%' }}><span>₹{item.current_price}</span></div>
                                                                    </div>
                                                                    <p className="mandi-advisory-text">💡 <strong>Mandi Advisory:</strong> {item.advisory || 'Steady procurement demand across regional APMC hubs.'}</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-market-state">
                                <span>🍃</span>
                                <p>No specific market rates recorded for <strong>{activeCropName}</strong> today.</p>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    style={{ marginTop: 8 }}
                                    onClick={() => setShowAllCrops(true)}
                                >
                                    View All Mandi Crops ➔
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Expanded Other Crops Table if toggled */}
                    {showAllCrops && otherCrops.length > 0 && (
                        <div className="glass-card market-section-card animate-fade-in" style={{ marginTop: 12 }}>
                            <h3 className="section-subtitle-dark" style={{ margin: '0 0 10px 0' }}>
                                🌐 Other Commodity Market Rates
                            </h3>
                            <div className="table-responsive">
                                <table className="market-table">
                                    <thead>
                                        <tr>
                                            <th>Crop & Variety</th>
                                            <th>Primary Mandi</th>
                                            <th>Price</th>
                                            <th>24h Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {otherCrops.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <strong>{item.crop}</strong>
                                                </td>
                                                <td>{item.mandi_prices?.[0]?.region || 'Regional APMC'}</td>
                                                <td><strong>₹ {item.current_price.toFixed(2)}</strong> / {item.unit}</td>
                                                <td>
                                                    <span className={`badge-pill ${item.trend === 'up' ? 'badge-green' : 'badge-red'}`}>
                                                        {item.change_24h}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 4. NEW CARD 1: Price Alert Setup */}
                    <div className="glass-card price-alert-card" style={{ marginTop: 12 }}>
                        <div className="card-header-title">
                            <span>🔔</span> Set Mandi Price Alert
                        </div>
                        <p className="card-sub-text">
                            Get an instant SMS notification when {activeCropName} reaches your target market price.
                        </p>

                        <div className="price-alert-form" style={{ marginTop: 10 }}>
                            <div className="input-group-row">
                                <span className="input-prefix">Target Rate (₹/kg):</span>
                                <input
                                    type="number"
                                    className="alert-price-input"
                                    value={alertPrice}
                                    onChange={(e) => setAlertPrice(e.target.value)}
                                />
                            </div>

                            <button
                                className={`btn full-width-btn ${alertSet ? 'btn-secondary' : 'btn-agri-primary'}`}
                                onClick={() => setAlertSet(!alertSet)}
                                style={{ marginTop: 10 }}
                            >
                                {alertSet ? '✅ Price Alert Active (Target: ₹' + alertPrice + ')' : '🔔 Set Price Alert'}
                            </button>
                        </div>
                    </div>

                    {/* 5. NEW CARD 2: Nearby Mandis & Transport Distance */}
                    <div className="glass-card nearby-mandis-card" style={{ marginTop: 12 }}>
                        <div className="card-header-title">
                            <span>📍</span> Nearby Mandis & Transport Feasibility
                        </div>
                        <p className="card-sub-text">
                            Compare transport distances to select the most profitable market destination:
                        </p>

                        <div className="mandis-distance-list" style={{ marginTop: 10 }}>
                            <div className="mandi-distance-item">
                                <div className="mandi-name-col">
                                    <strong>Karnal Grain Market</strong>
                                    <span className="mandi-sub-loc">Haryana</span>
                                </div>
                                <div className="mandi-meta-col">
                                    <span className="dist-tag">🚗 12 km</span>
                                    <span className="cost-tag">Transport ~ ₹15/Q</span>
                                </div>
                            </div>

                            <div className="mandi-distance-item">
                                <div className="mandi-name-col">
                                    <strong>Tiruvarur APMC</strong>
                                    <span className="mandi-sub-loc">Tamil Nadu</span>
                                </div>
                                <div className="mandi-meta-col">
                                    <span className="dist-tag">🚗 28 km</span>
                                    <span className="cost-tag">Transport ~ ₹35/Q</span>
                                </div>
                            </div>

                            <div className="mandi-distance-item">
                                <div className="mandi-name-col">
                                    <strong>Amritsar Main Mandi</strong>
                                    <span className="mandi-sub-loc">Punjab</span>
                                </div>
                                <div className="mandi-meta-col">
                                    <span className="dist-tag">🚗 45 km</span>
                                    <span className="cost-tag">Transport ~ ₹55/Q</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
