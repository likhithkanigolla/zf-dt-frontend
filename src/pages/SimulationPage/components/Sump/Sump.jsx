import React, { useEffect, useState, forwardRef } from 'react';
import './Sump.css';

const Sump = forwardRef(({ waterInSump, sumpCapacity, handleIconClick}, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [waterColor, setWaterColor] = useState('lightblue');
  let calculatedTdsVal = 520

  useEffect(() => {
    console.log("TDS VAL HERE", calculatedTdsVal)
    if (calculatedTdsVal >= 0 && calculatedTdsVal <= 150) {
      setWaterColor('rgb(37, 194, 226)');
    } else if (calculatedTdsVal >= 151 && calculatedTdsVal <= 250) {
      setWaterColor('#82A460');
    } else if (calculatedTdsVal >= 251 && calculatedTdsVal <= 400) {
      setWaterColor('#C0C0C2');
    } else if (calculatedTdsVal >= 401 && calculatedTdsVal <= 600) {
      setWaterColor('#CAAA76');
    }
  }, [calculatedTdsVal]);

  useEffect(() => {
    const targetPercentage = (waterInSump / sumpCapacity) * 100;
    setFillPercentage(targetPercentage);
  }, [waterInSump, sumpCapacity]);

  return (
    <div>
      <div className="sump-container" ref={ref} style={{ position: "absolute", top: "8vw", left: "11vw" }}>
        <div className="sump" onClick={handleIconClick}>
          <div className="sump-background"></div>
          <div className="sump-fill" style={{ height: `${fillPercentage}%`, backgroundColor: waterColor }}>
            <div className="sumpwave" style={{ height: `${fillPercentage}%`, backgroundColor: waterColor }}></div>
            <div className="sumpwave" style={{ height: `${fillPercentage}%`, backgroundColor: waterColor }}></div>
          </div>
        </div>
      </div>
      <div className="sump-text">SUMP: <b>{waterInSump.toFixed(2)}L</b></div>
    </div>
  );
});

export default Sump;
