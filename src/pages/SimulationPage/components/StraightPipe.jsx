import React from 'react';

function StraightPipe({ flow, onClick }) {
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
                    points="0 45, 100 45, 100 55, 0 55"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                    id='animatedPolygon'
                /> 
                :
                <polygon
                    points="0 45, 100 45, 100 55, 0 55"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                />
            }
        </svg>
    );
}

export default StraightPipe;
 