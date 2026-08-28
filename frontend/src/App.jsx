import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import CropCareTab from './components/CropCareTab';
import MarketAnalyticsTab from './components/MarketAnalyticsTab';
import PesticideTab from './components/PesticideTab';
import WeatherRiskTab from './components/WeatherRiskTab';
import BulletinTab from './components/BulletinTab';
import AgriCalculatorTab from './components/AgriCalculatorTab';
import AgriBotTab from './components/AgriBotTab';
import { TRANSLATIONS } from './translations';

const API_BASE_URL = 'http://localhost:8000';

export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [currentLang, setLang] = useState('en');
    const [apiOnline, setApiOnline] = useState(false);
    const [showAgriBotModal, setShowAgriBotModal] = useState(false);

    // Single Source of Truth for Selected Crop (Default: Paddy)
    const [selectedCrop, setSelectedCrop] = useState({
        id: 'Paddy',
        name: 'Paddy (Rice)',
        icon: '🌾',
        category: 'Cereals'
    });

    // Scanner state
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Camera state
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);

    // Selected translation dictionary
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];

    useEffect(() => {
        checkHealth();
    }, []);

    const checkHealth = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/health`);
            if (res.ok) {
                setApiOnline(true);
            } else {
                setApiOnline(false);
            }
        } catch (err) {
            setApiOnline(false);
        }
    };

    // Trigger gallery file selector from anywhere
    const triggerGalleryPicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Camera Handlers
    const startCamera = async () => {
        try {
            setShowCamera(true);
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError('Could not access camera. Please allow camera permissions in your browser.');
            setShowCamera(false);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const capturedFile = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
            setSelectedFile(capturedFile);
            setPreviewUrl(URL.createObjectURL(capturedFile));
            setResult(null);
            setError(null);
            stopCamera();
            setActiveTab('cropcare');
        }, 'image/jpeg', 0.95);
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file (JPEG, PNG, WEBP).');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResult(null);
        setError(null);
        setActiveTab('cropcare');
    };

    // Prediction Analysis Call with 15-second thorough scanning delay
    const analyzeImage = async () => {
        if (!selectedFile) {
            setError('Please upload or capture a leaf photo first.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const cropName = typeof selectedCrop === 'object' && selectedCrop !== null
            ? (selectedCrop.name || selectedCrop.id)
            : (selectedCrop || 'Paddy (Rice)');

        const formData = new FormData();
        formData.append('file', selectedFile);
        if (cropName) {
            formData.append('crop', cropName);
        }

        const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 15000)); // 15s thorough scan timer

        try {
            const fetchPromise = fetch(`${API_BASE_URL}/predict?confidence_threshold=0.50`, {
                method: 'POST',
                body: formData,
            }).then(async (res) => {
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || 'Analysis request failed.');
                }
                return res.json();
            });

            const [data] = await Promise.all([fetchPromise, minDelayPromise]);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to connect to backend server. Operating in fallback demo mode.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agricentral-app-wrapper">
            {/* Hidden File Input for Global Gallery Trigger */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files[0])}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Header */}
            <Header
                currentLang={currentLang}
                setLang={setLang}
                apiOnline={apiOnline}
                t={t}
            />

            {/* Main Active Tab Content */}
            <main className="main-tab-viewport">
                {activeTab === 'home' && (
                    <HomeTab
                        setActiveTab={setActiveTab}
                        selectedCrop={selectedCrop}
                        setSelectedCrop={setSelectedCrop}
                        startCamera={startCamera}
                        triggerGalleryPicker={triggerGalleryPicker}
                        t={t}
                    />
                )}

                {activeTab === 'cropcare' && (
                    <CropCareTab
                        selectedCrop={selectedCrop}
                        setSelectedCrop={setSelectedCrop}
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
                )}

                {activeTab === 'market' && (
                    <MarketAnalyticsTab
                        t={t}
                        apiBaseUrl={API_BASE_URL}
                        selectedCrop={selectedCrop}
                        setSelectedCrop={setSelectedCrop}
                    />
                )}

                {activeTab === 'pesticide' && (
                    <PesticideTab
                        t={t}
                        selectedCrop={selectedCrop}
                        result={result}
                    />
                )}

                {activeTab === 'weather' && (
                    <WeatherRiskTab t={t} apiBaseUrl={API_BASE_URL} selectedCrop={selectedCrop} />
                )}

                {activeTab === 'bulletin' && (
                    <BulletinTab t={t} />
                )}

                {activeTab === 'calculator' && (
                    <AgriCalculatorTab t={t} selectedCrop={selectedCrop} />
                )}

                {activeTab === 'agribot' && (
                    <AgriBotTab t={t} apiBaseUrl={API_BASE_URL} currentLang={currentLang} selectedCrop={selectedCrop} />
                )}
            </main>

            {/* Agri-Bot AI Floating Action Button (FAB) - Persistent on all tabs */}
            <button
                className="agribot-fab-button"
                onClick={() => setShowAgriBotModal(!showAgriBotModal)}
                title="Ask Agri-Bot AI"
            >
                <span className="fab-icon">🤖</span>
                <span className="fab-pulse-dot" />
                <span className="fab-label">Agri-Bot AI</span>
            </button>

            {/* Agri-Bot AI Slide-up Drawer Modal */}
            {showAgriBotModal && (
                <div className="agribot-drawer-overlay" onClick={() => setShowAgriBotModal(false)}>
                    <div className="agribot-drawer-content" onClick={(e) => e.stopPropagation()}>
                        <AgriBotTab
                            t={t}
                            apiBaseUrl={API_BASE_URL}
                            currentLang={currentLang}
                            selectedCrop={selectedCrop}
                            onClose={() => setShowAgriBotModal(false)}
                        />
                    </div>
                </div>
            )}

            {/* AgriCentral Style Bottom Navigation Bar */}
            <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                t={t}
            />

            {/* Camera Modal Overlay */}
            {showCamera && (
                <div className="camera-overlay">
                    <div className="camera-container">
                        <video ref={videoRef} autoPlay playsInline />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div style={{ padding: 16, display: 'flex', gap: 12, justifyContent: 'center', background: '#004d40' }}>
                            <button className="btn btn-agri-primary" onClick={capturePhoto}>
                                📸 Snap Photo
                            </button>
                            <button className="btn btn-secondary" onClick={stopCamera}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
