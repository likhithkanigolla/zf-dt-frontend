import React, { useState } from 'react';

const HoverableIcon = ({ src, alt, onClick, dataId, data, rotation, refreshData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    else{
    setIsEnabled(!isEnabled);
    }
  };

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
        onClick={onClick ? onClick : handleClick} 
      />
      {isEnabled && isHovered && (
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
      {!isEnabled && (
        <div
          style={{
            content: '',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '100%',
            background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><circle cx="12" cy="12" r="10"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg>') no-repeat center`,
            backgroundSize: 'contain',
            pointerEvents: 'none',
            borderRadius: '50%', // Keep the circular shape
          }}
        />
      )}
    </div>
  );
};

export default HoverableIcon;