import React, { useState, useMemo } from 'react';
import StandingsTable from '../components/StandingsTable';
import AdSenseBanner from '../components/AdSenseBanner';
import ContentSection from '../components/ContentSection';
import FeatureGrid from '../components/FeatureGrid';
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
                <div className="content-container">

                    <ContentSection title="How to Use Head-to-Head Standings">
                        <FeatureGrid>
                            <FeatureGrid.Card
                                icon="🏀"
                                title="Click Any Team"
                                description="Select a team to instantly see their head-to-head record against every other NBA team. View wins, losses, and game scores."
                            />
                            <FeatureGrid.Card
                                icon="📊"
                                title="Analyze Matchups"
                                description="Compare direct matchup results between teams. Perfect for understanding playoff tiebreaker scenarios and seeding implications."
                            />
                            <FeatureGrid.Card
                                icon="📅"
                                title="See Future Games"
                                description="Scheduled matchups are marked with a dot (•), showing which head-to-head games are still to come this season."
                            />
                        </FeatureGrid>
                    </ContentSection>

                    <ContentSection title="Why Head-to-Head Records Matter">
                        <FeatureGrid>
                            <FeatureGrid.Card
                                icon="🧮"
                                title="Tie Breaker"
                                description="Head-to-head records are the first tiebreaker when teams finish with identical win-loss records."
                            />
                            <FeatureGrid.Card
                                icon="🏆"
                                title="Playoff Implications"
                                description="The team with the better regular season record hosts Games 1, 2, 5, and 7 in a playoff series. When teams have the same record, head-to-head results determine who gets home court advantage."
                            />
                            <FeatureGrid.Card
                                icon="📈"
                                title="Performance Insight"
                                description="Gauges a team's effectiveness against specific opponents, offering insights beyond overall win-loss records for deeper analysis."
                            />
                        </FeatureGrid>

                    </ContentSection>

                </div>
            )}
        </div>
    );
}

export default Home;
