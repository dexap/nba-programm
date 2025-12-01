export const TEAM_COLORS = {
    ATL: { primary: '#E03A3E', secondary: '#fafd20ff', text: '#ffffffff' }, // Hawks
    BOS: { primary: '#007A33', secondary: '#BA9653', text: '#FFFFFF' }, // Celtics
    BKN: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' }, // Nets
    CHA: { primary: '#1D1160', secondary: '#00788C', text: '#FFFFFF' }, // Hornets
    CHI: { primary: '#CE1141', secondary: '#000000', text: '#FFFFFF' }, // Bulls
    CLE: { primary: '#860038', secondary: '#041E42', text: '#FFFFFF' }, // Cavaliers
    DAL: { primary: '#00538C', secondary: '#B8C4CA', text: '#FFFFFF' }, // Mavericks
    DEN: { primary: '#0E2240', secondary: '#FEC524', text: '#FFFFFF' }, // Nuggets
    DET: { primary: '#C8102E', secondary: '#1D42BA', text: '#FFFFFF' }, // Pistons
    GSW: { primary: '#1D428A', secondary: '#FFC72C', text: '#FFFFFF' }, // Warriors
    HOU: { primary: '#CE1141', secondary: '#000000', text: '#FFFFFF' }, // Rockets
    IND: { primary: '#002D62', secondary: '#FDBB30', text: '#FFFFFF' }, // Pacers
    LAC: { primary: '#C8102E', secondary: '#1D428A', text: '#FFFFFF' }, // Clippers
    LAL: { primary: '#552583', secondary: '#FDB927', text: '#FFFFFF' }, // Lakers
    MEM: { primary: '#5D76A9', secondary: '#12173F', text: '#FFFFFF' }, // Grizzlies
    MIA: { primary: '#98002E', secondary: '#F9A01B', text: '#FFFFFF' }, // Heat
    MIL: { primary: '#00471B', secondary: '#EEE1C6', text: '#FFFFFF' }, // Bucks
    MIN: { primary: '#0C2340', secondary: '#236192', text: '#FFFFFF' }, // Timberwolves
    NOP: { primary: '#0C2340', secondary: '#C8102E', text: '#FFFFFF' }, // Pelicans
    NYK: { primary: '#006BB6', secondary: '#F58426', text: '#FFFFFF' }, // Knicks
    OKC: { primary: '#007AC1', secondary: '#EF3B24', text: '#FFFFFF' }, // Thunder
    ORL: { primary: '#0077C0', secondary: '#C4CED4', text: '#FFFFFF' }, // Magic
    PHI: { primary: '#006BB6', secondary: '#ED174C', text: '#FFFFFF' }, // 76ers
    PHX: { primary: '#1D1160', secondary: '#E56020', text: '#FFFFFF' }, // Suns
    POR: { primary: '#E03A3E', secondary: '#000000', text: '#FFFFFF' }, // Trail Blazers
    SAC: { primary: '#5A2D81', secondary: '#63727A', text: '#FFFFFF' }, // Kings
    SAS: { primary: '#C4CED4', secondary: '#000000', text: '#000000' }, // Spurs
    TOR: { primary: '#CE1141', secondary: '#000000', text: '#FFFFFF' }, // Raptors
    UTA: { primary: '#002B5C', secondary: '#00471B', text: '#FFFFFF' }, // Jazz
    WAS: { primary: '#002B5C', secondary: '#E31837', text: '#FFFFFF' }, // Wizards
};

export const getTeamColors = (abbreviation) => {
    return TEAM_COLORS[abbreviation] || { primary: '#333333', secondary: '#666666', text: '#FFFFFF' };
};
