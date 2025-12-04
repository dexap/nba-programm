import React, { useState, useMemo } from 'react';
import StandingsTable from '../components/StandingsTable';
import AdSenseBanner from '../components/AdSenseBanner';
import SEO from '../components/SEO';
import { getHeadToHead } from '../services/api';

function Home({ standings, schedules, loading }) {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [headToHeadData, setHeadToHeadData] = useState({});

    // Convert schedules array to a map for easier access
    const allSchedules = useMemo(() => {
        const map = {};
        if (schedules && Array.isArray(schedules)) {
            schedules.forEach(item => {
                map[item.teamId] = item.schedule;
            });
        }
        return map;
    }, [schedules]);

    const handleTeamSelect = (team) => {
        // If clicking the already selected team, deselect it
        if (selectedTeam && selectedTeam.id === team.id) {
            setSelectedTeam(null);
            setHeadToHeadData({});
            return;
        }

        setSelectedTeam(team);

        // Get schedule from our local state (which came from DB or bulk fetch)
        const schedule = allSchedules[team.id];

        if (!schedule) {
            console.warn("No schedule found for team:", team.name);
            setHeadToHeadData({});
            return;
        }

        // Calculate head-to-head for every other team
        const allTeams = [...standings.eastern, ...standings.western];
        const newHeadToHead = {};

        allTeams.forEach(otherTeam => {
            if (otherTeam.id !== team.id) {
                // Pass the opponent's abbreviation to find games against them
                newHeadToHead[otherTeam.id] = getHeadToHead(schedule, otherTeam.abbreviation);
            }
        });

        setHeadToHeadData(newHeadToHead);
    };

    return (
        <div className="home-container">
            <SEO
                title="H2H Standings"
                description="View current NBA standings and check head-to-head records between any two teams instantly."
                keywords="NBA standings, head to head, NBA records, basketball stats"
            />

            {/* PageHeader is now in App.jsx */}

            {loading ? (
                <div className="loading">Loading Data ...</div>
            ) : (
                <div className="standings-grid">
                    <StandingsTable
                        conference="Western"
                        teams={standings.western}
                        onTeamSelect={handleTeamSelect}
                        selectedTeamId={selectedTeam?.id}
                        selectedTeamAbbreviation={selectedTeam?.abbreviation}
                        headToHeadResults={headToHeadData}
                    />
                    <StandingsTable
                        conference="Eastern"
                        teams={standings.eastern}
                        onTeamSelect={handleTeamSelect}
                        selectedTeamId={selectedTeam?.id}
                        selectedTeamAbbreviation={selectedTeam?.abbreviation}
                        headToHeadResults={headToHeadData}
                    />
                </div>
            )}

            {/* AdSense Banner - Between Tables and Content */}
            {!loading && (
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <AdSenseBanner format="horizontal" />
                </div>
            )}

            {/* Content Section - Below Tables */}
            {!loading && (
                <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 2rem' }}>

                    {/* How to Use Section */}
                    <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                            How to Use NBA H2H Standings
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem', color: '#60a5fa' }}>
                                    📊 View Current Standings
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                    Browse real-time NBA standings for both Eastern and Western conferences. Each table shows team rankings, win-loss records,
                                    win percentages, and games behind the leader. Data is automatically updated and cached for fast performance.
                                </p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem', color: '#60a5fa' }}>
                                    🏀 Analyze Head-to-Head Matchups
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                    Click on any team to see their complete head-to-head record against every other team in the league.
                                    View wins, losses, and game scores for completed matchups, plus see which games are still scheduled.
                                    This is perfect for understanding playoff tiebreaker scenarios.
                                </p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem', color: '#60a5fa' }}>
                                    🔄 Refresh Data Anytime
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                    Use the refresh button in the top-right corner to fetch the latest standings and game results.
                                    Our smart caching system ensures fast loading while keeping data current. Perfect for checking results
                                    right after games finish.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Understanding Standings Section */}
                    <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                            Understanding NBA Standings
                        </h2>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '1rem' }}>
                                NBA standings determine playoff seeding and are crucial for understanding the competitive landscape.
                                Here's what you need to know about how teams are ranked:
                            </p>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                Win Percentage (PCT)
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                The primary metric for ranking teams. Calculated as wins divided by total games played. A team with a 50-30 record
                                has a win percentage of .625 (50 wins ÷ 80 games). Higher percentages mean better positioning.
                            </p>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                Games Behind (GB)
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                Shows how many games a team trails the conference leader. If a team is 3.5 games behind, they would need to win
                                4 more games than the leader (while the leader loses those games) to tie for first place. The ".5" represents
                                one team having played more games.
                            </p>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                Head-to-Head Records
                            </h3>
                            <p style={{ marginBottom: '1rem' }}>
                                When teams have identical records, head-to-head results become the first tiebreaker for playoff seeding.
                                Our platform makes it easy to see these critical matchups. Simply click a team to view their record against
                                all other teams - essential for predicting playoff positioning.
                            </p>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                Conference vs. Division
                            </h3>
                            <p>
                                The NBA has two conferences (Eastern and Western), each with 15 teams. Playoff seeding is determined separately
                                for each conference, with the top 8 teams qualifying. Each conference is further divided into three divisions,
                                though division standings are less important than overall conference rankings for playoff purposes.
                            </p>
                        </div>
                    </div>

                    {/* Why Head-to-Head Matters Section */}
                    <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                            Why Head-to-Head Records Matter
                        </h2>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Head-to-head records are more than just interesting statistics - they're critical for playoff seeding and can
                                determine home court advantage in the postseason. Here's why they're so important:
                            </p>

                            <div style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.3)', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.75rem', color: '#60a5fa' }}>
                                    Tiebreaker Scenarios
                                </h3>
                                <p>
                                    When two or more teams finish the regular season with identical records, the NBA uses a series of tiebreakers
                                    to determine seeding. The first and most important tiebreaker is head-to-head record. If Team A went 3-1
                                    against Team B during the season, Team A wins the tiebreaker even if both teams finished 50-32.
                                </p>
                            </div>

                            <div style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.3)', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.75rem', color: '#60a5fa' }}>
                                    Playoff Implications
                                </h3>
                                <p>
                                    Home court advantage in the playoffs can be the difference between advancing and elimination. The team with
                                    the better regular season record hosts Games 1, 2, 5, and 7 (if necessary). This means understanding
                                    head-to-head records late in the season can help predict playoff matchups and home court scenarios.
                                </p>
                            </div>

                            <div style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.75rem', color: '#60a5fa' }}>
                                    Matchup Analysis
                                </h3>
                                <p>
                                    Some teams simply match up better against certain opponents due to playing styles, roster composition, or
                                    other factors. A team might dominate one opponent 4-0 in the season series while struggling against another.
                                    These patterns can help predict playoff performance and identify favorable or unfavorable potential matchups.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                            Pro Tips for Using NBA H2H
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', color: 'var(--text-secondary)' }}>
                            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Compare Playoff Contenders
                                </h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Late in the season, click on teams fighting for the same playoff seed to see who has the tiebreaker advantage.
                                </p>
                            </div>
                            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Check Remaining Matchups
                                </h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Scheduled games (marked with •) show which head-to-head matchups are still to come - crucial for predicting final standings.
                                </p>
                            </div>
                            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Identify Matchup Trends
                                </h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Look for teams that consistently dominate or struggle against specific opponents - these patterns often continue in playoffs.
                                </p>
                            </div>
                            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Use Schedule Difficulty
                                </h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Visit our Schedule Difficulty page to see which teams face tough or easy upcoming schedules - helps predict standings changes.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Home;
