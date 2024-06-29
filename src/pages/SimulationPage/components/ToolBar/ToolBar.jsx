import React from 'react';
import './ToolBar.css';


import MotorNode from "../../../images/MotorNode.png"; 
import WaterLevelNode from "../../../images/WaterLevelNode.png";
import WaterQualityNode from "../../../images/WaterQualityNode.png";
import WaterQuantityNode from "../../../images/WaterQuantityNode.png";
import LeakageIcon from "../../../images/leakage_water.png"; 

function Toolbar({ handleToolbarItemClick, handleLeakageIconClick }) {
    return (
        <div className="toolbar">
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterqualitysensor')}>
                <img src={WaterQualityNode} alt="Water Quality Sensor"/> 
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterquantitysensor')}>
                <img src={WaterQuantityNode} alt="Water Quantity Sensor"/> 
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterlevelsensor')}>
                <img src={WaterLevelNode} alt="Water Level Sensor"/>
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('motorsensor')}>
                <img src={MotorNode} alt="Motor Sensor"/>
            </button>
            <button className="tool-button" onClick={handleLeakageIconClick}>
                <img src={LeakageIcon} alt="Leakage" />
            </button>

            {/* <table>
                <tr>
                    <td>
                        <button className="tool-button" onClick={() => handleToolbarItemClick('waterqualitysensor')}>
                            <img src={WaterQualityNode} alt="Water Quality Sensor"/> waterqualitysensor
                        </button>
                    </td>
                    <td>
                        <button className="tool-button" onClick={() => handleToolbarItemClick('waterquantitysensor')}>
                            <img src={WaterQuantityNode} alt="Water Quantity Sensor"/> waterquantitysensor
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className="tool-button" onClick={() => handleToolbarItemClick('waterlevelsensor')}>
                            <img src={WaterLevelNode} alt="Water Level Sensor"/> waterlevelsensor
                        </button>
                    </td>
                    <td>
                        <button className="tool-button" onClick={() => handleToolbarItemClick('motorsensor')}>
                            <img src={MotorNode} alt="Motor Sensor"/> motorsensor
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className="tool-button" onClick={handleLeakageIconClick}>
                            <img src={LeakageIcon} alt="Leakage" /> Leakage
                        </button>
                    </td>
                </tr>
            </table> */}
        </div>
    );
}

export default Toolbar;