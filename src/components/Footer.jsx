import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    useEffect(() => {
        // Load AdSense script if not already loaded
        if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            // TODO: Replace with your actual AdSense client ID
            script.setAttribute('data-ad-client', 'ca-pub-2753663026729082');
            document.head.appendChild(script);
        }

        // Push ad after script loads
        try {
            if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <footer className="app-footer">
            {/* AdSense Banner */}
            <div className="adsense-container">
                <div className="ad-label">Advertisement</div>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-2753663026729082"
                    data-ad-slot="YYYYYYYYYY"
                    data-ad-format="horizontal"
                    data-full-width-responsive="true"
                ></ins>
            </div>

            {/* Credits */}
            <div className="footer-credits">
                <p>Data provided by NBA.com & ESPN (Unofficial). Built for NBA fans.</p>
                <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', margin: '1rem 0', fontSize: '0.85rem' }}>
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
