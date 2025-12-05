import React from 'react';
import './InjuryReport.css';

const INJURY_STATUS_MAP = {
    "out": 'OUT',
    "day-to-day": "DTD"
}


function InjuryReport({ injuries, teamName }) {
    if (!injuries || injuries.length === 0) {
        return null; // Don't render if no injuries
    }

    return (
        <div className="injury-report">
            <h4 className="injury-report-title">{teamName} - Verletzte Spieler</h4>
            <div className="injury-table-container">
                <table className="injury-table">
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Name</th>
                            <th>INJ</th>
                            <th>PPG</th>
                            <th>REB</th>
                            <th>AST</th>
                            <th>STL</th>
                            <th>BLK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {injuries.map((injury) => (
                            <tr key={injury.id}>
                                <td className="injury-position">{injury.position}</td>
                                <td className="injury-name">{injury.name}</td>
                                <td className="injury-status">
                                    <span className="status-badge"
                                        style={{
                                            backgroundColor: INJURY_STATUS_MAP[injury.status.toLowerCase()] === 'OUT' ? '#9a1b1bff' : '#ffb70eff',
                                            color: INJURY_STATUS_MAP[injury.status.toLowerCase()] === 'OUT' ? '#ffffff' : '#000000'
                                        }}
                                    >{INJURY_STATUS_MAP[injury.status.toLowerCase()]}</span>
                                </td>
                                <td>{injury.stats?.ppg != null ? injury.stats.ppg.toFixed(1) : '-'}</td>
                                <td>{injury.stats?.reb != null ? injury.stats.reb.toFixed(1) : '-'}</td>
                                <td>{injury.stats?.ast != null ? injury.stats.ast.toFixed(1) : '-'}</td>
                                <td>{injury.stats?.stl != null ? injury.stats.stl.toFixed(1) : '-'}</td>
                                <td>{injury.stats?.blk != null ? injury.stats.blk.toFixed(1) : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InjuryReport;
