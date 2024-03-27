import React from 'react';

function MirrorZPipe({ flow, onClick }) {
    return (
        <svg 
            width="100" 
            height="100" 
            className='absolute bottom-10 right-52'
            onClick={onClick} // Add onClick event here
        >
            {flow ? 
                <polygon
                    points="51 8, 51 100, 0 100, 0 92, 42 92, 42 0, 100 0, 100 8"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="1"
                    id='animatedPolygon'
                /> 
                :
                <polygon
                    points="51 8, 51 100, 0 100, 0 92, 42 92, 42 0, 100 0, 100 8"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="1"
                />
            }
        </svg>
    );
}

export default MirrorZPipe;
