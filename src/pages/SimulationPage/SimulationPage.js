import React, { useState, useEffect } from "react";
import "./SimulationPage.css";
import NavigationBar from "../../components/navigation/Navigation";
import blueprint from "./simulation_bp.png";
import { GiWaterTower } from "react-icons/gi";
import roPlantImage from "./ro_plant.png";
import roCoolerImage from "./ro_cooler.png";
import Motor from "./Motor.png";

const SimulationPage = () => {
  const [inputValues, setInputValues] = useState({
    voltage: "",
    temperature: "",
    desiredTDS: "",
    effectiveMembraneArea: "",
    sumpCapacity: "",
    ohtCapacity: "",
    roCapacity: "",
  });
  const [result, setResult] = useState(null);
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [waterInSump, setWaterInSump] = useState(100); // Initial water level in Sump
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(0); // Initial water level in RO Filter
  const [alertShown, setAlertShown] = useState(false);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [showMotorStatus, setShowMotorStatus] = useState(false);

  const [selectedNumber, setSelectedNumber] = useState('');
  const [voltageValue, setVoltageValue] = useState('');
  const voltageData = {
    1: 2.3,
    2: 3.4,
    3: 4.5,
    4: 5.6,
    5: 6.7,
    6: 7.8,
    7: 8.9,
    8: 9.0,
    9: 10.1,
    10: 11.2,
  };
  


  useEffect(() => {
    let intervalId;
    if (waterFlowStarted) {
      intervalId = setInterval(() => {
        if (motorOn) {
          // Pump water from Sump to OHT if motor is on
          if (waterInSump > 0 && waterInOHT < 60) {
            setWaterInSump((prev) => Math.max(prev - 5, 0)); // Reduce water in Sump by 5L per second
            setWaterInOHT((prev) => Math.min(prev + 5, 60)); // Increase water in OHT by 5L per second, limited to 60L
          }

          if ((waterInOHT === 60 || waterInSump === 0) && !alertShown) {
            alert("Motor turned off automatically since water tank is full.");
            setMotorOn(false);
            setAlertShown(true); // Set alertShown to true to prevent repeated alerts
          }
        }

        // Pump water from OHT to RO Filter continuously
        if (waterInOHT > 0 && waterInROFilter < 20) {
          setWaterInOHT((prev) => Math.max(prev - 1, 0)); // Reduce water in OHT by 1L per second
          setWaterInROFilter(
            (prev) => prev + (result ? result.permeate_flow_rate / 360 : 0)
          ); // Increase water in RO Filter by permeate flow rate, converted from l/m2/hr to l/s
        }
        // If water in OHT is less than 20%, turn on the motor automatically
        if (waterInOHT < 12) {
          setMotorOn(true);
        }
        // If water in OHT is empty, stop the motor
        // if (waterInOHT === 0) {
        //   setMotorOn(false);
        // }
        // If water in Sump is empty, stop the simulation and show alert
        if (waterInSump === 0) {
          setMotorOn(false);
          // alert("No water in sump.");
        }
      }, 1000); // Run every second
    }
    return () => clearInterval(intervalId); // Cleanup interval on unmount or when simulation stops
  }, [
    waterFlowStarted,
    motorOn,
    waterInSump,
    waterInOHT,
    waterInROFilter,
    alertShown,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
    if (name === "sumpCapacity") {
      setWaterInSump(parseInt(value) || 0); // Parse value as integer and set waterInSump
    }
  };

  const handleStartSimulation = () => {
    setIsSimulationRunning(true);
    setWaterFlowStarted(false);
  };

  const handleStopSimulation = () => {
    setIsSimulationRunning(false);
    setWaterFlowStarted(false)
    setMotorOn(false)
  };

  const handleStartWaterFlow = () => {
    setWaterFlowStarted(true);
  };

  const handleStopWaterFlow = () => {
    setWaterFlowStarted(false);
  };

  const handleMotorToggle = () => {
    if (!motorOn) {
      setAlertShown(false); // Reset alertShown state when motor is manually turned off
    }
    setMotorOn((prev) => !prev); // Toggle motor state
  };

  const handleInfoButtonClick = (info) => {
    alert(info);
  };

  const toggleMotorStatus = () => {
    setShowMotorStatus(true);
    setTimeout(() => setShowMotorStatus(false), 10000); // Hide after 10 seconds
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
      const selectedNumberValue = parseInt(selectedNumber);

      // Ensure that the selectedNumber is within the valid range of 1 to 10
      if (isNaN(selectedNumberValue) || selectedNumberValue < 1 || selectedNumberValue > 10) {
        alert("Please select a number between 1 and 10.");
        return;
      }
  
      // Retrieve voltage value from the voltageData object
      const voltageValue = voltageData[selectedNumberValue];
      // Calculate initial TDS based on input values
      const initialTDS = calculateInitialTDS(inputValues);

      // Prepare request body including initial TDS
      const requestBody = {
        initial_tds: initialTDS,
        desired_tds: inputValues.desired_tds,
        voltage: voltageValue,
        temperature: inputValues.temperature,
        effective_membrane_area: inputValues.effective_membrane_area,
        sump_capacity: inputValues.sumpCapacity
        // Other parameters as needed
      };

      const response = await fetch(
        "http://localhost:1629/calculate_ro_filtration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();
      setResult(data); // Set the entire response object as result
      setWaterFlowStarted(false);
    } catch (error) {
      console.error("Error calculating RO filtration:", error);
    }
  };

  const handleConsumeWater = () => {
    if (waterInROFilter >= 10) {
      setWaterInROFilter((prev) => prev - 10); // Consume 10 liters from RO Filter
      setWaterConsumed((prev) => prev + 10); // Add consumed water to the total
    } else {
      alert("Not enough water in RO Filter to consume.");
    }
  };

  const calculateInitialTDS = (inputValues) => {
    const { voltage, temperature } = inputValues;
    // Calculate CV
    const CV = voltage / (1.0 + 0.02 * (temperature - 25));
    // Calculate initial TDS using CV
    const initialTDS =
      133.42 * Math.pow(CV, 3) - 255.86 * Math.pow(CV, 2) + 857.39 * CV * 0.5;
    return initialTDS;
  };

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  return (
    <div className="simulation-page">
      <NavigationBar title="Digital Twin for Water Quality - Simulation"/>
      
      <div style={{ position: "relative" }}>
        <img
          src={blueprint}
          alt="blueprint"
          style={{ width: "100%", height: "400px", marginTop: "100px" }}
        />
        <GiWaterTower
          size={80}
          color={isOn.valve1 ? "green" : "red"}
          style={{ position: "absolute", top: "12%", left: "49%" }}
          onClick={() => {
            toggleIsOn("valve1");
          }}
        />
        <img src={roPlantImage} alt="ro plant" style={{ width: "50px", height: "50px", position: "absolute", top: "30%",left: "58%",}} onClick={() => { toggleIsOn("valve2");}}/>
        <img src={roCoolerImage} alt="ro plant" style={{ width: "50px", height: "50px", position: "absolute", top: "58%", left: "58%", }} onClick={() => { toggleIsOn("valve2"); }}/>
        <img src={roCoolerImage} alt="ro plant" style={{ width: "50px", height: "50px", position: "absolute", top: "72%", left: "58%",}} onClick={() => { toggleIsOn("valve2");}}/>
        <img src={roCoolerImage} alt="ro plant" style={{ width: "50px", height: "50px", position: "absolute", top: "87%", left: "58%",}}onClick={() => {toggleIsOn("valve2");}}/>
        <img src={Motor} alt="Motor" className={`motor ${motorOn ? 'running' : ''}`} style={{ width: "50px", height: "50px", position: "absolute",top: "86%",left: "35%",transform: "scaleX(-1)",}}onClick={() => {toggleIsOn("valve2");}}/>
      </div>

      <br></br>
      <div className="button-container">
          <button className={`button ${isSimulationRunning ? 'stop' : 'start'}`} onClick={isSimulationRunning ? handleStopSimulation : handleStartSimulation}>
            {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
          </button> 
      </div>
      <br></br>
      
      {isSimulationRunning && (
      <div className="container">
        <h4 className="heading" htmlFor="selectedNumber">Container <button className="info-button" onClick={() => handleInfoButtonClick("Information about selecting a container count from 1 to 5.")}>ℹ️</button></h4>
        <input type="number" name="selectedNumber" id="selectedNumber" value={selectedNumber} onChange={(e) => setSelectedNumber(e.target.value)} min="1" max="5" />

        {/* <h4 className="heading">Voltage:</h4>
        <input className="input-box" type="number" name="voltage" id="voltage" value={inputValues.voltage} onChange={handleChange} /> */}
        
        <h4 className="heading">Temperature:</h4>
        <input className="input-box" type="number" name="temperature" id="temperature" value={inputValues.temperature} onChange={handleChange} />
        <br></br>
        <h4 className="heading">Desired TDS:</h4>
        <input className="input-box" type="number" name="desired_tds" id="desired_tds" value={inputValues.desired_tds} onChange={handleChange} />
        
        <h4 className="heading">Effective Membrane Area:</h4>
        <input className="input-box" type="number" name="effective_membrane_area" id="effective_membrane_area" value={inputValues.effective_membrane_area} onChange={handleChange} />
        <br></br>
        <h4 className="heading">Sump Capacity (Liters):</h4>
        <input className="input-box" type="number" name="sumpCapacity" id="sumpCapacity" value={inputValues.sumpCapacity} onChange={handleChange} />

        <button className="button" onClick={handleCalculate}>Calculate</button>
      </div>)}

      {/* Display result if available */}
      {result && (
        <div className="result-container">
          <p>Estimated Result:</p>
          <div className="result-cards">
            <ResultCard
              title="Osmotic Pressure"
              value={result.osmotic_pressure}
            />
            <ResultCard title="Water Flux" value={result.water_flux} />
            <ResultCard
              title="Permeate Flow Rate"
              value={result.permeate_flow_rate}
            />
            <ResultCard
              title="Final TDS Concentration After RO Tank"
              value={result.final_tds_concentration_after_ro_tank}
            />
            <ResultCard
              title="Calculated TDS Value"
              value={result.calculated_tds_value}
            />
            <ResultCard title="Cycle Count" value={result.cycle_count} />
            <ResultCard
              title="Time Estimation (hours)"
              value={result.time_estimation_hours}
            />
          </div>
          <br></br>
          {/* <button onClick={handleStartWaterFlow} className="button">Start Water Flow</button> */}
          <button onClick={waterFlowStarted ? handleStopWaterFlow : handleStartWaterFlow} className="button">
            {waterFlowStarted ? "Stop Water Flow" : "Start Water Flow"}
          </button>

        </div>
        
      )}
      {result && waterFlowStarted && (
        <div className="result-container">
          <div className="water-flow-container">
            <div className="result-cards">
              <ResultCard title="Water in Sump" value={waterInSump} />
              <ResultCard title="Water in OHT" value={waterInOHT} />
              <ResultCard title="Water in RO Filter" value={waterInROFilter} />
              <ResultCard title="Water Consumed" value={waterConsumed} />
            </div>
            <br></br>
            <button className={`button ${motorOn ? 'motor-off' : 'motor-on'}`} onClick={handleMotorToggle}>
          {motorOn ? "Turn Motor Off" : "Turn Motor On"}
          </button> <span><span></span></span>
            <button className="button" onClick={handleConsumeWater}>Consume Water</button>
          </div>
        </div>
      )}

      {showMotorStatus && (
      <div className="motor-status-overlay">
        <p>Motor is {motorOn ? "on" : "off"}</p>
      </div>
    )}

    </div>
  );
};

export default SimulationPage;
