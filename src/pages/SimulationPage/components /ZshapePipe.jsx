import React from 'react';

function ZshapePipe({ flow, onClick }) {
    return (
        <svg 
            width="6vw" // Set width to 100% of the parent container
            height="8vw" // Set height to 50% of the parent container
            viewBox="0 0 100 100" // Set the viewBox to maintain aspect ratio
            className='absolute bottom-10 right-52'
            onClick={onClick} // Add onClick event here
            style={{ maxWidth: '100vw', maxHeight: '50vw' }} // Limit maximum width and height
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
 