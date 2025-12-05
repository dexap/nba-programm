import React, { useMemo, useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import ContentSection from '../components/ContentSection';
import SEO from '../components/SEO';
import { getTeamInjuryReport } from '../services/injuries';

function NextGame({ standings, schedules, loading }) {
    const [injuriesData, setInjuriesData] = useState({});

    // Helper to parse record string "10-5" -> win pct
    const parseRecord = (recordStr) => {
        if (!recordStr) return 0;
        const [w, l] = recordStr.split('-').map(Number);
        if (isNaN(w) || isNaN(l) || (w + l) === 0) return 0;
        return w / (w + l);
    };


    // Refined Momentum Helper
    const getLast5Wins = (schedule, teamId) => {
        if (!schedule) return 0;
        const completedGames = schedule.filter(g =>
            g.competitions?.[0]?.status?.type?.completed
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        const last5 = completedGames.slice(0, 5);
        let wins = 0;

        last5.forEach(game => {
            const competition = game.competitions[0];
            const competitor = competition.competitors.find(c => c.team.id === teamId);
            if (competitor && competitor.winner) {
                wins += 1;
            }
        });
        return wins;
    };

    // Get Last 5 Games as String (e.g., "W-L-W-W-L")
    const getLast5GamesString = (schedule, teamId) => {
        if (!schedule) return '';
        const completedGames = schedule.filter(g =>
            g.competitions?.[0]?.status?.type?.completed
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        const last5 = completedGames.slice(0, 5);
        const results = last5.map(game => {
            const competition = game.competitions[0];
            const competitor = competition.competitors.find(c => c.team.id === teamId);
            return competitor && competitor.winner ? 'W' : 'L';
        }).reverse(); // Reverse the array to show oldest to newest

        return results.join('-');
    };

    // Fetch injuries for all teams
    useEffect(() => {
        const fetchAllInjuries = async () => {
            if (loading || !standings.eastern.length || !standings.western.length) {
                return;
            }

            const allTeams = [...standings.eastern, ...standings.western];
            const injuriesMap = {};

            // Fetch injuries for all teams in parallel
            await Promise.all(
                allTeams.map(async (team) => {
                    try {
                        const injuries = await getTeamInjuryReport(team.id);
                        injuriesMap[team.id] = injuries;
                    } catch (error) {
                        console.error(`Failed to fetch injuries for team ${team.id}:`, error);
                        injuriesMap[team.id] = [];
                    }
                })
            );

            setInjuriesData(injuriesMap);
        };

        fetchAllInjuries();
    }, [standings, loading]);

    const analysisData = useMemo(() => {
        // Wait until we have both standings and schedules data
        if (loading) return [];
        if (!standings.eastern.length || !standings.western.length) return [];
        if (!schedules.length) return [];

        // Additional check: ensure schedules actually have data
        const hasScheduleData = schedules.some(s => s.schedule && s.schedule.length > 0);
        if (!hasScheduleData) return [];

        const allTeams = [...standings.eastern, ...standings.western];
        const teamMap = {};
        allTeams.forEach(t => teamMap[t.id] = t);

        const scheduleMap = {};
        schedules.forEach(s => scheduleMap[s.teamId] = s.schedule);

        // Find upcoming games
        // We iterate through all teams, find their next game.
        // To avoid duplicates (A vs B and B vs A), we can use a set of game IDs.
        const processedGameIds = new Set();
        const upcomingGames = [];

        allTeams.forEach(team => {
            const schedule = scheduleMap[team.id];
            if (!schedule) return;

            // Find next uncompleted game
            const nextGame = schedule.find(g =>
                !g.competitions?.[0]?.status?.type?.completed
            );

            if (!nextGame) return;

            const gameId = nextGame.id;
            if (processedGameIds.has(gameId)) return;
            processedGameIds.add(gameId);

            const competition = nextGame.competitions[0];
            const homeComp = competition.competitors.find(c => c.homeAway === 'home');
            const awayComp = competition.competitors.find(c => c.homeAway === 'away');

            const homeTeam = teamMap[homeComp.team.id];
            const awayTeam = teamMap[awayComp.team.id];

            if (!homeTeam || !awayTeam) return;

            // --- CALCULATIONS ---

            // 1. Momentum Factor (F_MOM)
            // S_Team = Wins in last 5
            const sHome = getLast5Wins(scheduleMap[homeTeam.id], homeTeam.id);
            const sAway = getLast5Wins(scheduleMap[awayTeam.id], awayTeam.id);
            const fMom = (sHome - sAway) / 5;

            // 2. Net Rating Factor (F_NET)
            // Using Point Differential as proxy
            const diffHome = parseFloat(homeTeam.differential || 0);
            const diffAway = parseFloat(awayTeam.differential || 0);
            const fNet = (diffHome - diffAway) / 15;

            // 3. Home/Away Factor (F_H/A)
            const homeWinPct = parseRecord(homeTeam.homeRecord);
            const awayWinPct = parseRecord(awayTeam.awayRecord);
            const fHA = homeWinPct - awayWinPct;

            // Weighted Sum
            // Weights: Mom=0.3, Net=0.4, HA=0.3
            const totalScore = (0.3 * fMom) + (0.4 * fNet) + (0.3 * fHA);

            // Get Last 5 Games String for both teams
            const homeLast5 = getLast5GamesString(scheduleMap[homeTeam.id], homeTeam.id);
            const awayLast5 = getLast5GamesString(scheduleMap[awayTeam.id], awayTeam.id);

            upcomingGames.push({
                game: nextGame,
                homeTeam: {
                    ...homeTeam,
                    last5Games: homeLast5,
                    netRating: diffHome
                },
                awayTeam: {
                    ...awayTeam,
                    last5Games: awayLast5,
                    netRating: diffAway
                },
                scoreData: {
                    totalScore,
                    momentumFactor: fMom,
                    netRatingFactor: fNet,
                    homeAwayFactor: fHA
                }
            });
        });

        // Sort by date
        return upcomingGames.sort((a, b) => new Date(a.game.date) - new Date(b.game.date));

    }, [standings, schedules, loading]);

    return (
        <div className="content-container">
            <SEO
                title="Next Game Analysis - NBA H2H"
                description="Dynamic Head-to-Head analysis for upcoming NBA games using Momentum, Net Rating, and Home/Away performance."
            />

            <ContentSection title="Next Game Analysis">
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Our <strong>Dynamic H2H Score</strong> predicts the advantage for the home team based on three key factors:
                    Momentum (Last 5), Net Rating (Season Strength), and Home/Away Performance.
                </p>

                {loading || analysisData.length === 0 ? (
                    <div className="loading">Loading Analysis...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
                        {analysisData.map(data => (
                            <GameCard
                                key={data.game.id}
                                game={data.game}
                                homeTeam={data.homeTeam}
                                awayTeam={data.awayTeam}
                                scoreData={data.scoreData}
                                homeInjuries={injuriesData[data.homeTeam.id] || []}
                                awayInjuries={injuriesData[data.awayTeam.id] || []}
                            />
                        ))}
                    </div>
                )}
            </ContentSection>
        </div>
    );
}

export default NextGame;
