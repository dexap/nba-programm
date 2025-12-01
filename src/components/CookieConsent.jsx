import React, { useState, useEffect } from 'react';
import './CookieConsent.css'; // We'll create this specifically for the complex styles

const COOKIE_STORAGE_KEY = 'nba_cookie_consent';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true and disabled
        analytics: false,
        marketing: false
    });

    useEffect(() => {
        const savedConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
        if (!savedConsent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        } else {
            // Load saved preferences
            setPreferences(JSON.parse(savedConsent));
        }
    }, []);

    const handleAcceptAll = () => {
        const allEnabled = { necessary: true, analytics: true, marketing: true };
        savePreferences(allEnabled);
    };

    const handleRejectAll = () => {
        const allDisabled = { necessary: true, analytics: false, marketing: false };
        savePreferences(allDisabled);
    };

    const handleSaveSettings = () => {
        savePreferences(preferences);
    };

    const savePreferences = (prefs) => {
        localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
        setPreferences(prefs);
        setIsVisible(false);
        setShowSettings(false);

        // Here you would trigger/disable actual tracking scripts based on 'prefs'
        // e.g., if (prefs.analytics) enableGoogleAnalytics();
        console.log("Cookie preferences saved:", prefs);
    };

    const togglePreference = (key) => {
        if (key === 'necessary') return;
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Main Banner */}
            {!showSettings && (
                <div className="cookie-banner">
                    <div className="cookie-content">
                        <h3>We value your privacy</h3>
                        <p>
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                            By clicking "Accept All", you consent to our use of cookies.
                            Our "Database" feature uses local storage to cache data for performance, which is classified as necessary.
                            {' '}
                            <a href="/privacy" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Learn more in our Privacy Policy</a>.
                        </p>
                    </div>
                    <div className="cookie-actions">
                        <button className="cookie-btn outline" onClick={() => setShowSettings(true)}>Customize</button>
                        <button className="cookie-btn outline" onClick={handleRejectAll}>Reject All</button>
                        <button className="cookie-btn primary" onClick={handleAcceptAll}>Accept All</button>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="cookie-modal-overlay">
                    <div className="cookie-modal">
                        <div className="cookie-modal-header">
                            <h3>Cookie Preferences</h3>
                            <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
                        </div>
                        <div className="cookie-modal-body">
                            <p className="modal-desc">
                                Customize your cookie preferences. Necessary cookies are required for the website to function properly.
                            </p>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="pref-title">Strictly Necessary</span>
                                    <span className="pref-desc">Required for the website to function (e.g., caching standings data). Cannot be disabled.</span>
                                </div>
                                <div className="toggle-switch disabled">
                                    <input type="checkbox" checked={true} disabled />
                                    <span className="slider"></span>
                                </div>
                            </div>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="pref-title">Analytics</span>
                                    <span className="pref-desc">Help us understand how visitors interact with the website.</span>
                                </div>
                                <div className="toggle-switch" onClick={() => togglePreference('analytics')}>
                                    <input type="checkbox" checked={preferences.analytics} readOnly />
                                    <span className="slider"></span>
                                </div>
                            </div>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <span className="pref-title">Marketing</span>
                                    <span className="pref-desc">Used to display relevant ads to you.</span>
                                </div>
                                <div className="toggle-switch" onClick={() => togglePreference('marketing')}>
                                    <input type="checkbox" checked={preferences.marketing} readOnly />
                                    <span className="slider"></span>
                                </div>
                            </div>
                        </div>
                        <div className="cookie-modal-footer">
                            <button className="cookie-btn outline" onClick={handleRejectAll}>Reject All</button>
                            <button className="cookie-btn primary" onClick={handleSaveSettings}>Save Preferences</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
