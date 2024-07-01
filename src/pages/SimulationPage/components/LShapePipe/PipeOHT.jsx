import React, { useEffect, useState } from 'react';
import './PipeOHT.css';

function LShapePipeOHT({ flow, onClick, text }) {
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
        <div className="lshapeoht-svg-container" onClick={onClick}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <clipPath id="lshapePipeClipPath">
                        <polygon points="9 75, 9 92, 100 91, 100 100, 0 100, 0 94, 0 75" />
                    </clipPath>
                    <linearGradient id="lshapeWaveGradient" x1="0%" y1="0%" x2="0%" y2="50%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <polygon
                    points="9 75, 9 92, 100 91, 100 100, 0 100, 0 94, 0 75"
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

                        <path
                            d="M 98,98 Q 100,105 98,110 T 98,120 T 98,130 T 98,140"
                            fill="none"
                            stroke=" rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="falling-wateroht"
                        />

                        <path
                            d="M 98,98 Q 100,105 98,110 T 98,120 T 98,130 T 98,140"
                            fill="none"
                            stroke=" rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="falling-water2oht"
                        />

                        <path
                            d="M 98,98 Q 100,105 98,110 T 98,120 T 98,130 T 98,140"
                            fill="none"
                            stroke=" rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="falling-water3oht"
                        />

                        {/* Water Bubbles */}
                        <circle className="bubbleoht" cx="98" cy="140" r="1" />
                        <circle className="bubbleoht" cx="102" cy="145" r="1.5" />
                        <circle className="bubbleoht" cx="94" cy="138" r="2.5" />
                        <circle className="bubbleoht" cx="99" cy="145" r="2.8" />
                       
                      
                    </>
                )}
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
            </svg>
        </div>
    );
}

export default LShapePipeOHT;
