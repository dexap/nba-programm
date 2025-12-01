import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { fetchStandings, fetchTeamSchedule } from '../services/api';
import { saveToDatabase, getFromDatabase, isDataStale } from '../services/storage';

function ScheduleDifficulty() {
    const [gameCount, setGameCount] = useState(5);
    const [mode, setMode] = useState('future'); // 'future' or 'past'
    const [difficultyData, setDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const processData = (standingsData, schedulesData) => {
        const allTeams = [...standingsData.eastern, ...standingsData.western];
        const teamMap = {};
        allTeams.forEach(team => {
            teamMap[team.id] = team;
        });

        // Process Data
        const processed = schedulesData.map(({ teamId, schedule }) => {
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
    };

    const fetchDataFromApi = async () => {
        setIsRefreshing(true);
        try {
            // 1. Fetch Standings
            const standingsData = await fetchStandings();
            if (!standingsData) throw new Error("Failed to fetch standings");

            const allTeams = [...standingsData.eastern, ...standingsData.western];

            // 2. Fetch Schedules
            const promises = allTeams.map(async (team) => {
                const schedule = await fetchTeamSchedule(team.espnId);
                return { teamId: team.id, schedule };
            });

            const schedulesData = await Promise.all(promises);

            // 3. Save to DB
            saveToDatabase(standingsData, schedulesData);

            // 4. Update State
            const processed = processData(standingsData, schedulesData);
            setDifficultyData(processed);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setIsRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);

            // Check DB first
            const dbData = getFromDatabase();
            const stale = isDataStale();

            if (dbData && !stale) {
                console.log("Loading from Database (Cache Hit)");
                const processed = processData(dbData.standings, dbData.schedules);
                setDifficultyData(processed);
                setLastUpdated(new Date(dbData.lastUpdated));
                setLoading(false);
            } else {
                console.log("Cache miss or stale, fetching from API...");
                await fetchDataFromApi();
            }
        };

        init();
    }, [gameCount, mode]);

    const handleManualRefresh = () => {
        fetchDataFromApi();
    };

    return (
        <div className="difficulty-container">
            <SEO
                title="Schedule Difficulty"
                description="Analyze NBA schedule difficulty. See which teams have the toughest upcoming games or who survived the hardest past schedule."
                keywords="NBA schedule difficulty, strength of schedule, upcoming opponents, NBA analysis"
            />
            <PageHeader
                title="Schedule Difficulty"
                subtitle={mode === 'future'
                    ? 'See which teams have the toughest upcoming schedule'
                    : 'See which teams have played the toughest schedule recently'}
                lastUpdated={lastUpdated}
                onRefresh={handleManualRefresh}
                isRefreshing={isRefreshing}
            />

            <div className="controls-container">
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
