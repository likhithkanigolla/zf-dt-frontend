import React from 'react';

// Load Google Fonts
const googleFontLink = document.createElement('link');
googleFontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
googleFontLink.rel = 'stylesheet';
document.head.appendChild(googleFontLink);

const Timer = ({ elapsedTime }) => {
    // Convert elapsed time to hours, minutes, and seconds
    const elapsedTimeInt = parseInt(elapsedTime);
    const hours = Math.floor(elapsedTimeInt / 3600);
    const minutes = Math.floor((elapsedTimeInt % 3600) / 60);
    const seconds = elapsedTimeInt % 60;

    // Format the time with leading zeros
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Dark timer
    const timerStyles = {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '0.8em',
        color: 'black',
        backgroundColor: '#f2f2f2',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        width: 'fit-content',
        margin: '20px auto',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    };

    // const timerStyles = {
    //     fontFamily: "'Orbitron', sans-serif",
    //     fontSize: '0.8vw',
    //     color: '#333333',  // Dark gray text color
    //     backgroundColor: '#f2f2f2',  // Light gray background color
    //     padding: '15px',
    //     borderRadius: '10px',
    //     textAlign: 'center',
    //     width: 'fit-content',
    //     margin: '20px auto',
    //     boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    // };

    return <div style={timerStyles}>Time Elapsed: {formattedTime}</div>;
};

export default Timer;
