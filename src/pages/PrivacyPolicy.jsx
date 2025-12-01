import React from 'react';
import PageHeader from '../components/PageHeader';

function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 pb-12">
            <PageHeader title="Privacy Policy" subtitle="Last updated: December 2025" />

            <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-slate-300 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                    <p>
                        Welcome to Head to Head NBA ("we," "our," or "us"). We are committed to protecting your privacy.
                        This Privacy Policy explains how your information is collected, used, and disclosed by Head to Head NBA.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
                    <p>
                        We do not collect any personal information from you directly. However, we use third-party services that may collect information about your visit.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. Cookies and Web Beacons</h2>
                    <p>
                        Like any other website, Head to Head NBA uses 'cookies'. These cookies are used to store information including visitors' preferences,
                        and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by
                        customizing our web page content based on visitors' browser type and/or other information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Google AdSense</h2>
                    <p>
                        Google, as a third-party vendor, uses cookies to serve ads on Head to Head NBA. Google's use of the DART cookie enables it to serve ads
                        to our site visitors based upon their visit to www.website.com and other sites on the internet.
                        Users may opt-out of the use of the DART cookie by visiting the Google ad and content network Privacy Policy at the following URL –
                        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://policies.google.com/technologies/ads</a>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. Third Party Privacy Policies</h2>
                    <p>
                        Head to Head NBA's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective
                        Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about
                        how to opt-out of certain options.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">6. Consent</h2>
                    <p>
                        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
