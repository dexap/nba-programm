export const TEAM_COLORS = {
    ATL: { primary: '#E03A3E', secondary: '#fafd20', text: '#ffffff', alternative: '#E03A3E' }, // Hawks
    BOS: { primary: '#007A33', secondary: '#BA9653', text: '#FFFFFF', alternative: '#007A33' }, // Celtics
    BKN: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF', alternative: '#ffffff' }, // Nets
    CHA: { primary: '#1D1160', secondary: '#00788C', text: '#FFFFFF', alternative: '#00788C' }, // Hornets
    CHI: { primary: '#CE1141', secondary: '#000000', text: '#FFFFFF', alternative: '#CE1141' }, // Bulls
    CLE: { primary: '#860038', secondary: '#041E42', text: '#FFFFFF', alternative: '#860038' }, // Cavaliers
    DAL: { primary: '#00538C', secondary: '#B8C4CA', text: '#FFFFFF', alternative: '#0388e1' }, // Mavericks
    DEN: { primary: '#0E2240', secondary: '#FEC524', text: '#FFFFFF', alternative: '#FEC524' }, // Nuggets
    DET: { primary: '#C8102E', secondary: '#1D42BA', text: '#FFFFFF', alternative: '#C8102E' }, // Pistons
    GSW: { primary: '#1D428A', secondary: '#FFC72C', text: '#FFFFFF', alternative: '#FFC72C' }, // Warriors
    HOU: { primary: '#CE1141', secondary: '#000000', text: '#FFFFFF', alternative: '#CE1141' }, // Rockets
    IND: { primary: '#002D62', secondary: '#FDBB30', text: '#FFFFFF', alternative: '#FDBB30' }, // Pacers
    LAC: { primary: '#C8102E', secondary: '#1D428A', text: '#FFFFFF', alternative: '#C8102E' }, // Clippers
    LAL: { primary: '#552583', secondary: '#FDB927', text: '#FFFFFF', alternative: '#552583' }, // Lakers
    MEM: { primary: '#5D76A9', secondary: '#12173F', text: '#FFFFFF', alternative: '#5D76A9' }, // Grizzlies
    MIA: { primary: '#98002E', secondary: '#F9A01B', text: '#FFFFFF', alternative: '#98002E' }, // Heat
    MIL: { primary: '#00471B', secondary: '#EEE1C6', text: '#FFFFFF', alternative: '#149043' }, // Bucks
    MIN: { primary: '#0C2340', secondary: '#236192', text: '#FFFFFF', alternative: '#236192' }, // Timberwolves
    NOP: { primary: '#0C2340', secondary: '#C8102E', text: '#FFFFFF', alternative: '#C8102E' }, // Pelicans
    NYK: { primary: '#006BB6', secondary: '#F58426', text: '#FFFFFF', alternative: '#F58426' }, // Knicks
    OKC: { primary: '#007AC1', secondary: '#EF3B24', text: '#FFFFFF', alternative: '#007AC1' }, // Thunder
    ORL: { primary: '#0077C0', secondary: '#C4CED4', text: '#FFFFFF', alternative: '#0077C0' }, // Magic
    PHI: { primary: '#006BB6', secondary: '#ED174C', text: '#FFFFFF', alternative: '#006BB6' }, // 76ers
    PHX: { primary: '#1D1160', secondary: '#E56020', text: '#FFFFFF', alternative: '#E56020' }, // Suns
    POR: { primary: '#E03A3E', secondary: '#000000', text: '#FFFFFF', alternative: '#E03A3E' }, // Trail Blazers
    SAC: { primary: '#5A2D81', secondary: '#63727A', text: '#FFFFFF', alternative: '#8142b8ff' }, // Kings
    SAS: { primary: '#C4CED4', secondary: '#000000', text: '#000000', alternative: '#C4CED4' }, // Spurs
    TOR: { primary: '#CE1141', secondary: '#000000', text: '#FFFFFF', alternative: '#CE1141' }, // Raptors
    UTA: { primary: '#002B5C', secondary: '#00471B', text: '#FFFFFF', alternative: '#0753abff' }, // Jazz
    WAS: { primary: '#002B5C', secondary: '#E31837', text: '#FFFFFF', alternative: '#E31837' }, // Wizards
};

export const getTeamColors = (abbreviation) => {
    return TEAM_COLORS[abbreviation] || { primary: '#333333', secondary: '#666666', text: '#FFFFFF' };
};
