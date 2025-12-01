import React, { useState, useEffect } from 'react';
import { fetchStandings, fetchTeamSchedule } from '../services/api';

function ScheduleDifficulty() {
    const [gameCount, setGameCount] = useState(5);
    const [mode, setMode] = useState('future'); // 'future' or 'past'
    const [difficultyData, setDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [standings, setStandings] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // 1. Fetch Standings to get team records and IDs
            const standingsData = await fetchStandings();
            if (!standingsData) {
                setLoading(false);
                return;
            }

            const allTeams = [...standingsData.eastern, ...standingsData.western];
            // Create a map for quick lookup of team stats by ID
            const teamMap = {};
            allTeams.forEach(team => {
                teamMap[team.id] = team;
            });
            setStandings(teamMap);

            // 2. Fetch Schedules for ALL teams
            const promises = allTeams.map(async (team) => {
                const schedule = await fetchTeamSchedule(team.espnId);
                return { teamId: team.id, schedule };
            });

            const schedules = await Promise.all(promises);

            // 3. Process Data
            const processedData = schedules.map(({ teamId, schedule }) => {
                const team = teamMap[teamId];

                let relevantGames = [];

                if (mode === 'future') {
                    // Filter for future games: Not completed, sort by date ASC
                    relevantGames = schedule.filter(game => {
                        const competition = game.competitions?.[0];
                        return competition && !competition.status.type.completed;
                    }).sort((a, b) => new Date(a.date) - new Date(b.date));
                } else {
                    // Filter for past games: Completed, sort by date DESC (most recent first)
                    relevantGames = schedule.filter(game => {
                        const competition = game.competitions?.[0];
                        return competition && competition.status.type.completed;
                    }).sort((a, b) => new Date(b.date) - new Date(a.date));
                }

                // Take next/last N games
                const gamesToAnalyze = relevantGames.slice(0, gameCount);

                // Calculate opponent stats
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
            });

            // Sort by difficulty (Opponent Win Pct Descending)
            processedData.sort((a, b) => b.opponentWinPct - a.opponentWinPct);

            setDifficultyData(processedData);
            setLoading(false);
        };

        loadData();
    }, [gameCount, mode]);

    return (
        <div className="difficulty-container">
            <header className="page-header">
                <h1>Schedule Difficulty Analyzer</h1>
                <p className="subtitle">
                    {mode === 'future'
                        ? 'See which teams have the toughest upcoming schedule'
                        : 'See which teams have played the toughest schedule recently'}
                </p>
            </header>

            <div className="controls-container">
                <div className="filter-group">
                    <span className="filter-label">Mode:</span>
                    <div className="button-group">
                        <button
                            className={`filter-btn ${mode === 'future' ? 'active' : ''}`}
                            onClick={() => setMode('future')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`filter-btn ${mode === 'past' ? 'active' : ''}`}
                            onClick={() => setMode('past')}
                        >
                            Past Results
                        </button>
                    </div>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Games to Analyze:</span>
                    <div className="button-group">
                        {[3, 5, 10, 15].map(count => (
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
                <div className="loading">Analyzing Schedules...</div>
            ) : (
                <div className="difficulty-table-wrapper">
                    <table className="difficulty-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Team</th>
                                <th>{mode === 'future' ? 'Upcoming' : 'Past'} Opponents</th>
                                <th>Difficulty Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {difficultyData.map((data, index) => (
                                <tr key={data.team.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="team-info">
                                            <img src={data.team.logo} alt={data.team.name} className="team-logo-small" />
                                            {data.team.name}
                                        </div>
                                    </td>
                                    <td className="opponents-cell">
                                        <div className="opponents-list">
                                            {data.opponentDetails.map((opp, idx) => (
                                                <div key={`${opp.id}-${idx}`} className="opponent-item">
                                                    <img src={opp.logo} alt={opp.abbreviation} className="opponent-logo" />
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
