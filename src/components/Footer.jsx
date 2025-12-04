import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const [showAds, setShowAds] = useState(false);
    const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    const adsenseAdSlot = import.meta.env.VITE_ADSENSE_AD_SLOT;

    useEffect(() => {
        // Only load AdSense if both client ID and ad slot are configured
        if (adsenseClientId && adsenseAdSlot && !window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-ad-client', adsenseClientId);
            document.head.appendChild(script);

            script.onload = () => {
                setShowAds(true);
                // Push ad after script loads
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error('AdSense error:', e);
                }
            };
        }
    }, [adsenseClientId, adsenseAdSlot]);

    return (
        <footer className="app-footer">
            {/* AdSense Banner - Only show if configured */}
            {showAds && adsenseClientId && adsenseAdSlot && (
                <div className="adsense-container">
                    <div className="ad-label">Advertisement</div>
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client={adsenseClientId}
                        data-ad-slot={adsenseAdSlot}
                        data-ad-format="horizontal"
                        data-full-width-responsive="true"
                    ></ins>
                </div>
            )}

            {/* Credits */}
            <div className="footer-credits">
                <p>Data provided by NBA.com & ESPN (Unofficial). Built for NBA fans.</p>
                <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', margin: '1rem 0', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <Link to="/about" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>About</Link>
                    <Link to="/faq" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>FAQ</Link>
                    <Link to="/glossary" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>Glossary</Link>
                    <span style={{ opacity: 0.5 }}>|</span>
                    <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>Privacy Policy</Link>
                    <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>Terms of Service</Link>
                </div>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} Head to Head NBA. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
