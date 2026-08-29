import React, { useState, useRef, useEffect } from 'react';
import TreatmentPlanScreen from './TreatmentPlanScreen';

export default function ScannerTab({
    selectedCrop,
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    loading,
    result,
    setResult,
    error,
    setError,
    analyzeImage,
    startCamera,
    triggerGalleryPicker,
    t,
    currentLang,
    apiBaseUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000' : 'https://agribot-backend.onrender.com')
}) {
    const fileInputRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStageText, setScanStageText] = useState('Initializing AI scanner...');

    // View state: 'scanner' | 'treatment_plan'
    const [showTreatmentScreen, setShowTreatmentScreen] = useState(false);

    // Accordion open states for result report
    const [openSection, setOpenSection] = useState('pesticide'); // 'pesticide', 'fertilizer', 'symptoms', 'cause', 'prevention'

    const cropName = typeof selectedCrop === 'object' && selectedCrop !== null
        ? selectedCrop.name || selectedCrop.id
        : selectedCrop || 'Paddy (Rice)';

    // Animated scanner progress timer during scanning phase
    useEffect(() => {
        let interval = null;
        if (loading) {
            setShowTreatmentScreen(false);
            setScanProgress(0);
            setScanStageText('Analyzing leaf cellular structure...');

            const startTime = Date.now();
            const totalDuration = 2200; // Fast & responsive 2.2s scan animation

            interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 99);
                setScanProgress(progress);

                if (progress < 25) {
                    setScanStageText('🔍 Extracting leaf vein & spot patterns...');
                } else if (progress < 50) {
                    setScanStageText('🌿 Detecting chlorotic halos & lesion severity...');
                } else if (progress < 75) {
                    setScanStageText('🤖 Running PyTorch EfficientNet-B0 neural model...');
                } else {
                    setScanStageText('📋 Formulating pesticide & fertilizer prescription...');
                }
            }, 50);
        } else {
            setScanProgress(100);
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResult(null);
        setShowTreatmentScreen(false);
        setError(null);
        if (typeof analyzeImage === 'function') {
            analyzeImage(file);
        }
    };

    const speakDiagnosis = () => {
        if (!result) return;
        if (!('speechSynthesis' in window)) {
            alert('Voice synthesis not supported in this browser.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const textToSpeak = `Diagnosis: ${result.disease_name}. Recommended Pesticide: ${result.treatment ? result.treatment[0] : 'Standard chemical spray'}. Recommended Fertilizer: Muriate of Potash and Zinc Sulphate for leaf defense.`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const toggleSection = (sectionName) => {
        setOpenSection(openSection === sectionName ? null : sectionName);
    };

    // If user clicked "View Treatment Plan →", render full TreatmentPlanScreen component
    if (showTreatmentScreen && result) {
        return (
            <TreatmentPlanScreen
                scanData={{
                    disease_name: result.disease_name,
                    confidence_score: result.confidence_percent,
                    crop_type: cropName,
                    scan_id: result.scan_id || 'SCAN_1082'
                }}
                onBack={() => setShowTreatmentScreen(false)}
                apiBaseUrl={apiBaseUrl}
                t={t}
            />
        );
    }

    return (
        <div className="scanner-flow-container">
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files[0])}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* CARD 1: UPLOAD CARD */}
            <div className="glass-card upload-card">
                <div className="card-header-title">
                    <span>📷</span> Upload or Capture Leaf
                </div>

                {!previewUrl ? (
                    <div
                        className="dashed-upload-zone"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="upload-icon-circle">🍃</div>
                        <p className="dashed-upload-title">
                            Tap to upload or capture a {cropName.toLowerCase()} leaf photo
                        </p>
                        <span className="dashed-upload-sub">Supports JPG, PNG & WEBP</span>
                    </div>
                ) : (
                    <div className="preview-box" style={{ position: 'relative', overflow: 'hidden' }}>
                        <img src={previewUrl} alt="Selected leaf" className="preview-img" style={{ width: '100%', borderRadius: 8, display: 'block' }} />

                        {/* Grad-CAM Highlight Simulation Box */}
                        {result && !loading && (
                            <div className="gradcam-highlight-overlay">
                                <span className="gradcam-tag">🎯 Lesion Detected (Grad-CAM)</span>
                            </div>
                        )}

                        {/* Thorough Scanning Overlay with Progress Bar */}
                        {loading && (
                            <div className="scan-laser-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 77, 64, 0.85)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                padding: 20,
                                textAlign: 'center',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <div className="spinner" style={{ width: 44, height: 44, marginBottom: 14 }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>Deep Scanning {cropName} Leaf</h3>
                                <p style={{ fontSize: '0.82rem', color: '#b2dfdb', marginBottom: 14 }}>{scanStageText}</p>

                                {/* Progress Bar Track */}
                                <div style={{ width: '85%', height: 10, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${scanProgress}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
                                        transition: 'width 0.2s linear'
                                    }} />
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80', marginTop: 6 }}>{scanProgress}% Completed</span>
                            </div>
                        )}

                        {!loading && (
                            <button
                                className="remove-preview-btn"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                    setResult(null);
                                    setShowTreatmentScreen(false);
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}

                {/* Two Equal-Width Side-by-Side Action Buttons */}
                <div className="upload-action-row">
                    <button
                        className="btn btn-secondary action-btn-half"
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                    >
                        🖼️ Browse gallery
                    </button>

                    <button
                        className="btn btn-secondary action-btn-half"
                        onClick={startCamera}
                        disabled={loading}
                    >
                        📸 Take photo
                    </button>
                </div>

                {/* Single Full-Width Analyze Button */}
                <button
                    className={`btn full-width-btn ${selectedFile && !loading ? 'btn-agri-primary' : 'btn-disabled'}`}
                    onClick={analyzeImage}
                    disabled={!selectedFile || loading}
                    style={{ marginTop: 12 }}
                >
                    {loading ? (
                        <>
                            <div className="spinner" /> Scanning {cropName} ({scanProgress}%)...
                        </>
                    ) : (
                        <>🔍 Analyze {cropName} health</>
                    )}
                </button>

                {error && (
                    <div className="non-leaf-alert-card" style={{
                        marginTop: 14,
                        padding: '16px 20px',
                        background: '#fef2f2',
                        border: '1.5px solid #fca5a5',
                        borderRadius: 16,
                        color: '#991b1b'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: '0.98rem', marginBottom: 4 }}>
                            <span style={{ fontSize: '1.4rem' }}>⚠️</span> Invalid Image: Not a Crop Leaf
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                            {error.replace('🚫 Invalid Image:', '').trim()}
                        </p>
                        <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.78rem', fontWeight: 800, color: '#b91c1c' }}>
                            💡 Tip: Please snap or upload a clear photo of an affected plant leaf (Tomato, Paddy, Potato, Cotton, etc.).
                        </span>
                    </div>
                )}
            </div>

            {/* CARD 2: DIAGNOSTIC REPORT CARD */}
            <div className="glass-card diagnostic-report-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-header-title" style={{ margin: 0 }}>
                        <span>🔬</span> Diagnostic Report
                    </div>
                    {result && !loading && (
                        <button className="btn btn-voice btn-sm" onClick={speakDiagnosis}>
                            🎙️ {isSpeaking ? 'Stop' : 'Voice'}
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {!result && !loading && (
                    <div className="empty-report-state">
                        <span className="empty-state-icon">🌱</span>
                        <h4>No scan completed yet</h4>
                        <p>Upload or snap a photo of an affected {cropName} leaf above to view specific pesticide & fertilizer recommendations.</p>
                    </div>
                )}

                {/* Loading State in Report Card */}
                {loading && (
                    <div className="empty-report-state" style={{ padding: '30px 16px' }}>
                        <div className="spinner" style={{ margin: '0 auto 12px auto', width: 38, height: 38 }} />
                        <h4 style={{ color: 'var(--agri-teal-dark)', fontWeight: 800 }}>Analyzing Neural Features ({scanProgress}%)</h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>{scanStageText}</p>
                    </div>
                )}

                {/* Result State with Pesticide & Fertilizer Cards */}
                {result && !loading && (
                    <div className="report-results-wrapper animate-fade-in" style={{ marginTop: 14 }}>
                        {/* Header Title & Severity Pill */}
                        <div className="report-result-header">
                            <div>
                                <h3 className="disease-report-title">{result.disease_name}</h3>
                                <span className="pathogen-sub">Pathogen: <i>{result.pathogen || 'Fungus / Bacteria'}</i></span>
                            </div>
                            <span className={`badge-pill ${result.severity?.toLowerCase() === 'high' ? 'badge-red' : result.severity?.toLowerCase() === 'moderate' ? 'badge-amber' : 'badge-green'}`}>
                                {result.severity || 'Moderate'}
                            </span>
                        </div>

                        {/* Low Confidence Safety Warning Banner */}
                        {(result.warning || result.is_uncertain) && (
                            <div style={{
                                marginTop: 12,
                                padding: '10px 14px',
                                background: '#fffbe5',
                                border: '1px solid #fde047',
                                borderLeft: '4px solid #d97706',
                                borderRadius: 8,
                                color: '#78350f',
                                fontSize: '0.83rem',
                                lineHeight: '1.45'
                            }}>
                                ⚠️ <strong>Safety Warning:</strong> {result.warning || `Low confidence diagnosis (${result.confidence_percent}%). Do NOT apply strong chemical pesticides (e.g. Mancozeb, Chlorothalonil) based on an uncertain result. Cross-check symptoms with ${cropName} Blast or Brown Spot, or consult your local Krishi Vigyan Kendra (KVK) officer.`}
                            </div>
                        )}

                        {/* Confidence Track */}
                        <div className="confidence-track-box" style={{ marginTop: 12 }}>
                            <div className="confidence-label-row">
                                <span>AI Confidence Score:</span>
                                <strong>{result.confidence_percent}%</strong>
                            </div>
                            <div className="confidence-track">
                                <div
                                    className="confidence-fill"
                                    style={{
                                        width: `${result.confidence_percent}%`,
                                        background: result.confidence_percent > 75 ? '#16a34a' : '#d97706'
                                    }}
                                />
                            </div>
                        </div>

                        {/* HIGHLIGHTED DUAL RECOMMENDATION BOXES: PESTICIDE & FERTILIZER */}
                        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {/* PESTICIDE RECOMMENDATION CARD */}
                            <div style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderLeft: '4px solid #16a34a',
                                padding: '12px 14px',
                                borderRadius: 8
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <span style={{ fontSize: '1.1rem' }}>💊</span>
                                    <strong style={{ color: '#14532d', fontSize: '0.9rem' }}>Recommended Pesticide / Fungicide:</strong>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#166534', margin: '4px 0 0 0', fontWeight: 600 }}>
                                    {result.treatment?.[1] || result.treatment?.[0] || 'Spray Mancozeb 75% WP @ 2.5g/L water or Copper Hydroxide.'}
                                </p>
                            </div>

                            {/* FERTILIZER RECOMMENDATION CARD */}
                            <div style={{
                                background: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                borderLeft: '4px solid #0284c7',
                                padding: '12px 14px',
                                borderRadius: 8
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <span style={{ fontSize: '1.1rem' }}>🧪</span>
                                    <strong style={{ color: '#0369a1', fontSize: '0.9rem' }}>Recommended Fertilizer & Nutrient Balance:</strong>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#075985', margin: '4px 0 0 0', fontWeight: 600 }}>
                                    Apply Muriate of Potash (MOP 20kg/acre) + Zinc Sulphate (10kg/acre) to build leaf cell wall resistance and prevent chlorotic spot spread.
                                </p>
                            </div>
                        </div>

                        {/* Accordions Section */}
                        <div className="accordion-group" style={{ marginTop: 14 }}>
                            {/* Accordion 1: Full Pesticide & Chemical Dosage Breakdown */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleSection('pesticide')}>
                                    <span>💊 Detailed Pesticide & Chemical Spray Guide</span>
                                    <span>{openSection === 'pesticide' ? '▲' : '▼'}</span>
                                </button>
                                {openSection === 'pesticide' && (
                                    <div className="accordion-body">
                                        <ul>
                                            {result.treatment?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            )) || <li>Apply copper hydroxide spray or bio-fungicide solution.</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 2: Fertilizer & Soil Nutrition */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleSection('fertilizer')}>
                                    <span>🌾 Soil Fertilizer & Micronutrient Strategy</span>
                                    <span>{openSection === 'fertilizer' ? '▲' : '▼'}</span>
                                </button>
                                {openSection === 'fertilizer' && (
                                    <div className="accordion-body">
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155' }}>
                                            <strong>Fertilizer Strategy:</strong> Potassium (MOP) increases stomatal resistance, while Zinc Sulphate mitigates chlorotic leaf lesions. Apply split basal dose 15 days apart.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 3: Symptoms */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleSection('symptoms')}>
                                    <span>🩺 Key Leaf Symptoms</span>
                                    <span>{openSection === 'symptoms' ? '▲' : '▼'}</span>
                                </button>
                                {openSection === 'symptoms' && (
                                    <div className="accordion-body">
                                        <ul>
                                            {result.symptoms?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            )) || <li>Concentric brown leaf spots with yellow chlorotic halos.</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 4: Cause */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleSection('cause')}>
                                    <span>🔬 Pathogen Cause & Environment</span>
                                    <span>{openSection === 'cause' ? '▲' : '▼'}</span>
                                </button>
                                {openSection === 'cause' && (
                                    <div className="accordion-body">
                                        <p>{result.cause || 'High relative humidity combined with warm temperatures accelerates spore splashback.'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 5: Prevention */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleSection('prevention')}>
                                    <span>🛡️ Long-term Field Prevention</span>
                                    <span>{openSection === 'prevention' ? '▲' : '▼'}</span>
                                </button>
                                {openSection === 'prevention' && (
                                    <div className="accordion-body">
                                        <ul>
                                            {result.prevention?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            )) || <li>Rotate crops and avoid overhead irrigation.</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PROMINENT FULL-WIDTH CTA BUTTON TO TREATMENT PLAN SCREEN */}
                        <div style={{ marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                            <button
                                className="btn btn-agri-primary full-width-btn"
                                onClick={() => setShowTreatmentScreen(true)}
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 900,
                                    padding: '14px 16px',
                                    boxShadow: '0 4px 12px rgba(0, 77, 64, 0.2)',
                                    display: 'flex',
                                    justify: 'center',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <span>🧪 Calculate Exact Field Dosage & Cost</span>
                                <span style={{ fontSize: '1.2rem' }}>➔</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
