import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import TeamBadge from '../components/TeamBadge';

function ScheduleDifficulty({ standings, schedules, loading }) {
    const [gameCount, setGameCount] = useState(5);
    const [mode, setMode] = useState('future'); // 'future' or 'past'

    const difficultyData = useMemo(() => {
        if (!standings.eastern.length || !schedules.length) return [];

        const allTeams = [...standings.eastern, ...standings.western];
        const teamMap = {};
        allTeams.forEach(team => {
            teamMap[team.id] = team;
        });

        // Convert schedules array to map if needed, or just iterate if schedules is array of {teamId, schedule}
        // The props 'schedules' is an array of {teamId, schedule}

        const processed = schedules.map(({ teamId, schedule }) => {
            const team = teamMap[teamId];
            if (!team) return null;

            let relevantGames = [];

            if (mode === 'future') {
                relevantGames = schedule.filter(game => {
                    const competition = game.competitions?.[0];
                    return competition && !competition.status.type.completed;
                }).sort((a, b) => new Date(a.date) - new Date(b.date));
            } else {
                relevantGames = schedule.filter(game => {
                    const competition = game.competitions?.[0];
                    return competition && competition.status.type.completed;
                }).sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            const gamesToAnalyze = relevantGames.slice(0, gameCount);

            let opponentWins = 0;
            let opponentLosses = 0;
            const opponentDetails = [];

            gamesToAnalyze.forEach(game => {
                const competition = game.competitions[0];
                const opponent = competition.competitors.find(c => c.team.id !== team.espnId)?.team;

                if (opponent && teamMap[opponent.id]) {
                    const oppStats = teamMap[opponent.id];
                    opponentWins += oppStats.wins;
                    opponentLosses += oppStats.losses;
                    opponentDetails.push({
                        id: oppStats.id,
                        logo: oppStats.logo,
                        abbreviation: oppStats.abbreviation,
                        record: `${oppStats.wins}-${oppStats.losses}`
                    });
                }
            });

            const totalOpponentGames = opponentWins + opponentLosses;
            const opponentWinPct = totalOpponentGames > 0 ? (opponentWins / totalOpponentGames) : 0;

            return {
                team,
                opponentWins,
                opponentLosses,
                opponentWinPct,
                opponentDetails,
                gamesCount: gamesToAnalyze.length
            };
        }).filter(Boolean);

        processed.sort((a, b) => b.opponentWinPct - a.opponentWinPct);
        return processed;
    }, [standings, schedules, mode, gameCount]);

    return (
        <div className="difficulty-container">
            <SEO
                title="Schedule Difficulty"
                description="Analyze NBA schedule difficulty. See which teams have the toughest upcoming games or who survived the hardest past schedule."
                keywords="NBA schedule difficulty, strength of schedule, upcoming opponents, NBA analysis"
            />

            {/* PageHeader is now in App.jsx */}

            <div className="controls-container" style={{ marginTop: '2rem' }}>
                <div className="filter-group">
                    <span className="filter-label"></span>
                    <div className="button-group">
                        <button
                            className={`filter-btn ${mode === 'future' ? 'active' : ''}`}
                            onClick={() => setMode('future')}
                        >
                            Upcoming Games
                        </button>
                        <button
                            className={`filter-btn ${mode === 'past' ? 'active' : ''}`}
                            onClick={() => setMode('past')}
                        >
                            Past Games
                        </button>
                    </div>
                </div>

                <div className="filter-group">
                    <span className="filter-label"></span>
                    <div className="button-group">
                        {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(count => (
                            <button
                                key={count}
                                className={`filter-btn ${gameCount === count ? 'active' : ''}`}
                                onClick={() => setGameCount(count)}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading Data...</div>
            ) : (
                <div className="difficulty-table-wrapper">
                    <table className="difficulty-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Team</th>
                                <th style={{ paddingLeft: '2.5rem' }}>{mode === 'future' ? 'Upcoming' : 'Past'} Opponents</th>
                                <th>Difficulty Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {difficultyData.map((data, index) => (
                                <tr key={data.team.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="team-info">
                                            <TeamBadge abbreviation={data.team.abbreviation} name={data.team.name} size="md" />
                                            {data.team.name}
                                        </div>
                                    </td>
                                    <td className="opponents-cell">
                                        <div className="opponents-list">
                                            {data.opponentDetails.map((opp, idx) => (
                                                <div key={`${opp.id}-${idx}`} className="opponent-item">
                                                    <TeamBadge abbreviation={opp.abbreviation} name={opp.abbreviation} size="md" />
                                                    <span className="opponent-record">{opp.record}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="difficulty-score-cell">
                                        <div className={`difficulty-box ${data.opponentWinPct > 0.55 ? 'hard' : data.opponentWinPct < 0.45 ? 'easy' : 'medium'}`}>
                                            <span className="difficulty-percent">{(data.opponentWinPct * 100).toFixed(1)}%</span>
                                            <span className="difficulty-record">{data.opponentWins}-{data.opponentLosses}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ScheduleDifficulty;
