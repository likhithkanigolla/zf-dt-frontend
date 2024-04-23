// ActuationPage.js
import React, { useState } from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';
import blueprint from '../images/simulation_bp.png';

import { GiWaterTower } from "react-icons/gi";
import roPlantImage from '../images/ro_plant.png'
import roCoolerImage from '../images/ro_cooler.png'
import Motor from '../images/Motor.png';
import Watertank from "../images/watertank.png";
import ROWatertank from "../images/tank_ro.png";

import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import LeakageIcon from "../images/borewell.png"; 

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
    water_level_krb_oht: false,
    water_level_sump: false,
    motor_control: false,
    water_quality_krb_sump: false,
    water_quality_krb_oht: false,
    water_qualityro_plant: false,
    water_quality_ro_tank_oht: false,
    water_quality_ro_cooler1: false,
    water_quality_ro_cooler2: false,
    water_flow_ro_cooler1: false,
    water_flow_ro_cooler2: false,
    water_flow_krb_wsh: false,
    water_flow_vind_wsh: false,
    
  });


  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  return (
    <div className="actuation-page">
      {/* <h2>Actuation Page</h2> */}
      <NavigationBar title="Digital Twin for Water Quality - Actuation" />
      <div style={{ position: 'relative' }}>
        
      <img src={blueprint} alt="blueprint" style={{ width: '100vw', height: '34vw', marginTop: '5vw' }} />
      {/* Components */}
      <img src={Watertank} alt="water tank OHT" style={{ width: '4vw', height: '4vw', position: 'absolute', top: '6.8vw', left: '49%' }} />
      <img src={ROWatertank} alt="RO OHT" style={{ width: '3vw', height: '3vw', position: 'absolute', top: '12vw', left: '59.8%' }} />
      <img src={roPlantImage} alt="ro plant" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '11vw', left: '54vw' }} />
      <img src={roCoolerImage} alt="ro cooler" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '23.4vw', left: '57vw' }}  />
      <img src={roCoolerImage} alt="ro cooler" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '29vw', left: '57vw' }}/>
      <img src={roCoolerImage} alt="ro cooler" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '34.5vw', left: '57vw' }} />
      <img src={Motor}  alt="Motor" style={{width: '3.5vw',height: '3.5vw', position: 'absolute', top: '34.6vw', left: '35vw',transform: 'scaleX(-1)' }} />

      {/* IoT Nodes */}
      <img src={WaterLevelNode}  alt="WaterLevelNode at SUMP" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '22.6vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_level_sump'); }} />
      <img src={WaterLevelNode}  alt="WaterLevelNode at OHT" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '4vw', left: '48vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_level_krb_oht'); }} />
      
      <img src={MotorNode}  alt="MotorNode" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '32vw', left: '35vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('motor_control'); }} />
      

      <img src={WaterQualityNode}  alt="WaterQualityNode at sump" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '27.8vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_quality_krb_sump'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at OHT" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '4vw', left: '51vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_quality_krb_oht'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO Plant" style={{width: '2vw',height: '2vw', position: 'absolute', top: '12vw', left: '52vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_qualityro_plant'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO OHT" style={{width: '2vw',height: '2vw', position: 'absolute', top: '11.5vw', left: '62.5vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_quality_ro_tank_oht'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO 1" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '55vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_quality_ro_cooler1'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO 2" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '23.5vw', left: '55vw',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('water_quality_ro_cooler2'); }} />

      <img src={WaterQuantityNode}  alt="WaterQualityNode at RO 1" style={{width: '1.5vw',height: '1.5vw', position: 'absolute', top: '23.4vw', left: '61vw'}} onClick={() => { toggleIsOn('water_flow_ro_cooler1'); }} />
      <img src={WaterQuantityNode}  alt="WaterQualityNode at RO 2" style={{width: '1.5vw',height: '1.5vw', position: 'absolute', top: '35vw', left: '61.5vw'}} onClick={() => { toggleIsOn('water_flow_ro_cooler2'); }} />
     
      </div>     

      {/* <div className="input-container">
        <label htmlFor="number1">Sump:</label>
        <input type="number" name="number1" id="number1" value={inputValues.number1} onChange={handleChange} />
        <label htmlFor="number2">Over Head Tank:</label>
        <input type="number" name="number2" id="number2" value={inputValues.number2} onChange={handleChange} />
        <label htmlFor="number3">RO 1:</label>
        <input type="number" name="number3" id="number3" value={inputValues.number3} onChange={handleChange} />
        <label htmlFor="number4">RO 2:</label>
        <input type="number" name="number4" id="number4" value={inputValues.number4} onChange={handleChange} />
        <button onClick={handleCalculate}>Calculate</button>
       </div> */}
    </div>
  );
}

export default ActuationPage;