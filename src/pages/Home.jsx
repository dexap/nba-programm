import React, { useState, useMemo } from 'react';
import StandingsTable from '../components/StandingsTable';
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
        </div>
    );
}

export default Home;
