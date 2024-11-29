import React, { useState } from 'react';
import './ToolBar.css';

function Toolbar({ handleToolbarItemClick, handleLeakageIconClick, setStepIndex, stepIndex }) {
    const [isDragging, setIsDragging] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // This is for Production Usage or Docker Usage only
    const basePath = process.env.REACT_APP_BASE_PATH || "";
    console.log("Base Path:", basePath);
    /*****************************************/

    const handleDragStart = (e, itemType) => {
        e.preventDefault();
        setDraggedItem(itemType);
        setIsDragging(true);
        
        // For touch events
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            setPosition({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;

        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            setPosition({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);

        // Trigger drop logic here
        if (draggedItem) {
            handleToolbarItemClick(draggedItem);
        }

        setDraggedItem(null);
    };

    return (
        <div className="toolbar">
            <button className="tool-button"
                onMouseDown={(e) => handleDragStart(e, 'waterqualitysensor')}
                onTouchStart={(e) => handleDragStart(e, 'waterqualitysensor')}
                onMouseMove={handleDragMove}
                onTouchMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}>
                <img src={`${basePath}/images/WaterQualityNode.png`} alt="Water Quality Sensor" />
                <span className="tool-button-title">Water Quality Sensor</span>
            </button>

            <button className="tool-button"
                onMouseDown={(e) => { handleDragStart(e, 'waterquantitysensor'); if(setStepIndex) { setStepIndex(stepIndex+1); }}}
                onTouchStart={(e) => { handleDragStart(e, 'waterquantitysensor'); if(setStepIndex) { setStepIndex(stepIndex+1); }}}
                onMouseMove={handleDragMove}
                onTouchMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}>
                <img src={`${basePath}/images/WaterQuantityNode.png`} alt="Water Quantity Sensor" />
                <span className="tool-button-title">Water Quantity Sensor</span>
            </button>

            <button className="tool-button"
                onMouseDown={(e) => { handleDragStart(e, 'waterlevelsensor'); if(setStepIndex) { setStepIndex(stepIndex+1); }}}
                onTouchStart={(e) => { handleDragStart(e, 'waterlevelsensor'); if(setStepIndex) { setStepIndex(stepIndex+1); }}}
                onMouseMove={handleDragMove}
                onTouchMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}>
                <img src={`${basePath}/images/WaterLevelNode.png`} alt="Water Level Sensor" className='waterlevel-tool' />
                <span className="tool-button-title">Water Level Sensor</span>
            </button>

            <button className="tool-button"
                onMouseDown={(e) => handleDragStart(e, 'motorsensor')}
                onTouchStart={(e) => handleDragStart(e, 'motorsensor')}
                onMouseMove={handleDragMove}
                onTouchMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}>
                <img src={`${basePath}/images/MotorNode.png`} alt="Motor Sensor" />
                <span className="tool-button-title">Motor Sensor</span>
            </button>
        </div>
    );
}

export default Toolbar;
