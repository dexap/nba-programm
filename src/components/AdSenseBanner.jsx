import React, { useEffect } from 'react';

function AdSenseBanner({
    format = 'horizontal', // 'horizontal' or 'vertical'
    className = '',
    style = {}
}) {
    const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    const adsenseAdSlot = import.meta.env.VITE_ADSENSE_AD_SLOT;

    useEffect(() => {
        // Only load ads if configured
        if (adsenseClientId && adsenseAdSlot) {
            try {
                // Push ad
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
    }, [adsenseClientId, adsenseAdSlot]);

    // Don't render if not configured
    if (!adsenseClientId || !adsenseAdSlot) {
        return null;
    }

    const isHorizontal = format === 'horizontal';

    return (
        <div
            className={`adsense-banner ${className}`}
            style={{
                margin: isHorizontal ? '2rem 0' : '0',
                padding: '1rem',
                backgroundColor: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                ...style
            }}
        >
            <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                textAlign: 'center',
                opacity: 0.6
            }}>
                Advertisement
            </div>
            <ins
                className="adsbygoogle"
                style={{
                    display: 'block',
                    textAlign: 'center'
                }}
                data-ad-client={adsenseClientId}
                data-ad-slot={adsenseAdSlot}
                data-ad-format={isHorizontal ? 'horizontal' : 'vertical'}
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}

export default AdSenseBanner;
