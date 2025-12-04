import React from 'react';
import TeamBadge, { BADGE_ABBREVIATION_MAP } from './TeamBadge';
import { getTeamColors } from '../utils/teamColors';
import './GameCard.css';

function GameCard({ game, homeTeam, awayTeam, scoreData }) {
    const { totalScore, momentumFactor, netRatingFactor, homeAwayFactor } = scoreData;

    // Determine advantage
    const advantageTeam = totalScore > 0 ? homeTeam : awayTeam;
    const advantageValue = Math.abs(totalScore);
    const isNeutral = advantageValue < 0.05;

    // Get colors
    const advantageColors = getTeamColors(BADGE_ABBREVIATION_MAP[advantageTeam.abbreviation]);
    const primaryColor = isNeutral ? 'var(--text-secondary)' : advantageColors.alternative;

    // Color logic for factors
    const getFactorColor = (val) => {
        if (Math.abs(val) < 0.05) return 'var(--text-secondary)';
        // If val > 0 (Home Adv), use Home Color. If val < 0 (Away Adv), use Away Color.
        const team = val > 0 ? homeTeam : awayTeam;
        return getTeamColors(team.abbreviation).alternative;
    };

    const formatFactor = (val) => {
        const prefix = val > 0 ? '+' : '';
        return `${prefix}${val.toFixed(2)}`;
    };

    return (
        <div className="game-card">
            <div className="game-header">
                <span className="game-date">{new Date(game.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="game-teams">


                <div className="team-block">
                    <TeamBadge abbreviation={awayTeam.abbreviation} name={awayTeam.name} size="lg" />
                    <span className="team-name">{awayTeam.name.split(' ').pop()}</span>
                    <span className="team-record">Road: {awayTeam.awayRecord}</span>
                </div>
                <div>@</div>
                <div className="team-block">
                    <TeamBadge abbreviation={homeTeam.abbreviation} name={homeTeam.name} size="lg" />
                    <span className="team-name">{homeTeam.name.split(' ').pop()}</span>
                    <span className="team-record">Home: {homeTeam.homeRecord}</span>
                </div>
            </div>

            <div className="score-section">
                <div className="score-value" style={{ color: primaryColor }}>
                    {totalScore.toFixed(2)}
                </div>
                <div className="advantage-text" style={{ color: primaryColor }}>
                    {isNeutral ? 'Neutral Matchup' : `${advantageTeam.name} Advantage`}
                </div>

                <div className="score-bar-container">
                    {/* Center Marker */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: 'rgba(255,255,255,0.1)', transform: 'translateX(-50%)', zIndex: 1 }}></div>

                    {/* Fill */}
                    {/* 
                        If Home (Left) has advantage (Score > 0): Bar grows from Center to Right.
                        If Away (Right) has advantage (Score < 0): Bar grows from Center to Left.
                    */}
                    <div
                        className="score-bar-fill"
                        style={{
                            left: totalScore > 0 ? '50%' : 'auto',
                            right: totalScore > 0 ? 'auto' : '50%',
                            width: `${Math.abs(totalScore) * 50}%`, // Scale: 1.0 score = 50% width from center
                            backgroundColor: primaryColor,
                            borderRadius: totalScore > 0 ? '0 4px 4px 0' : '4px 0 0 4px'
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
