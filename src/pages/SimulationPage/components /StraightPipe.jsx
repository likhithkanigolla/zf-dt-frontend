import React from 'react';

function StraightPipe({ flow, onClick }) {
    return (
        <svg 
            width="100" 
            height="100" 
            className='absolute bottom-10 right-52'
            onClick={onClick} // Add onClick event here
        >
            {flow ? 
                <polygon
                    points="0 45, 100 45, 100 55, 0 55"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="1"
                    id='animatedPolygon'
                /> 
                :
                <polygon
                    points="0 45, 100 45, 100 55, 0 55"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="1"
                />
            }
        </svg>
    );
}

export default StraightPipe;
 