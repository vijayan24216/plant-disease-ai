import React from 'react';

export default function Navigation({ activeTab, setActiveTab, t }) {
    const tabs = [
        { id: 'home', label: t.navHome, icon: '🏠' },
        { id: 'cropcare', label: t.navCropCare, icon: '🌿' },
        { id: 'market', label: t.navMarket, icon: '📊' },
        { id: 'pesticide', label: t.navPesticide || 'Pesticide', icon: '🧴' },
        { id: 'weather', label: t.navWeather, icon: '🌤️' },
        { id: 'bulletin', label: t.navBulletin, icon: '📰' },
    ];

    return (
        <nav className="tab-navigation">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                    {activeTab === tab.id && <span className="active-indicator" />}
                </button>
            ))}
        </nav>
    );
}
