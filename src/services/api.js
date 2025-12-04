
const ESPN_STANDINGS_URL = 'https://site.api.espn.com/apis/v2/sports/basketball/nba/standings';
const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

export const fetchStandings = async () => {
    try {
        const response = await fetch(ESPN_STANDINGS_URL);
        if (!response.ok) throw new Error('Failed to fetch standings');
        const data = await response.json();

        const conferences = {
            eastern: [],
            western: []
        };

        data.children?.forEach(conference => {
            const confName = conference.name; // "Eastern Conference" or "Western Conference"
            const isEast = confName.includes('Eastern');
            const targetArray = isEast ? conferences.eastern : conferences.western;

            conference.standings?.entries?.forEach(entry => {
                const team = entry.team;
                const stats = entry.stats;

                const getStat = (name) => stats.find(s => s.name === name)?.value || 0;
                const getStatDisplay = (name) => stats.find(s => s.name === name)?.displayValue || "";

                targetArray.push({
                    id: team.id,
                    espnId: team.id, // ID matches ESPN schedule ID
                    name: team.displayName,
                    abbreviation: team.abbreviation,
                    logo: team.logos?.[0]?.href || '',
                    wins: getStat('wins'),
                    losses: getStat('losses'),
                    winPercent: getStat('winPercent'),
                    gamesBehind: getStatDisplay('gamesBehind'), // Display value handles "-" for leader
                    record: getStatDisplay('overall'), // e.g. "10-5"
                    streak: getStatDisplay('streak'),
                    differential: getStat('differential'),
                    homeRecord: getStatDisplay('Home'),
                    awayRecord: getStatDisplay('Road')
                });
            });
        });

        // Sort by Win Percentage descending
        const sortByPct = (a, b) => b.winPercent - a.winPercent;
        conferences.eastern.sort(sortByPct);
        conferences.western.sort(sortByPct);

        return conferences;
    } catch (error) {
        console.error("Error fetching standings:", error);
        return null;
    }
};

export const fetchTeamSchedule = async (teamId) => {
    if (!teamId) return [];
    try {
        const response = await fetch(`${ESPN_BASE_URL}/teams/${teamId}/schedule`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        return data.events;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }
};

export const getHeadToHead = (schedule, opponentAbbreviation) => {
    if (!schedule || !opponentAbbreviation) return null;

    const games = schedule.filter(event => {
        const competitors = event.competitions?.[0]?.competitors;
        if (!competitors) return false;
        return competitors.some(c => c.team.abbreviation === opponentAbbreviation);
    });

    return games.map(game => {
        const competition = game.competitions[0];
        const isFinished = competition.status.type.completed;
        const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
        const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

        const date = new Date(game.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

        if (!isFinished) {
            return {
                status: 'SCHEDULED',
                date,
                display: `${date} @ ${homeTeam.team.abbreviation === awayTeam.team.abbreviation ? 'Home' : homeTeam.team.abbreviation}`
            };
        }

        const score = `${awayTeam.score.displayValue}-${homeTeam.score.displayValue}`;
        const winnerAbbrev = homeTeam.winner ? homeTeam.team.abbreviation : awayTeam.team.abbreviation;

        return {
            status: 'FINISHED',
            date,
            score,
            winner: winnerAbbrev,
            homeTeam: homeTeam.team.abbreviation,
            awayTeam: awayTeam.team.abbreviation,
            homeScore: homeTeam.score.displayValue,
            awayScore: awayTeam.score.displayValue
        };
    });
};
