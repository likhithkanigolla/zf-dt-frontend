import React from 'react';

function ZshapePipe({ flow, onClick }) {
    return (
        <svg 
            width="100" 
            height="100" 
            className='absolute bottom-10 right-52'
            onClick={onClick} // Add onClick event here
        >
            {flow ? 
                <polygon
                    points="51 0, 51 92, 99 92, 100 100, 43 100, 43 8, 0 8, 0 0"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                    id='animatedPolygon'
                /> 
                :
                <polygon
                    points="51 0, 51 92, 99 92, 100 100, 43 100, 43 8, 0 8, 0 0"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                />
            }
        </svg>
    );
}

export default ZshapePipe;
 