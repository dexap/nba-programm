import React from 'react';
import './FeatureGrid.css';

function FeatureGrid({ children }) {
    return (
        <div className="feature-grid">
            {children}
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="feature-card">
            {icon && <div className="feature-icon">{icon}</div>}
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
}

FeatureGrid.Card = FeatureCard;

export default FeatureGrid;
