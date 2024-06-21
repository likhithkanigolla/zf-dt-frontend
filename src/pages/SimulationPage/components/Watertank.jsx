import React, { useEffect, useState } from 'react';
import './WaterTank.css'; // Import CSS file

const WaterTank = ({ waterInOHT, handleIconClick }) => {
const [fillPercentage, setFillPercentage] = useState(0);
const [isOverflowing, setIsOverflowing] = useState(false);
const [inputValues] = useState({
  timeMultiplier: "1",
  SandQuantity: "2000",
  SoilQuantity: "3000",
  voltage: "240",
  current: "11",
  power_factor: "0.11",
  motor_efficiency: "0.85",
  temperature: "25",
  desired_tds: "65",
  membrane_area: "3700",
  sumpCapacity: "60000",
  ohtCapacity: "50000",
  ro_ohtCapacity: "1000",
  // flowrate: "5"
});

useEffect(() => {
const targetPercentage = (waterInOHT /20); 
const increment = targetPercentage > fillPercentage ? 1 : -1;
let currentPercentage = fillPercentage;
const animationInterval = setInterval(() => {
  if ((increment > 0 && currentPercentage >= targetPercentage) || (increment < 0 && currentPercentage <= targetPercentage)) {
    clearInterval(animationInterval);
    setIsOverflowing(targetPercentage > 90);
  } else {
    currentPercentage += increment;
    setFillPercentage(currentPercentage);
  }
}, 10);

return () => clearInterval(animationInterval); // Cleanup interval on component unmount
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
<div style={{ fontSize: "14px", color: "" , position: "" }}>KRB OHT - {waterInOHT}L</div>
</div>
);
}

export default WaterTank;