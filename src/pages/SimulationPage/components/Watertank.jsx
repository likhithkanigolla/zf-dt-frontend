import React, { useEffect, useState } from 'react';
import './WaterTank.css'; // Import CSS file

const WaterTank = ({ waterInOHT,ohtCapacity, handleIconClick }) => {
const [fillPercentage, setFillPercentage] = useState(0);
const [isOverflowing, setIsOverflowing] = useState(false);


useEffect(() => {
const targetPercentage = (waterInOHT / ohtCapacity)*100; 
setFillPercentage(targetPercentage)
// Cleanup interval on component unmount
}, [waterInOHT]);

return (
<div className="water-tank-container" style={{ position: "absolute", top: "9vw", left: "29.5vw" }}>
<div className={`water-pour ${isOverflowing ? 'overflowing' : ''}`}></div>
<div className="water-tank" onClick={handleIconClick}>
<div className="water-tank-cap"></div>
<div className="water-tank-cone"></div>
<div className="water-tank-background"></div>
<div className="overflow-tube" style={{ top: '10%' }}>
{isOverflowing && <div className="overflow-water"></div>}
</div>
<div className="water-tank-fill" style={{ height: `${fillPercentage}%` }}>
<div className="watertank-wave"></div>
<div className="watertank-wave"></div>
</div>
<div className="water-tank-percentage">{`${fillPercentage.toFixed(2)}%`}</div>
</div>
<div style={{ fontSize: "14px", color: "" , position: "" }}>KRB OHT</div>
<div style={{ fontSize: "14px", color: "" , position: "" }}><b>{waterInOHT.toFixed(2)}L</b></div>
</div>
);
}

export default WaterTank;