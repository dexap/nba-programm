import React from 'react';
import SEO from '../components/SEO';

function About() {
    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
            <SEO
                title="About - NBA H2H"
                description="Learn about NBA Head to Head - Your ultimate resource for NBA standings and head-to-head matchup analysis"
            />

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>About NBA H2H</h1>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', lineHeight: '1.8' }}>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>What is NBA H2H?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        NBA Head to Head (H2H) is a comprehensive basketball statistics platform designed for NBA fans who want to dive deeper into team matchups and standings analysis.
                        Our platform provides real-time NBA standings data combined with powerful head-to-head comparison tools that help you understand how teams perform against each other throughout the season.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Whether you're a casual fan trying to understand playoff implications, a fantasy basketball player researching matchups, or a dedicated analyst looking for detailed team comparisons,
                        NBA H2H gives you the insights you need in an intuitive, easy-to-use interface.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Key Features</h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#60a5fa' }}>📊 Real-Time NBA Standings</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Access up-to-date standings for both Eastern and Western conferences. Our data is sourced directly from ESPN's official API,
                            ensuring you always have the most current information about team records, win percentages, and conference rankings.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#60a5fa' }}>🏀 Head-to-Head Analysis</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Our unique head-to-head feature allows you to select any team and instantly see their matchup results against every other team in the league.
                            View win-loss records, game scores, and upcoming matchups all in one place. This is perfect for understanding playoff seeding scenarios
                            and tiebreaker situations.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#60a5fa' }}>📅 Schedule Difficulty Tracker</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Analyze which teams face the toughest or easiest schedules. Our schedule difficulty feature calculates opponent strength based on win percentages,
                            helping you predict potential winning or losing streaks. You can customize the analysis to look at upcoming games or review past performance.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#60a5fa' }}>💾 Smart Caching</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            We use intelligent local caching to provide lightning-fast performance while minimizing API calls. Data is automatically refreshed when it becomes stale,
                            but you can also manually refresh at any time to get the absolute latest information.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#60a5fa' }}>🎨 Team Color Badges</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Each team is represented by custom-designed badges featuring official team colors and abbreviations. This makes it easy to quickly identify teams
                            while maintaining a clean, modern aesthetic throughout the application.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Why We Built This</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        As passionate NBA fans ourselves, we found that existing statistics platforms either overwhelmed users with too much data or didn't provide
                        the specific head-to-head insights we were looking for. We wanted a clean, focused tool that answered one simple question:
                        "How do these two teams match up against each other?"
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        NBA H2H was born from this need. We've stripped away unnecessary complexity and focused on delivering the most relevant information
                        in the most accessible way possible. Whether you're checking standings during your lunch break or doing deep playoff analysis,
                        our platform adapts to your needs.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Technology & Data Sources</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        NBA H2H is built with modern web technologies to ensure fast performance and reliability:
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>React 19:</strong> For a responsive, dynamic user interface</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Vite:</strong> Lightning-fast build tool and development server</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Firebase Hosting:</strong> Reliable, global content delivery</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>ESPN API:</strong> Official NBA statistics and schedule data</li>
                    </ul>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        All data is sourced from ESPN's public API, which aggregates official NBA statistics. We update our cache regularly to ensure
                        you're seeing the most current information available.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Privacy & Transparency</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        We take your privacy seriously. NBA H2H does not collect any personal information. We use local browser storage only to cache
                        NBA statistics for better performance - this data never leaves your device. For more details, please review our Privacy Policy.
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        This is an unofficial fan project and is not affiliated with the NBA or ESPN. We're simply fans building tools for other fans.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Get Started</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Ready to explore NBA matchups? Head over to our Standings page to start analyzing head-to-head records, or check out the
                        Schedule Difficulty page to see which teams have the toughest roads ahead. If you have questions, visit our FAQ page for
                        detailed guides on using all of our features.
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        We're constantly improving NBA H2H based on user feedback. If you have suggestions or encounter any issues,
                        we'd love to hear from you!
                    </p>
                </section>

            </div>
        </div>
    );
}

export default About;
