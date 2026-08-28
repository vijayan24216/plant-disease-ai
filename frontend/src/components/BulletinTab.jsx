import React, { useState } from 'react';

const BULLETIN_ARTICLES = [
    {
        id: 1,
        category: 'Market Intelligence',
        title: 'Higher Maize Prices Could Keep Egg Prices Firm During Winter',
        summary: 'Growing demand for maize from ethanol producers is increasing pressure on India’s poultry industry as tighter supplies push up feed costs. Maize is a major component in poultry feed.',
        date: '28 August 2026',
        image: '🌽'
    },
    {
        id: 2,
        category: 'Crop Care Advisory',
        title: 'Monsoon Rice Sheath Blight Alert for Northern & Eastern Belts',
        summary: 'With high relative humidity exceeding 90% and continuous evening cloud cover, farmers are advised to monitor paddy leaf sheaths. Apply Validamycin or Hexaconazole early to stop fungal spread.',
        date: '28 August 2026',
        image: '🌾'
    },
    {
        id: 3,
        category: 'Weather & Irrigation',
        title: 'IMD Forecasts Moderate Rainfall in South Peninsular Regions',
        summary: 'Widespread rain expected over Tamil Nadu, Andhra Pradesh, and Karnataka over the next 4 days. Farmers are advised to clear drainage channels in tomato and pepper fields to avoid root rot.',
        date: '27 August 2026',
        image: '🌦️'
    },
    {
        id: 4,
        category: 'Government Scheme',
        title: 'PM-Kisan 17th Installment Disbursement Notification Released',
        summary: 'Direct benefit transfer for eligible farmers scheduled for early next month. Ensure e-KYC and bank account seedings are updated before the cutoff date.',
        date: '26 August 2026',
        image: '🏛️'
    }
];

export default function BulletinTab({ t }) {
    const [selectedArticle, setSelectedArticle] = useState(null);

    return (
        <div className="bulletin-container">
            <div className="glass-card bulletin-hero">
                <h2 className="card-header-title">
                    <span>📰</span> {t.bulletinHeader}
                </h2>
                <p className="app-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                    {t.bulletinSub}
                </p>
            </div>

            <div className="bulletin-grid">
                {BULLETIN_ARTICLES.map((article) => (
                    <div key={article.id} className="glass-card bulletin-card">
                        <div className="article-header-row">
                            <span className="article-category">{article.category}</span>
                            <span className="article-date">{article.date}</span>
                        </div>
                        <div className="article-main">
                            <div className="article-icon">{article.image}</div>
                            <div>
                                <h3 className="article-title">{article.title}</h3>
                                <p className="article-summary">{article.summary}</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary article-read-btn"
                            onClick={() => setSelectedArticle(article)}
                        >
                            {'Read Full Bulletin >'}
                        </button>
                    </div>
                ))}
            </div>

            {selectedArticle && (
                <div className="camera-overlay" onClick={() => setSelectedArticle(null)}>
                    <div className="glass-card article-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="article-category">{selectedArticle.category}</span>
                        <h2 className="article-title" style={{ fontSize: '1.4rem', margin: '10px 0' }}>
                            {selectedArticle.title}
                        </h2>
                        <p className="article-summary" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {selectedArticle.summary}
                        </p>
                        <div style={{ marginTop: 20, textAlignment: 'right' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedArticle(null)}>
                                Close Article
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
