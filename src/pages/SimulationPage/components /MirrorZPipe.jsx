import React from 'react';

function MirrorZPipe({ flow, onClick }) {
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
                    points="51 8, 51 100, 0 100, 0 92, 42 92, 42 0, 100 0, 100 8"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                    id='animatedPolygon'
                /> 
                :
                <polygon
                    points="51 8, 51 100, 0 100, 0 92, 42 92, 42 0, 100 0, 100 8"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="2"
                />
            }
        </svg>
    );
}

export default MirrorZPipe;
