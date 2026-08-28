import React, { useState, useEffect } from 'react';

export default function DiseaseDBTab({ t, apiBaseUrl }) {
    const [diseases, setDiseases] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');

    useEffect(() => {
        fetchDiseaseDb();
    }, []);

    const fetchDiseaseDb = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${apiBaseUrl}/diseases`);
            if (res.ok) {
                const json = await res.json();
                setDiseases(json.diseases || {});
            }
        } catch (err) {
            console.error('Disease DB fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const diseaseEntries = Object.entries(diseases);
    const cropsList = ['ALL', ...new Set(diseaseEntries.map(([_, info]) => info.crop))];

    const filteredEntries = diseaseEntries.filter(([key, info]) => {
        const matchesCrop = selectedCropFilter === 'ALL' || info.crop === selectedCropFilter;
        const matchesSearch =
            info.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            info.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (info.pathogen && info.pathogen.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCrop && matchesSearch;
    });

    return (
        <div className="diseasedb-container">
            {/* Header */}
            <div className="glass-card diseasedb-hero">
                <h2 className="card-header-title">
                    <span>📊</span> {t.dbHeader}
                </h2>
                <p className="app-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                    {t.dbSub}
                </p>

                {/* Filter Controls Bar */}
                <div className="db-filter-bar">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="db-search-input"
                    />

                    <div className="crop-filter-chips">
                        {cropsList.map((crop) => (
                            <button
                                key={crop}
                                className={`filter-chip ${selectedCropFilter === crop ? 'active' : ''}`}
                                onClick={() => setSelectedCropFilter(crop)}
                            >
                                {crop === 'ALL' ? t.filterCrop : crop}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="glass-card empty-state">
                    <div className="spinner" style={{ margin: '0 auto 16px auto', width: 36, height: 36 }} />
                    <p>Loading Disease Knowledge Base...</p>
                </div>
            ) : (
                <div className="disease-cards-grid">
                    {filteredEntries.map(([key, info]) => {
                        const severityLevel = info.severity || 'Moderate';
                        return (
                            <div key={key} className="glass-card disease-kb-card">
                                <div className="db-card-header">
                                    <div>
                                        <h3 className="db-disease-title">{info.disease_name}</h3>
                                        <span className="db-pathogen">Pathogen: {info.pathogen}</span>
                                    </div>
                                    <span className="crop-tag">{info.crop}</span>
                                </div>

                                {/* Severity Meter Pill */}
                                <div className="db-severity-row">
                                    <span className="severity-title">Severity Rating:</span>
                                    <span className={`severity-badge ${severityLevel.toLowerCase().split(' ')[0]}`}>
                                        {severityLevel}
                                    </span>
                                </div>

                                {/* Symptoms */}
                                {info.symptoms && (
                                    <div className="db-section-box">
                                        <span className="db-section-title">🔍 Key Symptoms:</span>
                                        <ul className="info-list">
                                            {info.symptoms.map((s, idx) => (
                                                <li key={idx}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Organic & Chemical Treatments */}
                                {info.treatment && (
                                    <div className="db-section-box highlight-box">
                                        <span className="db-section-title">💊 Treatment Options:</span>
                                        {info.treatment.organic && (
                                            <div className="treat-sub">
                                                <strong>Organic:</strong> {info.treatment.organic.join(', ')}
                                            </div>
                                        )}
                                        {info.treatment.chemical && (
                                            <div className="treat-sub">
                                                <strong>Chemical:</strong> {info.treatment.chemical.join(', ')}
                                            </div>
                                        )}
                                        {Array.isArray(info.treatment) && (
                                            <ul className="info-list">
                                                {info.treatment.map((tItem, idx) => (
                                                    <li key={idx}>{tItem}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
