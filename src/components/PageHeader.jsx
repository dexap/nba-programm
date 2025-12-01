import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function PageHeader({ onRefresh, isRefreshing }) {
    const location = useLocation();

    return (
        <header className="page-header sticky-header">
            <div className="header-content">
                {/* Left: Logo & Title */}
                <Link to="/" className="header-brand">
                    <img src="/h2h_logo.png" alt="NBA H2H Logo" className="header-logo" />
                    <span className="header-title">NBA H2H</span>
                </Link>

                {/* Center: Navigation */}
                <nav className="header-nav">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Standings
                    </Link>
                    <Link to="/difficulty" className={`nav-link ${location.pathname === '/difficulty' ? 'active' : ''}`}>
                        Schedule Difficulty
                    </Link>
                </nav>

                {/* Right: Refresh Button (only show if onRefresh is provided) */}
                <div className="header-actions">
                    {onRefresh && (
                        <button
                            className="refresh-btn-icon"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={isRefreshing ? 'animate-spin' : ''}
                            >
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default PageHeader;
