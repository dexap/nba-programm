
import React from 'react';

const StandingsTable = ({ conference, teams, onTeamSelect, selectedTeamId, selectedTeamAbbreviation, headToHeadResults }) => {
    return (
        <div className="standings-table-container">
            <h2 className="conference-title">{conference} Conference</h2>
            <div className="table-wrapper">
                <table className="standings-table">
                    <thead>
                        <tr>
                            <th className="th-team">Team</th>
                            <th className="th-h2h">Head-to-Head</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team, index) => {
                            const isSelected = selectedTeamId === team.id;
                            const h2h = headToHeadResults[team.id];

                            return (
                                <tr
                                    key={team.id}
                                    onClick={() => onTeamSelect(team)}
                                    className={`team-row ${isSelected ? 'selected' : ''}`}
                                >
                                    <td className="team-cell">
                                        <span className="rank">{index + 1}</span>
                                        <div className="team-info">
                                            {team.logo && <img src={team.logo} alt={team.abbreviation} className="team-logo" />}
                                            <span className="team-name">{team.name}</span>
                                            <span className="team-record">{team.record}</span>
                                        </div>
                                    </td>
                                    <td className="h2h-cell">
                                        {selectedTeamId ? (
                                            isSelected ? (
                                                <span className="current-selection">Selected</span>
                                            ) : (
                                                <div className="h2h-results">
                                                    {h2h && h2h.length > 0 ? (
                                                        h2h.map((game, i) => {
                                                            const isWin = game.winner === selectedTeamAbbreviation;
                                                            const resultClass = game.status === 'FINISHED' ? (isWin ? 'result-win' : 'result-loss') : 'result-scheduled';

                                                            return (
                                                                <div key={i} className={`game-result-item ${resultClass}`}>
                                                                    <span className="game-badge">
                                                                        {game.status === 'FINISHED' ? (isWin ? 'W' : 'L') : '•'}
                                                                    </span>
                                                                    {game.status === 'FINISHED' && (
                                                                        <span className="game-score">{game.score}</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="no-games">-</span>
                                                    )}
                                                </div>
                                            )
                                        ) : (
                                            <span className="no-games">Select a team</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StandingsTable;
