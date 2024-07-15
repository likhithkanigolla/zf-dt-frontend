import React, { forwardRef, useEffect, useState } from 'react';
import './ELpipe.css';

const ELpipe= forwardRef(({ flow, onClick, text }, ref) => {
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
        <div className="el-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="elPipeClipPath">
                        <polygon ref={ref} points="30 0, 30 10, 10 10, 10 87, 0 87, 0 60, 0 0" />
                    </clipPath>
                    <linearGradient id="elWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="30 0, 30 10, 10 10, 10 87, 0 87, 0 60, 0 0"
                    className="el-pipe-border"
                />

                {flow && (
                    <>
                        <g className="el-pipe-water">
                            {/* {!initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="30"
                                    height="87"
                                    fill="white"
                                    className="el-initial-flow"
                                />
                            )} */}
                            {initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="30"
                                    height="87"
                                    fill="lightblue"
                                    className="el-initial-flow"
                                    style={{ transform: 'translateY(-100%)' }}
                                />
                            )}
                            <rect
                                x="0"
                                y="0"
                                width="30"
                                height="87"
                                fill="url(#elWaveGradient)"
                                className="el-wave-path"
                            />
                        </g>
                    </>
                )}
                <text x="15" y="40" textAnchor="middle" dominantBaseline="middle">{text}</text>
            </svg>
        </div>
    );
});

export default ELpipe;
