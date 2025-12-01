import React, { useState, useEffect } from 'react';
import StandingsTable from '../components/StandingsTable';
import { fetchStandings, fetchTeamSchedule, getHeadToHead } from '../services/api';

function Home() {
    const [standings, setStandings] = useState({ eastern: [], western: [] });
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [headToHeadData, setHeadToHeadData] = useState({});

    useEffect(() => {
        const loadStandings = async () => {
            setLoading(true);
            const data = await fetchStandings();
            if (data) {
                setStandings(data);
            }
            setLoading(false);
        };
        loadStandings();
    }, []);

    const handleTeamSelect = async (team) => {
        // If clicking the already selected team, deselect it
        if (selectedTeam && selectedTeam.id === team.id) {
            setSelectedTeam(null);
            setHeadToHeadData({});
            return;
        }

        setSelectedTeam(team);

        // Fetch schedule for the selected team using its ESPN ID
        if (!team.espnId) {
            console.warn("No ESPN ID found for team:", team.name);
            setHeadToHeadData({});
            return;
        }

        const schedule = await fetchTeamSchedule(team.espnId);

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
            <header className="page-header">
                <h1>NBA H2H Standings</h1>
                <p className="subtitle">Select a team to see head-to-head results</p>
            </header>

            {loading ? (
                <div className="loading">Loading Standings...</div>
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
