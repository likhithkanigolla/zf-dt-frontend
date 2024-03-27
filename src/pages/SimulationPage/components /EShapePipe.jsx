import React from 'react';

function EShapePipe({ flow, onClick, text }) {
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
                        points="0 0, 100 0, 100 44, 90 44, 90 11, 57 11, 57 45, 46 45, 46 11, 10 11, 10 46, 0 46"
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
                    points="0 0, 100 0, 100 44, 90 44, 90 11, 57 11, 57 45, 46 45, 46 11, 10 11, 10 46, 0 46"
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

export default EShapePipe;
