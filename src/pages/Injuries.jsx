import React, { useEffect, useMemo, useState } from 'react';
import SEO from '../components/SEO';
import './Injuries.css';

const BASE = import.meta.env.BASE_URL;

const fmtM = (v) => (v == null ? '–' : v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : `$${(v / 1e6).toFixed(1)}M`);
const fmtD = (s) => {
    if (!s) return '';
    const d = new Date(`${s}T12:00:00Z`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(s.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' });
};
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const isInj = (p) => Boolean(p.inj && p.inj.injury);

const SOURCES = {
    cbs: 'https://www.cbssports.com/nba/news/nba-unprecedented-early-season-injury-crisis-players-coaches-answers/',
};

/** Plain-text tooltip that follows the pointer; any element with data-tip triggers it. */
function useTooltip() {
    const [tip, setTip] = useState(null);
    useEffect(() => {
        const move = (e) => {
            const el = e.target.closest?.('[data-tip]');
            setTip(el ? { text: el.dataset.tip, x: e.clientX, y: e.clientY } : null);
        };
        document.addEventListener('mousemove', move);
        return () => document.removeEventListener('mousemove', move);
    }, []);
    return tip;
}

function Kpi({ label, value, unit, sub, share }) {
    return (
        <div className="ir-card ir-kpi">
            <div className="ir-kpi-label">{label}</div>
            <div className="ir-kpi-value">{value}{unit && <small>{unit}</small>}</div>
            <div className="ir-kpi-sub">{sub}</div>
            {share != null && (
                <div className="ir-meter" role="img" aria-label={`${share}% affected`}>
                    <i style={{ width: `${share}%` }} /><b />
                </div>
            )}
        </div>
    );
}

function Status({ p }) {
    if (!p.inj && p.was) {
        return (
            <span className="ir-pill fit" data-tip={`${p.name}\nlisted injured ${fmtD(p.was.first)} – ${fmtD(p.was.last)} (${p.was.types.join(', ')})`}>
                back · was out ({p.was.types[0]})
            </span>
        );
    }
    if (!p.inj) return p.salary ? null : <span className="ir-pill tw">Two-Way</span>;
    const j = p.inj;
    const cls = !j.injury ? 'neu' : j.status === 'Out' ? 'out' : 'dtd';
    const label = !j.injury ? j.type : `${j.status === 'Out' ? 'Out' : 'Day-to-day'} · ${j.type}`;
    const ret = j.return ? `est. return ${fmtD(j.return)}` : '';
    return (
        <>
            <span className={`ir-pill ${cls}`} data-tip={`${p.name}\n${j.note}\nreported ${fmtD(j.since)}${ret ? ` · ${ret}` : ''}`}>{label}</span>
            {j.injury && ret && <span className="ir-ret">{ret}</span>}
        </>
    );
}

function PlayerRow({ p, rank, team }) {
    return (
        <tr className={isInj(p) ? 'injured' : ''}>
            {rank !== undefined && <td className="ir-rank">{rank}</td>}
            <td>
                <div className="ir-pname">{p.name}</div>
                <div className="ir-pmeta">
                    {team && <span className="ir-tm" style={{ '--tc': team.color }}>{team.abbr}</span>}
                    {p.pos}{p.age ? ` · ${p.age} yrs` : ''}
                </div>
                <div className="ir-pstat"><Status p={p} /></div>
            </td>
            <td className="ir-sal">{p.salary ? fmtM(p.salary) : '–'}</td>
        </tr>
    );
}

function TrendChart({ days }) {
    const W = 1200, H = 210, L = 36, R = 16, T = 16, B = 28;
    const max = Math.max(...days.map((d) => d.injured)) * 1.15 || 1;
    const x = (i) => (days.length === 1 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (days.length - 1));
    const y = (v) => T + (H - T - B) * (1 - v / max);
    const mag = Math.pow(10, Math.floor(Math.log10(max)));
    const step = [0.1, 0.2, 0.25, 0.5, 1, 2, 5].map((f) => f * mag).find((st) => max / st <= 6);
    const ticks = [];
    for (let v = 0; v <= max; v += step) ticks.push(v);
    const every = Math.ceil(days.length / 8);
    const last = days[days.length - 1];
    const hitW = days.length === 1 ? 60 : (W - L - R) / (days.length - 1);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="ir-trend" role="img" aria-label="Injured players per day">
            {ticks.map((v) => (
                <g key={v}>
                    <line className="grid" x1={L} x2={W - R} y1={y(v)} y2={y(v)} />
                    <text className="ax" x={L - 8} y={y(v) + 4} textAnchor="end">{v}</text>
                </g>
            ))}
            {days.map((d, i) => (i % every === 0 || i === days.length - 1) && (
                <text key={d.date} className="ax" x={x(i)} y={H - 6} textAnchor="middle">{fmtD(d.date)}</text>
            ))}
            {days.length > 1 && <polyline className="ln" points={days.map((d, i) => `${x(i)},${y(d.injured)}`).join(' ')} />}
            {days.map((d, i) => <circle key={d.date} className="pt" cx={x(i)} cy={y(d.injured)} r={days.length > 40 ? 3 : 5} />)}
            <text className="lbl" x={x(days.length - 1) - (days.length === 1 ? 0 : 8)} y={y(last.injured) - 12}
                textAnchor={days.length === 1 ? 'middle' : 'end'}>{last.injured} injured</text>
            {days.map((d, i) => (
                <rect key={d.date} className="hit" x={x(i) - hitW / 2} y={T} width={hitW} height={H - T - B}
                    data-tip={`${fmtD(d.date)}\n${d.injured} injured (${d.out} out)\n${fmtM(d.injured_salary)} in salary\nTop-50 earners out: ${d.top50}`} />
            ))}
        </svg>
    );
}

function HBar({ label, segments, value, tip, wide }) {
    return (
        <div className={`ir-hbar${wide ? ' wide' : ''}`} data-tip={tip}>
            <span className="lab">{label}</span>
            <span className="track">
                {segments.filter((s) => s.w > 0).map((s, i) => <i key={i} style={{ width: `${s.w}%`, background: s.c }} />)}
            </span>
            <span className="num">{value}</span>
        </div>
    );
}

function Injuries() {
    const [D, setD] = useState(null);
    const [H, setH] = useState(null);
    const [error, setError] = useState(false);
    const [view, setView] = useState('teams');
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('injsal');
    const [onlyInj, setOnlyInj] = useState(false);
    const [showTw, setShowTw] = useState(false);
    const [copied, setCopied] = useState(false);
    const tip = useTooltip();

    useEffect(() => {
        fetch(`${BASE}data/injuries.json`).then((r) => (r.ok ? r.json() : Promise.reject(r))).then(setD).catch(() => setError(true));
        fetch(`${BASE}data/history.json`).then((r) => (r.ok ? r.json() : null)).then(setH).catch(() => setH(null));
    }, []);

    const S = useMemo(() => {
        if (!D) return null;
        const teams = Object.fromEntries(D.teams.map((t) => [t.abbr, t]));
        const P = D.players;
        const paid = P.filter((p) => p.salary);
        const inj = P.filter(isInj);
        const payroll = paid.reduce((s, p) => s + p.salary, 0);
        const injSal = inj.reduce((s, p) => s + (p.salary || 0), 0);
        const stars = paid.filter((p) => p.salary >= 40e6);
        const games = D.teams.reduce((s, t) => s + t.w + t.l, 0) / D.teams.length;
        const agg = D.teams.map((t) => {
            const ps = P.filter((p) => p.team === t.abbr);
            const pi = ps.filter(isInj);
            return { ...t, ps, pay: ps.reduce((s, p) => s + (p.salary || 0), 0), isal: pi.reduce((s, p) => s + (p.salary || 0), 0), icount: pi.length, inames: pi.filter((p) => p.salary).map((p) => p.name) };
        });
        const brackets = [[40e6, Infinity, '$40M+'], [20e6, 40e6, '$20–40M'], [10e6, 20e6, '$10–20M'], [5e6, 10e6, '$5–10M'], [0, 5e6, 'under $5M']].map(([lo, hi, l]) => {
            const g = paid.filter((p) => p.salary >= lo && p.salary < hi);
            const i = g.filter(isInj).length;
            return { l, n: g.length, i, s: pct(i, g.length) };
        });
        const bc = {};
        inj.forEach((p) => { bc[p.inj.type] = (bc[p.inj.type] || 0) + 1; });
        const bl = Object.entries(bc).sort((a, b) => b[1] - a[1]);
        const body = bl.slice(0, 7);
        const rest = bl.slice(7).reduce((s, x) => s + x[1], 0);
        if (rest) body.push(['Other', rest]);
        return {
            teams, P, paid, inj, payroll, injSal, stars, games, agg, brackets, body,
            rankOf: new Map(paid.map((p, i) => [p.id, i + 1])),
            out: inj.filter((p) => p.inj.status === 'Out').length,
            top50: paid.slice(0, 50).filter(isInj).length,
            back: P.filter((p) => p.was).length,
        };
    }, [D]);

    const share = async () => {
        const url = `${location.origin}${BASE}injuries/`;
        try {
            if (navigator.share) await navigator.share({ title: 'NBA Injury Report 2026-27', url });
            else { await navigator.clipboard.writeText(url); setCopied(true); }
        } catch { /* share dialog dismissed */ }
    };

    if (error) return <div className="ir-page"><div className="ir-card ir-empty">Injury data could not be loaded.</div></div>;
    if (!S) return <div className="ir-page"><div className="ir-card ir-empty">Loading injury report…</div></div>;

    const asOf = new Date(D.injury_report_at || D.generated);
    const since = D.tracking_since || H?.since;
    const days = H?.days || [];
    const maxPay = Math.max(...S.agg.map((t) => t.pay));
    const ql = q.trim().toLowerCase();
    const match = (p) => !ql || p.name.toLowerCase().includes(ql) || p.team.toLowerCase() === ql || S.teams[p.team].name.toLowerCase().includes(ql);
    const filt = (p) => (showTw || p.salary) && (!onlyInj || isInj(p));
    const sorters = {
        injsal: (a, b) => b.isal - a.isal || b.pay - a.pay,
        payroll: (a, b) => b.pay - a.pay,
        injcount: (a, b) => b.icount - a.icount || b.isal - a.isal,
        name: (a, b) => a.name.localeCompare(b.name),
    };
    const teamList = [...S.agg].sort(sorters[sort]).map((t) => {
        const teamHit = ql && (t.abbr.toLowerCase() === ql || t.name.toLowerCase().includes(ql));
        return { t, ps: t.ps.filter(filt).filter((p) => teamHit || match(p)) };
    }).filter((x) => x.ps.length);
    const rankList = S.P.filter(filt).filter(match);
    const shown = view === 'teams' ? teamList.reduce((s, x) => s + x.ps.length, 0) : rankList.length;
    const bmax = Math.max(...S.body.map((x) => x[1]));

    return (
        <div className="ir-page">
            <SEO
                title="NBA Injury Report 2026-27"
                description={`${S.inj.length} injured players, ${fmtM(S.injSal)} in salary sidelined. Every NBA team and player sorted by salary, updated daily.`}
                keywords="NBA injuries, injury report, NBA salaries, injured players, 2026-27 season"
                image={`${BASE}og-injuries.png`}
            />

            <header className="ir-hero">
                <div className="ir-kicker"><span className="dot" />Season {D.season} · as of {asOf.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <h1>NBA Injury <span>Report</span></h1>
                <p className="ir-lead">Only about {Math.round(S.games)} games into the season, a large share of the league's stars are already sidelined. Every team, every player, sorted by annual salary. <strong>Injured players are greyed out.</strong></p>
                <div className="ir-hero-row">
                    <button type="button" className="ir-share" onClick={share}>{copied ? '✓ Link copied' : '↗ Share this page'}</button>
                    <span className="ir-meta">Injury report: {asOf.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · {S.P.length} players on {D.teams.length} rosters · avg. {S.games.toFixed(1)} games played</span>
                </div>
            </header>

            <div className="ir-kpis">
                <Kpi label="Injured players" value={S.inj.length} unit={` / ${S.P.length}`} sub={`${pct(S.inj.length, S.P.length)}% of all rostered players · ${S.out} out, ${S.inj.length - S.out} day-to-day`} share={pct(S.inj.length, S.P.length)} />
                <Kpi label="Salary on the injury list" value={fmtM(S.injSal)} sub={`${pct(S.injSal, S.payroll)}% of league payroll (${fmtM(S.payroll)})`} share={pct(S.injSal, S.payroll)} />
                <Kpi label="Top-50 earners injured" value={S.top50} unit=" / 50" sub={`${pct(S.top50, 50)}% of the highest-paid players are out`} share={pct(S.top50, 50)} />
                <Kpi label="$40M+ players injured" value={S.stars.filter(isInj).length} unit={` / ${S.stars.length}`} sub={`after avg. ${S.games.toFixed(1)} games per team`} share={pct(S.stars.filter(isInj).length, S.stars.length)} />
                <Kpi label="Injured since tracking began" value={Math.max(D.ever_injured || 0, S.inj.length)} sub={`${S.back} of them back · tracking ${since ? `since ${fmtD(since)}` : 'from today'}`} />
            </div>

            <section className="ir-section">
                <div className="ir-head"><h2>The situation</h2><p>Updated automatically every day</p></div>
                <div className="ir-two">
                    <div className="ir-card ir-pad">
                        <h3>Most expensive absences</h3>
                        <ul className="ir-toplist">
                            {S.inj.filter((p) => p.salary).slice(0, 8).map((p) => (
                                <li key={p.id}>
                                    <span className="n">{p.name} <span className="ir-tm" style={{ '--tc': S.teams[p.team].color }}>{p.team}</span></span>
                                    <span className="s">{fmtM(p.salary)}</span>
                                    <span className="d">{p.inj.type}{p.inj.return ? ` · est. return ${fmtD(p.inj.return)}` : ''}{p.inj.note && <> – <i>{p.inj.note}</i></>}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="ir-src">From the current injury report · notes via ESPN/RotoWire</div>
                    </div>
                    <div className="ir-card ir-pad ir-news">
                        <h3>Latest news</h3>
                        {(D.news || []).length ? D.news.map((n) => (
                            <a key={n.url || n.headline} href={n.url} target="_blank" rel="noopener noreferrer">
                                <div className="h">{n.headline}</div>
                                <div className="t">{n.published ? new Date(n.published).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''} · ESPN</div>
                            </a>
                        )) : <div className="t">No injury news right now.</div>}
                        <div className="ir-src">ESPN headlines, filtered for injuries</div>
                    </div>
                </div>
                <div className="ir-quotes">
                    <blockquote>“Unprecedented” – he had never seen this many injuries this early in a season.<cite>Ime Udoka, Houston Rockets head coach · <a href={SOURCES.cbs} target="_blank" rel="noopener noreferrer">CBS Sports, Oct 30, 2026</a></cite></blockquote>
                    <blockquote>“I wish I knew the science behind why all of these injuries are happening.”<cite>Kevin Durant – points to a faster game, more possessions, 82 games · <a href={SOURCES.cbs} target="_blank" rel="noopener noreferrer">CBS Sports</a></cite></blockquote>
                    <blockquote>“There's no prevention.” He wants the league to lead more research into player health.<cite>Fred VanVleet, NBPA president · <a href={SOURCES.cbs} target="_blank" rel="noopener noreferrer">CBS Sports</a></cite></blockquote>
                </div>
            </section>

            <section className="ir-section">
                <div className="ir-head"><h2>Key figures</h2><p>Salary = 2026-27 cap salary from contract data</p></div>
                {days.length > 0 && (
                    <div className="ir-card ir-pad ir-chart" style={{ marginBottom: 12 }}>
                        <h3>Trend: injured players per day</h3>
                        <p className="hint">{days.length === 1 ? `Tracking started ${fmtD(days[0].date)} – a new point is added every day.` : `${days.length} days since ${fmtD(days[0].date)} · recorded daily from the injury report`}</p>
                        <TrendChart days={days} />
                    </div>
                )}
                <div className="ir-charts">
                    <div className="ir-card ir-pad ir-chart">
                        <h3>Injured salary by team</h3>
                        <p className="hint">Sorted by salary sidelined. Bar = total roster payroll.</p>
                        <div className="ir-legend"><span><i style={{ background: 'var(--ir-inj)' }} />injured</span><span><i style={{ background: 'var(--ir-fit)' }} />available</span></div>
                        {[...S.agg].sort(sorters.injsal).map((t) => (
                            <HBar key={t.abbr} label={t.abbr} value={fmtM(t.isal)}
                                segments={[{ w: (t.isal / maxPay) * 100, c: 'var(--ir-inj)' }, { w: ((t.pay - t.isal) / maxPay) * 100, c: 'var(--ir-fit)' }]}
                                tip={`${t.name} (${t.w}-${t.l})\nInjured: ${fmtM(t.isal)} (${pct(t.isal, t.pay)}%), ${t.icount} players\nPayroll: ${fmtM(t.pay)}${t.inames.length ? `\n${t.inames.slice(0, 4).join(', ')}${t.inames.length > 4 ? ' …' : ''}` : ''}`} />
                        ))}
                    </div>
                    <div className="ir-stack">
                        <div className="ir-card ir-pad ir-chart">
                            <h3>Pricier players, more injuries?</h3>
                            <p className="hint">Share of injured players by salary bracket</p>
                            {S.brackets.map((b) => (
                                <HBar key={b.l} wide label={b.l} value={`${b.s}%`} tip={`${b.l}\n${b.i} of ${b.n} players injured`}
                                    segments={[{ w: b.s, c: 'var(--ir-inj)' }, { w: 100 - b.s, c: 'var(--border-color)' }]} />
                            ))}
                        </div>
                        <div className="ir-card ir-pad ir-chart">
                            <h3>Injuries by body part</h3>
                            <p className="hint">Number of players (excluding rest, illness, personal)</p>
                            {S.body.map(([k, n]) => (
                                <HBar key={k} wide label={k} value={n} tip={`${k}\n${n} players`} segments={[{ w: (n / bmax) * 100, c: 'var(--ir-inj)' }]} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="ir-section">
                <div className="ir-head"><h2>Every player by salary</h2><p>{shown} players{view === 'teams' ? ` on ${teamList.length} teams · sorted by salary within each team` : ' · league-wide by 2026-27 salary'}</p></div>
                <div className="ir-controls">
                    <div className="ir-tabs" role="tablist">
                        <button type="button" role="tab" aria-selected={view === 'teams'} onClick={() => setView('teams')}>By team</button>
                        <button type="button" role="tab" aria-selected={view === 'rank'} onClick={() => setView('rank')}>League ranking</button>
                    </div>
                    <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search player or team …" aria-label="Search" />
                    {view === 'teams' && (
                        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort teams">
                            <option value="injsal">Teams: most injured salary</option>
                            <option value="payroll">Teams: highest payroll</option>
                            <option value="injcount">Teams: most injured players</option>
                            <option value="name">Teams: A–Z</option>
                        </select>
                    )}
                    <label className="ir-chk"><input type="checkbox" checked={onlyInj} onChange={(e) => setOnlyInj(e.target.checked)} /> injured only</label>
                    <label className="ir-chk"><input type="checkbox" checked={showTw} onChange={(e) => setShowTw(e.target.checked)} /> show two-way players</label>
                </div>

                {view === 'rank' ? (
                    rankList.length ? (
                        <div className="ir-card ir-rankwrap">
                            <table className="ir-table">
                                <thead><tr><th>#</th><th>Player / status</th><th className="r">2026-27 salary</th></tr></thead>
                                <tbody>{rankList.map((p) => <PlayerRow key={p.id} p={p} rank={S.rankOf.get(p.id) ?? ''} team={S.teams[p.team]} />)}</tbody>
                            </table>
                        </div>
                    ) : <div className="ir-card ir-empty">No matches.</div>
                ) : teamList.length ? (
                    <div className="ir-teams">
                        {teamList.map(({ t, ps }) => (
                            <article key={t.abbr} className="ir-card ir-team" style={{ '--tc': t.color, '--ta': t.alt }}>
                                <div className="ir-team-head">
                                    <div className="ir-badge">{t.abbr}</div>
                                    <div><h3>{t.name}</h3><div className="rec">Record {t.w}-{t.l} · {t.icount} injured</div></div>
                                    <div className="ir-team-stats"><b>{fmtM(t.pay)}</b>{pct(t.isal, t.pay)}% injured</div>
                                </div>
                                <div className="ir-team-meter" role="img" aria-label={`${pct(t.isal, t.pay)}% of payroll injured`}><i style={{ width: `${pct(t.isal, t.pay)}%` }} /><b /></div>
                                <div className="ir-team-body"><table className="ir-table"><tbody>{ps.map((p) => <PlayerRow key={p.id} p={p} />)}</tbody></table></div>
                            </article>
                        ))}
                    </div>
                ) : <div className="ir-card ir-empty">No matches.</div>}
            </section>

            <section className="ir-section ir-method">
                <div>
                    <h3>Methodology</h3>
                    <ul>
                        <li><b>Greyed out</b> = currently listed on the injury report with an <b>injury</b> (status “Out” or “Day-To-Day”). Rest, illness and personal absences are tagged but not greyed out or counted.</li>
                        <li>Data is refreshed <b>automatically every day</b>. Players listed as injured since tracking began ({since ? fmtD(since) : 'today'}) who are playing again are tagged “back”. Earlier injuries only appear if the player was still listed on that day.</li>
                        <li><b>Salary</b> = 2026-27 cap salary from ESPN contract data, cross-checked with Basketball-Reference (renegotiated summer contracts use the current deal).</li>
                        <li><b>Two-way players</b> have no standard contract or fixed cap salary; they are hidden by default and excluded from salary totals.</li>
                        <li>“Est. return” is the injury report's estimate, not a guarantee.</li>
                    </ul>
                </div>
                <div>
                    <h3>Sources</h3>
                    <ul>
                        <li><a href="https://www.espn.com/nba/injuries" target="_blank" rel="noopener noreferrer">ESPN NBA Injuries</a> (status, injury type, return estimate; notes via RotoWire)</li>
                        <li>ESPN team rosters incl. contract data · ESPN standings · ESPN news</li>
                        <li><a href="https://www.basketball-reference.com/contracts/players.html" target="_blank" rel="noopener noreferrer">Basketball-Reference player contracts</a> (cross-check)</li>
                        <li><a href={SOURCES.cbs} target="_blank" rel="noopener noreferrer">CBS Sports</a>, <a href="https://sports.yahoo.com/articles/were-few-games-nba-season-000733782.html" target="_blank" rel="noopener noreferrer">Yahoo Sports</a> (context, quotes)</li>
                    </ul>
                    <p>Independent fan project, not affiliated with the NBA or its teams. No guarantee of accuracy.</p>
                </div>
            </section>

            {tip && (
                <div className="ir-tip" style={{ left: Math.min(tip.x + 14, window.innerWidth - 280), top: Math.min(tip.y + 14, window.innerHeight - 140) }}>{tip.text}</div>
            )}
        </div>
    );
}

export default Injuries;
