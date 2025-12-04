import React from 'react';
import TeamBadge from './TeamBadge';
import './GameCard.css';

function GameCard({ game, homeTeam, awayTeam, scoreData }) {
    const { totalScore, momentumFactor, netRatingFactor, homeAwayFactor } = scoreData;

    // Determine advantage
    const advantageTeam = totalScore > 0 ? homeTeam : awayTeam;
    const advantageValue = Math.abs(totalScore);
    const isNeutral = advantageValue < 0.05;

    // Color logic
    // Score is -1 to 1. 
    // We want to visualize where it falls.
    // Let's map -1 to 0% (Full Away), 0 to 50% (Neutral), 1 to 100% (Full Home)
    const barPercentage = ((totalScore + 1) / 2) * 100;

    const getFactorColor = (val) => {
        if (val > 0.05) return '#10b981'; // Green (Home Adv)
        if (val < -0.05) return '#ef4444'; // Red (Away Adv)
        return 'var(--text-secondary)';
    };

    const formatFactor = (val) => {
        const prefix = val > 0 ? '+' : '';
        return `${prefix}${val.toFixed(2)}`;
    };

    return (
        <div className="game-card">
            <div className="game-header">
                <span className="game-date">{new Date(game.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                <span className="vs-badge">VS</span>
            </div>

            <div className="game-teams">
                <div className="team-block">
                    <TeamBadge abbreviation={homeTeam.abbreviation} name={homeTeam.name} size="lg" />
                    <span className="team-name">{homeTeam.abbreviation}</span>
                    <span className="team-record">Home: {homeTeam.homeRecord}</span>
                </div>

                <div className="team-block">
                    <TeamBadge abbreviation={awayTeam.abbreviation} name={awayTeam.name} size="lg" />
                    <span className="team-name">{awayTeam.abbreviation}</span>
                    <span className="team-record">Road: {awayTeam.awayRecord}</span>
                </div>
            </div>

            <div className="score-section">
                <div className="score-label">Dynamic H2H Score</div>
                <div className="score-value" style={{ color: isNeutral ? 'var(--text-primary)' : (totalScore > 0 ? '#10b981' : '#ef4444') }}>
                    {totalScore > 0 ? '+' : ''}{totalScore.toFixed(2)}
                </div>
                <div className="advantage-text" style={{ color: isNeutral ? 'var(--text-secondary)' : (totalScore > 0 ? '#10b981' : '#ef4444') }}>
                    {isNeutral ? 'Neutral Matchup' : `${advantageTeam.abbreviation} Advantage`}
                </div>

                <div className="score-bar-container">
                    {/* Center Marker */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: 'rgba(255,255,255,0.3)', transform: 'translateX(-50%)', zIndex: 1 }}></div>

                    {/* Fill */}
                    <div
                        className="score-bar-fill"
                        style={{
                            left: totalScore > 0 ? '50%' : `${barPercentage}%`,
                            width: `${Math.abs(totalScore) * 50}%`, // Scale: 1.0 score = 50% width from center
                            backgroundColor: totalScore > 0 ? '#10b981' : '#ef4444'
                        }}
                    ></div>
                </div>
            </div>

            <div className="factors-grid">
                <div className="factor-item">
                    <span className="factor-label">Momentum</span>
                    <span className="factor-value" style={{ color: getFactorColor(momentumFactor) }}>
                        {formatFactor(momentumFactor)}
                    </span>
                </div>
                <div className="factor-item">
                    <span className="factor-label">Net Rating</span>
                    <span className="factor-value" style={{ color: getFactorColor(netRatingFactor) }}>
                        {formatFactor(netRatingFactor)}
                    </span>
                </div>
                <div className="factor-item">
                    <span className="factor-label">Home/Away</span>
                    <span className="factor-value" style={{ color: getFactorColor(homeAwayFactor) }}>
                        {formatFactor(homeAwayFactor)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default GameCard;
