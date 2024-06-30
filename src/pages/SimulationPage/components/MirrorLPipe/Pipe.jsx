import React, { useEffect, useState } from 'react';
import './Pipe.css';

function MirrorLPipe({ flow, onClick }) {
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
            <svg viewBox="0 0 110 150">
                <defs>
                    <clipPath id="mirrorPipeClipPath">
                        <polygon points="37 92, 91 91, 92 0, 91 0, 100 0, 100 15, 100 85, 100 100, 85 100, 37 100, 37 100, 37 92" />
                    </clipPath>
                    <linearGradient id="mirrorWaveGradient" x1="5%" y1="0%" x2="50%" y2="0%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="37 92, 91 91, 92 0, 91 0, 100 0, 100 15, 100 85, 100 100, 85 100, 37 100, 37 100, 37 92"
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

                        {/* <path
                            d="M 98,8 Q 100,15 98,20 T 98,30 T 98,40 T 98,50"
                            fill="none"
                            stroke="rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="mirror-falling-water"
                        />

                        <path
                            d="M 98,8 Q 100,15 98,20 T 98,30 T 98,40 T 98,50"
                            fill="none"
                            stroke="rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="mirror-falling-water2"
                        />

                        <path
                            d="M 98,8 Q 100,15 98,20 T 98,30 T 98,40 T 98,50"
                            fill="none"
                            stroke="rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="mirror-falling-water3"
                        /> */}

                        {/* Water Bubbles */}
                        {/* <circle className="mirror-bubble" cx="98" cy="50" r="1" />
                        <circle className="mirror-bubble" cx="102" cy="55" r="1.5" />
                        <circle className="mirror-bubble" cx="94" cy="48" r="2.5" />
                        <circle className="mirror-bubble" cx="99" cy="55" r="2.8" />
                        <circle className="mirror-bubble" cx="106" cy="58" r="2.0" /> */}
                    </>
                )}
            </svg>
        </div>
    );
}

export default MirrorLPipe;
