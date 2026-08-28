import React, { useState } from 'react';
import ScannerTab from './ScannerTab';

const CROPS_GRID = [
    { id: 'Paddy', name: 'Paddy (Rice)', icon: '🌾', category: 'Cereals' },
    { id: 'Wheat', name: 'Wheat', icon: '🍞', category: 'Cereals' },
    { id: 'Maize', name: 'Maize (Corn)', icon: '🌽', category: 'Cereals' },
    { id: 'Barley', name: 'Barley', icon: '🌿', category: 'Cereals' },
    { id: 'Sorghum', name: 'Sorghum (Jowar)', icon: '🌾', category: 'Cereals' },
    { id: 'Pearl millet', name: 'Pearl Millet (Bajra)', icon: '🌱', category: 'Cereals' },
    { id: 'Tomato', name: 'Tomato', icon: '🍅', category: 'Vegetables' },
    { id: 'Potato', name: 'Potato', icon: '🥔', category: 'Vegetables' },
    { id: 'Onion', name: 'Onion', icon: '🧅', category: 'Vegetables' },
    { id: 'Pepper', name: 'Chilli / Pepper', icon: '🌶️', category: 'Vegetables' },
    { id: 'Brinjal', name: 'Brinjal (Eggplant)', icon: '🍆', category: 'Vegetables' },
    { id: 'Okra', name: 'Okra (Ladyfinger)', icon: '🥬', category: 'Vegetables' },
    { id: 'Cucumber', name: 'Cucumber', icon: '🥒', category: 'Vegetables' },
    { id: 'Bitter gourd', name: 'Bitter Gourd', icon: '🥒', category: 'Vegetables' },
    { id: 'Cotton', name: 'Cotton', icon: '☁️', category: 'Commercial' },
    { id: 'Banana', name: 'Banana', icon: '🍌', category: 'Fruits' },
    { id: 'Apple', name: 'Apple', icon: '🍎', category: 'Fruits' },
    { id: 'Citrus', name: 'Citrus (Lemon)', icon: '🍋', category: 'Fruits' },
    { id: 'Sugarcane', name: 'Sugarcane', icon: '🎋', category: 'Commercial' },
];

export default function CropCareTab({
    selectedCrop,
    setSelectedCrop,
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
    currentLang
}) {
    const [isChangingCrop, setIsChangingCrop] = useState(false);

    const activeCropObj = typeof selectedCrop === 'object' && selectedCrop !== null
        ? selectedCrop
        : CROPS_GRID.find(c => c.id === selectedCrop || c.name.includes(selectedCrop)) || CROPS_GRID[0];

    const handleSelectCrop = (crop) => {
        setSelectedCrop(crop);
        setIsChangingCrop(false);
        setResult(null);
    };

    return (
        <div className="crop-care-wrapper">
            {(!selectedCrop || isChangingCrop) ? (
                <div className="glass-card crop-selection-card">
                    <div className="card-header-title">
                        <span>🌿</span> {t.selectCropTitle}
                    </div>
                    <p className="app-subtitle" style={{ textAlign: 'left', margin: '0 0 16px 0' }}>
                        {t.selectCropSub}
                    </p>

                    <div className="crops-circular-grid">
                        {CROPS_GRID.map((crop) => (
                            <div
                                key={crop.id}
                                className={`crop-circle-item ${activeCropObj.id === crop.id ? 'active-selection' : ''}`}
                                onClick={() => handleSelectCrop(crop)}
                            >
                                <div className="circle-avatar">{crop.icon}</div>
                                <span className="crop-circle-name">{crop.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {/* Top Bar showing selected crop with Change Crop button */}
                    <div className="glass-card active-crop-banner">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 32 }}>{activeCropObj.icon}</span>
                            <div>
                                <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>{activeCropObj.name} Active</h3>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                    Upload affected leaf photo for instant {activeCropObj.name} disease diagnosis
                                </span>
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsChangingCrop(true)}
                        >
                            🔄 Change Crop
                        </button>
                    </div>

                    {/* Scanner Tab */}
                    <ScannerTab
                        selectedCrop={activeCropObj}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        previewUrl={previewUrl}
                        setPreviewUrl={setPreviewUrl}
                        loading={loading}
                        result={result}
                        setResult={setResult}
                        error={error}
                        setError={setError}
                        analyzeImage={analyzeImage}
                        startCamera={startCamera}
                        triggerGalleryPicker={triggerGalleryPicker}
                        t={t}
                        currentLang={currentLang}
                    />
                </div>
            )}
        </div>
    );
}
