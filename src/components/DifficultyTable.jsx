import React from 'react';
import TeamBadge from './TeamBadge';

function DifficultyTable({ difficultyData, mode }) {
    return (
        <div className="difficulty-table-wrapper">
            <table className="difficulty-table">
                <thead>
                    <tr>
                        <th style={{ paddingLeft: '1.5rem' }}>Team</th>
                        <th style={{ paddingLeft: '2.5rem' }}>{mode === 'future' ? 'Upcoming' : 'Past'} Opponents →</th>
                        <th>Difficulty Score</th>
                    </tr>
                </thead>
                <tbody>
                    {difficultyData.map((data) => (
                        <tr key={data.team.id}>
                            <td>
                                <div className="team-info">
                                    <TeamBadge abbreviation={data.team.abbreviation} name={data.team.name} size="md" />
                                    {data.team.name}
                                </div>
                            </td>
                            <td className="opponents-cell">
                                <div className="opponents-list">
                                    {data.opponentDetails.map((opp, idx) => (
                                        <div key={`${opp.id}-${idx}`} className="opponent-item">
                                            <TeamBadge abbreviation={opp.abbreviation} name={opp.abbreviation} size="md" />
                                            <span className="opponent-record">{opp.record}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="difficulty-score-cell">
                                <div className={`difficulty-box ${data.opponentWinPct > 0.55 ? 'hard' : data.opponentWinPct < 0.45 ? 'easy' : 'medium'}`}>
                                    <span className="difficulty-percent">{(data.opponentWinPct * 100).toFixed(1)}%</span>
                                    <span className="difficulty-record">{data.opponentWins}-{data.opponentLosses}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DifficultyTable;
