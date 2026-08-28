import React, { useState, useRef, useEffect } from 'react';

export default function AgriBotTab({ t, apiBaseUrl, currentLang, onClose }) {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Hello! I am Agri-Bot, your AI agricultural advisory assistant. Ask me any questions about crop diseases, chemical pesticide dosages, organic remedies, or live mandi prices!'
        }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [currentlySpeakingIndex, setCurrentlySpeakingIndex] = useState(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Text-to-Speech Voice Assistant Output
    const speakText = (text, index = null) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const cleanText = text.replace(/[*#•]/g, '').replace(/(\r\n|\n|\r)/gm, ' ');
        const utterance = new SpeechSynthesisUtterance(cleanText);

        const langMap = {
            en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
            bn: 'bn-IN', mr: 'mr-IN', es: 'es-ES', fr: 'fr-FR'
        };
        utterance.lang = langMap[currentLang] || 'en-US';
        utterance.rate = 0.95;

        if (index !== null) {
            setCurrentlySpeakingIndex(index);
        }

        utterance.onend = () => setCurrentlySpeakingIndex(null);
        utterance.onerror = () => setCurrentlySpeakingIndex(null);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        setCurrentlySpeakingIndex(null);
    };

    const handleSend = async (textToSend) => {
        const query = textToSend || inputMsg;
        if (!query.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: query }];
        setMessages(newMessages);
        setInputMsg('');
        setLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/bot/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query, language: currentLang })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => [
                    ...prev,
                    { sender: 'bot', text: data.reply, source: data.source }
                ]);
                if (voiceEnabled) {
                    speakText(data.reply);
                }
            } else {
                throw new Error('Bot response failed');
            }
        } catch (err) {
            const errorMsg = 'Sorry, I am having trouble connecting to the advisory server. Please check your connection or try again.';
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: errorMsg }
            ]);
            if (voiceEnabled) {
                speakText(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    // Web Speech API - Speech-to-Text Voice Input
    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported in this browser. Try Google Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        const langMap = {
            en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
            bn: 'bn-IN', mr: 'mr-IN', es: 'es-ES', fr: 'fr-FR'
        };
        recognition.lang = langMap[currentLang] || 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputMsg(transcript);
            setIsListening(false);
            handleSend(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <div className="agribot-full-workspace">
            {/* Unified Top Header Bar */}
            <div className="agribot-top-header">
                <div className="header-bot-info">
                    <div className="bot-avatar-badge">🤖</div>
                    <div>
                        <h3 className="bot-header-title">{t.botHeader || 'Agri-Bot AI Assistant'}</h3>
                        <div className="bot-status-line">
                            <span className="status-dot" />
                            <span>Online • Crop Advisory Engine</span>
                        </div>
                    </div>
                </div>

                <div className="header-controls">
                    <button
                        className={`voice-toggle-pill ${voiceEnabled ? 'active' : 'muted'}`}
                        onClick={() => {
                            if (voiceEnabled) stopSpeech();
                            setVoiceEnabled(!voiceEnabled);
                        }}
                        title="Toggle automatic voice speech readout"
                    >
                        {voiceEnabled ? '🔊 Voice ON' : '🔇 Muted'}
                    </button>

                    {onClose && (
                        <button className="agribot-close-btn" onClick={onClose} title="Close drawer">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="agribot-messages-feed">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`agribot-msg-row ${msg.sender}`}>
                        <div className="msg-avatar">{msg.sender === 'bot' ? '🤖' : '👨‍🌾'}</div>
                        <div className="msg-bubble">
                            <p className="msg-text">{msg.text}</p>

                            <div className="msg-footer">
                                {msg.source && <span className="msg-source-tag">✓ {msg.source}</span>}
                                {msg.sender === 'bot' && (
                                    <button
                                        className={`listen-btn ${currentlySpeakingIndex === idx ? 'speaking' : ''}`}
                                        onClick={() => {
                                            if (currentlySpeakingIndex === idx) {
                                                stopSpeech();
                                            } else {
                                                speakText(msg.text, idx);
                                            }
                                        }}
                                    >
                                        {currentlySpeakingIndex === idx ? '⏹️ Stop' : '🔊 Listen Solution'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="agribot-msg-row bot">
                        <div className="msg-avatar">🤖</div>
                        <div className="msg-bubble loading-bubble">
                            <div className="typing-dots">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Active Speech-to-Text Listening Banner */}
            {isListening && (
                <div className="voice-listening-banner">
                    <span className="listening-pulse-dot" />
                    <span>🎙️ Listening to your voice... Speak your crop question clearly!</span>
                </div>
            )}

            {/* Single Horizontal Input Dock */}
            <div className="agribot-input-dock">
                <button
                    className={`btn-voice-mic ${isListening ? 'active' : ''}`}
                    onClick={startVoiceInput}
                    title="Voice Speech-to-Text Input"
                >
                    🎙️ {isListening ? 'Listening...' : 'Voice Chat'}
                </button>

                <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? '🎙️ Listening to voice...' : 'Ask crop, disease, or pesticide question...'}
                    className="agribot-text-input"
                />

                <button
                    className="btn-agribot-send"
                    onClick={() => handleSend()}
                    disabled={!inputMsg.trim() || loading}
                >
                    Send ➢
                </button>
            </div>
        </div>
    );
}
