import React from 'react';
import { LANGUAGES } from '../translations';

export default function Header({ currentLang, setLang, apiOnline, t, user, onOpenAuthModal, onLogout }) {
    return (
        <header className="agripulse-header">
            <div className="header-brand-row">
                <div className="brand-logo-group">
                    <div className="agri-logo-symbol">🌱</div>
                    <div>
                        <h1 className="brand-title">AgriPulse <span className="ai-badge">AI</span></h1>
                        <span className="brand-sub">Agricultural Intelligence Suite</span>
                    </div>
                </div>

                <div className="header-right-actions">
                    {/* Live Status Pill */}
                    <div className={`status-pill ${apiOnline ? 'online' : 'offline'}`}>
                        <span className="status-dot" />
                        {apiOnline ? 'AI Connected' : 'Offline Mode'}
                    </div>

                    {/* Language Switcher */}
                    <div className="language-selector-wrapper">
                        <span className="lang-icon">🌐</span>
                        <select
                            value={currentLang}
                            onChange={(e) => setLang(e.target.value)}
                            className="language-dropdown"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* User Auth Pill / Login Button */}
                    {user ? (
                        <div className="user-profile-pill" onClick={onLogout} title="Click to Logout">
                            <span className="user-icon">🧑‍🌾</span>
                            <span className="user-phone">{user.phone}</span>
                            <span className="logout-tooltip">Logout</span>
                        </div>
                    ) : (
                        <button className="auth-login-btn" onClick={onOpenAuthModal}>
                            🔑 Login
                        </button>
                    )}

                    <button className="icon-btn" title="Notifications">
                        🔔
                    </button>
                </div>
            </div>
        </header>
    );
}
