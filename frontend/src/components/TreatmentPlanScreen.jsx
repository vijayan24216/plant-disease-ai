import React, { useState, useEffect } from 'react';

export default function TreatmentPlanScreen({
    scanData,
    onBack,
    apiBaseUrl = 'http://localhost:8000',
    t
}) {
    // Persistent Field Size (Load from localStorage if available, default to 1.0)
    const [fieldSizeAcres, setFieldSizeAcres] = useState(() => {
        const saved = localStorage.getItem('agripulse_field_size') || localStorage.getItem('agricentral_field_size');
        return saved ? parseFloat(saved) : 1.0;
    });

    // Save field size to localStorage when updated
    const handleFieldSizeChange = (val) => {
        const acres = Math.max(0.1, parseFloat(val) || 1.0);
        setFieldSizeAcres(acres);
        localStorage.setItem('agripulse_field_size', acres.toString());
    };

    // Calculate treatment plan via API on changes
    useEffect(() => {
        fetchPlan();
    }, [diseaseName, fieldSizeAcres, budgetLevel, farmingType]);

    const fetchPlan = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiBaseUrl}/treatment-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    disease_name: diseaseName,
                    field_size_acres: fieldSizeAcres,
                    budget_level: budgetLevel,
                    farming_type: farmingType
                })
            });

            if (!res.ok) {
                throw new Error('Could not calculate treatment plan.');
            }

            const data = await res.json();
            setPlan(data);
        } catch (err) {
            console.error('Error fetching treatment plan:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="treatment-plan-screen-wrapper animate-fade-in" style={{ paddingBottom: 80 }}>
            {/* Header Nav Bar with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={onBack}
                    style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 800 }}
                >
                    ← Back to Diagnosis
                </button>
                <span className="badge-pill badge-green">
                    🧪 Agronomic Intelligence Suite
                </span>
            </div>

            {/* 1. TOP CARD — DIAGNOSIS SUMMARY RECAP */}
            <div className="glass-card diagnosis-recap-card" style={{ background: '#f8fafc', borderColor: '#cbd5e1', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                            {cropType} Diagnosis Summary
                        </span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                            🌿 {diseaseName}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                            {plan?.disease_info?.symptoms || 'Pathogen leaf spots detected via PyTorch EfficientNet-B0 vision network.'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span className="badge-pill badge-green" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                            {confidenceScore}% Confidence
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. BUDGET & FIELD SIZE SELECTION CARD */}
            <div className="glass-card budget-selection-card" style={{ marginBottom: 14 }}>
                <div className="card-header-title">
                    <span>📐</span> Field Size & Budget Selection
                </div>
                <p className="card-sub-text">
                    Select your field size and target budget per acre to calculate exact pesticide dosage & cost.
                </p>

                {/* Field Size Input */}
                <div style={{ marginTop: 12, marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                        Field Size (Acres)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                            type="number"
                            min="0.1"
                            max="500"
                            step="0.25"
                            value={fieldSizeAcres}
                            onChange={(e) => handleFieldSizeChange(e.target.value)}
                            style={{
                                width: '130px',
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: '2px solid #00796b',
                                fontSize: '1.05rem',
                                fontWeight: 900,
                                color: '#004d40',
                                outline: 'none'
                            }}
                        />
                        <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 700 }}>
                            Acre(s) = <strong>{(fieldSizeAcres * 43560).toLocaleString()} sq. ft</strong>
                        </span>
                    </div>
                </div>

                {/* Heading & 3 Tappable Budget Cards */}
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: 8 }}>
                    Select Your Budget Per Acre (Pre-selected default: Medium)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    <button
                        className={`btn-budget-option ${budgetLevel === 'low' ? 'active-budget-card-low' : ''}`}
                        onClick={() => setBudgetLevel('low')}
                        style={{
                            padding: '12px 8px',
                            borderRadius: 10,
                            border: budgetLevel === 'low' ? '2.5px solid #22c55e' : '1px solid #cbd5e1',
                            background: budgetLevel === 'low' ? '#f0fdf4' : '#fff',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#15803d', display: 'block' }}>🌱 Low Budget</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', display: 'block', marginTop: 2 }}>Organic First</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>₹200 - ₹400 / acre</span>
                    </button>

                    <button
                        className={`btn-budget-option ${budgetLevel === 'medium' ? 'active-budget-card-med' : ''}`}
                        onClick={() => setBudgetLevel('medium')}
                        style={{
                            padding: '12px 8px',
                            borderRadius: 10,
                            border: budgetLevel === 'medium' ? '2.5px solid #d97706' : '1px solid #cbd5e1',
                            background: budgetLevel === 'medium' ? '#fffbeb' : '#fff',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#b45309', display: 'block' }}>🧪 Medium (Default)</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e', display: 'block', marginTop: 2 }}>Standard Chemical</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>₹450 - ₹800 / acre</span>
                    </button>

                    <button
                        className={`btn-budget-option ${budgetLevel === 'high' ? 'active-budget-card-high' : ''}`}
                        onClick={() => setBudgetLevel('high')}
                        style={{
                            padding: '12px 8px',
                            borderRadius: 10,
                            border: budgetLevel === 'high' ? '2.5px solid #ef4444' : '1px solid #cbd5e1',
                            background: budgetLevel === 'high' ? '#fef2f2' : '#fff',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#b91c1c', display: 'block' }}>🛡️ High / Severe</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', display: 'block', marginTop: 2 }}>Systemic Curative</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>₹850 - ₹1500 / acre</span>
                    </button>
                </div>
            </div>

            {/* 3. RESULTS CARD */}
            <div className="glass-card treatment-results-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div className="card-header-title" style={{ margin: 0 }}>
                        <span>📋</span> Recommended Treatment Plan
                    </div>

                    {/* Organic | Chemical Mode Toggle */}
                    <div style={{ background: '#f1f5f9', padding: 3, borderRadius: 8, display: 'flex', gap: 4 }}>
                        <button
                            onClick={() => setFarmingType('organic')}
                            style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: farmingType === 'organic' ? '#16a34a' : 'transparent',
                                color: farmingType === 'organic' ? '#fff' : '#64748b',
                                cursor: 'pointer'
                            }}
                        >
                            🌱 Organic
                        </button>

                        <button
                            onClick={() => setFarmingType('conventional')}
                            style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: farmingType === 'conventional' ? '#00796b' : 'transparent',
                                color: farmingType === 'conventional' ? '#fff' : '#64748b',
                                cursor: 'pointer'
                            }}
                        >
                            🧪 Chemical
                        </button>

                        <button
                            onClick={() => setFarmingType('no_preference')}
                            style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: farmingType === 'no_preference' ? '#475569' : 'transparent',
                                color: farmingType === 'no_preference' ? '#fff' : '#64748b',
                                cursor: 'pointer'
                            }}
                        >
                            All
                        </button>
                    </div>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                        <div className="spinner" style={{ margin: '0 auto 12px auto', width: 36, height: 36 }} />
                        <h4 style={{ color: '#004d40', fontWeight: 800 }}>Calculating CIB&RC Label Rates...</h4>
                        <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Scaling dosage for {fieldSizeAcres} acre(s)</p>
                    </div>
                )}

                {!loading && plan && plan.available && (
                    <div>
                        {/* Product Header Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #004d40 0%, #00796b 100%)',
                            color: '#fff',
                            padding: 16,
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0, 77, 64, 0.15)',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    background: 'rgba(255, 255, 255, 0.22)',
                                    padding: '3px 10px',
                                    borderRadius: 6
                                }}>
                                    {plan.selected_treatment.tier?.replace('_', ' ')}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: 6, marginBottom: 2, color: '#fff' }}>
                                    {plan.selected_treatment.product}
                                </h3>
                                <span style={{ fontSize: '0.82rem', color: '#b2dfdb' }}>
                                    Dosage Rate: <strong>{plan.selected_treatment.dosage}</strong>
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.72rem', color: '#b2dfdb', display: 'block' }}>Total Est. Cost</span>
                                <strong style={{ fontSize: '1.25rem', color: '#4ade80', fontWeight: 900 }}>
                                    {plan.selected_treatment.total_estimated_cost}
                                </strong>
                            </div>
                        </div>

                        {/* Prominent Exact Quantity Box */}
                        <div style={{
                            background: '#f0fdf4',
                            border: '2px solid #86efac',
                            borderRadius: 10,
                            padding: 14,
                            marginTop: 14
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '1.8rem' }}>📦</span>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#166534', textTransform: 'uppercase' }}>
                                        Exact Quantity Needed ({fieldSizeAcres} Acre Field)
                                    </span>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                                        {plan.selected_treatment.summary_instruction}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Application Schedule List */}
                        <div style={{ marginTop: 14, background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                            <strong style={{ fontSize: '0.88rem', color: '#1e293b', display: 'block', marginBottom: 6 }}>
                                📅 Application Steps & Timing
                            </strong>
                            <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                                {plan.selected_treatment.application_schedule}
                            </p>
                        </div>

                        {/* Safety Notes Highlight Box */}
                        <div style={{
                            background: '#fef2f2',
                            borderLeft: '5px solid #ef4444',
                            padding: 14,
                            borderRadius: 10,
                            marginTop: 14
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                                <div>
                                    <strong style={{ fontSize: '0.88rem', color: '#991b1b', display: 'block' }}>
                                        Safety Notes & Regulatory Restrictions (CIB&RC)
                                    </strong>
                                    <p style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: 4, margin: 0, lineHeight: 1.4 }}>
                                        {plan.selected_treatment.safety_notes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fertilizer Sub-section */}
                        {plan.fertilizer_recommendation && plan.fertilizer_recommendation.product && (
                            <div style={{
                                background: '#e0f2f1',
                                borderLeft: '5px solid #00796b',
                                padding: 14,
                                borderRadius: 10,
                                marginTop: 14
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <span style={{ fontSize: '1.4rem' }}>🌾</span>
                                    <div>
                                        <strong style={{ fontSize: '0.88rem', color: '#004d40', display: 'block' }}>
                                            Nutrient Balance: {plan.fertilizer_recommendation.product}
                                        </strong>
                                        <p style={{ fontSize: '0.82rem', color: '#00695c', marginTop: 3, margin: 0 }}>
                                            <strong>Dosage:</strong> {plan.fertilizer_recommendation.dosage_per_acre} per acre ({plan.fertilizer_recommendation.application_method})
                                        </p>
                                        <span style={{ fontSize: '0.78rem', color: '#004d40', fontStyle: 'italic', display: 'block', marginTop: 4 }}>
                                            Reason: {plan.fertilizer_recommendation.reason}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Fallback State: Unmapped disease */}
                {!loading && plan && !plan.available && (
                    <div style={{
                        background: '#fffbeb',
                        borderLeft: '5px solid #f59e0b',
                        padding: 16,
                        borderRadius: 10,
                        marginTop: 10
                    }}>
                        <h4 style={{ color: '#92400e', fontWeight: 800, margin: '0 0 6px 0' }}>
                            ⚠️ Specific Treatment Data Pending
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#78350f', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                            {plan.message}
                        </p>

                        {/* Escalation CTA Button to find Krishi Vigyan Kendra (KVK) */}
                        <a
                            href="tel:18001801551"
                            className="btn btn-agri-primary full-width-btn"
                            style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                        >
                            📞 Call Kisan Call Center (1800-180-1551) / Nearest KVK Office
                        </a>
                    </div>
                )}

                {/* 4. DISCLAIMER PINNED AT BOTTOM */}
                <p style={{
                    fontSize: '0.72rem',
                    color: '#94a3b8',
                    marginTop: 16,
                    lineHeight: 1.4,
                    textAlign: 'center',
                    fontStyle: 'italic'
                }}>
                    ⚖️ {plan?.disclaimer || 'Recommendations are general guidance based on label rates. Confirm with a local agricultural officer before large-scale application, and always follow product label instructions and local regulations.'}
                </p>
            </div>
        </div>
    );
}
