import React, { useEffect, useState } from 'react';
import { forwardRef } from 'react';
import './Sump.css';

const Sump = forwardRef(({ waterInSump, sumpCapacity, handleIconClick }, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    const targetPercentage = (waterInSump / sumpCapacity) * 100;
    setFillPercentage(targetPercentage);
  }, [waterInSump, sumpCapacity]);

  return (
    <div>
    <div className="sump-container" ref={ref} style={{ position: "absolute", top: "13vw", left: "13vw" }}>
      <div className="sump" onClick={handleIconClick}>
        <div className="sump-background"></div>
        <div className="sump-fill" style={{ height: `${fillPercentage}%` }}>
          <div className="sumpwave"></div>
          <div className="sumpwave"></div>
        </div>
      </div>
    </div>
    <div style={{ fontSize: "14px", position: "initial" }}>SUMP</div>
    <div style={{ fontSize: "14px" }}><b>{waterInSump.toFixed(2)}L</b></div>
    </div>
  );
});

export default Sump;
