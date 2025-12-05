const ESPN_CORE_API = 'https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba';
const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';
/**
 * Fetches injury data for a specific team
 * @param {string} teamId - The ESPN team ID
 * @returns {Promise<Array>} Array of injured players with their details
 */
export const fetchTeamInjuries = async (teamId) => {
    if (!teamId) return [];
    
    try {
        // Try ESPN Core API first
        const response = await fetch(`${ESPN_CORE_API}/teams/${teamId}/injuries`);
        
        if (!response.ok) {
            console.warn(`Injuries API returned ${response.status} for team ${teamId}`);
            return [];
        }
        
        const data = await response.json();
        
        // Parse injuries from the response
        if (!data.items || data.items.length === 0) {
            return [];
        }
        
        // Map injury data to our format
        const injuries = await Promise.all(
            data.items.map(async (item) => {
                try {
                    const injuryDetailResponse = await fetch(item.$ref);
                    const injuryDetail = await injuryDetailResponse.json();
                    
                    // Get athlete details
                    const athleteResponse = await fetch(injuryDetail.athlete.$ref);
                    const athlete = await athleteResponse.json();
                    
                    return {
                        id: athlete.id,
                        name: athlete.displayName || athlete.fullName,
                        position: athlete.position?.abbreviation || 'N/A',
                        status: injuryDetail.status || 'Out',
                        shortComment: injuryDetail.shortComment || injuryDetail.longComment || 'Injury',
                        // We'll fetch stats separately
                        stats: null
                    };
                } catch (err) {
                    console.error('Error fetching injury detail:', err);
                    return null;
                }
            })
        );
        
        // Filter out any null results from failed fetches
        return injuries.filter(injury => injury !== null);
        
    } catch (error) {
        console.error(`Error fetching injuries for team ${teamId}:`, error);
        return [];
    }
};
/**
 * Fetches player statistics to determine importance
 * @param {string} athleteId - The ESPN athlete ID
 * @returns {Promise<Object>} Player statistics
 */
export const getPlayerStats = async (athleteId) => {
    if (!athleteId) return null;
    
    try {
        const response = await fetch(`${ESPN_CORE_API}/athletes/${athleteId}/statistics/0`);
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        
        // Parse stats - looking for season averages
        if (data.splits?.categories) {
            const stats = {};
            
            data.splits.categories.forEach(category => {
                category.stats?.forEach(stat => {
                    const name = stat.name;
                    const value = parseFloat(stat.displayValue) || 0;
                    
                    // Map common stat names
                    if (name === 'avgPoints' || name === 'points') stats.ppg = value;
                    if (name === 'avgRebounds' || name === 'rebounds') stats.reb = value;
                    if (name === 'avgAssists' || name === 'assists') stats.ast = value;
                    if (name === 'avgSteals' || name === 'steals') stats.stl = value;
                    if (name === 'avgBlocks' || name === 'blocks') stats.blk = value;
                });
            });
            
            return stats;
        }
        
        return null;
        
    } catch (error) {
        console.error(`Error fetching stats for athlete ${athleteId}:`, error);
        return null;
    }
};
/**
 * Enriches injury data with player statistics
 * @param {Array} injuries - Array of injury objects
 * @returns {Promise<Array>} Injuries enriched with stats
 */
export const enrichInjuriesWithStats = async (injuries) => {
    if (!injuries || injuries.length === 0) return [];
    
    const enrichedInjuries = await Promise.all(
        injuries.map(async (injury) => {
            const stats = await getPlayerStats(injury.id);
            return {
                ...injury,
                stats: stats || {
                    ppg: 0,
                    reb: 0,
                    ast: 0,
                    stl: 0,
                    blk: 0
                }
            };
        })
    );
    
    // Sort by PPG (descending) - most important players first
    return enrichedInjuries.sort((a, b) => (b.stats?.ppg || 0) - (a.stats?.ppg || 0));
};
/**
 * Main function to get complete injury report for a team
 * @param {string} teamId - The ESPN team ID
 * @returns {Promise<Array>} Sorted array of injured players with stats
 */
export const getTeamInjuryReport = async (teamId) => {
    const injuries = await fetchTeamInjuries(teamId);
    return await enrichInjuriesWithStats(injuries);
};
