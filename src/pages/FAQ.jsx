import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function FAQ() {
    const faqs = [
        {
            category: "Getting Started",
            questions: [
                {
                    q: "What is NBA H2H and how do I use it?",
                    a: "NBA H2H (Head to Head) is a platform for analyzing NBA team matchups and standings. Simply visit the Standings page and click on any team to see their head-to-head record against all other teams. The interface is intuitive - just click and explore!"
                },
                {
                    q: "Where does the data come from?",
                    a: "All NBA statistics are sourced from ESPN's official public API, which aggregates data directly from the NBA. This ensures accuracy and reliability. Data is updated regularly throughout the season."
                },
                {
                    q: "Is NBA H2H free to use?",
                    a: "Yes! NBA H2H is completely free for all users. We're a fan-built project designed to help basketball enthusiasts analyze matchups and standings."
                }
            ]
        },
        {
            category: "Features & Functionality",
            questions: [
                {
                    q: "How do I view head-to-head matchups?",
                    a: "On the Standings page, simply click on any team's row. The table will update to show that team's record against every other team in the league. You'll see wins, losses, and scores for completed games, plus scheduled future matchups."
                },
                {
                    q: "What does the Schedule Difficulty feature show?",
                    a: "The Schedule Difficulty page ranks teams based on the strength of their opponents. You can toggle between 'Upcoming Games' and 'Past Games', and adjust the number of games to analyze (3-15). A higher difficulty score means tougher opponents."
                },
                {
                    q: "How is schedule difficulty calculated?",
                    a: "We calculate difficulty by looking at the combined win percentage of a team's opponents over a specified number of games. For example, if a team's next 5 opponents have an average win percentage of 65%, that indicates a very difficult stretch."
                },
                {
                    q: "Can I see future matchups?",
                    a: "Yes! When you select a team on the Standings page, scheduled future games against other teams are displayed with a dot (•) indicator, showing you which matchups are still to come."
                },
                {
                    q: "What do the team badges represent?",
                    a: "Each team is represented by a circular badge featuring their official three-letter abbreviation (e.g., LAL for Lakers, BOS for Celtics) in their official team colors. This provides quick visual identification while maintaining a clean design."
                }
            ]
        },
        {
            category: "Data & Updates",
            questions: [
                {
                    q: "How often is the data updated?",
                    a: "Data is cached locally for performance but automatically refreshes when it becomes stale (typically after a few hours). You can also manually refresh at any time using the refresh button in the header."
                },
                {
                    q: "Why do I see cached data?",
                    a: "We cache data in your browser's local storage to provide instant loading times and reduce server load. This means you can browse standings even with a slow internet connection. The cache automatically updates when needed."
                },
                {
                    q: "What if the data seems outdated?",
                    a: "Click the refresh button (circular arrow icon) in the top-right corner of the page. This will force-fetch the latest data from ESPN's API and update your local cache."
                },
                {
                    q: "Are playoff games included in head-to-head records?",
                    a: "Currently, our platform focuses on regular season games. Playoff matchups are tracked separately by the NBA and are not included in the head-to-head analysis."
                }
            ]
        },
        {
            category: "Technical Questions",
            questions: [
                {
                    q: "Do I need to create an account?",
                    a: "No! NBA H2H doesn't require any registration or login. All features are available immediately to all visitors."
                },
                {
                    q: "Does NBA H2H work on mobile devices?",
                    a: "Yes, our platform is fully responsive and works great on smartphones and tablets. The interface adapts to your screen size for optimal viewing."
                },
                {
                    q: "What browsers are supported?",
                    a: "NBA H2H works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
                },
                {
                    q: "Why does the site use local storage?",
                    a: "Local storage allows us to cache NBA data on your device, providing faster load times and reducing the number of API requests. This data is only used for performance optimization and never leaves your device."
                },
                {
                    q: "Is my data private?",
                    a: "Absolutely. We don't collect any personal information. The only data stored is NBA statistics cached in your browser for performance. You can clear this at any time by clearing your browser's local storage."
                }
            ]
        },
        {
            category: "Understanding NBA Statistics",
            questions: [
                {
                    q: "What does 'Games Behind' mean?",
                    a: "Games Behind (GB) shows how many games a team trails the conference leader. It's calculated by comparing wins and losses. A team that's 2.5 games behind would need to win 3 more games (while the leader loses) to tie for first place."
                },
                {
                    q: "How are tiebreakers determined?",
                    a: "NBA tiebreakers are complex and include head-to-head record, division record, conference record, and more. Our head-to-head feature helps you see one of the most important tiebreaker criteria: direct matchups between teams."
                },
                {
                    q: "What's the difference between Eastern and Western Conference?",
                    a: "The NBA is divided into two conferences of 15 teams each. Teams primarily play within their conference, and playoff seeding is determined separately for each conference. The top 8 teams from each conference make the playoffs."
                },
                {
                    q: "Why do some teams have more games played than others?",
                    a: "The NBA schedule is complex, and games can be postponed due to various reasons. This creates temporary imbalances in games played, which typically even out as the season progresses."
                }
            ]
        },
        {
            category: "Troubleshooting",
            questions: [
                {
                    q: "The page won't load or shows an error",
                    a: "Try refreshing your browser (Ctrl+R or Cmd+R). If the problem persists, clear your browser cache and cookies, then try again. The issue might also be temporary if ESPN's API is experiencing downtime."
                },
                {
                    q: "I clicked a team but nothing happened",
                    a: "Make sure JavaScript is enabled in your browser. Also try clicking directly on the team row (not just the badge). If issues persist, try refreshing the page."
                },
                {
                    q: "The standings look wrong or incomplete",
                    a: "Click the refresh button to fetch the latest data. If you're viewing the site during an active game, there might be a slight delay before results appear."
                },
                {
                    q: "Can I report a bug or suggest a feature?",
                    a: "We welcome feedback! While we don't have a formal bug reporting system yet, we're constantly working to improve the platform based on user needs."
                }
            ]
        }
    ];

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
            <SEO
                title="FAQ & Help - NBA H2H"
                description="Frequently asked questions about NBA Head to Head - Learn how to use our features and understand NBA statistics"
            />

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>Frequently Asked Questions</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Everything you need to know about using NBA H2H
            </p>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                {faqs.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: idx < faqs.length - 1 ? '3rem' : '0' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem', color: '#60a5fa', borderBottom: '2px solid rgba(96, 165, 250, 0.3)', paddingBottom: '0.5rem' }}>
                            {section.category}
                        </h2>
                        {section.questions.map((faq, qIdx) => (
                            <div key={qIdx} style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                    Q: {faq.q}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', paddingLeft: '1rem', borderLeft: '3px solid rgba(96, 165, 250, 0.3)' }}>
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}

                <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'rgba(96, 165, 250, 0.1)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        Still have questions?
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        Check out our <Link to="/about" style={{ color: '#60a5fa', textDecoration: 'underline' }}>About page</Link> to learn more about NBA H2H,
                        or visit our <Link to="/glossary" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Glossary</Link> for explanations of basketball terms and statistics.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FAQ;
