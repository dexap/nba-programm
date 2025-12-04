import React, { useState } from 'react';
import SEO from '../components/SEO';

function Glossary() {
    const [searchTerm, setSearchTerm] = useState('');

    const terms = [
        {
            term: "Conference",
            definition: "The NBA is divided into two conferences: Eastern and Western. Each conference has 15 teams. Playoff seeding and standings are determined separately for each conference."
        },
        {
            term: "Division",
            definition: "Each conference is further divided into three divisions of five teams each. Division standings can affect playoff seeding tiebreakers, though conference record is generally more important."
        },
        {
            term: "Win Percentage (PCT)",
            definition: "The percentage of games won out of total games played. Calculated as Wins / (Wins + Losses). This is the primary metric for determining team rankings in the standings."
        },
        {
            term: "Games Behind (GB)",
            definition: "The number of games a team trails the division or conference leader. Calculated by comparing the difference in wins and losses. A half-game represents one team having played more games."
        },
        {
            term: "Head-to-Head Record",
            definition: "The win-loss record between two specific teams. This is one of the most important tiebreakers when teams have identical records. Our platform specializes in showing these matchups."
        },
        {
            term: "Home Record",
            definition: "A team's win-loss record in games played at their home arena. Home court advantage is real in the NBA, with teams typically performing better at home."
        },
        {
            term: "Away Record",
            definition: "A team's win-loss record in games played at opponent arenas. Road games are generally more challenging due to travel, crowd noise, and unfamiliar environments."
        },
        {
            term: "Conference Record",
            definition: "A team's win-loss record against teams within their own conference. This is an important tiebreaker for playoff seeding."
        },
        {
            term: "Strength of Schedule (SOS)",
            definition: "A measure of how difficult a team's opponents are, based on their win percentages. Our Schedule Difficulty feature calculates this for upcoming or past games."
        },
        {
            term: "Playoff Seeding",
            definition: "The ranking of teams within each conference for the playoffs. The top 8 teams from each conference qualify, with seeds 1-6 going to division leaders and teams with the best records."
        },
        {
            term: "Play-In Tournament",
            definition: "Teams seeded 7-10 in each conference compete in a mini-tournament to determine the final two playoff spots (seeds 7 and 8). This was introduced in the 2020-21 season."
        },
        {
            term: "Tiebreaker",
            definition: "Rules used to determine standings when teams have identical records. The order is: (1) Head-to-head record, (2) Division record (if applicable), (3) Conference record, (4) Record vs. playoff teams, and more."
        },
        {
            term: "Season Series",
            definition: "The complete set of games between two teams in a single season. Most teams play each other 3-4 times per season, with more games against division rivals."
        },
        {
            term: "Winning Streak",
            definition: "The number of consecutive games a team has won. Streaks can indicate momentum and team performance trends."
        },
        {
            term: "Losing Streak",
            definition: "The number of consecutive games a team has lost. Extended losing streaks often lead to coaching changes or roster adjustments."
        },
        {
            term: "Back-to-Back",
            definition: "When a team plays games on consecutive days. These are challenging due to fatigue and limited practice time. Teams often rest key players during back-to-backs."
        },
        {
            term: "Rest Days",
            definition: "The number of days between games. More rest typically leads to better performance, especially for older teams or those dealing with injuries."
        },
        {
            term: "Regular Season",
            definition: "The 82-game season that runs from October to April. Each team plays 82 games total: 41 home and 41 away."
        },
        {
            term: "Playoffs",
            definition: "The post-season tournament where the top 8 teams from each conference compete for the NBA Championship. It's a best-of-seven series format."
        },
        {
            term: "Clinched Playoff Spot",
            definition: "When a team has mathematically secured a playoff berth, meaning they cannot finish lower than 10th in their conference regardless of remaining games."
        },
        {
            term: "Eliminated from Playoffs",
            definition: "When a team can no longer mathematically qualify for the playoffs, regardless of winning all remaining games."
        },
        {
            term: "Magic Number",
            definition: "The combined number of wins by a leading team and losses by a trailing team needed for the leading team to clinch a playoff spot or division title."
        },
        {
            term: "Point Differential",
            definition: "The average margin of victory or defeat. Calculated as points scored minus points allowed per game. A strong indicator of team quality."
        },
        {
            term: "Opponent Win Percentage",
            definition: "The average win percentage of a team's opponents. Used in our Schedule Difficulty feature to measure how tough a team's schedule is."
        },
        {
            term: "Division Leader",
            definition: "The team with the best record in each of the six divisions. Division leaders are guaranteed at least a top-6 seed in the playoffs."
        },
        {
            term: "Wild Card",
            definition: "Playoff teams that qualify based on conference record but are not division leaders. These teams are seeded 7-8 (or compete in the play-in tournament)."
        },
        {
            term: "Home Court Advantage",
            definition: "In playoff series, the team with the better regular season record hosts more games (4 out of 7) and has the final game at home if the series goes to Game 7."
        },
        {
            term: "Season Sweep",
            definition: "When one team wins all games in the season series against another team. For example, if Team A plays Team B four times and wins all four games."
        },
        {
            term: "Overtime (OT)",
            definition: "An additional 5-minute period played when the score is tied at the end of regulation (48 minutes). Multiple overtimes can occur if the score remains tied."
        },
        {
            term: "Postponed Game",
            definition: "A scheduled game that is delayed to a later date due to various reasons (weather, COVID-19 protocols, etc.). This can create imbalances in games played."
        }
    ];

    const filteredTerms = terms.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
            <SEO
                title="NBA Glossary - NBA H2H"
                description="Comprehensive glossary of NBA terms and statistics - Learn basketball terminology and understand standings metrics"
            />

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>NBA Glossary</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Your guide to understanding NBA statistics and terminology
            </p>

            {/* Search Box */}
            <div style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                {filteredTerms.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                        No terms found matching "{searchTerm}"
                    </p>
                ) : (
                    <div>
                        {filteredTerms.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    marginBottom: idx < filteredTerms.length - 1 ? '2rem' : '0',
                                    paddingBottom: idx < filteredTerms.length - 1 ? '2rem' : '0',
                                    borderBottom: idx < filteredTerms.length - 1 ? '1px solid rgba(100, 116, 139, 0.3)' : 'none'
                                }}
                            >
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#60a5fa' }}>
                                    {item.term}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                    {item.definition}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'rgba(96, 165, 250, 0.1)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        📚 Learn More
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '0.5rem' }}>
                        This glossary covers the most common NBA terms you'll encounter on our platform. For more detailed explanations of how to use our features,
                        check out our FAQ page.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        For official NBA rules and statistics, visit <a href="https://www.nba.com" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>NBA.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Glossary;
