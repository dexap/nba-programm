import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function Terms() {
    return (
        <div className="container mx-auto px-4 pb-12" style={{ maxWidth: '900px', marginTop: '2rem' }}>
            <SEO
                title="Terms of Service - NBA H2H"
                description="Terms of Service for Head to Head NBA"
            />

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>Terms of Service</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Last updated: December 1, 2025</p>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        By accessing and using this website (https://nba-h2h.web.app), you accept and agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use this website.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Disclaimer and Non-Affiliation</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        <strong>This is an unofficial fan project.</strong> Head to Head NBA is NOT affiliated with, endorsed by, sponsored by, or approved by:
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li>The National Basketball Association (NBA)</li>
                        <li>ESPN or any of its affiliates</li>
                        <li>Any NBA team or franchise</li>
                    </ul>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        All team names, logos, and trademarks are the property of their respective owners.
                        We use team abbreviations and colors for informational and fan purposes only under fair use principles.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>3. Use of Service</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        This website is provided for informational and entertainment purposes only. You agree to:
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>Use the website only for lawful purposes</li>
                        <li>Not attempt to interfere with the website's operation</li>
                        <li>Not use automated tools to scrape or download content without permission</li>
                        <li>Not misrepresent your affiliation with this website</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>4. Data Accuracy</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        All NBA data is sourced from ESPN's public API. While we strive for accuracy, we make no guarantees about the completeness,
                        accuracy, or timeliness of the information displayed. Data may contain errors or be outdated.
                        For official NBA statistics, please visit NBA.com or ESPN.com.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Limitation of Liability</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This website is provided "AS IS" without warranties of any kind, either express or implied.
                        Head to Head NBA and its operators shall not be liable for any damages arising from the use or inability to use this website,
                        including but not limited to direct, indirect, incidental, or consequential damages.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>6. Intellectual Property</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        The design, layout, and original content of this website are protected by copyright.
                        NBA team names, logos, and related marks are trademarks of their respective owners and are used here for informational purposes only.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>7. Third-Party Links</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This website may contain links to third-party websites (such as ESPN, NBA.com, or Google).
                        We are not responsible for the content, privacy policies, or practices of these external sites.
                        Use of third-party websites is at your own risk.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>8. Advertising</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This website displays advertisements through Google AdSense. We do not control the content of these advertisements.
                        Clicking on ads is at your own discretion and risk.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>9. Changes to Terms</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting.
                        Your continued use of the website after changes constitutes acceptance of the modified terms.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>10. Termination</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We reserve the right to terminate or suspend access to the website at any time, without notice, for any reason.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>11. Governing Law</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        These Terms of Service shall be governed by and construed in accordance with applicable laws.
                        For more information about how we handle your data, please see our{' '}
                        <Link to="/privacy" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Terms;
