import React, { useEffect, useState } from 'react';
import './LShapePipe.css';

function LShapePipe({ flow, onClick, text }) {
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
        <div className="lshape-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="lshapePipeClipPath">
                        <polygon points="10 0, 10 90, 100 90, 100 100, 0 100, 0 0" />
                    </clipPath>
                    <linearGradient id="lshapeWaveGradient" x1="0%" y1="0%" x2="0%" y2="50%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="10 0, 10 90, 100 90, 100 100, 0 100, 0 0"
                    className="lshape-pipe-border"
                />

                {flow && (
                    <>
                        <g className="lshape-pipe-water">
                            {!initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="10"
                                    fill="lightblue"
                                    className="lshape-initial-flow"
                                />
                            )}
                            {initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="200"
                                    fill="lightblue"
                                    className="lshape-initial-flow"
                                    style={{ transform: 'translateY(0)' }}
                                />
                            )}
                            <rect
                                x="0"
                                y="0"
                                width="100"
                                height="200"
                                fill="url(#lshapeWaveGradient)"
                                className="lshape-wave-path"
                            />
                        </g>

                      
                    </>
                )}
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
            </svg>
        </div>
    );
}

export default LShapePipe;
