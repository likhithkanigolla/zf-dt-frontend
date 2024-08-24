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

    // Responsive timer styles
    const timerStyles = {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '1vw',  // Using vw units to make the font responsive
        color: 'black',
        padding: '1vw',  // Padding using vw units
        borderRadius: '1vw',
        textAlign: 'center',
        width: 'fit-content',
        margin: 'auto',
    };

    return <div style={timerStyles}>Time Elapsed: {formattedTime}</div>;
};

export default Timer;
