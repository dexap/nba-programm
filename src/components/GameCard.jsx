import React from 'react';
import TeamBadge, { BADGE_ABBREVIATION_MAP } from './TeamBadge';
import { getTeamColors } from '../utils/teamColors';
import InjuryReport from './InjuryReport';
import ScoreSection from './ScoreSection';
import FactorItem from './FactorItem';
import './GameCard.css';

function GameCard({ game, homeTeam, awayTeam, scoreData, homeInjuries, awayInjuries }) {
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
        return getTeamColors(BADGE_ABBREVIATION_MAP[team.abbreviation]).alternative;
    };

    return (
        <div className="game-card">
            <div className="game-header">
                <span className="game-date">
                    {new Date(game.date).toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZoneName: 'short'
                    })}
                </span>
            </div>

            <div className="game-teams">
                <div className="team-block">
                    <TeamBadge abbreviation={awayTeam.abbreviation} name={awayTeam.name} size="lg" />
                    <span className="team-name">{awayTeam.name.split(' ').pop()}</span>
                    {awayTeam.last5Games && (
                        <div className="team-last5">
                            {awayTeam.last5Games.split('-').map((result, idx) => (
                                <span
                                    key={idx}
                                    className={`last5-result ${result === 'W' ? 'win' : 'loss'}`}
                                >
                                    {result}
                                </span>
                            ))}

                        </div>
                    )}
                    <span className="team-record">Road: {awayTeam.awayRecord}</span>
                    {awayTeam.netRating !== undefined && (
                        <span className="team-record">
                            Net: {awayTeam.netRating > 0 ? '+' : ''}{awayTeam.netRating.toFixed(1)}
                        </span>
                    )}
                </div>
                <div className="vs-badge">@</div>
                <div className="team-block">
                    <TeamBadge abbreviation={homeTeam.abbreviation} name={homeTeam.name} size="lg" />
                    <span className="team-name">{homeTeam.name.split(' ').pop()}</span>
                    {homeTeam.last5Games && (
                        <div className="team-last5">
                            {homeTeam.last5Games.split('-').map((result, idx) => (
                                <span
                                    key={idx}
                                    className={`last5-result ${result === 'W' ? 'win' : 'loss'}`}
                                >
                                    {result}
                                </span>
                            ))}
                        </div>
                    )}
                    <span className="team-record">Home: {homeTeam.homeRecord}</span>
                    {homeTeam.netRating !== undefined && (
                        <span className="team-record">
                            Net: {homeTeam.netRating > 0 ? '+' : ''}{homeTeam.netRating.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>

            <ScoreSection
                totalScore={totalScore}
                primaryColor={primaryColor}
                isNeutral={isNeutral}
                advantageTeam={advantageTeam}
            />

            <div className="factors-grid">
                <FactorItem
                    label="Momentum"
                    value={momentumFactor}
                    color={getFactorColor(momentumFactor)}
                />
                <FactorItem
                    label="Net Rating"
                    value={netRatingFactor}
                    color={getFactorColor(netRatingFactor)}
                />
                <FactorItem
                    label="Home/Away"
                    value={homeAwayFactor}
                    color={getFactorColor(homeAwayFactor)}
                />
            </div>

            {/* Injury Reports Section */}
            {(awayInjuries?.length > 0 || homeInjuries?.length > 0) && (
                <div className="injury-reports-section">
                    {awayInjuries && awayInjuries.length > 0 && (
                        <InjuryReport
                            injuries={awayInjuries}
                            teamName={awayTeam.name.split(' ').pop()}
                        />
                    )}
                    {homeInjuries && homeInjuries.length > 0 && (
                        <InjuryReport
                            injuries={homeInjuries}
                            teamName={homeTeam.name.split(' ').pop()}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default GameCard;
