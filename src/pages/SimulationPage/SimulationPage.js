import React, { useState, useEffect } from "react";
import "./SimulationPage.css";

import NavigationBar from "../../components/navigation/Navigation"; // assuming NavigationBar is a component defined in NavigationBar.js
// import blueprint from "./simulation_bp.png";
import blueprint from "./images/ZF_DT_Simulation_Diagram.png";
import { GiWaterTower } from "react-icons/gi";

import roPlantImage from "./images/ro_plant.png";
import roCoolerImage from "./images/ro_cooler.png";
import Motor from "./images/Motor.png";
import SumpIcon from "./images/Sump.png";
import PumpHouse from "./images/pump_house.png";
import Borewell from "./images/borewell.png";
import Watertank from "./images/watertank.png";
import ROWatertank from "./images/tank_ro.png";
import WaterLevelArrow from "./images/Waterlevel_arrow.png";

import whiteimage from './images/white.png';
import ContainerBox from "./components /ContainerBox";
import ZshapePipe from "./components /ZshapePipe";
import MirrorZPipe from "./components /MirrorZPipe";
import StraightPipe from "./components /StraightPipe";
import EShapePipe from "./components /EShapePipe";
import LShapePipe from "./components /LShapePipe";

const SimulationPage = () => {
  // State for holding input values and results
  const [inputValues, setInputValues] = useState({
    voltage: "",
    temperature: "25",
    desired_tds: "50",
    effective_membrane_area: "370",
    sumpCapacity: "6000",
    ohtCapacity: "",
    roCapacity: "",
  });
  const [result, setResult] = useState(null);
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: true,
    valve3: true,
    valve4: true,
    valve5: true,
  });


  const [flow1, setFlow1] = useState(false);
  const [flow2, setFlow2] = useState(false);
  const [flow3, setFlow3] = useState(false);
  const [flow4, setFlow4] = useState(false);

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [waterInSump, setWaterInSump] = useState(6000); // Initial water level in Sump
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(2); // Initial water level in RO Filter
  const [alertShown, setAlertShown] = useState(false);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [showMotorStatus, setShowMotorStatus] = useState(false);
  const [fillPercentage, setfillPercentage] = useState(0);

  const [infoText, setInfoText] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [voltageValue, setVoltageValue] = useState("");
  const voltageData = {
    0: 1.2,
    1: 2.3,
    2: 3.4,
    3: 4.5,
    4: 5.6,
    5: 6.7,
  };

  useEffect(() => {
    let intervalId;
    let intervalwaterConsume;
    if (waterFlowStarted) {
      intervalId = setInterval(() => {
        if (motorOn) {
          // Pump water from Sump to OHT if motor is on
          if (waterInSump > 0 && waterInOHT < 60) {
            setWaterInSump((prev) => Math.max(prev - 5, 0)); // Reduce water in Sump by 5L per second
            setWaterInOHT((prev) => Math.min(prev + 5, 600)); // Increase water in OHT by 5L per second, limited to 600L
          }

          if ((waterInOHT === 60 || waterInSump === 0) && !alertShown) {
            alert("Motor turned off automatically since water tank is full.");
            setMotorOn(false);
            setFlow2((false));
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
          setFlow2(true);
          
        }
        // If water in OHT is empty, stop the motor
        // if (waterInOHT === 0) {
        //   setMotorOn(false);
        // }
        // If water in Sump is empty, stop the simulation and show alert
        if (waterInSump === 0) {
          setMotorOn(false);
          setFlow2(false);
          // alert("No water in sump.");
        }

        // setfillPercentage(waterInOHT / 60 * 100);
        // console.log("Water %: ",fillPercentage)
      }, 1000); // Run every second

      intervalwaterConsume = setInterval(() => {
        if(waterInROFilter>1){
          handleConsumeWater();
      }}, 1000);
    }
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalwaterConsume);
    }; // Cleanup interval on unmount or when simulation stops
  }, [
    waterFlowStarted,
    motorOn,
    waterInSump,
    waterInOHT,
    waterInROFilter,
    alertShown,
  ]);
  // Handler functions
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setInputValues({
  //     ...inputValues,
  //     [name]: value,
  //   });
  //   if (name === "sumpCapacity") {
  //     setWaterInSump(parseInt(value) || 0); // Parse value as integer and set waterInSump
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if simulation is running
    if (isSimulationRunning) {
      // If simulation is running, stop it
      handleStopWaterFlow();
      setIsSimulationRunning(false);
  
      // Update input values
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [name]: value
      }));
  
      // Restart the simulation
      handleCalculate(); // Recalculate
      handleStartWaterFlow(); // Restart the simulation
      setIsSimulationRunning(true);
    } else {
      // If simulation is not running, simply update input values
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [name]: value
      }));
    }
      if (name === "sumpCapacity") {
      setWaterInSump(parseInt(value) || 0); // Parse value as integer and set waterInSump
    }
  };

  const handleInfoButtonClick = (info) => {
    setInfoText(info);
  };

  const handleInfoButtonLeave = () => {
    setInfoText(""); // Clear the info text when mouse leaves the info button
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

  const ResultCard = ({ title, value }) => {
    return (
      <div className="result-card">
        <h5>{title}</h5>
        <p>{value}</p>
      </div>
    );
  };

  const handleCalculate = async () => {
    // if (!isSimulationRunning) {
    //   alert("Please start the simulation to proceed.");
    //   return;
    // }

    try {
      const selectedNumberValue = parseInt(selectedNumber);

      // Ensure that the selectedNumber is within the valid range of 1 to 10
      if (
        isNaN(selectedNumberValue) ||
        selectedNumberValue < 1 ||
        selectedNumberValue > 5
      ) {
        alert("Please select a number between 1 and 5.");
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
        sump_capacity: inputValues.sumpCapacity,
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
      setWaterFlowStarted(true);
    } catch (error) {
      console.error("Error calculating RO filtration:", error);
    }
  };

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
    console.log(valve)
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
    setFlow2((flow2) => !flow2);
  };

  const handleStartSimulation = () => {
    if (!isSimulationRunning) {
      handleCalculate(); // Start calculation
      handleStartWaterFlow(); // Start water flow
      setIsSimulationRunning(true);
      // setFlow4((flow4) => !flow4);
      setFlow1((flow1) => !flow1);
    } else {
      handleStopWaterFlow(); // Stop water flow
      setIsSimulationRunning(false);
      setFlow1(false);
      setFlow2(false);
      setFlow3(false);
      setFlow4(false);
      setMotorOn(false);
    }
  };

  const handleConsumeWater = () => {
    if (waterInROFilter >= 0.1) {
      setWaterInROFilter((prev) => prev - 0.1); // Consume 10 liters from RO Filter
      setWaterConsumed((prev) => prev + 0.1); // Add consumed water to the total
    } else {
      alert("Not enough water in RO Filter to consume.");
    }
  };

  return (
    <div>
      <NavigationBar title="Digital Twin for Water Quality - Simulation" />
      <div style={{ display: "flex" }}>
        {/* Left Section */}
        <div className="container" style={{ flex: 1 }}>
          <h4 className="heading" htmlFor="selectedNumber">
            Soil Impurities{" "}
            <button
              className="info-button"
              onMouseEnter={() =>
                handleInfoButtonClick(
                  "One Container adds 100g of soil for 2 litre water"
                )
              }
              onMouseLeave={handleInfoButtonLeave}
            >
              ℹ️
            </button>
            {infoText && <div className="info-box">{infoText}</div>}
          </h4>
          <input
            type="number"
            name="selectedNumber"
            id="selectedNumber"
            value={selectedNumber}
            onChange={(e) => {
              setSelectedNumber(e.target.value);
              handleChange(e);
            }}            
            min="0"
            max="5"
          />
          <h4 className="heading">Temperature(°C):</h4>
          <input
            className="input-box"
            type="number"
            name="temperature"
            id="temperature"
            value={inputValues.temperature}
            onChange={handleChange}
          />
          <br />
          <h4 className="heading">Desired TDS(mg/Litre):</h4>
          <input
            className="input-box"
            type="number"
            name="desired_tds"
            id="desired_tds"
            value={inputValues.desired_tds}
            onChange={handleChange}
          />
          <h4 className="heading">Effective Membrane Area(m²):</h4>
          <input
            className="input-box"
            type="number"
            name="effective_membrane_area"
            id="effective_membrane_area"
            value={inputValues.effective_membrane_area}
            onChange={handleChange}
          />
          <br />
          <h4 className="heading">Sump Capacity (Liters):</h4>
          <input
            className="input-box"
            type="number"
            name="sumpCapacity"
            id="sumpCapacity"
            value={inputValues.sumpCapacity}
            onChange={handleChange}
          />
          <button onClick={handleStartSimulation} className="button">
            {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
          </button>
          <div className="definitions">
    <h3>Definitions</h3>
    <p><strong>Permeate Flowrate for RO Plant:</strong> The permeate flowrate refers to the rate at which purified water (permeate) is produced by the reverse osmosis (RO) plant. It is typically measured in liters per hour (L/hr) or cubic meters per hour (m³/hr).</p>
    <p><strong>Total Dissolved Solids (TDS):</strong> TDS refers to the total concentration of dissolved substances in water, including salts, minerals, and other organic and inorganic compounds. It is commonly measured in milligrams per liter (mg/L) or parts per million (ppm).</p>
  </div>
        </div>
        {/* Middle Section */}
        <div style={{ flex: 3 }}>
          <div className="demo-page">
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <img
      src={whiteimage}
      alt="blueprint"
      style={{ width: "100%", height: "100%" }}
    />

    {/* PumpHouse 1 */}
    <div style={{ position: "absolute", top: "11%", left: "10.8%" }}>
      {/* <ContainerBox
        flow={flow4}
        text="PumpHouse 1"
      /> */}
      <img
      src={PumpHouse}
      alt="sump"
      style={{ width: "100px", height: "100px" }}
    />
      <div>PumpHouse 1</div>
    </div>

    {/* Z Shape Pipe */}
    <div style={{ position: "absolute", top: "17%", left: "19.7%" }}>
      {/* <div>Z Shape Pipe</div> */}
      <ZshapePipe
        flow={flow1}
        onClick={() => {
          setFlow1((flow1) => !flow1);
        }}
      />
    </div>

    {/* Borewell */}
    <div style={{ position: "absolute", top: "39%", left: "10.8%" }}>
    
      {/* <ContainerBox
        flow={flow4}
        text="Borewell"
      /> */}
      <img
      src={Borewell}
      alt="borewell"
      style={{ width: "100px", height: "100px" }}
    />
      <div>Borewell</div>
    </div>

    {/* Mirror Z Pipe */}
    <div style={{ position: "absolute", top: "37%", left: "19.7%" }}>
      {/* <div>Mirror Z Pipe</div> */}
      <MirrorZPipe
        flow={flow1}
      />
    </div>

    {/* SUMP */}
    <div style={{ position: "absolute", top: "26.5%", left: "28.5%" , textAlign: "center"}}>
      {/* <ContainerBox
        flow={flow4}
        text=""
      /> */}
      <img
      src={SumpIcon}
      alt="sump"
      style={{ width: "100px", height: "100px" }}
    />

      <div>SUMP</div>
    </div>

    {/* Straight Pipes */}
    <div style={{ position: "absolute", top: "29.4%", left: "36.4%" }}>
      {/* <div>Straight Pipe 1</div> */}
      <StraightPipe flow={flow2} />
    </div>
    <div style={{ position: "absolute", top: "29.4%", left: "46.4%" }}>
      {/* <div>Straight Pipe 2</div> */}
      <StraightPipe flow={flow2} />
    </div>

    {/* Motor */}
    <div style={{ position: "absolute", top: "32.4%", left: "43.5%", textAlign: "center", width: "50px" }}>
      
      <img
        src={Motor}
        alt="Motor"
        className={`motor ${motorOn ? "running" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          transform: "scaleX(-1)",
        }}
        onClick={() => {
          toggleIsOn("valve5");
          if (isSimulationRunning) {
            handleMotorToggle();
          }
        }}
      />
      {motorOn && <div style={{ fontSize: "12px", color: "green" }}>Running</div>}
      <div>Motor</div>
    </div>
    
    {/* L Shape Pipe */}
    <div style={{ position: "absolute", top: "35%", left: "60.2%", transform: "rotate(180deg)" }}>
      {/* <div>L Shape Pipe</div> */}
      <LShapePipe flow={flow1} />
    </div>

    {/* Water Tower */}
    <div style={{ position: "absolute", top: "32%", left: "54.4%" }}>
      {/* <GiWaterTower
        size={90}
        color={isOn.valve1 ? "blue" : "red"}
        onClick={() => {
          toggleIsOn("valve1");
        }}
      /> */}
      <img
      src={Watertank}
      alt="WaterTank"
      style={{ width: "80px", height: "80px" }}
    />
      <div>KRB OHT</div>
    </div>

    {/* RO Plant */}
    <div style={{ position: "absolute", top: "47%", left: "68%" }}>
      
      <img
        src={roPlantImage}
        alt="ro plant"
        style={{
          width: "60px",
          height: "60px",
        }}
        onClick={() => {
          toggleIsOn("valve2");
        }}
      />
      <div>RO Plant</div>
    </div>

    {/* Straight Pipe */}
    <div style={{ position: "absolute", top: "46%", left: "73%" }}>
      {/* <div>Straight Pipe</div> */}
      <StraightPipe flow={flow1} />
    </div>

    {/* Water Tower */}
    <div style={{ position: "absolute", top: "44.5%", left: "80.7%" }}>
    <div>RO Filtered Water OHT</div>
      {/* <GiWaterTower
        size={80}
        color={isOn.valve4 ? "skyblue" : "red"}
        onClick={() => {
          toggleIsOn("valve4");
        }}
        /> */}
      <img
      src={ROWatertank}
      alt="WaterTank"
      style={{ width: "80px", height: "80px" }}
    />
        
        </div>
        
        {/* E Shape Pipe */}
        <div style={{ position: "absolute", top: "60%", left: "80%" }}>
          {/* <div>E Shape Pipe</div> */}
          <EShapePipe flow={flow1} />
        </div>
    
        {/* RO Coolers */}
        <div style={{ position: "absolute", top: "66%", left: "78.3%", textAlign:"center"  }}>
          
          <img
            src={roCoolerImage}
            alt="ro cooler 1"
            style={{
              width: "50px",
              height: "50px",
            }}
            onClick={() => {
              toggleIsOn("valve3");
            }}
          />
          <div>RO 1</div>
        </div>
        <div style={{ position: "absolute", top: "66%", left: "82.3%", textAlign:"center" }}>
          
          <img
            src={roCoolerImage}
            alt="ro cooler 2"
            style={{
              width: "50px",
              height: "50px",
            }}
            onClick={() => {
              toggleIsOn("valve3");
            }}
          />
          <div>RO 2</div>
        </div>
        <div style={{ position: "absolute", top: "66%", left: "86.3%", textAlign:"center" }}>
         
          <img
            src={roCoolerImage}
            alt="ro cooler 3"
            style={{
              width: "50px",
              height: "50px",
            }}
            onClick={() => {
              toggleIsOn("valve3");
            }}
          />
           <div>RO 3</div>
      </div>
      </div>
    </div>


          {/* {result && ( */}
          {(
            <div className="result-container">
              <div className="water-flow-container">
                <div className="result-cards">
                  <ResultCard title="Water in Sump" value={waterInSump} />
                  <ResultCard title="Water in OHT" value={waterInOHT} />
                  <ResultCard
                    title="Water in RO Filter"
                    value={waterInROFilter}
                  />
                  <ResultCard title="Water Consumed" value={waterConsumed} />
                </div>
                <br></br>
                {/* <button
                  className={`button ${motorOn ? "motor-off" : "motor-on"}`}
                  onClick={handleMotorToggle}
                >
                  {motorOn ? "Turn Motor Off" : "Turn Motor On"}
                </button>{" "} */}
                <span>
                  <span></span>
                </span>
                {/* <button className="button" onClick={handleConsumeWater}>
                  Consume Water
                </button> */}
              </div>
            </div>
          )}

          {showMotorStatus && (
            <div className="motor-status-overlay">
              <p>Motor is {motorOn ? "on" : "off"}</p>
            </div>
          )}
        </div>
        {/* Right Section */}
        <div style={{ flex: 1 }}>
          {/* {result && ( */}
            <div className="result-container">
              <p>Results:</p>
              <div className="result-cards">
              <ResultCard
                  title="TDS Value(mg/L) - At SUMP"
                  value={result?.calculated_tds_value ?? 'N/A'}
                />
                {/* <ResultCard
                  title="Osmotic Pressure(Pascal (Pa))"
                  value={result.osmotic_pressure}
                /> */}
                {/* <ResultCard title="Water Flux(m³)" value={result.water_flux} /> */}
                <ResultCard
                  title="Permeate Flow Rate(m³/s)"
                  value={result?.permeate_flow_rate ?? 'N/A'}
                />
                <ResultCard
                  title="Final TDS Concentration After RO Tank(mg/L)"
                  value={result?.final_tds_concentration_after_ro_tank ?? 'N/A'}
                />
                <ResultCard title="Cycle Count" value={result?.cycle_count ?? 'N/A'} />
                <ResultCard
                  title="Time Estimation (hours)"
                  value={result?.time_estimation_hours ?? 'N/A'}
                />
              </div>
              <br />
              {/* <button onClick={waterFlowStarted ? handleStopWaterFlow : handleStartWaterFlow} className="button">
                {waterFlowStarted ? "Stop Water Flow" : "Start Water Flow"}
              </button> */}
            </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
