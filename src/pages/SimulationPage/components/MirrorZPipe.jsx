import React, { useEffect, useState } from 'react';
import './MirrorZPipe.css';

function MirrorZPipe({ flow, onClick }) {
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
        <div className="mirror-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="mirrorPipeClipPath">
                        <polygon points="51 8, 51 100, 0 100, 0 92, 42 92, 42 0, 100 0, 100 8" />
                    </clipPath>
                    <linearGradient id="mirrorWaveGradient" x1="5%" y1="0%" x2="50%" y2="0%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="51 8, 51 100, 0 100, 0 92, 42 92, 42 0, 100 0, 100 8"
                    className="mirror-pipe-border"
                />

                {flow && (
                    <>
                        <g className="mirror-pipe-water">
                            {!initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="10"
                                    height="100"
                                    fill="lightblue"
                                    className="mirror-initial-flow"
                                />
                            )}
                            {initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="200"
                                    height="100"
                                    fill="lightblue"
                                    className="mirror-initial-flow"
                                    style={{ transform: 'translateX(0)' }}
                                />
                            )}
                            <rect
                                x="0"
                                y="0"
                                width="200"
                                height="100"
                                fill="url(#mirrorWaveGradient)"
                                className="mirror-wave-path"
                            />
                        </g>
                    </>
                )}
            </svg>
        </div>
    );
}

export default MirrorZPipe;
