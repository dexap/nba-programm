const STORAGE_KEYS = {
    STANDINGS: 'nba_standings',
    SCHEDULES: 'nba_schedules',
    LAST_UPDATED: 'nba_last_updated'
};

const STALE_DURATION_MINUTES = 30;

// Minify schedule data to save space
const minifySchedule = (schedules) => {
    return schedules.map(item => ({
        teamId: item.teamId,
        schedule: item.schedule.map(event => {
            const competition = event.competitions?.[0];
            if (!competition) return null;

            return {
                date: event.date,
                competitions: [{
                    status: { type: { completed: competition.status?.type?.completed } },
                    competitors: competition.competitors?.map(comp => ({
                        homeAway: comp.homeAway,
                        winner: comp.winner,
                        score: comp.score ? { displayValue: comp.score.displayValue } : null,
                        team: {
                            id: comp.team?.id,
                            abbreviation: comp.team?.abbreviation
                        }
                    }))
                }]
            };
        }).filter(Boolean)
    }));
};

export const saveToDatabase = (standings, schedules) => {
    try {
        const minifiedSchedules = minifySchedule(schedules);
        localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(standings));
        localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(minifiedSchedules));
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
        console.log("Database saved successfully.");
        return true;
    } catch (error) {
        console.error("Database save failed (likely quota exceeded):", error);
        // Try clearing old data and saving again?
        try {
            localStorage.clear();
            const minifiedSchedules = minifySchedule(schedules);
            localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(standings));
            localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(minifiedSchedules));
            localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
            console.log("Database saved successfully after clear.");
            return true;
        } catch (retryError) {
            console.error("Database save failed even after clear:", retryError);
            return false;
        }
    }
};

export const getFromDatabase = () => {
    try {
        const standingsStr = localStorage.getItem(STORAGE_KEYS.STANDINGS);
        const schedulesStr = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
        const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);

        if (!standingsStr || !schedulesStr || !lastUpdated) return null;

        return {
            standings: JSON.parse(standingsStr),
            schedules: JSON.parse(schedulesStr),
            lastUpdated
        };
    } catch (error) {
        console.error("Database read failed:", error);
        return null;
    }
};

export const isDataStale = () => {
    const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
    if (!lastUpdated) return true;

    const lastUpdateDate = new Date(lastUpdated);
    const now = new Date();
    const diffMinutes = (now - lastUpdateDate) / (1000 * 60);

    return diffMinutes > STALE_DURATION_MINUTES;
};

export const clearDatabase = () => {
    localStorage.removeItem(STORAGE_KEYS.STANDINGS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATED);
};
