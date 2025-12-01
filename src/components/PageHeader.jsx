import React from 'react';

function PageHeader({ title, subtitle, lastUpdated, onRefresh, isRefreshing }) {
    return (
        <header className="page-header">
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
            <div className="db-status">
                {lastUpdated && <span className="last-updated">Last Updated: {lastUpdated.toLocaleTimeString()}</span>}
                <button
                    className="refresh-btn"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? 'Refreshing...' : 'Manual Reload'}
                </button>
            </div>
        </header>
    );
}

export default PageHeader;
