import React, { useEffect, useState } from 'react';
import './Sump.css';

const Sump = ({ waterInSump, handleIconClick }) => {
  const [fillPercentage, setFillPercentage] = useState(0);

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
    sumpCapacity: "6000",
    ohtCapacity: "10000",
    ro_ohtCapacity: "1000",
    // flowrate: "5"
  });

  useEffect(() => {
    const targetPercentage = (waterInSump / inputValues.sumpCapacity ); // Assuming the sump capacity is 10000L
    const increment = targetPercentage > fillPercentage ? 1 : -1;

    let currentPercentage = fillPercentage;
    const animationInterval = setInterval(() => {
      if ((increment > 0 && currentPercentage >= targetPercentage) || (increment < 0 && currentPercentage <= targetPercentage)) {
        clearInterval(animationInterval);
      } else {
        currentPercentage += increment;
        setFillPercentage(currentPercentage);
      }
    }, 10);

    return () => clearInterval(animationInterval); // Cleanup interval on component unmount
  }, [waterInSump]);

  return (
    <div className="sump-container" style={{ position: "absolute", top: "13vw", left: "13vw" }}>
      <div className="sump" onClick={handleIconClick}>
        <div className="sump-background"></div>
        <div className="sump-fill" style={{ height: `${fillPercentage}%` }}>
          <div className="sumpwave"></div>
          <div className="sumpwave"></div>
        </div>
        <div className="sump-percentage">{`${fillPercentage.toFixed(2)}%`}</div>
      </div>
      <div style={{ fontSize: "14px" }}>SUMP - {waterInSump}L</div>
    </div>
  );
}

export default Sump;
