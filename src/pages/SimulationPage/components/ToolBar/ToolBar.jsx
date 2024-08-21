import React, { useState } from 'react';
import './ToolBar.css';

import MotorNode from "../../../images/MotorNode.png"; 
import WaterLevelNode from "../../../images/WaterLevelNode.png";
import WaterQualityNode from "../../../images/WaterQualityNode.png";
import WaterQuantityNode from "../../../images/WaterQuantityNode.png";


function Toolbar({ handleToolbarItemClick, handleLeakageIconClick, setStepIndex, stepIndex }) {
    return (
        <div className="toolbar">
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterqualitysensor')}>
                <img src={WaterQualityNode} alt="Water Quality Sensor" />
                <span className="tool-button-title">Water Quality Sensor</span>
            </button>
            <button className="tool-button" onClick={() => { handleToolbarItemClick('waterquantitysensor'); if(setStepIndex) { setStepIndex(stepIndex+1); }}}>
                <img src={WaterQuantityNode} alt="Water Quantity Sensor" />
                <span className="tool-button-title">Water Quantity Sensor</span>
            </button>
            <button className="tool-button" onClick={() => { handleToolbarItemClick('waterlevelsensor'); if(setStepIndex) { setStepIndex(stepIndex+1); }}}>
                <img src={WaterLevelNode} alt="Water Level Sensor" className='waterlevel-tool'/>
                <span className="tool-button-title">Water Level Sensor</span>
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('motorsensor')}>
                <img src={MotorNode} alt="Motor Sensor" />
                <span className="tool-button-title">Motor Sensor</span>
            </button>
        </div>
    );
}

export default Toolbar;
