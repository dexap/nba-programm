import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 pb-12" style={{ maxWidth: '900px', marginTop: '2rem' }}>
            <SEO
                title="Privacy Policy - NBA H2H"
                description="Privacy Policy for Head to Head NBA - Learn how we protect your data"
            />

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>Privacy Policy</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Last updated: December 1, 2025</p>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Data Controller</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This website ("Head to Head NBA" or "NBA H2H") is operated as a personal, non-commercial fan project.
                        For inquiries regarding your data, please contact us via the website.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Information We Collect</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        <strong>We do not collect any personal information directly.</strong> However, we use the following technologies:
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li><strong>Local Storage:</strong> We cache NBA standings and schedule data in your browser's local storage to improve performance and reduce API calls. This data is stored locally on your device and is not transmitted to us.</li>
                        <li><strong>Cookies:</strong> We may use cookies for essential website functionality and, with your consent, for analytics and advertising purposes.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>3. Third-Party Services</h2>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>3.1 Google AdSense</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We use Google AdSense to display advertisements. Google uses cookies (such as the DART cookie) to serve ads based on your visits to this and other websites.
                        You can opt out of personalized advertising by visiting{' '}
                        <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                            Google Ads Settings
                        </a>{' '}
                        or{' '}
                        <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                            www.aboutads.info
                        </a>.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>3.2 ESPN API</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We fetch NBA data from ESPN's public API. No personal data is transmitted to ESPN through our website.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>3.3 Firebase Hosting</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This website is hosted on Google Firebase. Firebase may collect standard server logs including IP addresses and access times.
                        Please refer to{' '}
                        <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                            Firebase's Privacy Policy
                        </a>.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>4. Your Rights (GDPR)</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        Under the General Data Protection Regulation (GDPR), you have the following rights:
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li><strong>Right to Access:</strong> You can request information about data we process about you.</li>
                        <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data.</li>
                        <li><strong>Right to Erasure:</strong> You can request deletion of your data by clearing your browser's local storage and cookies.</li>
                        <li><strong>Right to Object:</strong> You can object to data processing by adjusting your cookie preferences.</li>
                        <li><strong>Right to Data Portability:</strong> You can export your locally stored data from your browser.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Cookie Management</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        You can manage your cookie preferences at any time by clearing your browser cookies or adjusting settings in our cookie consent banner.
                        Note that disabling necessary cookies may affect website functionality.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>6. Data Retention</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        All data stored in your browser (local storage and cookies) remains on your device until you clear it manually.
                        We do not store any data on our servers.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>7. Children's Privacy</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This website does not knowingly collect information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>8. Changes to This Policy</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this page.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>9. Consent</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        By using our website, you consent to this Privacy Policy and our{' '}
                        <Link to="/terms" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Terms of Service</Link>.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
