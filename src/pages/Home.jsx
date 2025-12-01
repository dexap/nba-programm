import React, { useState, useEffect } from 'react';
import StandingsTable from '../components/StandingsTable';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { fetchStandings, fetchTeamSchedule, getHeadToHead } from '../services/api';
import { saveToDatabase, getFromDatabase, isDataStale } from '../services/storage';

function Home() {
    const [standings, setStandings] = useState({ eastern: [], western: [] });
    const [allSchedules, setAllSchedules] = useState({}); // Map of teamId -> schedule
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [headToHeadData, setHeadToHeadData] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const processData = (standingsData, schedulesData) => {
        setStandings(standingsData);

        // Convert schedules array to a map for easier access
        const schedulesMap = {};
        schedulesData.forEach(item => {
            schedulesMap[item.teamId] = item.schedule;
        });
        setAllSchedules(schedulesMap);
    };

    const fetchDataFromApi = async () => {
        setIsRefreshing(true);
        try {
            // 1. Fetch Standings
            const standingsData = await fetchStandings();
            if (!standingsData) throw new Error("Failed to fetch standings");

            const allTeams = [...standingsData.eastern, ...standingsData.western];

            // 2. Fetch Schedules for ALL teams (to populate DB)
            const promises = allTeams.map(async (team) => {
                const schedule = await fetchTeamSchedule(team.espnId);
                return { teamId: team.id, schedule };
            });

            const schedulesData = await Promise.all(promises);

            // 3. Save to DB
            saveToDatabase(standingsData, schedulesData);

            // 4. Update State
            processData(standingsData, schedulesData);
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
                processData(dbData.standings, dbData.schedules);
                setLastUpdated(new Date(dbData.lastUpdated));
                setLoading(false);
            } else {
                console.log("Cache miss or stale, fetching from API...");
                await fetchDataFromApi();
            }
        };

        init();
    }, []);

    const handleManualRefresh = () => {
        fetchDataFromApi();
    };

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
            <PageHeader
                title="H2H Standings"
                subtitle="Select a team to see head-to-head results"
                lastUpdated={lastUpdated}
                onRefresh={handleManualRefresh}
                isRefreshing={isRefreshing}
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
        </div>
    );
}

export default Home;
