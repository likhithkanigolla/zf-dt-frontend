import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import "./SimulationPage.css";

import NavigationBar from "../../components/navigation/Navigation";
import Toolbar from "./components/ToolBar/ToolBar";
import SimulationForm from "./components/SimulationForm/Form";
import ResultContainer from "./components/ResultContainer";
import LeakageOptions from "./components/LeakageOptions";
import SimulationCanvas from "./components/SimulationCanvas";
import ConsoleHeader from "./components/Console/Console";

import whiteimage from "../images/white.png";
import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import LeakageIcon from "../images/leakage_water.png"; 
import HoverableIcon from "./components/HoverableIcon";

import DeleteIcon from '@mui/icons-material/Delete';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import config from '../../config';

const SimulationPage = () => {
  // State for holding input values and results
  const iconRefs = [];
  const [isMarkerPlaced, setIsMarkerPlaced] = useState(false);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [floatBox, setFloatBox] = useState({ isVisible: false, value: '' , nodeId: null});
  const [hoverData, setHoverData] = useState({isVisible: false, data: '',x: 0,y: 0});
  const [inputValues, setInputValues] = useState({
    Scenarios: "1",
    timeMultiplier: "1",
    SandQuantity: "0",
    SoilQuantity: "0",
    voltage: "240",
    current: "11",
    power_factor: "0.11",
    motor_efficiency: "0.85",
    temperature: "25",
    desired_tds: "65",
    membrane_area: "3700",
    sumpCapacity: "60000",
    ohtCapacity: "100000",
    ro_ohtCapacity: "1000",
    // flowrate: "5"
  });

  const [result, setResult] = useState(null);
  const [previousResult, setpreviousResult] = useState(null)
  const [soilContamination, setSoilContamination] = useState(null);
  const [sandContamination, setSandContamination] = useState(null);
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

  const [sensorValues, setSensorValues] = useState({
    waterqualitysensor: 0,
    waterquantitysensor: 0,
    waterlevelsensor: 0,
    motorsensor:  0
  });

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [waterInSump, setWaterInSump] = useState(60000); // Initial water level in Sump
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [waterFlowAdmin, setWaterFlowAdmin] = useState(0); // Initial water flow in Admin
  const [waterFlowKRB, setWaterFlowKRB] = useState(0); // Initial water flow in KRB
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(100); // Initial water level in RO Filter
  const [alertShown, setAlertShown] = useState(false);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0.00);
  const [flowrate, setFlowrate] = useState(10);
  const [PermeateFlowRate, setPermeateFlowRate] = useState(1);
  const [PreviousPermeateFlowRate, setPreviousPermeateFlowRate] = useState(0);
  const [showMotorStatus, setShowMotorStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);


  const [infoText, setInfoText] = useState("");
  const [SoilQuantity, setSoilQuantity] = useState("");
  const [SandQuantity, setSandQuantity] = useState("");
  const [voltageValue, setVoltageValue] = useState("");
  const voltageData = {0: 1.2, 1: 2.3, 2: 3.4, 3: 4.5, 4: 5.6, 5: 6.7,};

  const [showLeakageOptions, setShowLeakageOptions] = useState(false);
  const [numLeakages, setNumLeakages] = useState(1);
  const [leakageLocation, setLeakageLocation] = useState("");
  const [leakageRate, setLeakageRate] = useState(0); // Add state for leakage rate
  const [leakageMarkers, setLeakageMarkers] = useState([]);

  const [datagraph, setDatagraph] = useState([]);
  const [flowgraph, setFlowgraph] = useState([]);
  const [log, setLog] = useState([]); 
  const updateLog = (message) => {
    setLog((prevLog) => [...prevLog, `${new Date().toISOString()}: ${message}`]);
  };

  const handleDownloadLog = () => {
    const blob = new Blob([log.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'simulation_log.txt');
  };

  const handleSaveLog = () => {
    const logData = log ;
    handleStopSimulation();
    try{
      const response = fetch(`${config.backendAPI}/save_log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ log: logData }),
      });
      updateLog("Log data saved successfully.");
      setLog(['']); // Clear the log after saving
      // reset everything 
      setWaterInSump(60000);
      setWaterInOHT(0);
      setWaterFlowAdmin(0);
      setWaterFlowKRB(0);
      setMotorOn(false);
      setWaterInROFilter(100);
      setAlertShown(false);
      setWaterFlowStarted(false);
      setWaterConsumed(0.00);
      setFlowrate(10);
      setPermeateFlowRate(1);
      setPreviousPermeateFlowRate(0);
      // toast.success("Log data saved successfully.");
    } catch (error) {
      console.error("Error saving log data:", error);
      updateLog("Error saving log data.");
      // toast.error("Error saving log data.");
    }
  };  

  const handleMultiplierChange = (e) => {
    setTimeMultiplier(parseFloat(e.target.value));
    updateLog(`Speed Multiplier changed to ${e.target.value}.`);
  };

  // Function to handle leakage icon click
  const handleLeakageIconClick = () => {
    setShowLeakageOptions(true);
  };
  // Function to handle applying leakage options
  const handleApplyLeakages = () => {
    const newMarkers = [];
    for (let i = 0; i < numLeakages; i++) {
      // Calculate position based on leakageLocation and index (to distribute markers)
      const position = calculateLeakagePosition(leakageLocation, i, numLeakages);
      newMarkers.push({
        type: "leakage",
        x: position.x,
        y: position.y,
        rate: leakageRate, // Include leakage rate in the marker data
      });
    }
    setLeakageMarkers(newMarkers);
    setShowLeakageOptions(false);
    // toast.success("Leakages applied successfully!");

  };

  // Function to calculate leakage position (you'll need to implement the logic)
  const calculateLeakagePosition = (location, index, totalLeakages) => {
    let x, y;
    if (location === "motorOHT") {
      // Hardcoded coordinates for the three possible leakage positions
      const leakagePositions = [
        { x: 890, y: 510 }, // Motor end
        { x: 920, y: 460 }, // Middle pipe
        { x: 950, y: 410 }, // Near OHT
      ];
  
      // Ensure totalLeakages is within the allowed range (1 to 3)
      totalLeakages = Math.max(1, Math.min(3, totalLeakages));
  
      // Determine the index for the leakage position based on totalLeakages
      let positionIndex;
      if (totalLeakages === 1) {
        positionIndex = 0; // Only use the motor end position
      } else if (totalLeakages === 2) {
        positionIndex = index * 2; // Use motor end and middle positions
      } else {
        positionIndex = index; // Use all three positions
      }
  
      // Get the coordinates from the leakagePositions array
      ({ x, y } = leakagePositions[positionIndex]);
    } // ... (rest of your logic)
    return { x, y };
  };

  const handleStopSimulation = () => {
    handleStopWaterFlow();
    setIsSimulationRunning(false);
    setFlow1(false);
    setFlow2(false);
    setFlow3(false);
    setFlow4(false);
    setMotorOn(false);
    updateLog("Simulation stopped.");
    // toast.error("Simulation stopped!");
  };

  useEffect(() => {
    let intervalId;
    let intervalwaterConsume;
    // console.log("iconRefs",iconRefs);
    if (waterFlowStarted) {
      intervalId = setInterval(() => {
        if (motorOn) {
          // Pump water from Sump to OHT if motor is on
          if (waterInSump > 0 && waterInOHT < inputValues.ohtCapacity) {
            setWaterInSump((prev) => Math.max((prev - flowrate), 0));

        // Calculate total leakage rate (limited to 4 L/s)
            const totalLeakageRate = Math.min(
              leakageMarkers.reduce((sum, marker) => {
                if (marker.type === "leakage" && marker.location === "motorOHT") {
                  return sum + marker.rate;
                }
                return sum;
              }, 0),
              4 // Maximum leakage rate
            );
            updateLog(`Total Leakage Rate: ${totalLeakageRate}`);
            console.log("Total Leakage Rate:", totalLeakageRate); // Check the calculated value
        
        // Calculate the effective flow rate into OHT
        updateLog(`Motor Flow Rate: ${flowrate}`);
        const effectiveFlowRate = Math.max(flowrate - totalLeakageRate + (Math.random() - 0.5), 1); 
  
        updateLog(`Effective Flow Rate: ${effectiveFlowRate}`);
        // console.log("Effective Flow Rate:", effectiveFlowRate); // Check the flow rate

        const prevWaterInOHT = waterInOHT; // Get previous water level
        setWaterInOHT((prev) => Math.min(prev + effectiveFlowRate, inputValues.ohtCapacity)); 
        console.log("Water in OHT:", waterInOHT, "(Previous:", prevWaterInOHT, ")"); // Verify state update 
        }
        
          if ((waterInOHT === inputValues.ohtCapacity || waterInSump === 0) && !alertShown) {
            updateLog("Motor turned off automatically since water tank is full.");
            // ...

            if ((waterInOHT === inputValues.ohtCapacity || waterInSump === 0) && !alertShown) {
              updateLog("Motor turned off automatically since water tank is full.");
              // toast.error("Motor turned off automatically since water tank is full.");
              setMotorOn(false);
              setFlow2(false);
              setAlertShown(true); // Set alertShown to true to prevent repeated alerts
            }
            setMotorOn(false);
            setFlow2(false);
            setAlertShown(true); // Set alertShown to true to prevent repeated alerts
          }
        }
        // console.log("Permate_Flow_here:",PermeateFlowRate)
        const temp_permeate = PermeateFlowRate+ (Math.random() - 0.5);
        setPreviousPermeateFlowRate(PermeateFlowRate.toFixed(2));
        setPermeateFlowRate(temp_permeate);
        setFlowgraph(flowgraph => [...flowgraph, { time: new Date().toLocaleTimeString(), flowrate: PermeateFlowRate, id: 4 }]);
        console.log("Flow Graph:", flowgraph);
        setWaterInROFilter(temp_permeate/5); //Initializing enough water to consume
        updateLog("Permeate Flow Rate: "+PermeateFlowRate);
        
        // Pump water from OHT to RO Filter continuously
        if (waterInOHT > PermeateFlowRate && waterInROFilter < inputValues.ro_ohtCapacity) {
          console.log("Permeate_Flow_here:",PermeateFlowRate)
          setWaterInOHT((prev) => Math.max(prev - (PermeateFlowRate+(PermeateFlowRate*0.3)) - (flowrate*0.06), 0)); // Tds Reduction rate is 70% so 30% water will be wasted.
          setWaterFlowAdmin((prev) => prev + (flowrate*0.02));
          setWaterFlowKRB((prev) => prev + (flowrate*0.04));
          setWaterInROFilter(
            (prev) => prev + PermeateFlowRate 
          ); // Increase water in RO Filter by permeate flow rate, converted from l/m2/hr to l/s
        }

        if (waterInOHT < PermeateFlowRate) {
          setFlow3(false);
          updateLog("Flow stopped from since OHT is empty.");
          // toast.error("Flow stopped from since OHT is empty.");
        }
        else{
          setFlow3(true);
        }

        // If water in OHT is less than 20%, turn on the motor automatically
        // if (waterInOHT < (20*inputValues.ohtCapacity)/100) {
        //   setMotorOn(true);
        //   setFlow2(true);
        // }
        if (waterInSump < flowrate) {
          setMotorOn(false);
          setFlow2(false);
          updateLog("Motor turned off automatically since sump is empty.");
          // toast.error("No water in sump.");
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
        // console.log(`Icon ${iconId} coordinates:`, iconCoordinates);
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
    leakageRate
  ]);



  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if simulation is running
    if (isSimulationRunning) {
      // If simulation is running, stop it
      handleStopWaterFlow();
      setIsSimulationRunning(false);
      updateLog("Simulation stopped to Update Values.");

      // Update input values
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: value,
      }));

      updateLog(`Updated the Value ${name} to ${value}.`)
      // Restart the simulation
      handleCalculate(); // Recalculate
      handleStartWaterFlow(); // Restart the simulation
      setIsSimulationRunning(true);
      updateLog("Simulation restarted after updating values.")
    } else {
      // If simulation is not running, simply update input values
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: value,
      }));
      updateLog(`Updated the Value ${name} to ${value}.`)
    }
    if (name === "sumpCapacity") {
      setWaterInSump(parseInt(value) || 0); // Parse value as integer and set waterInSump
    }
  };

  const ResultCard = ({ title, value }) => {
    return (
      <div className="result-card">
        <h5>{title}</h5>
        <p>{value}</p>
      </div>
    );
  };

  // Function to call the api calculate_soil_contamination from backend and get the result
  const calculateSoilContamination = async () => {
    try {
      const response = await fetch(`${config.backendAPI}/calculate_soil_contamination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputValues)
      });
      if (!response.ok) {
        throw new Error("Failed to calculate soil contamination");
      }
      const soilContamination = await response.json();
      setSoilContamination(soilContamination);
      updateLog(`TDS Value Soil Contamination calculated: ${soilContamination}`);
      return soilContamination; // Return the soil contamination value
    } catch (error) {
      console.error(error);
    }
  };

  const calculateSandContamination = async () => {
    try {
      const response = await fetch(`${config.backendAPI}/calculate_sand_contamination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputValues)
      });
      if (!response.ok) {
        throw new Error("Failed to calculate sand contamination");
      }
      const sandContamination = await response.json();
      setSandContamination(sandContamination);
      updateLog(`TDS Value Sand Contamination calculated: ${sandContamination}`);
      return sandContamination; // Return the sand contamination value
    } catch (error) {
      console.error(error);
    }
  };

  const calculateROFiltration = async (calculatedTDS, desired_tds, temperature,membrane_area, timeMultiplier) => {
    const requestBody = {
      initial_tds: calculatedTDS,
      desired_tds: desired_tds,
      voltage: voltageData[voltageValue],
      temperature: temperature,
      effective_membrane_area: membrane_area,
      sump_capacity: inputValues.sumpCapacity,
      timeMultiplier: timeMultiplier,
      // Other parameters as needed
    };

    let response = await fetch(
      `${config.backendAPI}/calculate_ro_filtration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    let data = await response.json();
    updateLog(`RO Filtration Data: ${JSON.stringify(data, null, 2)}`);
    return data;
  };

  const calculateMotorFlowRate = async(voltage, current, power_factor, motor_efficiency, depth,timeMultiplier) => {
    const requestBody = {
      voltage: voltage,
      current: current,
      power_factor: power_factor,
      motor_efficiency: motor_efficiency,
      depth: depth, 
      timeMultiplier: timeMultiplier
    };

    let response = await fetch(
      `${config.backendAPI}/calculate_motor_flow_rate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    let data = await response.json();
    updateLog(`Motor Flow Rate Data: ${JSON.stringify(data, null, 2)}`);
    return data;
  }

  const handleCalculate = async () => {
    try {
      const soilQuantity = parseInt(inputValues.SoilQuantity);
      const sandQuantity = parseInt(inputValues.SandQuantity);
      let calculatedTDS;
      // store the result.calculated_tds_value in this format in { time: currenttime', tds: result.calculated_tds_value, id: 1 } id 1 if only soil is there and id 2 if only sand is there id 3 if both are there
    

      if (soilQuantity !== 0 && sandQuantity === 0) {
        const soilContaminationValue = await calculateSoilContamination(inputValues);
        console.log("Soil Value:", soilContaminationValue);
        calculatedTDS = soilContaminationValue;
        setDatagraph(datagraph => [...datagraph, { time: new Date().toLocaleTimeString(), tds: soilContaminationValue, id: 1 }]);
        console.log("Data Graph:", datagraph);
      } else if (soilQuantity === 0 && sandQuantity !== 0) {
        const sandContaminationValue = await calculateSandContamination(inputValues);
        console.log("Sand Value:", sandContaminationValue);
        calculatedTDS = sandContaminationValue;
        setDatagraph(datagraph => [...datagraph, { time: new Date().toLocaleTimeString(), tds: sandContaminationValue, id: 2 }]);
        console.log("Data Graph:", datagraph);
      } else {
        const SandTDS = await calculateSandContamination(inputValues);
        const SoilTDS = await calculateSoilContamination(inputValues);
  
        console.log("Soil Value:", SoilTDS, "Sand Value:", SandTDS);
        updateLog(`Soil TDS Value calculated: ${SoilTDS}`);
        updateLog(`Sand TDS Value calculated: ${SandTDS}`);
  
        calculatedTDS = (SoilTDS + SandTDS) / 2;
        setDatagraph(datagraph => [...datagraph, { time: new Date().toLocaleTimeString(), tds: calculatedTDS, id: 3 }]);
        console.log("Data Graph:", datagraph);
        updateLog(`Average TDS Value calculated: ${calculatedTDS}`);
      }

      const flow = await calculateMotorFlowRate(inputValues.voltage, inputValues.current, inputValues.power_factor, inputValues.motor_efficiency, 2.5, inputValues.timeMultiplier)
      const data_RO = await calculateROFiltration(calculatedTDS, inputValues.desired_tds, inputValues.temperature, inputValues.membrane_area, inputValues.timeMultiplier);
      setpreviousResult(result); // Store the current result in previousResult
        setResult({
        ...data_RO,
        calculated_tds_value: parseFloat(data_RO.calculated_tds_value) + Math.random() * 0.5 - 0.25
      });

      // console.log("Result PR:", data_RO.permeate_flow_rate);
      setPreviousPermeateFlowRate(PermeateFlowRate.toFixed(2));
      setFlowgraph(flowgraph => [...flowgraph, { time: new Date().toLocaleTimeString(), flowrate: PermeateFlowRate, id: 4 }]);
      console.log("Flow Graph:", flowgraph);
      setPermeateFlowRate(parseFloat(data_RO.permeate_flow_rate)* timeMultiplier);
      setFlowrate(parseFloat(flow.flowrate_per_min)* timeMultiplier);
      console.log("Flow Rate:", flowrate);
      console.log("Permeate Flow Rate:", PermeateFlowRate);

      updateLog(`Motor flow rate calculated: ${flow.flowrate_per_min}`);
      updateLog(`RO filtration data: ${JSON.stringify(data_RO)}`);

      setWaterFlowStarted(true);
      return calculatedTDS;

    } catch (error) {
      console.error("Error calculating RO filtration:", error);
    }

  };

  const getRealData = async (tableName) => {
    try {
      const response = await fetch(`${config.backendAPI}/get_value?table_name=${tableName}`);
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
    setMotorOn(true);
    updateLog("Water Flow Started.");
    updateLog("Motor turned on.");
    // toast.info("Water flow started!");
  };

  const handleStopWaterFlow = () => {
    setWaterFlowStarted(false);
    updateLog("Water Flow Stopped.");
    // toast.info("Water flow stopped!");
  };

  const handleMotorToggle = () => {
    if (!motorOn) {
      setMotorOn(true);
      updateLog("Motor turned on.");
      setFlow2(true);
      toast.info("Motor turned on!");
    } else {
      setMotorOn(false);
      updateLog("Motor turned off.");
      setFlow2(false);
      toast.info("Motor turned off!");
    }
  };

  const handleStartSimulation = async () => {
    if (!isSimulationRunning) {
      await handleCalculate(); 
      // calculateSoilContamination();
      handleStartWaterFlow(); // Start water flow
      setIsSimulationRunning(true);
      // setFlow4((flow4) => !flow4);
      setFlow1((flow1) => !flow1);
      setFlow2(true);
      setMotorOn(true);
      updateLog("Simulation started.")
      // toast.success("Simulation started!");
    } else {
      handleStopWaterFlow(); // Stop water flow
      setIsSimulationRunning(false);
      setFlow1(false);
      setFlow2(false);
      setFlow3(false);
      setFlow4(false);
      setMotorOn(false);
      updateLog("Simulation stopped.")
      // toast.error("Simulation stopped!");
    }
  };

  const handleConsumeWater = () => {
    // Consumption is 10% of the filteration. 
    if (waterInROFilter >= (PermeateFlowRate/10)) {
      setFlow4(true);
      setWaterInROFilter((prev) => prev - (PermeateFlowRate/10)); 
      setWaterConsumed((prev) => prev + (PermeateFlowRate/10)); 
    } else {
      // alert("Not enough water in RO Filter to consume.")
      setFlow4(false);
      // toast.error("Not enough water in RO Filter to consume.");
      updateLog("Not enough water in RO Filter to consume.");
    }
  };

  const [canvasItems, setCanvasItems] = useState([]);
  const [itemToAdd, setItemToAdd] = useState(null);
  
  const handleDragStart = (event, index) => {
    if (index !== undefined) {
      event.dataTransfer.setData('index', index);
      console.log(`Dragging item at index: ${index}`);
    }

    const markerCoordinates = {
      x: event.clientX,
      y: event.clientY,
    };

    const { isPlaced, iconId } = checkMarkerOverlap(markerCoordinates, index);
    console.log('Marker is placed on:', iconId);
    updateLog(`Marker is placed on: ${iconId}`);
    setIsMarkerPlaced(isPlaced);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...canvasItems];
    updatedItems.splice(index, 1);
    setCanvasItems(updatedItems);
    updateLog(`Deleted item at index ${index}.`);
    // toast.error(`Deleted item at index ${index}.`);
  };
  
  const checkMarkerOverlap = (markerCoordinates, index) => {
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
        iconId = ref.id; 
        isPlaced = true;
      }
    });

    if(iconId === 'dustbin'){
      console.log("Dustbin is clicked");
      handleDeleteItem(index);
    }

    if (!isPlaced) {
      // toast.error("Marker is not placed on any icon.");
    }
     else {

      // toast.success(`Marker is placed on: ${iconId}`);
    }
  
    return { isPlaced, iconId };
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const canvasRect = event.currentTarget.getBoundingClientRect();
    const index = event.dataTransfer.getData('index');
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
    console.log(`Dropped at x dustbin: ${x}, y: ${y}`);


      console.log(`Dropped at x: ${x}, y: ${y}`);
      if (index) {
        const updatedItems = [...canvasItems];
        updatedItems[index] = {
          ...updatedItems[index],
          x: x,
          y: y,
        };
        setCanvasItems(updatedItems);
        console.log(`Moved item ${updatedItems[index].type} to x: ${x}, y: ${y}`);
      } else if (itemToAdd) {
        const newItem = {
          type: itemToAdd,
          x: x,
          y: y,
        };
        setCanvasItems([...canvasItems, newItem]);
        setItemToAdd(null);
        updateLog(`Added item of type ${itemToAdd}`);
      }
      else {  
        console.log("Dropped at x: ", x, "y: ", y);
      }
    
  };
  

  const handleDeleteAllItems = (event) => {
    setCanvasItems([]); 
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const handleIconClick = (event) => {
    const refId = event.target.id;
    const iconCoordinates = {
      x: event.clientX,
      y: event.clientY,
    };
    console.log(refId, "coordinates:", iconCoordinates);
    console.log("Icon clicked:", refId);
  };

  const handleMarkerClick = async (item, index, event) => {
    const { clientX, clientY } = event; 
    const coordinates = {
      x: clientX,
      y: clientY,
    };
    
    const { isPlaced, iconId } = checkMarkerOverlap(coordinates, index);
    console.log("Marker of type ", item.type , "placed on",iconId, "at coordinates:", coordinates);
    updateLog(`Marker of type ${item.type} placed on ${iconId} at coordinates: ${JSON.stringify(coordinates)}`);

    const caltds= await handleCalculate()
    console.log("Calculated TDS:",caltds)

    if(iconId=='KRBSump' && item.type=='waterlevelsensor'){
      setSensorValues(prevValues => ({
        ...prevValues,
        waterlevelsensor: (waterInSump/inputValues.sumpCapacity)*100,
      }));
    }
    if(iconId=='KRBOHTIcon' && item.type=='waterlevelsensor'){
      setSensorValues(prevValues => ({
        ...prevValues,
        waterlevelsensor: (waterInOHT/inputValues.ohtCapacity)*100,
      }));
    }
    if(iconId=='KRBROOHT' && item.type=='waterlevelsensor'){
      setSensorValues(prevValues => ({
        ...prevValues,
        waterlevelsensor: (waterInROFilter/inputValues.ro_ohtCapacity)*100,
      }));
    }
    if(iconId=='KRBSump' && item.type=='waterqualitysensor'){
      setSensorValues(prevValues => ({
        ...prevValues,
        waterqualitysensor: caltds,
      }));

    }
    if(iconId=='KRBOHTIcon' && item.type=='waterqualitysensor'){
      setSensorValues(prevValues => ({
        ...prevValues,
        waterqualitysensor: caltds + Math.floor(Math.random() * 21) - 10,
      }));

    }
    if(iconId=='KRBROOHT' && item.type=='waterqualitysensor'){
      setSensorValues(prevValues => ({
        ...prevValues,
        waterqualitysensor: result.final_tds_concentration_after_ro_tank+Math.floor(Math.random() * 11) - 5,
      }));
    }
    

  };

  const handleToolbarItemClick = (type) => {
    // Prepare to add a new item when the next drop occurs
    // Instead of directly adding the item, we set an "item to add" state
    setItemToAdd(type);
  };

  const handleClearLog = () => {
    // Assuming logContent is a state variable holding the log data
    setLog(''); // Clear the log by setting the log content to an empty string
    updateLog('Log cleared'); // Log the action
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


  const SimulatedValues = {
    "WM-WL-KH98-00": (waterInSump / inputValues.sumpCapacity) * 100,
    "WM-WL-KH00-00": (waterInOHT / inputValues.ohtCapacity) * 100,
    "DM-KH98-60": 0,
    "WM-WD-KH98-00": result? result.calculated_tds_value + Math.floor(Math.random() * 21) - 10: 0,
    "WM-WD-KH96-00": result? (result.calculated_tds_value+30) + Math.floor(Math.random() * 21) - 10 : 0,
    "WM-WD-KH96-02": result? (result.final_tds_concentration_after_ro_tank)+Math.floor(Math.random() * 11) - 5: 0,
    "WM-WD-KH95-00": result? (result.final_tds_concentration_after_ro_tank-5)+Math.floor(Math.random() * 11) - 5: 0,
    "WM-WD-KH96-01": result? result.calculated_tds_value + Math.floor(Math.random() * 21) - 10 : 0,
    "WM-WD-KH03-00": result? (result.final_tds_concentration_after_ro_tank-5)+Math.floor(Math.random() * 11) - 5: 0,
    "WM-WF-KB04-70": waterFlowAdmin,
    "WM-WF-KB04-73": waterFlowKRB,
    "WM-WF-KB04-71": ((3 * waterConsumed) / 4),
    "WM-WF-KB04-72": ((waterConsumed) / 4),
    "WM-WF-KH98-40": inputValues?inputValues.sumpCapacity:0,
    "WM-WF-KH95-40": inputValues?inputValues.sumpCapacity-waterInSump:0, 
  };

  const displayValueOnClick = (id) => {
    const value = SimulatedValues[id];
    // Display the value in the floated text box with close button
    // You can implement the UI logic here
    console.log("value", value)
    setFloatBox({ isVisible: true, value: value, nodeId: id });
  };

  // Ensure this function is correctly defined in your component
  const handleFloatBoxClose = () => {
    setFloatBox({ isVisible: false, value: '' });
  };
  

  return (
    <div>
      <ToastContainer />
      <NavigationBar title="Digital Twin for Water Quality" />
      <div style={{ display: "flex"}}>
        {/* Left Section */}
        <SimulationForm 
            inputValues={inputValues} 
            handleChange={handleChange} 
            handleStartSimulation={handleStartSimulation} 
            isSimulationRunning={isSimulationRunning} 
            handleMultiplierChange={handleMultiplierChange}
            timeMultiplier={timeMultiplier}
            handleDownloadLog={handleDownloadLog}
            handleSaveLog={handleSaveLog}
            log={log}
        />

        {/* Middle Section */}
        <div style={{ flex: 3 }}>
          {/* Toolbar */}
          <Toolbar handleToolbarItemClick={handleToolbarItemClick} handleLeakageIconClick={handleLeakageIconClick} />
          <LeakageOptions showLeakageOptions={showLeakageOptions} numLeakages={numLeakages} setNumLeakages={setNumLeakages} leakageLocation={leakageLocation} setLeakageLocation={setLeakageLocation} leakageRate={leakageRate} setLeakageRate={setLeakageRate} handleApplyLeakages={handleApplyLeakages}/>
          <div className="demo-page">
            <div style={{ position: 'relative', width: '60vw', height: '23vw', border: '1px solid black', background: "#ffffff"}} onDrop={handleDrop} onDragOver={handleDragOver}>
              <img src={whiteimage} alt="blueprint" style={{ width: "100%", height: "100%" }}/>
              <SimulationCanvas 
                  handleIconClick={handleIconClick}
                  iconRefs={iconRefs}
                  flow1={flow1}
                  flow2={flow1}
                  flow3={flow1}
                  flow4={flow2}
                  flow5={flow3}
                  flow6={flow3}
                  flow7={flow3}
                  flow8={flow4}
                  flow9={flow4}
                  setFlow1={setFlow1}
                  waterInSump={waterInSump}
                  sumpCapacity={inputValues.sumpCapacity}
                  motorOn={motorOn}
                  toggleIsOn={toggleIsOn}
                  isSimulationRunning={isSimulationRunning}
                  handleMotorToggle={handleMotorToggle}
                  waterInOHT={waterInOHT}
                  ohtCapacity={inputValues.ohtCapacity}
                  waterInROFilter={waterInROFilter}
                  waterConsumed={waterConsumed}
                  flowrate={flowrate}
                  result={result}
                />
              

              {/* IoT Nodes  */}
              <div style={{ position: "absolute", top: "12.5vw", left: "14vw", textAlign: "center" }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WD-KH98-00')} /> */}
                <HoverableIcon src={WaterQualityNode}  alt="WaterQualityNode" dataId="WM-WD-KH98-00" data={`Water Quality: ${SimulatedValues['WM-WD-KH98-00'].toFixed(2)}ppm`}/>
              </div>

              <div style={{ position: "absolute", top: "1vw", left: "29.5vw", textAlign: "center", zIndex: 3 }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WD-KH96-00')} /> */}
                <HoverableIcon src={WaterQualityNode}  alt="WaterQualityNode" dataId="WM-WD-KH96-00" data={`Water Quality: ${SimulatedValues['WM-WD-KH96-00'].toFixed(2)}ppm`}/>
              </div>

              <div style={{ position: "absolute", top: "6.5vw", left: "50.6vw", textAlign: "center", zIndex: 3 }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WD-KH96-01')} /> */}
                <HoverableIcon src={WaterQualityNode}  alt="WaterQualityNode" dataId="WM-WD-KH96-01" data={`Water Quality: ${SimulatedValues['WM-WD-KH96-01'].toFixed(2)}ppm`}/>
              </div>

              <div style={{ position: "absolute", top: "9vw", left: "55vw", textAlign: "center" }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WD-KH96-02')} /> */}
                <HoverableIcon src={WaterQualityNode}  alt="WaterQualityNode" dataId="WM-WD-KH96-02" data={`Water Quality: ${SimulatedValues['WM-WD-KH96-02'].toFixed(2)}ppm`}/>
              </div>

              <div style={{ position: "absolute", top: "15vw", left: "52.3vw", textAlign: "center" }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WD-KH95-00')} /> */}
                <HoverableIcon src={WaterQualityNode}  alt="WaterQualityNode" dataId="WM-WD-KH95-00" data={`Water Quality: ${SimulatedValues['WM-WD-KH95-00'].toFixed(2)}ppm`}/>
              </div>

              <div style={{ position: "absolute", top: "15vw", left: "57.9vw", textAlign: "center" }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WD-KH03-00')} /> */}
                <HoverableIcon src={WaterQualityNode}  alt="WaterQualityNode" dataId="WM-WD-KH03-00" data={`Water Quality: ${SimulatedValues['WM-WD-KH03-00'].toFixed(2)}ppm`}/>
              </div>

              <div style={{ position: "absolute", top: "8vw", left: "13vw", textAlign: "center" }}>
                {/* <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WL-KH98-00')} /> */}
                <HoverableIcon src={WaterLevelNode}  alt="WaterQuantityNode" dataId="WM-WL-KH98-00" data={`Water Level: ${SimulatedValues['WM-WL-KH98-00'].toFixed(2)}%`}/>
              </div>

              <div style={{ position: "absolute", top: "1vw", left: "32vw", textAlign: "center" }}>
                {/* <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> displayValueOnClick('WM-WL-KH00-00')} onMouseEnter={(e) => handleMouseEnter(e)} onMouseLeave={(e) => handleMouseLeave(e)}/> */}
                <HoverableIcon src={WaterLevelNode}  alt="WaterQuantityNode" dataId="WM-WL-KH00-00" data={`Water Level: ${SimulatedValues['WM-WL-KH00-00'].toFixed(2)}%`}/>
              </div>

              <div style={{ position: "absolute", top: "10vw", left: "22vw", textAlign: "center", zIndex:15}}>
                {/* <img src={MotorNode} alt="MotorNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('DM-KH98-60')} /> */}
                <HoverableIcon src={MotorNode}  alt="MotorNode" aId="DM-KH98-60" dataId="DM-KH98-60" data={`Motor Status: ${motorOn ? "ON" : "OFF"}`}/>
              </div>

              <div style={{ position: "absolute", top: "7vw", left: "7vw", textAlign: "center",transform: "rotate(90deg)", zIndex: 2 }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KH98-40')} /> */}
                <HoverableIcon src={WaterQuantityNode}  alt="WaterQuantityNode" dataId="WM-WF-KH98-40" data={`Total Water Flow: ${SimulatedValues['WM-WF-KH98-40']}L`} rotation={90}/>
              </div>

              <div style={{ position: "absolute", top: "6.7vw", left: "26.5vw", textAlign: "center",transform: "rotate(90deg)", zIndex: 2 }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WF-KH95-40')} /> */}
                <HoverableIcon src={WaterQuantityNode}  alt="WaterQuantityNode" dataId="WM-WF-KH95-40" data={`Total Water Flow: ${SimulatedValues['WM-WF-KH95-40'].toFixed(2)}L`}  rotation={90}/>
              </div>

              <div style={{ position: "absolute", top: "7.3vw", left: "39.6vw", textAlign: "center", transform: "rotate(90deg)", zIndex: "2" }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WF-KB04-70')} /> */}
                <HoverableIcon src={WaterQuantityNode}  alt="WaterQuantityNode" dataId="WM-WF-KB04-70" data={`Total Water Flow: ${SimulatedValues['WM-WF-KB04-70'].toFixed(2)}L`}  rotation={90}/>
              </div>

              <div style={{ position: "absolute", top: "7.3vw", left: "45.3vw", textAlign: "center", transform: "rotate(90deg)", zIndex: "2"  }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WF-KB04-73')} /> */}
                <HoverableIcon src={WaterQuantityNode}  alt="WaterQuantityNode" dataId="WM-WF-KB04-73" data={`Total Water Flow: ${SimulatedValues['WM-WF-KB04-73'].toFixed(2)}L`}  rotation={90}/>
              </div>

              <div style={{ position: "absolute", top: "11vw", left: "52.5vw", textAlign: "center", transform: "rotate(90deg)" }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WF-KB04-71')} /> */}
                <HoverableIcon src={WaterQuantityNode}  alt="WaterQuantityNode" dataId="WM-WF-KB04-71" data={`Total Water Flow: ${SimulatedValues['WM-WF-KB04-71'].toFixed(2)}L`}  rotation={90}/>
              </div>

              <div style={{ position: "absolute", top: "11vw", left: "57.5vw", textAlign: "center", transform: "rotate(90deg)" }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WF-KB04-72')} /> */}
                <HoverableIcon src={WaterQuantityNode}  alt="WaterQuantityNode" dataId="WM-WF-KB04-72" data={`Total Water Flow: ${SimulatedValues['WM-WF-KB04-72'].toFixed(2)}L`}  rotation={90}/>
              </div>

            {
              canvasItems.map((item, index) => (
                <div
                  key={index}
                  draggable
                  // onDragStart={(e) => handleDragStart(e, index)&handleMarkerClick(item, index, e)}
                  onDragStart={(e) => handleDragStart(e, index)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    cursor: 'move',
                    border: isMarkerPlaced ? '2px solid green' : 'none',
                    zIndex:5
                  }}
                  // onClick={(e) => handleMarkerClick(item, index, e)}
                >
                  {/* <img
                    src={getImageForType(item.type)}
                    alt={item.type}
                    style={{ maxWidth: '2vw', maxHeight: '2vw', filter:"grayscale(200%)", zIndex: 10}}
                  /> */}
                  <HoverableIcon src={getImageForType(item.type)} alt={item.type} dataId="VirtualNode" data={sensorValues[item.type]}/>
                </div>
              ))
            }

        {/* Dustbin Icon for Deleting Items */}
        <div
          id="dustbin"
          onDragOver={(e) => e.preventDefault()}
          onClick={handleDeleteAllItems}
          style={{
            position: 'absolute',
            bottom: '1vw',
            right: '1vw',
            width: '2vw',
            height: '2vw',
            cursor: 'pointer',
            zIndex: 10,
            backgroundColor: 'red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 0
          }}
          ref={(ref) => { if (ref) { ref.id = "dustbin"; iconRefs.push(ref); } }}
        >
          <DeleteIcon style={{ color: 'white', fontSize: '40px' }} />
        </div>

            {
            itemToAdd && (
              <div draggable onDragStart={(e) => handleDragStart(e)} style={{position: 'absolute', left: '20px',top: '20px',cursor: 'move',}}>
                {/* <img src={getImageForType(itemToAdd)}  alt={itemToAdd}  style={{ maxWidth: '3vw', maxHeight: '100%', filter:"grayscale(200%)" }}/> */}
                <HoverableIcon src={getImageForType(itemToAdd)} alt={itemToAdd} dataId="Virtual Node" data={`NULL`}/>
              </div>
            )
            }
            {
                hoverData.isVisible && (
                  <div style={{ position: 'absolute', top: hoverData.y, left: hoverData.x, zIndex: 100, backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
                    {hoverData.data}
                  </div>
                )
            }
            </div>
          <ConsoleHeader handleDownloadLog={handleDownloadLog} log={log} handleClearLog={handleClearLog} className={"consoleContainer"} />
          </div>

          <br></br>



          {/* Leakage Markers */}
          {leakageMarkers.map((marker, index) => (
            <div key={index} style={{position: 'absolute', left: `${marker.x}px`, top: `${marker.y}px`, cursor: 'pointer', }}
            onClick={() => { 
              // Handle clicking on a leakage marker (e.g., show information about the leakage)
              console.log(`Clicked leakage marker at x: ${marker.x}, y: ${marker.y}, rate: ${marker.rate} L/s`);
            }}
            >
            <img src={LeakageIcon} alt="Leakage" style={{ width: '20px', height: '20px' }
          }
        />
        
  </div>

  
))}

      {/* <div className="container" style={{overflowY: 'scroll', height: '25vh', color: 'white' }}>
            <div className='flex-container'>
            <button onClick={handleDownloadLog} className='button' style={{background: 'blue', height:'1vw', width:'6vw'}}>Download</button>
            <button onClick={handleDownloadLog} className='button' sstyle={{background: 'blue', height:'1vw', width:'6vw'}}>Save</button>
            <button onClick={handleDownloadLog} className='button' sstyle={{background: 'blue', height:'1vw', width:'6vw'}}>Close</button>
            </div>
        </div> */}

  </div>


        {/* Right Section */}
        <ResultContainer result={result} previousResult={previousResult} data={data} sensorValues={sensorValues} PermeateFlowRate={PermeateFlowRate} PreviousPermeateFlowRate={PreviousPermeateFlowRate} datagraph={datagraph} flowgraph={flowgraph}/>
        
      </div>
    </div>
  );
};

export default SimulationPage;