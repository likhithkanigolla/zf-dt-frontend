import React, { useEffect, useState } from 'react';
import './Sump.css';

const Sump = ({ waterInSump, sumpCapacity, handleIconClick }) => {
const [fillPercentage, setFillPercentage] = useState(0);

  // const [inputValues] = useState({
  //   timeMultiplier: "1",
  //   SandQuantity: "2000",
  //   SoilQuantity: "3000",
  //   voltage: "240",
  //   current: "11",
  //   power_factor: "0.11",
  //   motor_efficiency: "0.85",
  //   temperature: "25",
  //   desired_tds: "65",
  //   membrane_area: "3700",
  //   sumpCapacity: "6000",
  //   ohtCapacity: "10000",
  //   ro_ohtCapacity: "1000",
  //   // flowrate: "5"
  // });

  useEffect(() => {
    const targetPercentage = (waterInSump / sumpCapacity)*100; 
    setFillPercentage(targetPercentage)
   ;
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
      <div style={{ fontSize: "14px" }}>SUMP - {waterInSump.toFixed(2)}L</div>
    </div>
  );
}

export default Sump;
