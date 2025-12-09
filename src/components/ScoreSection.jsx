import React from 'react';

function ScoreSection({ totalScore, primaryColor, isNeutral, advantageTeam }) {
    const formatScore = (val) => {
        return Math.abs(val).toFixed(2);
    };

    return (
        <div className="score-section">
            <div className="score-value" style={{ color: primaryColor }}>
                {formatScore(totalScore)}
            </div>
            <div className="advantage-text" style={{ color: primaryColor }}>
                {isNeutral ? 'Neutral Matchup' : `${advantageTeam.name} Advantage`}
            </div>

            <div className="score-bar-container">
                {/* Center Marker */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateX(-50%)',
                    zIndex: 1
                }}></div>

                {/* Fill */}
                {/* 
                    If Home (Left) has advantage (Score > 0): Bar grows from Center to Right.
                    If Away (Right) has advantage (Score < 0): Bar grows from Center to Left.
                */}
                <div
                    className="score-bar-fill"
                    style={{
                        left: totalScore > 0 ? '50%' : 'auto',
                        right: totalScore > 0 ? 'auto' : '50%',
                        width: `${Math.abs(totalScore) * 50}%`, // Scale: 1.0 score = 50% width from center
                        backgroundColor: primaryColor,
                        borderRadius: totalScore > 0 ? '0 4px 4px 0' : '4px 0 0 4px'
                    }}
                ></div>
            </div>
        </div>
    );
}

export default ScoreSection;
