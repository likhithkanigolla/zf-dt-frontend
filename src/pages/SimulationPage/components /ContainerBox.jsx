import React from 'react';

function ContainerBox({ flow, onClick, text }) {
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
                        points="0 0, 100 0, 100 100, 0 100"
                        fill='transparent'
                        stroke="black"
                        strokeWidth="4"
                        id='animatedPolygon'
                    /> 
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
                </>
                :
                <>
                <polygon
                    points="0 0, 100 0, 100 100, 0 100"
                    fill='transparent'
                    stroke="black"
                    strokeWidth="4"
                />
                 <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">{text}</text>
                </>
                
            }
        </svg>
    );
}

export default ContainerBox;
