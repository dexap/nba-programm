import React from 'react';
import './ContentSection.css';

function ContentSection({ title, children, className = '' }) {
    return (
        <div className={`content-section ${className}`}>
            {title && <h2 className="content-section-title">{title}</h2>}
            <div className="content-section-body">
                {children}
            </div>
        </div>
    );
}

export default ContentSection;
