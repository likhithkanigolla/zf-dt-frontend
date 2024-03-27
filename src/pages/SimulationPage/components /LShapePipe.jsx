import React from 'react';

function LShapePipe({ flow, onClick, text }) {
    return (
        <svg 
            width="100" 
            height="100" 
            className='absolute bottom-10 right-52'
            onClick={onClick} // Add onClick event here
        >
            {flow ? 
                <>
                    <polygon
                        points="5 0, 5 95, 100 95, 100 100, 0 100, 0 0"
                        fill='transparent'
                        stroke="black"
                        strokeWidth="2"
                        id='animatedPolygon'
                    /> 
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
                </>
                :
                <>
                <polygon
                    points="5 0, 5 95, 100 95, 100 100, 0 100, 0 0"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                />
                 <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
                </>
                
            }
        </svg>
    );
}

export default LShapePipe;
