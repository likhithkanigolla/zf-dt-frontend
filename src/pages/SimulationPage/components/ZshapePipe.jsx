import React, { useEffect, useState } from 'react';
import './ZshapePipe.css';

function ZshapePipe({ flow, onClick }) {
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
        <div className="svg-container" onClick={onClick}>
            <svg 
                viewBox="0 0 100 100"
                width="100vw" // Set width to 100% of the parent container
                height="50vw" // Set height to 50% of the parent container
                className='absolute bottom-10 right-52'
                style={{ maxWidth: '100vw', maxHeight: '50vw' }}
            >
                <defs>
                    <clipPath id="pipeClipPath">
                        <path
                            d="M 50,0 L 50,90 L 100,90 L 100,100 L 40,100 L 40,10 L 0,10 L 0,0 Z"
                        />
                    </clipPath>
                    <linearGradient id="waveGradient" x1="5%" y1="0%" x2="50%" y2="0%">
                        <stop offset="0%" stopColor="lightblue" />
                        <stop offset="50%" stopColor="#008ECC" />
                        <stop offset="100%" stopColor="lightblue" />
                    </linearGradient>
                </defs>

                <path
                    d="M 50,0 L 50,90 L 100,90 L 100,100 L 40,100 L 40,10 L 0,10 L 0,0 Z"
                    className="pipe-border"
                />

                {flow && (
                    <>
                        <g className="pipe-water">
                            {!initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="10"
                                    height="100"
                                    fill="lightblue"
                                    className="initial-flow"
                                />
                            )}
                            {initialFlowComplete && (
                                <rect
                                    x="0"
                                    y="0"
                                    width="200"
                                    height="100"
                                    fill="lightblue"
                                    className="initial-flow"
                                    style={{ transform: 'translateX(0)' }}
                                />
                            )}
                            <rect
                                x="0"
                                y="0"
                                width="200"
                                height="100"
                                fill="url(#waveGradient)"
                                className="wave-path"
                            />
                        </g>

                        <path
                            d="M 98,98 Q 100,105 98,110 T 98,120 T 98,130 T 98,140"
                            fill="none"
                            stroke=" rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="falling-water"
                        />

                        <path
                            d="M 98,98 Q 100,105 98,110 T 98,120 T 98,130 T 98,140"
                            fill="none"
                            stroke=" rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="falling-water2"
                        />

                        <path
                            d="M 98,98 Q 100,105 98,110 T 98,120 T 98,130 T 98,140"
                            fill="none"
                            stroke=" rgb(37, 194, 226)"
                            strokeWidth="4"
                            className="falling-water3"
                        />

                        {/* Water Bubbles */}
                        <circle className="bubble" cx="98" cy="140" r="1" />
                        <circle className="bubble" cx="102" cy="145" r="1.5" />
                        <circle className="bubble" cx="94" cy="138" r="2.5" />
                        <circle className="bubble" cx="99" cy="145" r="2.8" />
                        <circle className="bubble" cx="106" cy="148" r="2.0" />
                    </>
                )}
            </svg>
        </div>
    );
}

export default ZshapePipe;