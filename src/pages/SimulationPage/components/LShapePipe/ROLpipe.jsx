import React, { forwardRef, useEffect, useState } from 'react';
import './ROLpipe.css';

const ROLpipe=forwardRef(({ flow, onClick, text }, ref) => {
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
        <div className="rol-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="rolPipeClipPath">
                        <polygon ref={ref} points="80 0, 100 0, 100 60, 100 80, 91 80, 91 9, 80 9" />
                    </clipPath>
                    <linearGradient id="rolWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="80 0, 100 0, 100 60, 100 80, 91 80, 91 9, 80 9"
                    className="rol-pipe-border"
                />

                {flow && (
                    <>
                        <g className="rol-pipe-water">
                            {!initialFlowComplete && (
                                <rect
                                    x="69"
                                    y="0"
                                    width="31"
                                    height="11"
                                    fill="white"
                                    className="rol-initial-flow"
                                />
                            )}
                            {initialFlowComplete && (
                                <rect
                                    x="69"
                                    y="0"
                                    width="31"
                                    height="100"
                                    fill="lightblue"
                                    className="rol-initial-flow"
                                    style={{ transform: 'translateY(-50)' }}
                                />
                            )}
                            <rect
                                x="69"
                                y="0"
                                width="31"
                                height="100"
                                fill="url(#rolWaveGradient)"
                                className="rol-wave-path"
                            />
                        </g>
                    </>
                )}
                <text x="85" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
            </svg>
        </div>
    );
});

export default ROLpipe;
