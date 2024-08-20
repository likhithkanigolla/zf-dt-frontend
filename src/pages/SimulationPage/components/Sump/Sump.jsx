import React, { useEffect, useState, forwardRef } from 'react';
import './Sump.css';

const Sump = forwardRef(({ waterInSump, sumpCapacity, handleIconClick, calculatedTdsVal }, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [waterColor, setWaterColor] = useState('lightblue');
  const [impurities, setImpurities] = useState([]);
  const [speed, setSpeed] = useState(2); // Configurable speed

  useEffect(() => {
    if (calculatedTdsVal >= 0 && calculatedTdsVal <= 150) {
      setWaterColor('rgb(37, 194, 226)');
    } else if (calculatedTdsVal >= 151 && calculatedTdsVal <= 250) {
      setWaterColor('#82A460');
    } else if (calculatedTdsVal >= 251 && calculatedTdsVal <= 400) {
      setWaterColor('#6B6947');
    } else if (calculatedTdsVal >= 401) {
      setWaterColor('#CAAA76');
    }

    // Update impurities based on TDS value
    setImpurities(generateImpurities(calculatedTdsVal));
  }, [calculatedTdsVal]);

  useEffect(() => {
    const targetPercentage = (waterInSump / sumpCapacity) * 100;
    setFillPercentage(targetPercentage);
  }, [waterInSump, sumpCapacity]);

  const generateImpurities = (tdsValue) => {
    let count = 0;
    if (tdsValue >= 0 && tdsValue <= 50) {
      count = 6;
    } else if (tdsValue >= 51 && tdsValue <= 100) {
      count = 9 + Math.floor(Math.random() * 2);
    } else if (tdsValue >= 101 && tdsValue <= 150) {
      count = 10 + Math.floor(Math.random() * 4);
    } else if (tdsValue >= 151 && tdsValue <= 250) {
      count = 80 + Math.floor(Math.random() * 6);
    } else if (tdsValue >= 251 && tdsValue <= 400) {
      count = 50 + Math.floor(Math.random() * 6);
    } else if (tdsValue >= 401 && tdsValue <= 600) {
      count = 35 + Math.floor(Math.random() * 6);
    } else if (tdsValue > 600) {
      count = 500;
    }

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        left: Math.random() * 100, // Random position within the container
        top: Math.random() * 100,
        size: Math.random() * 0.5 + 0.1, // Random size
      });
    }
    return particles;
  };

  const moveParticles = () => {
    setImpurities(impurities.map(impurity => ({
      ...impurity,
      left: (impurity.left + Math.random() * speed) % 100,
      top: (impurity.top + Math.random() * speed) % 100,
    })));
  };

  useEffect(() => {
    const interval = setInterval(moveParticles, 100);
    return () => clearInterval(interval);
  }, [impurities, speed]);

  return (
    <div>
      <div className="sump-container" ref={ref} style={{ position: "absolute", top: "8vw", left: "11vw" }}>
        <div className="sump" onClick={handleIconClick}>
          <div className="sump-background"></div>
          <div className="sump-fill" style={{ height: `${fillPercentage}%`, backgroundColor: waterColor }}>
            {impurities.map((impurity, index) => (
              <div
                key={index}
                className="impurity"
                style={{
                  position: 'absolute',
                  left: `${impurity.left}%`,
                  top: `${impurity.top}%`,
                  width: `${impurity.size}vw`,
                  height: `${impurity.size}vw`,
                  backgroundColor: 'gray',
                  borderRadius: '50%',
                  zIndex: '2'
                }}
              ></div>
            ))}
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
