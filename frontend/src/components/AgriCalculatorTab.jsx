import React, { useState } from 'react';

const CROP_NUTRIENT_PRESETS = {
    Paddy: { urea: 90, dap: 50, mop: 40, zinc: 10, yieldPerAcre: 22, avgPricePerQ: 2200 },
    Wheat: { urea: 100, dap: 55, mop: 30, zinc: 8, yieldPerAcre: 20, avgPricePerQ: 2275 },
    Maize: { urea: 110, dap: 60, mop: 35, zinc: 10, yieldPerAcre: 25, avgPricePerQ: 2090 },
    Tomato: { urea: 120, dap: 75, mop: 60, zinc: 12, yieldPerAcre: 150, avgPricePerQ: 1800 },
    Potato: { urea: 130, dap: 85, mop: 70, zinc: 10, yieldPerAcre: 120, avgPricePerQ: 1400 },
    Cotton: { urea: 95, dap: 50, mop: 45, zinc: 10, yieldPerAcre: 12, avgPricePerQ: 7200 },
    Sugarcane: { urea: 220, dap: 100, mop: 80, zinc: 15, yieldPerAcre: 350, avgPricePerQ: 315 },
    Onion: { urea: 85, dap: 60, mop: 50, zinc: 8, yieldPerAcre: 110, avgPricePerQ: 1600 }
};

export default function AgriCalculatorTab({ t }) {
    const [calcType, setCalcType] = useState('fertilizer');
    const [selectedCrop, setSelectedCrop] = useState('Paddy');
    const [acres, setAcres] = useState(1);
    const [tankCapacity, setTankCapacity] = useState(15); // 15 Liters
    const [pesticideDosePerLiter, setPesticideDosePerLiter] = useState(2); // 2 ml/L

    const preset = CROP_NUTRIENT_PRESETS[selectedCrop] || CROP_NUTRIENT_PRESETS['Paddy'];

    // Calculations
    const ureaTotal = (preset.urea * acres).toFixed(1);
    const dapTotal = (preset.dap * acres).toFixed(1);
    const mopTotal = (preset.mop * acres).toFixed(1);
    const zincTotal = (preset.zinc * acres).toFixed(1);

    // Tank Spray Calculation
    const waterReqPerAcre = 150; // 150 Liters per acre
    const totalWater = waterReqPerAcre * acres;
    const totalTanks = Math.ceil(totalWater / tankCapacity);
    const dosePerTank = (tankCapacity * pesticideDosePerLiter).toFixed(1);
    const totalPesticideReq = ((totalWater * pesticideDosePerLiter) / 1000).toFixed(2); // Liters/kg

    // Yield Estimation
    const estYieldQuintals = (preset.yieldPerAcre * acres).toFixed(1);
    const estGrossRevenue = (estYieldQuintals * preset.avgPricePerQ).toLocaleString('en-IN');

    return (
        <div className="agri-calculator-container">
            {/* Header */}
            <div className="glass-card calc-hero">
                <h2 className="card-header-title">
                    <span>🧮</span> {t.calculatorHeader}
                </h2>
                <p className="app-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                    Precise fertilizer dosage, spray mixture ratio, and revenue estimations based on field acreage.
                </p>

                {/* Calc Switcher Tabs */}
                <div className="calc-tabs">
                    <button
                        className={`calc-tab-btn ${calcType === 'fertilizer' ? 'active' : ''}`}
                        onClick={() => setCalcType('fertilizer')}
                    >
                        🌱 Fertilizer Dose
                    </button>
                    <button
                        className={`calc-tab-btn ${calcType === 'spray' ? 'active' : ''}`}
                        onClick={() => setCalcType('spray')}
                    >
                        🧪 Spray Tank Mix
                    </button>
                    <button
                        className={`calc-tab-btn ${calcType === 'yield' ? 'active' : ''}`}
                        onClick={() => setCalcType('yield')}
                    >
                        💰 Yield & Income
                    </button>
                </div>
            </div>

            {/* Input Form Card */}
            <div className="glass-card calc-form-card">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Target Crop</label>
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="form-select"
                        >
                            {Object.keys(CROP_NUTRIENT_PRESETS).map((crop) => (
                                <option key={crop} value={crop}>{crop}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t.fieldArea}</label>
                        <input
                            type="number"
                            min="0.25"
                            max="500"
                            step="0.25"
                            value={acres}
                            onChange={(e) => setAcres(Math.max(0.1, parseFloat(e.target.value) || 1))}
                            className="form-input"
                        />
                    </div>
                </div>

                {calcType === 'spray' && (
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Sprayer Tank Capacity (Liters)</label>
                            <select
                                value={tankCapacity}
                                onChange={(e) => setTankCapacity(parseInt(e.target.value))}
                                className="form-select"
                            >
                                <option value={10}>10 Liters Backpack</option>
                                <option value={15}>15 Liters Standard</option>
                                <option value={20}>20 Liters Battery Sprayer</option>
                                <option value={50}>50 Liters Power Trolley</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Recommended Chemical Dose (ml or g per Liter)</label>
                            <input
                                type="number"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={pesticideDosePerLiter}
                                onChange={(e) => setPesticideDosePerLiter(parseFloat(e.target.value) || 1)}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Result Display Cards */}
            <div className="glass-card calc-results-card">
                {calcType === 'fertilizer' && (
                    <div>
                        <h3 className="section-subtitle">
                            Recommended Fertilizer Dosage for {acres} Acre(s) of {selectedCrop}
                        </h3>
                        <div className="nutrient-grid">
                            <div className="nutrient-card urea">
                                <span className="nut-icon">🌾</span>
                                <span className="nut-name">Urea (46% N)</span>
                                <span className="nut-val">{ureaTotal} kg</span>
                                <span className="nut-sub">({(ureaTotal / 50).toFixed(1)} bags of 50kg)</span>
                            </div>

                            <div className="nutrient-card dap">
                                <span className="nut-icon">🧪</span>
                                <span className="nut-name">DAP (18-46-0)</span>
                                <span className="nut-val">{dapTotal} kg</span>
                                <span className="nut-sub">({(dapTotal / 50).toFixed(1)} bags of 50kg)</span>
                            </div>

                            <div className="nutrient-card mop">
                                <span className="nut-icon">🪴</span>
                                <span className="nut-name">MOP (60% K)</span>
                                <span className="nut-val">{mopTotal} kg</span>
                                <span className="nut-sub">({(mopTotal / 50).toFixed(1)} bags of 50kg)</span>
                            </div>

                            <div className="nutrient-card zinc">
                                <span className="nut-icon">✨</span>
                                <span className="nut-name">Zinc Sulphate (21%)</span>
                                <span className="nut-val">{zincTotal} kg</span>
                                <span className="nut-sub">Micronutrient Soil Application</span>
                            </div>
                        </div>

                        <div className="calc-advisory">
                            💡 <strong>Application Schedule:</strong> Apply 100% DAP, MOP & Zinc during basal land preparation. Apply Urea in 3 equal split doses: Basal, Tillering stage (25 days), and Panicle Initiation stage (45 days).
                        </div>
                    </div>
                )}

                {calcType === 'spray' && (
                    <div>
                        <h3 className="section-subtitle">
                            🧪 Spray Tank Mixture Plan for {acres} Acre(s) of {selectedCrop}
                        </h3>
                        <div className="nutrient-grid">
                            <div className="nutrient-card dap">
                                <span className="nut-icon">🪣</span>
                                <span className="nut-name">Dose Per Tank</span>
                                <span className="nut-val">{dosePerTank} ml or g</span>
                                <span className="nut-sub">Add to {tankCapacity}L tank filled with clean water</span>
                            </div>

                            <div className="nutrient-card urea">
                                <span className="nut-icon">🔢</span>
                                <span className="nut-name">Total Tanks Needed</span>
                                <span className="nut-val">{totalTanks} Tanks</span>
                                <span className="nut-sub">Based on {totalWater}L water per {acres} acre(s)</span>
                            </div>

                            <div className="nutrient-card mop">
                                <span className="nut-icon">📦</span>
                                <span className="nut-name">Total Chemical Required</span>
                                <span className="nut-val">{totalPesticideReq} Liters / kg</span>
                                <span className="nut-sub">Total product needed for field treatment</span>
                            </div>
                        </div>
                    </div>
                )}

                {calcType === 'yield' && (
                    <div>
                        <h3 className="section-subtitle">
                            💰 Projected Harvest Yield & Income for {acres} Acre(s) of {selectedCrop}
                        </h3>
                        <div className="nutrient-grid">
                            <div className="nutrient-card urea">
                                <span className="nut-icon">🌾</span>
                                <span className="nut-name">Estimated Harvest</span>
                                <span className="nut-val">{estYieldQuintals} Quintals</span>
                                <span className="nut-sub">Avg yield: {preset.yieldPerAcre} Q/Acre</span>
                            </div>

                            <div className="nutrient-card zinc">
                                <span className="nut-icon">💵</span>
                                <span className="nut-name">Projected Revenue</span>
                                <span className="nut-val">₹ {estGrossRevenue}</span>
                                <span className="nut-sub">Based on mandi rate ₹ {preset.avgPricePerQ}/Q</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
