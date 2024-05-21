import React from 'react';

function LShapePipe({ flow, onClick, text }) {
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
                <>
                    <polygon
                        points="10 0, 10 90, 100 90, 100 100, 0 100, 0 0"
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
                    points="10 0, 10 90, 100 90, 100 100, 0 100, 0 0"
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
