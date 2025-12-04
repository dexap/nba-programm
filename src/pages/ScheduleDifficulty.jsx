import React, { useState, useMemo, useEffect } from 'react';
import SEO from '../components/SEO';
import TeamBadge from '../components/TeamBadge';
import AdSenseBanner from '../components/AdSenseBanner';
import ContentSection from '../components/ContentSection';
import FeatureGrid from '../components/FeatureGrid';
import DifficultyTable from '../components/DifficultyTable';

function ScheduleDifficulty({ standings, schedules, loading }) {
    const [gameCount, setGameCount] = useState(5);
    const [mode, setMode] = useState('future'); // 'future' or 'past'
    const [showVerticalAd, setShowVerticalAd] = useState(false);

    // Check screen width for vertical ad display
    useEffect(() => {
        const checkWidth = () => {
            setShowVerticalAd(window.innerWidth >= 1750);
        };

        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, []);

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
                keywords="NBA schedule difficulty, strength of schedule, upcoming opponents, past opponents, NBA analysis"
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
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 82].map(count => (
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
                <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Main Table - Centered */}
                    <DifficultyTable difficultyData={difficultyData} mode={mode} />

                    {/* Vertical AdSense Banner - Positioned on the right */}
                    {showVerticalAd && (
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            right: '-320px',
                            width: '300px'
                        }}>
                            <AdSenseBanner format="vertical" />
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            {!loading && (
                <ContentSection title="Understanding Schedule Difficulty">
                    <FeatureGrid>
                        <FeatureGrid.Card
                            icon=""
                            title="How it Works"
                            description="We calculate the combined win percentage of a team's upcoming opponents. A higher percentage signifies a tougher schedule."
                        />
                        <FeatureGrid.Card
                            icon=""
                            title="Playoff Race"
                            description="Teams with easier schedules may climb standings faster."
                        />
                        <FeatureGrid.Card
                            icon=""
                            title="Betting & Fantasy"
                            description="Predict performance dips or surges based on opponent strength."
                        />
                        <FeatureGrid.Card
                            icon=""
                            title="Strategic Analysis"
                            description="Understand which teams are tested by tough competition."
                        />
                        <FeatureGrid.Card
                            icon=""
                            title="Rest & Rotation"
                            description="Teams facing tough stretches may rest key players."
                        />
                        <FeatureGrid.Card
                            icon=""
                            title="Using the Filters"
                            description="You can use the filters to view schedule difficulty for time periods in the past or future."
                        />
                    </FeatureGrid>
                </ContentSection>
            )}
        </div>
    );
}

export default ScheduleDifficulty;
