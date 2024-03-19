import React, { useState , useEffect} from 'react';
import './SimulationPage.css';
import NavigationBar from '../../components/navigation/Navigation';
import blueprint from './simulation_bp.png';
import { GiWaterTower } from "react-icons/gi";
import roPlantImage from './ro_plant.png';
import roCoolerImage from './ro_cooler.png';
import Motor from './Motor.png';

const SimulationPage = () => {
  const [inputValues, setInputValues] = useState({
    voltage: '',
    temperature: '',
    desiredTDS: '',
    effectiveMembraneArea: '',
    sumpCapacity: '',
    ohtCapacity: '',
    roCapacity: ''
  });
  const [result, setResult] = useState(null);
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [waterInSump, setWaterInSump] = useState(inputValues.sumpCapacity);
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(0); // Initial water level in RO Filter
  const [alertShown, setAlertShown] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0);
  

  useEffect(() => {
    let intervalId;
    if (isSimulationRunning) {
      intervalId = setInterval(() => {
        const { sumpCapacity, ohtCapacity } = inputValues;
        const ohtThreshold80Percent = 0.8 * ohtCapacity;
        const ohtThreshold20Percent = 0.2 * ohtCapacity;

        if (motorOn) {
          // Pump water from Sump to OHT if motor is on
          if (waterInSump > 0 && waterInOHT < ohtCapacity) {
            setWaterInSump(prev => Math.max(prev - 3, 0)); // Reduce water in Sump by 3L per second
            setWaterInOHT(prev => Math.min(prev + 3, ohtCapacity)); // Increase water in OHT by 3L per second, limited to OHT capacity
          }

          // Pump water from OHT to RO Filter continuously
          if (waterInOHT > 0 && waterInROFilter < inputValues.roCapacity) {
            setWaterInOHT(prev => Math.max(prev - 3, 0)); // Reduce water in OHT by 3L per second
            setWaterInROFilter(prev => Math.min(prev + 3, inputValues.roCapacity)); // Increase water in RO Filter by 3L per second, limited to RO capacity
          }

          // Turn off motor if OHT is 80% filled
          if (waterInOHT >= ohtThreshold80Percent) {
            setMotorOn(false);
          }
        } else {
          // Turn on motor if OHT is less than 20% filled
          if (waterInOHT <= ohtThreshold20Percent) {
            setMotorOn(true);
          }
        }

        // If motor is turned off automatically due to tank filled or empty
        if ((waterInOHT >= ohtCapacity || waterInSump === 0) && !alertShown) {
          alert("Motor turned off automatically since water tank is full.");
          setMotorOn(false)
          setAlertShown(true); // Set alertShown to true to prevent repeated alerts
        }

        // If water in Sump is empty, stop the simulation and show alert
        if (waterInSump === 0) {
          setIsSimulationRunning(false);
          alert("No water in sump. Simulation stopped.");
        }
      }, 1000); // Run every second
    }
    return () => clearInterval(intervalId); // Cleanup interval on unmount or when simulation stops
  }, [isSimulationRunning, motorOn, waterInSump, waterInOHT, waterInROFilter, alertShown, inputValues]);

  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const handleStartSimulation = () => {
    setIsSimulationRunning(true);
  };

  const handleStopSimulation = () => {
    setIsSimulationRunning(false);
  };

  const handleMotorToggle = () => {
    if (!motorOn) {
      setAlertShown(false); // Reset alertShown state when motor is manually turned off
    }
    setMotorOn(prev => !prev); // Toggle motor state
  };
  
  const ResultCard = ({ title, value }) => {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    );
  };
  

  const handleCalculate = async () => {
    if (!isSimulationRunning) {
      alert("Please start the simulation to proceed.");
      return;
    }

    try {
      // Calculate initial TDS based on input values
      const initialTDS = calculateInitialTDS(inputValues);

      // Prepare request body including initial TDS
      const requestBody = {
        initial_tds: initialTDS,
        desired_tds: inputValues.desired_tds,
        voltage: inputValues.voltage,
        temperature: inputValues.temperature,
        effective_membrane_area: inputValues.effective_membrane_area,
        sumpCapacity: inputValues.sumpCapacity
        // Other parameters as needed
      };

      const response = await fetch('http://localhost:1629/calculate_ro_filtration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      setResult(data); // Set the entire response object as result
    } catch (error) {
      console.error('Error calculating RO filtration:', error);
    }
  };

  const handleConsumeWater = () => {
    if (waterInROFilter >= 10) {
      setWaterInROFilter(prev => prev - 10); // Consume 10 liters from RO Filter
      setWaterConsumed(prev => prev + 10); // Add consumed water to the total
    } else {
      alert("Not enough water in RO Filter to consume.");
    }
  };

  const calculateInitialTDS = (inputValues) => {
    const { voltage, temperature } = inputValues;
    // Calculate CV
    const CV = voltage / (1.0 + 0.02 * (temperature - 25));
    // Calculate initial TDS using CV
    const initialTDS = 133.42 * Math.pow(CV, 3) - 255.86 * Math.pow(CV, 2) + 857.39 * CV * 0.5;
    return initialTDS;
  };

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  return (
    <div className="simulation-page">
      <h2>Simulation Page</h2>
      <div style={{ position: 'relative' }}>
      <img src={blueprint} alt="blueprint" style={{ width: '100%', height: '400px', marginTop: '100px' }} />
      <GiWaterTower size={80} color={isOn.valve1 ? "green" : "red"} style={{position: 'absolute', top: '12%', left: '49%' }} onClick={() => {toggleIsOn('valve1');}} />
      <img src={roPlantImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '30%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={roCoolerImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '58%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={roCoolerImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '72%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={roCoolerImage} alt="ro plant" style={{ width: '50px', height: '50px', position: 'absolute', top: '87%', left: '58%' }} onClick={() => { toggleIsOn('valve2'); }} />
      <img src={Motor}  alt="Motor" style={{width: '50px',height: '50px', position: 'absolute', top: '86%', left: '35%',transform: 'scaleX(-1)' }} onClick={() => { toggleIsOn('valve2'); }} />
      </div> 

      {/* Water Flow From Sump to OHT */}
      <div className="water-flow-container">
            <div className="result-cards">
            <ResultCard title="Water in Sump" value={waterInSump} />
            <ResultCard title="Water in OHT" value={waterInOHT} />
            <ResultCard title="Water in RO Filter" value={waterInROFilter} />
            <ResultCard title="Water Consumed" value={waterConsumed} />
            
            
            </div>
      </div>
      <br></br>
      <br></br>

      <div className="input-container">
        <label htmlFor="voltage">Voltage:</label>
        <input type="number" name="voltage" id="voltage" value={inputValues.voltage} onChange={handleChange} />
        <label htmlFor="temperature">Temperature:</label>
        <input type="number" name="temperature" id="temperature" value={inputValues.temperature} onChange={handleChange} />
        <label htmlFor="desired_tds">Desired TDS:</label>
        <input type="number" name="desired_tds" id="desired_tds" value={inputValues.desired_tds} onChange={handleChange} />
        <label htmlFor="effective_membrane_area">Effective Membrane Area:</label>
        <input type="number" name="effective_membrane_area" id="effective_membrane_area" value={inputValues.effective_membrane_area} onChange={handleChange} />
        <label htmlFor="sumpCapacity">Sump Capacity (Liters):</label>
        <input type="number" name="sumpCapacity" id="sumpCapacity" value={inputValues.sumpCapacity} onChange={handleChange} />
        <label htmlFor="ohtCapacity">OHT Capacity (Liters):</label>
        <input type="number" name="ohtCapacity" id="ohtCapacity" value={inputValues.ohtCapacity} onChange={handleChange} />
        <label htmlFor="roCapacity">RO Capacity (Liters):</label>
        <input type="number" name="roCapacity" id="roCapacity" value={inputValues.roCapacity} onChange={handleChange} />


        {isSimulationRunning ? (
            <button onClick={handleStopSimulation}>Stop Simulation</button>
          ) : (
            <button onClick={handleStartSimulation}>Start Simulation</button>
          )}
          <button onClick={handleCalculate}>Calculate</button>
          <button onClick={handleMotorToggle}>{motorOn ? "Turn Motor Off" : "Turn Motor On"}</button>
          <button onClick={handleConsumeWater}>Consume Water</button>
      </div>
        {/* Display result if available */}
        {result && (
          <div className="result-container">
          <p>Result:</p>
          <div className="result-cards">
            <ResultCard title="Osmotic Pressure" value={result.osmotic_pressure} />
            <ResultCard title="Water Flux" value={result.water_flux} />
            <ResultCard title="Permeate Flow Rate" value={result.permeate_flow_rate} />
            <ResultCard title="Final TDS Concentration After RO Tank" value={result.final_tds_concentration_after_ro_tank} />
            <ResultCard title="Calculated TDS Value" value={result.calculated_tds_value} />
            <ResultCard title="Cycle Count" value={result.cycle_count} />
            <ResultCard title="Time Estimation (hours)" value={result.time_estimation_hours} />
          </div>
        </div>
        )}

    </div>
  );
}

export default SimulationPage;
