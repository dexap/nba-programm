import React from 'react';
import { getTeamColors } from '../utils/teamColors';

// Complete mapping of all possible API abbreviations to standardized 3-letter codes
const BADGE_ABBREVIATION_MAP = {
    // Teams that already use 3 letters
    'ATL': 'ATL', // Atlanta Hawks
    'BOS': 'BOS', // Boston Celtics
    'BKN': 'BKN', // Brooklyn Nets
    'CHA': 'CHA', // Charlotte Hornets
    'CHI': 'CHI', // Chicago Bulls
    'CLE': 'CLE', // Cleveland Cavaliers
    'DAL': 'DAL', // Dallas Mavericks
    'DEN': 'DEN', // Denver Nuggets
    'DET': 'DET', // Detroit Pistons
    'HOU': 'HOU', // Houston Rockets
    'IND': 'IND', // Indiana Pacers
    'LAC': 'LAC', // LA Clippers
    'LAL': 'LAL', // LA Lakers
    'MEM': 'MEM', // Memphis Grizzlies
    'MIA': 'MIA', // Miami Heat
    'MIL': 'MIL', // Milwaukee Bucks
    'MIN': 'MIN', // Minnesota Timberwolves
    'OKC': 'OKC', // Oklahoma City Thunder
    'ORL': 'ORL', // Orlando Magic
    'PHI': 'PHI', // Philadelphia 76ers
    'PHX': 'PHX', // Phoenix Suns
    'POR': 'POR', // Portland Trail Blazers
    'SAC': 'SAC', // Sacramento Kings
    'TOR': 'TOR', // Toronto Raptors
    'UTA': 'UTA', // Utah Jazz
    'WAS': 'WAS', // Washington Wizards

    // Teams that might use 2 letters in API
    'GS': 'GSW',   // Golden State Warriors
    'GSW': 'GSW',  // Golden State Warriors
    'NO': 'NOP',   // New Orleans Pelicans
    'NOP': 'NOP',  // New Orleans Pelicans
    'NY': 'NYK',   // New York Knicks
    'NYK': 'NYK',  // New York Knicks
    'SA': 'SAS',   // San Antonio Spurs
    'SAS': 'SAS',  // San Antonio Spurs
    'UTAH': 'UTA', // Utah Jazz
    'UTA': 'UTA', // Utah Jazz
    'WSH': 'WAS', // Washington Wizards
    'WAS': 'WAS', // Washington Wizards
};

const getBadgeAbbreviation = (abbreviation) => {
    if (!abbreviation) return '???';
    const upper = abbreviation.toUpperCase();
    return BADGE_ABBREVIATION_MAP[upper] || upper;
};

function TeamBadge({ abbreviation, name, size = 'md', className = '' }) {
    const badgeAbbr = getBadgeAbbreviation(abbreviation);
    const colors = getTeamColors(badgeAbbr);

    // Size mappings
    const sizeStyles = {
        sm: { width: '28px', height: '28px', fontSize: '0.65rem', borderWidth: '1px' },
        md: { width: '36px', height: '36px', fontSize: '0.8rem', borderWidth: '2px' },
        lg: { width: '48px', height: '48px', fontSize: '1rem', borderWidth: '2px' }
    };

    const style = sizeStyles[size] || sizeStyles.md;

    return (
        <div
            className={`team-badge ${className}`}
            title={name}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
                color: colors.text,
                border: `${style.borderWidth} solid ${colors.secondary}`,
                borderRadius: '50%',
                width: style.width,
                height: style.height,
                minWidth: style.width, // Prevent shrinking
                fontSize: style.fontSize,
                fontWeight: '800',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                textTransform: 'uppercase',
                userSelect: 'none',
                letterSpacing: '0.05em'
            }}
        >
            {badgeAbbr}
        </div>
    );
}

export default TeamBadge;
