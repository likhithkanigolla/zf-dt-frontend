import React, { useEffect, useState, forwardRef } from 'react';
import './WaterTank.css'; // Import CSS file

const WaterTank = forwardRef(({ waterInOHT, ohtCapacity, handleIconClick }, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const targetPercentage = (waterInOHT / ohtCapacity) * 100;
    setFillPercentage(targetPercentage);
  }, [waterInOHT, ohtCapacity]);

  return (
    <div className="water-tank-container" ref={ref} style={{ position: "absolute", top: "0.3vw", left: "28.2vw" }}>
      {/* <div className={`water-pour ${isOverflowing ? 'overflowing' : ''}`}></div> */}
      <div className="water-tank" onClick={handleIconClick}>
        <div className="water-tank-cap"></div>
        <div className="water-tank-cone"></div>
        <div className="water-tank-background"></div>
        {/* <div className="overflow-tube" style={{ top: '10%' }}>
          {isOverflowing && <div className="overflow-water"></div>}
        </div> */}
        <div className="water-tank-fill" style={{ height: `${fillPercentage}%` }}></div>
          <div className="wave" style={{ height: `${fillPercentage}%` }}></div>
          <div className="wave wave2" style={{ height: `${fillPercentage}%` }}></div>
          
      </div>
      <div style={{ fontSize: "1vw", position: "relative", top: "0vw", left: "1vw" }}>KRB OHT</div>
      <div style={{ fontSize: "1vw", position: "relative", top: "0vw", left: "1vw" }}><b>{waterInOHT.toFixed(2)}L</b></div>
    </div>
  );
});

export default WaterTank;
