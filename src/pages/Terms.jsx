import React from 'react';
import PageHeader from '../components/PageHeader';

function Terms() {
    return (
        <div className="container mx-auto px-4 pb-12">
            <PageHeader title="Terms of Service" subtitle="Last updated: December 2025" />

            <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-slate-300 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Terms</h2>
                    <p>
                        By accessing this Website, accessible from https://nba-h2h.web.app, you are agreeing to be bound by these Website Terms and Conditions of Use
                        and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited
                        from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Disclaimer</h2>
                    <p>
                        All the materials on Head to Head NBA's Website are provided "as is". Head to Head NBA makes no warranties, may it be expressed or implied,
                        therefore negates all other warranties. Furthermore, Head to Head NBA does not make any representations concerning the accuracy or reliability
                        of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
                    </p>
                    <p className="mt-2">
                        This website is an unofficial fan project and is not affiliated with, endorsed, sponsored, or specifically approved by the National Basketball Association (NBA)
                        or ESPN. All team names, logos, and other trademarks are the property of their respective owners.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. Limitations</h2>
                    <p>
                        Head to Head NBA or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on
                        Head to Head NBA's Website, even if Head to Head NBA or an authorize representative of this Website has been notified, orally or written,
                        of the possibility of such damage.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Revisions and Errata</h2>
                    <p>
                        The materials appearing on Head to Head NBA's Website may include technical, typographical, or photographic errors. Head to Head NBA will not promise
                        that any of the materials in this Website are accurate, complete, or current. Head to Head NBA may change the materials contained on its Website
                        at any time without notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. Links</h2>
                    <p>
                        Head to Head NBA has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site.
                        The presence of any link does not imply endorsement by Head to Head NBA of the site. The use of any linked website is at the user's own risk.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Terms;
