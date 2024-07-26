import React, { useEffect, useState, forwardRef } from 'react';
import './RoOHT.css'; // Import CSS file

const RoOHT = forwardRef(({ waterInROFilter, ro_ohtCapacity, handleIconClick }, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const targetPercentage = (waterInROFilter / ro_ohtCapacity) ;
    setFillPercentage(targetPercentage);
  }, [waterInROFilter, ro_ohtCapacity]);
  
  return (
    <div className="Ro-tank-container" ref={ref} style={{ position: "absolute", top: "6vw", left: "53.8vw" }}>
      {/* <div className={`water-pour ${isOverflowing ? 'overflowing' : ''}`}></div> */}
      <div className="Ro-tank" onClick={handleIconClick}>
        {/* <div className="Ro-tank-cap"></div> */}
        <div className="Ro-tank-cone"></div>
        <div className="Ro-tank-background"></div>
        {/* <div className="overflow-tube" style={{ top: '10%' }}>
          {isOverflowing && <div className="overflow-water"></div>}
        </div> */}
        <div className="Ro-tank-fill" style={{ height: `${fillPercentage}%` }}></div>
          <div className="ro-wave" ></div>
          <div className="ro-wave wave2" ></div>
          
      </div>
      <div style={{ fontSize: "0.5vw", position: "relative", bottom: "3.35vw", right: "2vw" }}>RO OHT</div>
      <div style={{ fontSize: "0.5vw", position: "relative", bottom: "3.4vw", right: "1.8vw" }}><b>{waterInROFilter.toFixed(2)}L</b></div>
    </div>
  );
});

export default RoOHT;
