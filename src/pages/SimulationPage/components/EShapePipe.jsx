import React, { useEffect, useState } from 'react';
import './EShapePipe.css';

function EShapePipe({ flow, onClick, text }) {
    const [initialFlowComplete, setInitialFlowComplete] = useState(false);

    useEffect(() => {
        if (flow) {
            const timer = setTimeout(() => {
                setInitialFlowComplete(true);
            }, 2000); // Match this duration to the initialFlow animation duration

            return () => clearTimeout(timer);
        }
    }, [flow]);

    return (
        <div className="eshape-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="eshapePipeClipPath">
                        <polygon points="100 50, 100 100, 90 100, 90 60, 55 60, 55 100, 45 100, 45 60, 10 60, 10 100, 0 100, 0 50" />
                    </clipPath>
                    <linearGradient id="eshapeWaveGradient" x1="0%" y1="5%" x2="0%" y2="50%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="100 50, 100 100, 90 100, 90 60, 55 60, 55 100, 45 100, 45 60, 10 60, 10 100, 0 100, 0 50"
                    className="eshape-pipe-border"
                />

                {flow && (
                    <>
                        <g className="eshape-pipe-water">
                            {!initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="10"
                                    fill="lightblue"
                                    className="eshape-initial-flow"
                                />
                            )}
                            {initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="200"
                                    fill="lightblue"
                                    className="eshape-initial-flow"
                                    style={{ transform: 'translateY(0)' }}
                                />
                            )}
                            <rect
                                x="0"
                                y="0"
                                width="100"
                                height="200"
                                fill="url(#eshapeWaveGradient)"
                                className="eshape-wave-path"
                            />
                        </g>

                       
                    </>
                )}
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
            </svg>
        </div>
    );
}

export default EShapePipe;
