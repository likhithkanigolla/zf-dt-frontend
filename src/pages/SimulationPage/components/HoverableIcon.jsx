import React, { useState } from 'react';

const HoverableIcon = ({ src, alt, onClick, dataId, data, rotation, refreshData }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer', // Add cursor pointer to indicate clickable element
      }}
      onMouseEnter={() => setIsHovered(true)&refreshData}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '2vw',
          height: '2vw',
          borderRadius: '50%', // Makes the image circular (adjust as needed)
          zIndex:15
        }}
        onClick={onClick}
      />
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5vw', // Adjusted to 2.5vw for slight separation from image
            left: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)', // Glassmorphism background color
            padding: '1vw', // Increased padding for better visual appearance
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Glassmorphism box shadow
            backdropFilter: 'blur(7px)', // Glassmorphism backdrop filter
            WebkitBackdropFilter: 'blur(7px)', // Vendor prefix for backdrop filter
            borderRadius: '10px', // Rounded corners
            zIndex: 8,
            minWidth: '10vw', // Ensure a minimum width for the tooltip
            textAlign: 'center', // Center text within the tooltip
            whiteSpace: 'nowrap', // Prevent text wrapping
            transform: rotation ? `rotate(${-rotation}deg) translateY(-190%) translateX(-30%)` : 'translateX(-50%)',
          }}
        >
        <b>{dataId}</b>
          <br></br>
          {data}
        </div>
      )}
    </div>
  );
};

export default HoverableIcon;