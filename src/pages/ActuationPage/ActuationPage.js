// ActuationPage.js
import React, { useState } from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';
import blueprint from './images/simulation_bp.png';

import { GiWaterTower } from "react-icons/gi";
import roPlantImage from './images/ro_plant.png'
import roCoolerImage from './images/ro_cooler.png'
import Motor from './images/Motor.png';

const ActuationPage = () => {

  const [inputValues, setInputValues] = useState({
    number1: '',
    number2: '',
    number3: '',
    number4: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });

  const handleCalculate = async () => {
    try {
      const response = await fetch('http://localhost:1629/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputValues)
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error calculating simulation:', error);
    }
  };

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  return (
    <div className="actuation-page">
      <h2>Actuation Page</h2>
      {/* <NavigationBar title="Digital Twin for Water Quality - Simulation" /> */}
      <div style={{ position: 'relative' }}>
      <img src={blueprint} alt="blueprint" style={{ width: '100%', height: '400px', marginTop: '100px' }} />
      <GiWaterTower size={80} color={isOn.valve1 ? "green" : "red"} style={{position: 'absolute', top: '12%', left: '49%' }} onClick={() => {toggleIsOn('valve1');}} />
      <img src={roPlantImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '30%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={roCoolerImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '58%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={roCoolerImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '72%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={roCoolerImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '87%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={Motor}  alt="Motor" style={{width: '50px',height: '50px', position: 'absolute', top: '86%', left: '35%',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('valve2'); }} />

      </div>     

      <div className="input-container">
        <label htmlFor="number1">Sump:</label>
        <input type="number" name="number1" id="number1" value={inputValues.number1} onChange={handleChange} />
        <label htmlFor="number2">Over Head Tank:</label>
        <input type="number" name="number2" id="number2" value={inputValues.number2} onChange={handleChange} />
        <label htmlFor="number3">RO 1:</label>
        <input type="number" name="number3" id="number3" value={inputValues.number3} onChange={handleChange} />
        <label htmlFor="number4">RO 2:</label>
        <input type="number" name="number4" id="number4" value={inputValues.number4} onChange={handleChange} />
        <button onClick={handleCalculate}>Calculate</button>
       </div>
    </div>
  );
}

export default ActuationPage;