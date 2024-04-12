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

import MotorNode from "./images/MotorNode.png"; 
import WaterLevelNode from "./images/WaterLevelNode.png";
import WaterQualityNode from "./images/WaterQualityNode.png";
import WaterQuantityNode from "./images/WaterQuantityNode.png";

import whiteimage from "./images/white.png";
import Washrooms from "./images/Washrooms.png";
import ContainerBox from "./components /ContainerBox";
import ZshapePipe from "./components /ZshapePipe";
import MirrorZPipe from "./components /MirrorZPipe";
import StraightPipe from "./components /StraightPipe";
import EShapePipe from "./components /EShapePipe";
import LShapePipe from "./components /LShapePipe";
import Toolbar from "./components /ToolBar";

const SimulationPage = () => {
  // State for holding input values and results
  const iconRefs = [];
  const [isMarkerPlaced, setIsMarkerPlaced] = useState(false);
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
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);


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
          if (waterInSump > 0 && waterInOHT < 600) {
            setWaterInSump((prev) => Math.max(prev - 5, 0)); // Reduce water in Sump by 5L per second
            setWaterInOHT((prev) => Math.min(prev + 5, 600)); // Increase water in OHT by 5L per second, limited to 600L
          }

          if ((waterInOHT === 600 || waterInSump === 0) && !alertShown) {
            alert("Motor turned off automatically since water tank is full.");
            setMotorOn(false);
            setFlow2(false);
            setAlertShown(true); // Set alertShown to true to prevent repeated alerts
          }
        }

        // Pump water from OHT to RO Filter continuously
        if (waterInOHT > 0 && waterInROFilter < 50) {
          setWaterInOHT((prev) => Math.max(prev - 5, 0));
          setWaterInROFilter(
            (prev) => prev + (result ? result.permeate_flow_rate / 360 : 0)
          ); // Increase water in RO Filter by permeate flow rate, converted from l/m2/hr to l/s
        }
        // If water in OHT is less than 20%, turn on the motor automatically
        if (waterInOHT < 120) {
          setMotorOn(true);
          setFlow2(true);
        }
        if (waterInSump === 0) {
          setMotorOn(false);
          setFlow2(false);
          // alert("No water in sump.");
        }
      }, 1000); // Run every second

      intervalwaterConsume = setInterval(() => {
        if (waterInROFilter > 1) {
          handleConsumeWater();
        }
      }, 1000);
    }

    const logIconCoordinates = () => {
      iconRefs.forEach((ref, index) => {
        const iconId = ref.id;
        const rect = ref.getBoundingClientRect();
        const iconCoordinates = {
          x: rect.left,
          y: rect.top,
        };
        // These coordinates are used to know the postions of the SUMP, OHT etc 
        console.log(`Icon ${iconId} coordinates:`, iconCoordinates);
        // You can now use iconCoordinates as needed
      });
    };
    logIconCoordinates();
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if simulation is running
    if (isSimulationRunning) {
      // If simulation is running, stop it
      handleStopWaterFlow();
      setIsSimulationRunning(false);

      // Update input values
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: value,
      }));

      // Restart the simulation
      handleCalculate(); // Recalculate
      handleStartWaterFlow(); // Restart the simulation
      setIsSimulationRunning(true);
    } else {
      // If simulation is not running, simply update input values
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: value,
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
        "http://smartcitylivinglab.iiit.ac.in:1629/calculate_ro_filtration",
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


  const getRealData = async (tableName) => {
    try {
      const response = await fetch(`http://smartcitylivinglab.iiit.ac.in:1629/get_value?table_name=${tableName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Assuming this returns an object
      // Transform the data object into an array of objects for each key-value pair,
      // ensuring null values are handled gracefully.
      const dataArray = Object.entries(data).map(([key, value]) => ({
        title: key,
        value: value === null ? 'N/A' : value.toString(), // Use 'N/A' for null values
      }));
      setData(dataArray); // Assuming you have a setData function to update state
    } catch (error) {
      console.error("Fetch error:", error);
      setData([{ title: "Error", value: "Failed to fetch data" }]); // Update accordingly
    }
  };

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
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
    if (waterInROFilter >= 0.5) {
      setWaterInROFilter((prev) => prev - 0.5); 
      setWaterConsumed((prev) => prev + 0.5); 
    } else {
      alert("Not enough water in RO Filter to consume.");
    }
  };

  const [canvasItems, setCanvasItems] = useState([]);

  // This state is used to track the type of item that we need to add to the canvas
  const [itemToAdd, setItemToAdd] = useState(null);


  
  const handleDragStart = (event, index) => {
    // Set the dataTransfer object with the item's index if we are moving an existing item
    if (index !== undefined) {
      event.dataTransfer.setData('index', index);
    }
    
    // Capture the coordinates of the draggable marker
    const markerCoordinates = {
      x: event.clientX,
      y: event.clientY,
    };
    
    // Log the marker coordinates
    // console.log("Marker coordinates during drag start:", markerCoordinates);
    
    // Call function to check if marker overlaps with any icon
    const { isPlaced, iconId } = checkMarkerOverlap(markerCoordinates);
    console.log("Marker is placed on:", iconId);
    setIsMarkerPlaced(isPlaced);
  };
  
  
  const checkMarkerOverlap = (markerCoordinates) => {
    let isPlaced = false;
    let iconId = null;
  
    // Iterate over each icon and check if the marker overlaps with it
    iconRefs.forEach((ref, index) => {
      const rect = ref.getBoundingClientRect();
      if (
        markerCoordinates.x >= rect.left &&
        markerCoordinates.x <= rect.left + rect.width &&
        markerCoordinates.y >= rect.top &&
        markerCoordinates.y <= rect.top + rect.height
      ) {
        iconId = ref.id; // Update iconId if the marker overlaps with the icon
        // console.log(`Marker is placed on ${iconId}`);
        if (iconId === 'KRBSump') {
          console.log("Marker is Placed on KRB Sump");
        }
        isPlaced = true;
      }
    });
  
    if (!isPlaced) {
      console.log("checkMarkerOverlap - Marker is not placed on any icon: ");
    }
     else {
      console.log(`checkMarkerOverlap - Marker is placed on: ${iconId}`);
    }
  
    return { isPlaced, iconId };
  };
  
  

  const handleDrop = (event) => {
    event.preventDefault();
    const canvasRect = event.currentTarget.getBoundingClientRect();
    const index = event.dataTransfer.getData('index');
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
    

    if (index) {
      // We're dragging an existing item, update its position
      const updatedItems = [...canvasItems];
      updatedItems[index] = {
        ...updatedItems[index],
        x: x,
        y: y
      };
      setCanvasItems(updatedItems);
      console.log(`Moved item ${updatedItems[index].type} to x: ${x}, y: ${y}`);
    } else if (itemToAdd) {
      // We're adding a new item, add it to the canvasItems state with the dropped position
      const newItem = {
        type: itemToAdd,
        x: x,
        y: y
      };
      setCanvasItems([...canvasItems, newItem]);
      setItemToAdd(null); // Reset the itemToAdd since it has been added
      console.log(`Added item of type ${itemToAdd} at x: ${x}, y: ${y}`);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const handleToolbarItemClick = (type) => {
    // Prepare to add a new item when the next drop occurs
    // Instead of directly adding the item, we set an "item to add" state
    setItemToAdd(type);
  };

  const handleIconClick = (event) => {
    const refId = event.target.id;
    const iconCoordinates = {
      x: event.clientX,
      y: event.clientY,
    };
    console.log(refId, "coordinates:", iconCoordinates);
  };

  const handleMarkerClick = (item, index, event) => {
    const { clientX, clientY } = event; // Get the client coordinates of the click event
    // console.log("Clicked marker:", item);
    
    // Use the marker's coordinates
    const coordinates = {
      x: clientX,
      y: clientY,
    };
    
    const { isPlaced, iconId } = checkMarkerOverlap(coordinates);
    console.log("Marker of type ", item.type , "placed on",iconId, "at coordinates:", coordinates);
    // Continue with your logic here
  };
  

  const getImageForType = (type) => {
    switch (type) {
      case 'waterqualitysensor':
        return WaterQualityNode;
      case 'waterquantitysensor':
        return WaterQuantityNode;
      case 'waterlevelsensor':
        return WaterLevelNode;
      case 'motorsensor':
        return MotorNode;
      default:
        return ''; // default image or empty string if none
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
            <p>
              <strong>Permeate Flowrate for RO Plant:</strong> The permeate
              flowrate refers to the rate at which purified water (permeate) is
              produced by the reverse osmosis (RO) plant. It is typically
              measured in liters per hour (L/hr) or cubic meters per hour
              (m³/hr).
            </p>
            <p>
              <strong>Total Dissolved Solids (TDS):</strong> TDS refers to the
              total concentration of dissolved substances in water, including
              salts, minerals, and other organic and inorganic compounds. It is
              commonly measured in milligrams per liter (mg/L) or parts per
              million (ppm).
            </p>
          </div>
        </div>
        {/* Middle Section */}
        <div style={{ flex: 3 }}>

          {/* Toolbar */}
          <div className="toolbar">
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterqualitysensor')}>
              <img src={WaterQualityNode} alt="Water Quality Sensor"/> waterqualitysensor
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterquantitysensor')}>
              <img src={WaterQuantityNode} alt="Water Quantity Sensor"/> waterquantitysensor
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('waterlevelsensor')}>
              <img src={WaterLevelNode} alt="Water Level Sensor"/> waterlevelsensor
            </button>
            <button className="tool-button" onClick={() => handleToolbarItemClick('motorsensor')}>
              <img src={MotorNode} alt="Motor Sensor"/> motorsensor
            </button>
          </div>

          <div className="demo-page">
            <div
              style={{
                position: 'relative',
                width: '60vw',
                height: '40vw',
                border: '1px solid black',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <img src={whiteimage} alt="blueprint" style={{ width: "100%", height: "100%" }}/>

              {/* PumpHouse 1 */}
              <div style={{ position: "absolute", top: "6vw", left: "3.8vw" }} id="pumpHouseIcon">
                <img src={PumpHouse} alt="sump" style={{ width: "4.8vw", height: "4.8vw" }} onClick={(e) => handleIconClick(e)}
                  ref={(ref) => {if (ref) {ref.id = "PumpHouse1"; iconRefs.push(ref);} }}
                />
                <div style={{ fontSize: "1vw" }}>PumpHouse</div>
              </div>

              {/* Z Shape Pipe */}
              <div style={{ position: "absolute", top: "8.5vw", left: "7.8vw" }}>
                <ZshapePipe flow={flow1}  onClick={() => {setFlow1((flow1) => !flow1);}}/>
              </div>

              {/* Mirror Z Pipe */}
              <div style={{ position: "absolute", top: "16vw", left: "7.8vw" }}>
                <MirrorZPipe flow={flow1} style={{ width: "4.8vw", height: "4.8vw" }}/>
              </div>

              {/* Borewell */}
              <div id="borewellIcon" style={{ position: "absolute", top: "19vw", left: "3.8vw" }}>
                <img
                  src={Borewell}
                  alt="borewell"
                  style={{ width: "4.8vw", height: "4.8vw" }}
                  onClick={(e) => handleIconClick(e)}
                  ref={(ref) => {if (ref) {ref.id = "Borewell1"; iconRefs.push(ref);} }}
                />
                <div style={{ fontSize: "1vw" }}>Borewell</div>
              </div>

              {/* Straight Pipes */}
              <div style={{ position: "absolute", top: "13vw", left: "18vw" }}>
                <StraightPipe flow={flow2} />
              </div>

              {/* SUMP */}
              <div style={{position: "absolute", top: "13vw", left: "13vw", textAlign: "center"}}>
                <img src={SumpIcon}  alt="sump" style={{ width: "6vw", height: "6vw" }} onClick={(e) => handleIconClick(e)} 
                ref={(ref) => {if (ref) {ref.id = "KRBSump"; iconRefs.push(ref);} }}/>
                <div style={{fontSize:"1vw"}}>SUMP-{waterInSump}L</div>
              </div>

              <div style={{ position: "absolute", top: "10.3vw", left: "25vw" }}>
                <MirrorZPipe flow={flow2} />
              </div>

              {/* Motor */}
              <div style={{position: "absolute", top: "15.5vw", left: "21.5vw", textAlign: "center", width: "5.8vw"}} 
              ref={(ref) => {if (ref) {ref.id = "Motor"; iconRefs.push(ref);} }}>
                <img src={Motor} alt="Motor" 
                  className={`motor ${motorOn ? "running" : ""}`} 
                  style={{width: "3vw", height: "3vw",transform: "scaleX(-1)",}}
                  onClick={() => {toggleIsOn("valve5");
                    if (isSimulationRunning) {
                      handleMotorToggle();
                    }
                  }}
                />
                {motorOn && (<div style={{ fontSize: "10px", color: "green" }}>Running</div>)}
                <div style={{fontSize:"1vw"}}>Motor</div>
              </div>

              {/* L Shape Pipe */}
              <div style={{ position: "absolute", top: "11.5vw", left: "32.2vw", transform: "rotate(180deg)"}}>
                <LShapePipe flow={flow1} />
              </div>

              {/* L Shape Pipe */}
              <div style={{ position: "absolute", top: "3.5vw", left: "33vw", transform: "rotate(90deg)"}}>
                <LShapePipe flow={flow1} />
              </div>

              <div style={{ position: "absolute", top: "1.8vw", left: "34.5vw" ,textAlign:"center"}}>
              <div style={{fontSize:"1vw"}}>Admin Block Washrooms</div>
                <img src={Washrooms} alt="WaterTank" style={{ width: "2.8vw", height: "2.8vw" }}/>
              </div>

              <div style={{ position: "absolute", top: "8vw", left: "38.5vw", textAlign:"center" }}>
              <div style={{fontSize:"1vw"}}>KRB Washrooms</div>
                <img src={Washrooms} alt="WaterTank" style={{ width: "2.8vw", height: "2.8vw" }}/>
              </div>

              <div style={{ position: "absolute", top: "7vw", left: "35vw" }}>
                <StraightPipe flow={flow1} />
              </div>
              
              {/* Water Tower */}
              <div style={{ position: "absolute", top: "9vw", left: "29.5vw" }}>
                <img src={Watertank} alt="WaterTank" style={{ width: "7vw", height: "7vw" }} onClick={(e) => handleIconClick(e)} 
                ref={(ref) => {if (ref) {ref.id = "KRBOHTIcon"; iconRefs.push(ref);} }}/>
                <div style={{fontSize:"1vw"}}>KRB OHT - {waterInOHT}L</div>
              </div>

              {/* Straight Pipe */}
              <div style={{ position: "absolute", top: "17vw", left: "41.5vw" }}>
                <StraightPipe flow={flow1} />
              </div>

              {/* RO Plant */}
              <div style={{ position: "absolute", top: "17vw", left: "37vw" }}>
                <img src={roPlantImage} alt="ro plant" style={{ width: "4.8vw", height: "4.8vw" }}
                  onClick={(e) => handleIconClick(e)} ref={(ref) => {if (ref) {ref.id = "ROPlant"; iconRefs.push(ref);} }}
                />
                <div style={{fontSize:"1vw"}}>RO Plant</div>
              </div>

              {/* E Shape Pipe */}
              <div style={{ position: "absolute", top: "22vw", left: "45.5vw" }}>
                <EShapePipe flow={flow1} />
              </div>

              {/* Water Tower */}
              <div style={{ position: "absolute", top: "16.5vw", left: "46vw" }}>
                <div style={{fontSize:"1vw"}}>RO Filtered Water OHT- <b>{waterInROFilter.toFixed(1)}L</b></div>
                <img src={ROWatertank} alt="WaterTank" style={{ width: "5vw", height: "5vw" }} onClick={(e) => handleIconClick(e)} 
                ref={(ref) => {if (ref) {ref.id = "KRB-RO-OHT"; iconRefs.push(ref);} }}/>
              </div>

              {/* RO Coolers */}
              <div style={{ position: "absolute", top: "28vw", left: "44.4vw", textAlign: "center", }} >
                <img src={roCoolerImage} alt="ro cooler 1" style={{ width: "2.8vw", height: "2.8vw" }}
                 onClick={(e) => handleIconClick(e)} 
                 ref={(ref) => {if (ref) {ref.id = "ROCooler1"; iconRefs.push(ref);} }}
                />
                <div style={{fontSize:"1vw"}}>RO 1</div>
                <div style={{fontSize:"1vw"}}>{((3*waterConsumed)/4).toFixed(1)}L</div>
              </div>

              <div style={{ position: "absolute", top: "28vw", left: "47.1vw", textAlign: "center", }}>
                <img src={roCoolerImage} alt="ro cooler 2" style={{ width: "2.8vw", height: "2.8vw" }}
                  onClick={(e) => handleIconClick(e)} 
                  ref={(ref) => {if (ref) {ref.id = "ROCooler2"; iconRefs.push(ref);} }}
                />
                <div style={{fontSize:"1vw"}}>RO 2</div>
              </div>

              <div style={{ position: "absolute", top: "28vw", left: "49.8vw", textAlign: "center",}}>
                <img src={roCoolerImage} alt="ro cooler 3" style={{ width: "2.8vw", height: "2.8vw" }}
                  onClick={(e) => handleIconClick(e)}
                  ref={(ref) => {if (ref) {ref.id = "ROCooler3"; iconRefs.push(ref);} }}/>
                <div style={{fontSize:"1vw"}}>RO 3</div>
                <div style={{fontSize:"1vw"}}>{(waterConsumed/4).toFixed(1)}L</div>
              </div>

              {/* Nodes  */}
              <div style={{ position: "absolute", top: "21vw", left: "13vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => setData([{ title: "Error", value: "Node Not Deployed" }])}
                />
              </div>

              <div style={{ position: "absolute", top: "21vw", left: "29vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                 style={{ width: "3vw", height: "3vw",}}
                onClick={() => getRealData('WM-WD-KH96-00')}
                />
              </div>

              <div style={{ position: "absolute", top: "24vw", left: "38vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => setData([{ title: "Error", value: "Node Not Deployed" }])}
                />
                {/* <div>AFter RO</div> */}
              </div>

              <div style={{ position: "absolute", top: "20vw", left: "51vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => setData([{ title: "Error", value: "Node Not Deployed" }])}
                />
                {/* <div>RO OHT</div> */}
              </div>

              <div style={{ position: "absolute", top: "35vw", left: "44vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                 style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KH95-00')}
                />
                {/* <div>RO 1</div> */}
              </div>

              <div style={{ position: "absolute", top: "35vw", left: "50vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                 style={{ width: "3vw", height: "3vw",}}
                  onClick={() => setData([{ title: "Error", value: "Node Not Deployed" }])}
                />
                {/* <div>RO 3</div> */}
              </div>

              <div style={{ position: "absolute", top: "21vw", left: "17vw", textAlign: "center", }}>
                <img src={WaterLevelNode} alt="WaterLevelNode"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WL-KH98-00')}
                />
                {/* <div>SUMP</div> */}
              </div>

              <div style={{ position: "absolute", top: "21vw", left: "33vw", textAlign: "center", }}>
                <img src={WaterLevelNode} alt="WaterLevelNode"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WL-KH00-00')}
                />
                {/* <div>OHT</div> */}
              </div>

              <div style={{ position: "absolute", top: "22vw", left: "22.7vw", textAlign: "center", }}>
                <img src={MotorNode} alt="MotorNode"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KRB-M1')}
                />
                {/* <div>Motor</div> */}
              </div>

              <div style={{ position: "absolute", top: "4vw", left: "34.5vw", textAlign: "center", }}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-70')}
                />
                {/* <div>W1</div> */}
              </div>

              <div style={{ position: "absolute", top: "10vw", left: "37vw", textAlign: "center", }}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-73')}
                />
                {/* <div>W2</div> */}
              </div>

              <div style={{ position: "absolute", top: "25vw", left: "44.5vw", textAlign: "center", transform: "rotate(90deg)",}}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-71')}
                />
                {/* <div>RO1</div> */}
              </div>

              <div style={{ position: "absolute", top: "25vw", left: "50vw", textAlign: "center", transform: "rotate(90deg)",}}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-72')}
                />
                {/* <div>RO3</div> */}
              </div>

              {/* Other Nodes and Components */}
              {/* Include other nodes and components with their positions calculated in vw */}
              {/* ... */}


            {/* Draggable Code */}

            {
              canvasItems.map((item, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    cursor: 'move',
                    border: isMarkerPlaced ? '2px solid green' : 'none'
                  }}
                  onClick={(e) => handleMarkerClick(item, index, e)}
                >
                  <img
                    src={getImageForType(item.type)}
                    alt={item.type}
                    style={{ maxWidth: '3vw', maxHeight: '100%', filter:"grayscale(200%)" }}
                  />
                </div>
              ))
            }

            {itemToAdd && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e)}
                style={{
                  position: 'absolute',
                  left: '20px', // Default x position
                  top: '20px', // Default y position
                  cursor: 'move',
                }}
              >
                <img
                  src={getImageForType(itemToAdd)}
                  alt={itemToAdd}
                  style={{ maxWidth: '3vw', maxHeight: '100%', filter:"grayscale(200%)" }}
                />
              </div>
            )}

            </div>
          </div>


          <br></br>
          <div className="result-container">
            <div className="water-flow-container">
              <div className="result-cards">
                {data.map((item, index) => (
                  <ResultCard key={index} title={item.title} value={item.value} />
                ))}
              </div>
            </div>
          </div>


          {/* {result && ( */}
          {/* {
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
              </div>
            </div>
          } */}

          {/* {showMotorStatus && (
            <div className="motor-status-overlay">
              <p>Motor is {motorOn ? "on" : "off"}</p>
            </div>
          )} */}
        </div>


        {/* Right Section */}
        <div style={{ flex: 1 }}>
          {/* {result && ( */}
          <div className="result-container">
            <p>Results:</p>
            <div className="result-cards">
              <ResultCard
                title="TDS Value(mg/L) - At SUMP"
                value={result?.calculated_tds_value ?? "N/A"}
              />
              {/* <ResultCard
                  title="Osmotic Pressure(Pascal (Pa))"
                  value={result.osmotic_pressure}
                /> */}
              {/* <ResultCard title="Water Flux(m³)" value={result.water_flux} /> */}
              <ResultCard
                title="Permeate Flow Rate(m³/s)"
                value={result?.permeate_flow_rate ?? "N/A"}
              />
              <ResultCard
                title="Final TDS Concentration After RO Tank(mg/L)"
                value={result?.final_tds_concentration_after_ro_tank ?? "N/A"}
              />
              <ResultCard
                title="Cycle Count"
                value={result?.cycle_count ?? "N/A"}
              />
              <ResultCard
                title="Time Estimation (hours)"
                value={result?.time_estimation_hours ?? "N/A"}
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
