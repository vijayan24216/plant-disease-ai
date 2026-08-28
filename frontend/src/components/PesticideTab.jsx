import React, { useState, useEffect } from 'react';

const PESTICIDES_DATA = [
    {
        id: 'tricyclazole_75',
        name: 'Tricyclazole 75% WP (Beam)',
        category: 'chemical_fungicide',
        categoryLabel: 'Systemic Blasticide',
        activeIngredient: 'Tricyclazole 75% WP',
        imageUrl: '/images/pesticides/tricyclazole.png',
        crops: ['Paddy (Rice)'],
        diseases: ['Paddy Leaf Blast', 'Neck Blast', 'Node Blast'],
        dosagePerLiter: '0.6 g per Litre of water',
        dosagePerAcre: '90 g in 150 Litres water per acre',
        priceInr: 480,
        unit: '100g pack',
        mandiLocation: 'IFFCO Kendra / KVK Co-op Store',
        priceTrend: '+1.2% (Seasonal High)',
        trendClass: 'badge-amber',
        safetyNotes: 'Systemic fungicide. Pre-Harvest Interval (PHI): 30 days. Wear mask during spray.',
        isOrganic: false
    },
    {
        id: 'mancozeb_carbendazim',
        name: 'Mancozeb 75% + Carbendazim 12% (Saaf)',
        category: 'chemical_fungicide',
        categoryLabel: 'Broad-Spectrum Dual Fungicide',
        activeIngredient: 'Mancozeb 75% WP + Carbendazim 12% WP',
        imageUrl: '/images/pesticides/mancozeb.png',
        crops: ['Paddy (Rice)', 'Tomato', 'Potato', 'Apple'],
        diseases: ['Brown Spot (Rice Leaf)', 'Early Blight', 'Leaf Mold', 'Apple Scab'],
        dosagePerLiter: '2.0 g per Litre of water',
        dosagePerAcre: '300 g in 150 Litres water per acre',
        priceInr: 320,
        unit: '250g pack',
        mandiLocation: 'Karnal APMC / Local Agri Dealer',
        priceTrend: 'Stable (Govt Regulated)',
        trendClass: 'badge-green',
        safetyNotes: 'Dual action contact + systemic. PHI: 15 days. Do not mix with alkaline insecticides.',
        isOrganic: false
    },
    {
        id: 'propiconazole_25',
        name: 'Propiconazole 25% EC (Tilt)',
        category: 'chemical_fungicide',
        categoryLabel: 'Triazole Systemic Fungicide',
        activeIngredient: 'Propiconazole 25% EC',
        imageUrl: '/images/pesticides/tricyclazole.png',
        crops: ['Paddy (Rice)', 'Wheat', 'Corn (Maize)'],
        diseases: ['Brown Spot', 'Wheat Yellow Rust', 'Brown Rust', 'Corn Northern Leaf Blight'],
        dosagePerLiter: '1.0 ml per Litre of water',
        dosagePerAcre: '150 ml in 150 Litres water per acre',
        priceInr: 650,
        unit: '250ml bottle',
        mandiLocation: 'Tiruvarur APMC / National Agro',
        priceTrend: 'Stable',
        trendClass: 'badge-green',
        safetyNotes: 'High efficiency protective triazole. PHI: 25 days. Toxic to aquatic life.',
        isOrganic: false
    },
    {
        id: 'metalaxyl_mancozeb',
        name: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)',
        category: 'chemical_fungicide',
        categoryLabel: 'Systemic Oomycete Specialist',
        activeIngredient: 'Metalaxyl 8% + Mancozeb 64% WP',
        imageUrl: '/images/pesticides/mancozeb.png',
        crops: ['Potato', 'Tomato', 'Grape'],
        diseases: ['Potato Late Blight', 'Tomato Late Blight', 'Downy Mildew'],
        dosagePerLiter: '2.5 g per Litre of water',
        dosagePerAcre: '375 g in 150 Litres water per acre',
        priceInr: 580,
        unit: '500g pack',
        mandiLocation: 'Guntur APMC / Syngenta Channel',
        priceTrend: '+2.4% (High Demand)',
        trendClass: 'badge-red',
        safetyNotes: 'Curative and protective. Spray immediately at first late blight symptom. PHI: 14 days.',
        isOrganic: false
    },
    {
        id: 'isoprothiolane_40',
        name: 'Isoprothiolane 40% EC (Fuji-One)',
        category: 'chemical_fungicide',
        categoryLabel: 'Systemic Rice Blasticide',
        activeIngredient: 'Isoprothiolane 40% EC',
        imageUrl: '/images/pesticides/tricyclazole.png',
        crops: ['Paddy (Rice)'],
        diseases: ['Paddy Leaf Blast', 'Neck Blast', 'Stem Rot'],
        dosagePerLiter: '1.5 ml per Litre of water',
        dosagePerAcre: '225 ml in 150 Litres water per acre',
        priceInr: 720,
        unit: '250ml bottle',
        mandiLocation: 'Bhubaneswar APMC / Nihon Nohyaku Store',
        priceTrend: 'Stable',
        trendClass: 'badge-green',
        safetyNotes: 'Inhibits fungal lipid synthesis. Also suppresses rice planthoppers.',
        isOrganic: false
    },
    {
        id: 'copper_hydroxide',
        name: 'Copper Hydroxide 77% WP (Kocide)',
        category: 'chemical_fungicide',
        categoryLabel: 'Bactericide & Contact Fungicide',
        activeIngredient: 'Copper Hydroxide 77% WP',
        imageUrl: '/images/pesticides/mancozeb.png',
        crops: ['Tomato', 'Citrus (Lemon)', 'Pepper', 'Peach'],
        diseases: ['Bacterial Spot', 'Citrus Canker', 'Bacterial Blight'],
        dosagePerLiter: '2.0 g per Litre of water',
        dosagePerAcre: '300 g in 150 Litres water per acre',
        priceInr: 440,
        unit: '500g pack',
        mandiLocation: 'Amritsar APMC / Agro Junction',
        priceTrend: 'Stable',
        trendClass: 'badge-green',
        safetyNotes: 'Broad bactericidal barrier. PHI: 7 days. Avoid spraying in extreme heat.',
        isOrganic: false
    },
    {
        id: 'pseudomonas_fluorescens',
        name: 'Pseudomonas fluorescens 1% WP (Bio-Agent)',
        category: 'organic_bio',
        categoryLabel: 'Bio-Fungicide / Antagonistic Bacteria',
        activeIngredient: 'Pseudomonas fluorescens (2x10^8 CFU/g)',
        imageUrl: '/images/pesticides/neem.png',
        crops: ['Paddy (Rice)', 'Tomato', 'Potato', 'Wheat', 'Cotton'],
        diseases: ['Paddy Blast', 'Brown Spot', 'Bacterial Blight', 'Root Rot'],
        dosagePerLiter: '10.0 g per Litre of water',
        dosagePerAcre: '1.5 kg in 150 Litres water per acre',
        priceInr: 210,
        unit: '1kg bag',
        mandiLocation: 'State KVK Center / Organic Bio-Lab',
        priceTrend: 'Govt Subsidized (-15%)',
        trendClass: 'badge-green',
        safetyNotes: '100% Eco-Friendly. Safe for fish culture, pollinators, and livestock. PHI: 0 days.',
        isOrganic: true
    },
    {
        id: 'neem_kernel_extract',
        name: 'Neem Seed Kernel Extract (NSKE 5% / Azadirachtin)',
        category: 'organic_bio',
        categoryLabel: 'Botanical Bio-Pesticide',
        activeIngredient: 'Azadirachtin 10,000 PPM (1%)',
        imageUrl: '/images/pesticides/neem.png',
        crops: ['Paddy (Rice)', 'Tomato', 'Brinjal', 'Cotton', 'Okra'],
        diseases: ['Brown Spot', 'Spider Mites', 'Whitefly', 'Sucking Pests'],
        dosagePerLiter: '5.0 ml per Litre of water',
        dosagePerAcre: '750 ml in 150 Litres water per acre',
        priceInr: 340,
        unit: '1L bottle',
        mandiLocation: 'Organic Farmers Co-Op Store',
        priceTrend: 'Stable',
        trendClass: 'badge-green',
        safetyNotes: 'Organic repellant and anti-feedant. Safe for ladybugs and bees.',
        isOrganic: true
    },
    {
        id: 'muriate_of_potash',
        name: 'Muriate of Potash (MOP 60% K2O)',
        category: 'fertilizer',
        categoryLabel: 'Macro-Nutrient Fertilizer',
        activeIngredient: 'Potassium Chloride (K2O 60%)',
        imageUrl: '/images/pesticides/potash.png',
        crops: ['Paddy (Rice)', 'Potato', 'Sugarcane', 'Banana', 'Apple'],
        diseases: ['Potassium Deficiency Chlorosis', 'Brown Spot Risk', 'Lodging'],
        dosagePerLiter: 'Basal / Top Dressing Application',
        dosagePerAcre: '25 kg per acre during land preparation',
        priceInr: 1700,
        unit: '50kg bag (Subsidized)',
        mandiLocation: 'IFFCO / KRIBHCO Fertilizer Depot',
        priceTrend: 'Govt Subsidized (NBS Rate)',
        trendClass: 'badge-green',
        safetyNotes: 'Builds cell wall silica-lignin barrier against blast & blight fungi.',
        isOrganic: false
    },
    {
        id: 'zinc_sulphate_21',
        name: 'Zinc Sulphate Heptahydrate (Zn 21%)',
        category: 'fertilizer',
        categoryLabel: 'Essential Micronutrient',
        activeIngredient: 'Zinc Sulphate 21% + Sulphur 10%',
        imageUrl: '/images/pesticides/potash.png',
        crops: ['Paddy (Rice)', 'Corn (Maize)', 'Wheat'],
        diseases: ['Khaira Disease (Zinc Deficiency)', 'Brown Spot Chlorosis'],
        dosagePerLiter: '5.0 g per Litre (Foliar) or Basal Soil',
        dosagePerAcre: '10 kg per acre basal dressing',
        priceInr: 460,
        unit: '10kg bag',
        mandiLocation: 'District Agriculture Co-Op',
        priceTrend: 'Stable',
        trendClass: 'badge-green',
        safetyNotes: 'Essential for chlorophyll synthesis and leaf lesion recovery.',
        isOrganic: false
    }
];

export default function PesticideTab({ t, selectedCrop, result }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cropFilter, setCropFilter] = useState('all');

    const activeCropName = typeof selectedCrop === 'object' && selectedCrop !== null
        ? (selectedCrop.name || selectedCrop.id)
        : (selectedCrop || 'Paddy (Rice)');

    // Sync crop filter with active crop default
    useEffect(() => {
        if (activeCropName) {
            setCropFilter(activeCropName.split(' ')[0]);
        }
    }, [activeCropName]);

    // Check if coming from a recent diagnosis scan
    const isScanResultAvailable = result && result.disease_name;
    const isLowConfidence = result && (result.confidence < 0.50 || result.is_uncertain);

    const filteredItems = PESTICIDES_DATA.filter((item) => {
        // Search Filter
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.diseases.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category Filter
        const matchesCategory = selectedCategory === 'all' ||
            (selectedCategory === 'chemical' && item.category === 'chemical_fungicide') ||
            (selectedCategory === 'fertilizer' && item.category === 'fertilizer') ||
            (selectedCategory === 'organic' && item.isOrganic);

        // Crop Filter
        const matchesCrop = cropFilter === 'all' ||
            item.crops.some(c => c.toLowerCase().includes(cropFilter.toLowerCase()));

        return matchesSearch && matchesCategory && matchesCrop;
    });

    return (
        <div className="pesticide-screen-container">
            {/* 1. Header Banner */}
            <div className="glass-card active-crop-banner" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 32 }}>🧴</span>
                        <div>
                            <h3 style={{ color: '#fff', fontSize: '1.15rem', margin: 0 }}>Pesticide & Fertilizer Prices</h3>
                            <span style={{ color: '#b2dfdb', fontSize: '0.8rem' }}>
                                Verified chemical spray rates, bio-agents & live APMC market prices
                            </span>
                        </div>
                    </div>
                    <span className="live-pill" style={{ background: '#f59e0b', color: '#000' }}>KVK REGULATED</span>
                </div>
            </div>

            {/* 2. Low-Confidence / Verification Safeguard Banner */}
            {isScanResultAvailable && (
                <div className={`glass-card ${isLowConfidence ? 'confidence-warning-box' : 'confidence-verified-box'}`} style={{
                    marginBottom: 14,
                    background: isLowConfidence ? '#fffbeb' : '#f0fdf4',
                    borderLeft: isLowConfidence ? '4px solid #f59e0b' : '4px solid #22c55e',
                    padding: 14
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{isLowConfidence ? '⚠️' : '✅'}</span>
                        <div>
                            <strong style={{ color: isLowConfidence ? '#92400e' : '#14532d', fontSize: '0.9rem' }}>
                                {isLowConfidence ? 'Low Confidence Diagnosis Safeguard Notice' : 'Diagnosis Matched Prescriptions'}
                            </strong>
                            <p style={{ fontSize: '0.8rem', color: isLowConfidence ? '#b45309' : '#15803d', margin: '3px 0 0 0' }}>
                                Recent Scan: <strong>{result.disease_name}</strong> ({((result.confidence || 0) * 100).toFixed(1)}% Confidence).
                                {isLowConfidence ? ' Do NOT purchase chemical sprays based solely on low confidence. Visually inspect leaf or consult local KVK agronomy officer first.' : ' Prescriptions below match your detected crop pathogen.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Search & Filter Bar */}
            <div className="glass-card" style={{ padding: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 Search pesticide, active chemical, crop or disease..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 10,
                                border: '1px solid #cbd5e1',
                                fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <select
                        value={cropFilter}
                        onChange={(e) => setCropFilter(e.target.value)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: 10,
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: '#ffffff',
                            color: '#004d40'
                        }}
                    >
                        <option value="all">🌾 All Crops</option>
                        <option value="Paddy">🌾 Paddy (Rice)</option>
                        <option value="Tomato">🍅 Tomato</option>
                        <option value="Potato">🥔 Potato</option>
                        <option value="Wheat">🌾 Wheat</option>
                        <option value="Corn">🌽 Corn (Maize)</option>
                        <option value="Apple">🍎 Apple</option>
                    </select>
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
                    <button
                        className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-agri-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCategory('all')}
                        style={{ borderRadius: 20, fontSize: '0.78rem' }}
                    >
                        All ({PESTICIDES_DATA.length})
                    </button>
                    <button
                        className={`btn btn-sm ${selectedCategory === 'chemical' ? 'btn-agri-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCategory('chemical')}
                        style={{ borderRadius: 20, fontSize: '0.78rem' }}
                    >
                        🧪 Chemical Fungicides
                    </button>
                    <button
                        className={`btn btn-sm ${selectedCategory === 'organic' ? 'btn-agri-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCategory('organic')}
                        style={{ borderRadius: 20, fontSize: '0.78rem' }}
                    >
                        🌱 Organic & Bio-Agents
                    </button>
                    <button
                        className={`btn btn-sm ${selectedCategory === 'fertilizer' ? 'btn-agri-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCategory('fertilizer')}
                        style={{ borderRadius: 20, fontSize: '0.78rem' }}
                    >
                        🧪 NPK Fertilizers
                    </button>
                </div>
            </div>

            {/* 4. Product Directory Grid */}
            <div className="pesticide-items-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredItems.length === 0 ? (
                    <div className="glass-card empty-report-state">
                        <span className="empty-state-icon">🔍</span>
                        <h4>No matching pesticides or fertilizers found</h4>
                        <p>Try searching for active chemical names like 'Tricyclazole', 'Mancozeb', or 'Potash'.</p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.id} className="glass-card" style={{ padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        style={{
                                            width: 72,
                                            height: 72,
                                            objectFit: 'contain',
                                            borderRadius: 10,
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            padding: 4
                                        }}
                                    />
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>{item.name}</h4>
                                            <span className={`badge-pill ${item.isOrganic ? 'badge-green' : 'badge-teal'}`} style={{ fontSize: '0.68rem' }}>
                                                {item.categoryLabel}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                                            <strong>Active Formula:</strong> {item.activeIngredient}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', minWidth: 100 }}>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#00796b' }}>
                                        ₹ {item.priceInr}
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>per {item.unit}</span>
                                    <span className={`badge-pill ${item.trendClass}`} style={{ fontSize: '0.65rem', marginTop: 3 }}>
                                        {item.priceTrend}
                                    </span>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '12px 0' }} />

                            {/* Technical Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                                <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>🎯 TARGET CROPS & DISEASES</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                                        {item.crops.join(', ')} — {item.diseases.slice(0, 2).join(', ')}
                                    </span>
                                </div>

                                <div style={{ background: '#f0fdf4', padding: 8, borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, display: 'block' }}>🧪 RECOMMENDED DOSAGE</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#14532d' }}>
                                        {item.dosagePerLiter} ({item.dosagePerAcre})
                                    </span>
                                </div>

                                <div style={{ background: '#fefce8', padding: 8, borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.7rem', color: '#854d0e', fontWeight: 700, display: 'block' }}>📍 SUPPLIER & LOCATION</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713f12' }}>
                                        {item.mandiLocation}
                                    </span>
                                </div>
                            </div>

                            {/* Safety & Spray Advisory */}
                            <div style={{ marginTop: 10, fontSize: '0.76rem', color: '#475569', background: '#f1f5f9', padding: '6px 10px', borderRadius: 6 }}>
                                🛡️ <strong>Safety Advisory:</strong> {item.safetyNotes}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
