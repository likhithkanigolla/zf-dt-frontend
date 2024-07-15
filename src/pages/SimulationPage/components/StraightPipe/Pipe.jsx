import React, { useEffect, useState,forwardRef } from 'react';
import './Pipe.css';

const StraightPipe = forwardRef(({flow, onClick}, ref) => {
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
        <div className="straight-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="straightPipeClipPath">
                        <polygon ref={ref} points="0 45, 100 45, 100 55, 0 55" />
                    </clipPath>
                    <linearGradient id="straightWaveGradient" x1="5%" y1="0%" x2="50%" y2="0%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="0 45, 100 45, 100 55, 0 55"
                    className="straight-pipe-border"
                />

                {flow && (
                    <>
                        <g className="straight-pipe-water">
                            {!initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="45"
                                    width="100"
                                    height="10"
                                    fill="lightblue"
                                    className="straight-initial-flow"
                                />
                            )}
                            {initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="45"
                                    width="200"
                                    height="10"
                                    fill="lightblue"
                                    className="straight-initial-flow"
                                    style={{ transform: 'translateX(0)' }}
                                />
                            )}
                            <rect
                                x="0"
                                y="45"
                                width="200"
                                height="10"
                                fill="url(#straightWaveGradient)"
                                className="straight-wave-path"
                            />
                        </g>

                        
                    </>
                )}
            </svg>
        </div>
    );
});

export default StraightPipe;
