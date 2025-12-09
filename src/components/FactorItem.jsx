import React from 'react';

function FactorItem({ label, value, color }) {
    // Format factor with arrow
    const formatFactor = (val) => {
        const arrow = val < 0 ? '← ' : ' →';
        const text = Math.abs(val).toFixed(2);

        if (Math.abs(val) < 0.05) {
            return text;
        }

        return val < 0 ? `${arrow}${text}` : `${text}${arrow}`;
    };

    return (
        <div className="factor-item">
            <span className="factor-label">{label}</span>
            <span className="factor-value" style={{ color }}>
                {formatFactor(value)}
            </span>
        </div>
    );
}

export default FactorItem;
