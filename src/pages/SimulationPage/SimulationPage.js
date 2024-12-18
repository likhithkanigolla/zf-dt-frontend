import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SimulationPage.css";

import NavigationBar from "../../components/navigation/Navigation";
import ConsoleHeader from "../../components/Console/Console";
import LeakageOptions from "./components/LeakageOptions";
import ResultContainer from "./components/ResultContainer";
import SimulationCanvas from "./components/SimulationCanvas";
import SimulationForm from "./components/SimulationForm/Form";
import Toolbar from "./components/ToolBar/ToolBar";
import Timer from "../../components/timer-component";
import HoverableIcon from "./components/HoverableIcon";
import DeleteIcon from "@mui/icons-material/Delete";

import config from "../../config";

const SimulationPage = () => {
  // State for holding input values and results
  const iconRefs = [];
  const [isMarkerPlaced, setIsMarkerPlaced] = useState(false);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [floatBox, setFloatBox] = useState({
    isVisible: false,
    value: "",
    nodeId: null,
  });
  const [hoverData, setHoverData] = useState({
    isVisible: false,
    data: "",
    x: 0,
    y: 0,
  });
  const [inputValues, setInputValues] = useState({
    Scenarios: "2",
    timeMultiplier: "1",
    simulationTime: "3600",
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
    num_leakages: "3",
    leakage_location: "motorOHT",
    leakage_rate: "5",
    // flowrate: "5"
  });

  const scenarioMapping = {
    "2": "Soil vs TDS",
    "3": "Sand vs TDS",
    "4": "Flow vs TDS",
    "5": "Water Quality Node Failed",
    "8": "Water Purification Agents vs TDS",
    "all": "All Scenarios",
  };


  const [result, setResult] = useState(null);
  const [previousResult, setpreviousResult] = useState(null);
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
  const [flow5, setFlow5] = useState(false);

  const [sensorValues, setSensorValues] = useState({});

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [waterInSump, setWaterInSump] = useState(60000); // Initial water level in Sump
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [waterFlowAdmin, setWaterFlowAdmin] = useState(0); // Initial water flow in Admin
  const [waterFlowKRB, setWaterFlowKRB] = useState(0); // Initial water flow in KRB
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(1); // Initial water level in RO Filter
  const [alertShown, setAlertShown] = useState(false);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0.0);
  const [flowrate, setFlowrate] = useState(10);
  const [PermeateFlowRate, setPermeateFlowRate] = useState(1);
  const [PermeateFlowRate_B, setPermeateFlowRate_B] = useState(1);
  const [PreviousPermeateFlowRate, setPreviousPermeateFlowRate] = useState(0);
  const [showMotorStatus, setShowMotorStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [popupData, setPopupData] = useState({ isVisible: false, x: 0, y: 0, data: "" });

  const [infoText, setInfoText] = useState("");
  const [SoilQuantity, setSoilQuantity] = useState("");
  const [SandQuantity, setSandQuantity] = useState("");
  const [voltageValue, setVoltageValue] = useState("");
  const voltageData = { 0: 1.2, 1: 2.3, 2: 3.4, 3: 4.5, 4: 5.6, 5: 6.7 };

  const [showLeakageOptions, setShowLeakageOptions] = useState(false);
  const [numLeakages, setNumLeakages] = useState(1);
  const [leakageLocation, setLeakageLocation] = useState("motorOHT");
  const [leakageRate, setLeakageRate] = useState(0); // Add state for leakage rate
  const [leakageMarkers, setLeakageMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [datagraph, setDatagraph] = useState([]);
  const [flowgraph, setFlowgraph] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);

  const pipeList = ["PipeP1toSump", "PipeBoreToSump", "PipeSumpToMotor", "PipeMotorToOHT", "PipeOHTtoRO", "PipeOHTtoAdminWashrooms", "PipeOHTtoKRBWashrooms", "PipetoRO1", "PipetoRO3"];

  const pipeFlowPresence = {
    PipeP1toSump: flow1,
    PipeBoreToSump: flow1,
    PipeSumpToMotor: flow5,
    PipeMotorToOHT: flow2,
    PipeOHTtoRO: flow3,
    PipeOHTtoAdminWashrooms: flow3,
    PipeOHTtoKRBWashrooms: flow3,
    PipetoRO1: flow4,
    PipetoRO3: flow4,
  };

  // Define the flow rates for each pipe
  const pipeFlowRates = {
    PipeP1toSump: 10,
    PipeBoreToSump: 15,
    PipeSumpToMotor: 5,
    PipeMotorToOHT: flowrate,
    PipeOHTtoRO: PermeateFlowRate + PermeateFlowRate * 0.06,
    PipeOHTtoAdminWashrooms: 10,
    PipeOHTtoKRBWashrooms: 5,
    PipetoRO1: 2.5,
    PipetoRO3: 7.5,
  };

  const [log, setLog] = useState([]);
  const updateLog = (message) => {
    // setLog((prevLog) => [...prevLog, `${new Date().toISOString()}: ${message}`]);
    setLog((prevLog) => [...prevLog, `${message}`]);
  };

  const handleDownloadLog = () => {
    const blob = new Blob([log.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "simulation_log.txt");
  };

  const handleSaveLog = () => {
    const logData = log;
    updateLog("Simulation Ended.");
    updateLog("Simulation End Time: " + new Date().toISOString());
    updateLog("Simulation Duration: " + timeElapsed + " seconds");
    updateLog("Water in Sump: " + waterInSump);
    updateLog("Water in OHT: " + waterInOHT);
    updateLog("Water in RO Filter: " + waterInROFilter);
    updateLog("Water Flow Admin: " + waterFlowAdmin);
    updateLog("Water Flow KRB: " + waterFlowKRB);
    updateLog("Motor On: " + motorOn);
    updateLog("Saving log data...");
    handleStopSimulation();
    try {
      const response = fetch(`${config.backendAPI}/save_log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ log: logData , scenario: scenarioMapping[inputValues.Scenarios]}),
      });
      updateLog("Log data saved successfully.");
      setLog([""]); // Clear the log after saving
      // reset everything
      setWaterInSump(60000);
      setWaterInOHT(0);
      setWaterFlowAdmin(0);
      setWaterFlowKRB(0);
      setMotorOn(false);
      setWaterInROFilter(100);
      setAlertShown(false);
      setWaterFlowStarted(false);
      setWaterConsumed(0.0);
      setFlowrate(10);
      setPermeateFlowRate(1);
      setPreviousPermeateFlowRate(0);
      setTimeElapsed(0);
      setDatagraph([]);
      setFlowgraph([]);
      // toast.success("Log data saved successfully.");
    } catch (error) {
      console.error("Error saving log data:", error);
      updateLog("Error saving log data.");
      // toast.error("Error saving log data.");
    }
  };

  const handleMultiplierChange = (e) => {
    setTimeMultiplier(parseFloat(e.target.value));
    updateLog(`Speed Multiplier changed to ${e.target.value}x.`);
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
      // console.log("Marker Leakage Location:", leakageLocation);
      const position = calculateLeakagePosition(leakageLocation, i, numLeakages);
      newMarkers.push({
        type: "leakage",
        x: position.x,
        y: position.y,
        rate: leakageRate, // Include leakage rate in the marker data
        location: leakageLocation,
      });
    }
    setLeakageMarkers(newMarkers);
    setShowLeakageOptions(false);
    // toast.success("Leakages applied successfully!");
  };

  // Function to calculate leakage position (you'll need to implement the logic)
  const calculateLeakagePosition = (location, index, totalLeakages) => {
    let x, y;
    let leakagePositions = [];
    if (location === "motorOHT") {
      // Hardcoded coordinates for the three possible leakage positions
      leakagePositions = [
        { x: 13.5, y: 25.5 }, // Motor end
        { x: 10, y: 27 }, // Middle pipe
        { x: 4, y: 27 }, // Near OHT
      ];
    } // ... (rest of your logic)
    if (location === "roPlant") {
      // Hardcoded coordinates for the three possible leakage positions
      leakagePositions = [
        { x: 7, y: 38 }, // Motor end
        { x: 7, y: 43 }, // Middle pipe
        { x: 7, y: 48 }, // Near OHT
      ];
    }
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
    return { x, y };
  };

  const handleStopSimulation = () => {
    handleStopWaterFlow();
    setIsSimulationRunning(false);
    setFlow1(false);
    setFlow2(false);
    setFlow3(false);
    setFlow4(false);
    setFlow5(false);
    setMotorOn(false);
    updateLog("Simulation stopped.");
    // toast.error("Simulation stopped!");
  };

  useEffect(() => {
    let intervalId;
    let interval_val_update_wq;
    let intervalwaterConsume;
    // console.log("iconRefs",iconRefs);
    // console.log("TIMES", timeElapsed, inputValues.simulationTime);
    if (timeElapsed >= inputValues.simulationTime) {
      handleSaveLog();
      setTimeElapsed(0);
      updateLog("Simulation stopped automatically after reaching simulation time.");
      updateLog("Data saved successfully.");
    }

    if (waterFlowStarted) {
      intervalId = setInterval(() => {
        if (motorOn) {
          // Pump water from Sump to OHT if motor is on
          if (waterInSump > 0 && waterInOHT < inputValues.ohtCapacity) {
            setWaterInSump((prev) => Math.max(prev - flowrate, 0));

            // Calculate total leakage rate (limited to 4 L/s)

            const totalAfterMotorLeakageRate = Math.min(
              leakageMarkers.reduce((sum, marker) => {
                if (marker.type === "leakage" && marker.location === "motorOHT") {
                  return sum + marker.rate;
                }
                return sum;
              }, 0),
              20
            ); // Maximum leakage rate
            updateLog(`Total Leakage Rate: ${totalAfterMotorLeakageRate}l/s`);
            // Calculate the effective flow rate into OHT
            updateLog(`Motor Flow Rate: ${flowrate}l/s`);
            const effectiveFlowRate = Math.max(flowrate - totalAfterMotorLeakageRate + (Math.random() - 0.5), 1);

            updateLog(`Effective Flow Rate: ${effectiveFlowRate}l/s`);

            const prevWaterInOHT = waterInOHT; // Get previous water level
            setWaterInOHT((prev) => Math.min(prev + effectiveFlowRate, inputValues.ohtCapacity));
          }

          if (waterInSump === 0) {
            setFlow5(false);
          }

          if ((waterInOHT === inputValues.ohtCapacity || waterInSump === 0) && !alertShown) {
            updateLog("Motor turned off automatically since water tank is full.");
            // toast.error("Motor turned off automatically since water tank is full.");
            setMotorOn(false);
            setFlow2(false);
            setAlertShown(true); // Set alertShown to true to prevent repeated alerts
          }
        }
        const totalAfterOHTLeakageRate = Math.min(
          leakageMarkers.reduce((sum, marker) => {
            if (marker.type === "leakage" && marker.location === "roPlant") {
              return sum + marker.rate;
            }
            return sum;
          }, 0),
          20
        ); // Maximum leakage rate
        console.log("Total Leakage Rate: ", totalAfterOHTLeakageRate);

        const temp_permeate = Math.max(Math.max(0.0, Math.min(PermeateFlowRate + (Math.random() - 0.5) * 10, PermeateFlowRate_B + 5)) - totalAfterOHTLeakageRate, 0);
        const temp_flowrate = Math.max((flowrate  + Math.random() * 2 - 1).toFixed(2), 0);
        setPreviousPermeateFlowRate(PermeateFlowRate.toFixed(2));
        setPermeateFlowRate(temp_permeate);
        setFlowrate(temp_flowrate)
        setFlowgraph((flowgraph) => [
          ...flowgraph,
          {
            time: new Date().toLocaleTimeString(),
            flowrate: temp_permeate,
            id: 4,
          },
        ]);
        // setWaterInROFilter(temp_permeate/5); //Initializing enough water to consume
        updateLog("Permeate Flow Rate: " + PermeateFlowRate + "l/s");

        // Pump water from OHT to RO Filter continuously
        if (waterInOHT > PermeateFlowRate && waterInROFilter < inputValues.ro_ohtCapacity) {
          setWaterInOHT((prev) => Math.max(prev - (PermeateFlowRate + PermeateFlowRate * 0.3) - flowrate * 0.06, 0)); // Tds Reduction rate is 70% so 30% water will be wasted.
          setWaterFlowAdmin((prev) => prev + flowrate * 0.02);
          setWaterFlowKRB((prev) => prev + flowrate * 0.04);
          setWaterInROFilter((prev) => prev + PermeateFlowRate); // Increase water in RO Filter by permeate flow rate, converted from l/m2/hr to l/s
        }

        if (waterInOHT < PermeateFlowRate) {
          setFlow3(false);
          updateLog("Flow stopped from since OHT is empty.");
          // toast.error("Flow stopped from since OHT is empty.");
        } else {
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

        if (waterInOHT < PermeateFlowRate && waterInSump <= flowrate && waterInROFilter < 10) {
          handleStopSimulation();
          updateLog("Simulation stopped automatically since all tanks are empty.");
          // toast.error("Simulation stopped automatically since all tanks are empty.");
        }

        setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }, 1000 / inputValues.timeMultiplier); // Run every half second

      intervalwaterConsume = setInterval(() => {
        if (waterInROFilter > 1) {
          handleConsumeWater();
        }
      }, 1000 / inputValues.timeMultiplier);
    }

    interval_val_update_wq = setInterval(() => {
      setSensorValues((prevValues) => {
        const newValues = { ...prevValues };

        // Iterate over the current sensor values
        Object.keys(newValues).forEach((index) => {
          console.log("Index Here TDD: ", index);
          const sensor = newValues[index];
          console.log("Sensor Here TDD: ", sensor);
          if (sensor.type === "waterquantitysensor") {
            const pipeId = sensor.iconId; // Correctly use the ID from the sensor
            console.log("Pipe ID Here TDD: ", pipeId);
            const hasFlow = pipeFlowPresence[pipeId]; // Get flow presence for the pipe ID
            const flowRate = pipeFlowRates[pipeId] || 0; // Get flow rate for the pipe ID, default to 0 if not found
            console.log("Flow Rate Here TDD: ", flowRate);
            if (hasFlow && flowRate > 0) {
              console.log("Flow Rate TDD: ", flowRate);
              newValues[index] = {
                ...sensor,
                totalFlow: sensor.totalFlow + flowRate, // Adjust the totalFlow increment based on timeMultiplier
              };
            }
          }
        });

        return newValues;
      });

      console.log("Sensor Values: ", sensorValues);
    }, 1000 / inputValues.timeMultiplier);

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
      clearInterval(interval_val_update_wq);
    }; // Cleanup interval on unmount or when simulation stops
  }, [waterFlowStarted, motorOn, waterInSump, waterInOHT, waterInROFilter, alertShown, leakageRate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Check if simulation is running
    if (isSimulationRunning) {
      // If simulation is running, stop it
      handleStopWaterFlow();
      setIsSimulationRunning(false);
      // updateLog("Simulation stopped to Update Values.");

      // Update input values
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: value,
      }));

      // updateLog(`Updated the Value ${name} to ${value}.`);

      // Restart the simulation
      await handleCalculate(); // Recalculate
      handleStartWaterFlow(); // Restart the simulation
      setIsSimulationRunning(true);
      // updateLog("Simulation restarted after updating values.");
    } else {
      // If simulation is not running, simply update input values
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: value,
      }));
      // updateLog(`Updated the Value ${name} to ${value}.`);
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
    setIsLoading(true);
    try {
      const response = await fetch(`${config.backendAPI}/calculate_soil_contamination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      });
      if (!response.ok) {
        throw new Error("Failed to calculate soil contamination");
      }
      const soilContamination = await response.json();
      setSoilContamination(soilContamination);
      updateLog(`TDS Value Soil Contamination calculated: ${soilContamination} ppm`);
      return soilContamination; // Return the soil contamination value
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const calculateSandContamination = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.backendAPI}/calculate_sand_contamination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      });
      if (!response.ok) {
        throw new Error("Failed to calculate sand contamination");
      }
      const sandContamination = await response.json();
      setSandContamination(sandContamination);
      updateLog(`TDS Value Sand Contamination calculated: ${sandContamination} ppm`);
      return sandContamination; // Return the sand contamination value
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const calculateROFiltration = async (calculatedTDS, desired_tds, temperature, membrane_area) => {
    setIsLoading(true);
    const requestBody = {
      initial_tds: calculatedTDS,
      desired_tds: desired_tds,
      voltage: voltageData[voltageValue],
      temperature: temperature,
      effective_membrane_area: membrane_area,
      sump_capacity: inputValues.sumpCapacity,
    };

    try {
      let response = await fetch(`${config.backendAPI}/calculate_ro_filtration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      let data = await response.json();
      updateLog(`RO Filtration Data: ${JSON.stringify(data, null, 2)}`);
      // setROFiltrationData(data);
      return data;
    } catch (error) {
      console.error('Error calculating RO Filtration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMotorFlowRate = async (voltage, current, power_factor, motor_efficiency, depth) => {
    setIsLoading(true);
    const requestBody = {
      voltage: voltage,
      current: current,
      power_factor: power_factor,
      motor_efficiency: motor_efficiency,
      depth: depth,
    };

    try {
      let response = await fetch(`${config.backendAPI}/calculate_motor_flow_rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      let data = await response.json();
      updateLog(`Motor Flow Rate Data: ${JSON.stringify(data, null, 2)}`);
      // setMotorFlowRateData(data);
      return data;
    } catch (error) {
      console.error('Error calculating Motor Flow Rate:', error);
    } finally {
      setIsLoading(false);
    }
  };


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
        setDatagraph((datagraph) => [
          ...datagraph,
          {
            time: new Date().toLocaleTimeString(),
            tds: soilContaminationValue,
            id: 1,
          },
        ]);
      } else if (soilQuantity === 0 && sandQuantity !== 0) {
        const sandContaminationValue = await calculateSandContamination(inputValues);
        console.log("Sand Value:", sandContaminationValue);
        calculatedTDS = sandContaminationValue;
        setDatagraph((datagraph) => [
          ...datagraph,
          {
            time: new Date().toLocaleTimeString(),
            tds: sandContaminationValue,
            id: 2,
          },
        ]);
      } else {
        const SandTDS = await calculateSandContamination(inputValues);
        const SoilTDS = await calculateSoilContamination(inputValues);

        console.log("Soil Value:", SoilTDS, "Sand Value:", SandTDS);
        updateLog(`Soil TDS Value calculated: ${SoilTDS} ppm`);
        updateLog(`Sand TDS Value calculated: ${SandTDS} ppm`);

        calculatedTDS = (SoilTDS + SandTDS) / 2;
        setDatagraph((datagraph) => [...datagraph, { time: new Date().toLocaleTimeString(), tds: calculatedTDS, id: 3 }]);
        updateLog(`Average TDS Value calculated: ${calculatedTDS} ppm`);
      }
      const flow = await calculateMotorFlowRate(inputValues.voltage, inputValues.current, inputValues.power_factor, inputValues.motor_efficiency, 2.5);
      const data_RO = await calculateROFiltration(calculatedTDS, inputValues.desired_tds, inputValues.temperature, inputValues.membrane_area);
      // console.log("RO Filtration Data:", data_RO);
      setpreviousResult(result); // Store the current result in previousResult
      setResult({
        ...data_RO,
        calculated_tds_value: parseFloat(data_RO.calculated_tds_value) + Math.random() * 0.5 - 0.25,
      });

      setPreviousPermeateFlowRate(PermeateFlowRate.toFixed(2));
      setFlowgraph((flowgraph) => [
        ...flowgraph,
        {
          time: new Date().toLocaleTimeString(),
          flowrate: PermeateFlowRate,
          id: 4,
        },
      ]);
      setPermeateFlowRate(parseFloat(data_RO.permeate_flow_rate));
      setPermeateFlowRate_B(parseFloat(data_RO.permeate_flow_rate));
      setFlowrate(parseFloat(flow.flowrate_per_min));

      updateLog(`Motor flow rate calculated: ${flow.flowrate_per_min} l/s`);
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Assuming this returns an object
      // Transform the data object into an array of objects for each key-value pair,
      // ensuring null values are handled gracefully.
      const dataArray = Object.entries(data).map(([key, value]) => ({
        title: key,
        value: value === null ? "N/A" : value.toString(), // Use 'N/A' for null values
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
      updateLog("Starting simulation...");
      updateLog(`Selected Scenario: ${scenarioMapping[inputValues.Scenarios]}`);
      updateLog(`Simulation Start Time: ${new Date().toISOString()}`); 
      updateLog("Input Configuration: " + JSON.stringify(inputValues));
      await handleCalculate();
      // calculateSoilContamination();
      handleStartWaterFlow(); // Start water flow
      setIsSimulationRunning(true);
      // setFlow4((flow4) => !flow4);
      setFlow1((flow1) => !flow1);
      setFlow5((flow5) => !flow5);
      setFlow2(true);
      setMotorOn(true);
      updateLog("Simulation started.");
      // toast.success("Simulation started!");
    } else {
      handleStopWaterFlow(); // Stop water flow
      setIsSimulationRunning(false);
      setFlow1(false);
      setFlow2(false);
      setFlow3(false);
      setFlow4(false);
      setFlow5(false);
      setMotorOn(false);
      updateLog("Simulation paused.");
      // toast.error("Simulation stopped!");
    }
  };

  const handleConsumeWater = () => {
    // Consumption is 10% of the filteration.
    // if (waterInROFilter >= (PermeateFlowRate/10)) {
    //   setFlow4(true);
    //   setWaterInROFilter((prev) => prev - (PermeateFlowRate/10));
    //   setWaterConsumed((prev) => prev + (PermeateFlowRate/10));
    //   console.log(" TDD Consumed water from RO Filter.");
    // }
    if (waterInROFilter >= 10) {
      setFlow4(true);
      setWaterInROFilter((prev) => prev - 10);
      setWaterConsumed((prev) => prev + 10);
    } else {
      // alert("Not enough water in RO Filter to consume.")
      setFlow4(false);
      // toast.error("Not enough water in RO Filter to consume.");
      updateLog("Not enough water in RO Filter to consume.");
    }
  };

  const [canvasItems, setCanvasItems] = useState([]);
  const [itemToAdd, setItemToAdd] = useState(null);


  const checkMarkerOverlap = (markerCoordinates, index) => {
    let isPlaced = false;
    let iconId = null;
  
    // Iterate over each icon and check if the marker overlaps with it
    iconRefs.forEach((ref) => {
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
  
    if (iconId === "dustbin") {
      handleDeleteItem(index);
    }
  
    return { isPlaced, iconId };
  };
  
  const handleDragStart = (event, index, isTouch) => {
    if (index !== undefined) {
      if (isTouch) {
        event.target.dataset.index = index;
      } else {
        event.dataTransfer.setData("index", index);
      }
    }
  
    const markerCoordinates = {
      x: isTouch ? event.touches[0].clientX : event.clientX,
      y: isTouch ? event.touches[0].clientY : event.clientY,
    };
  
    const { isPlaced, iconId } = checkMarkerOverlap(markerCoordinates, index);
    updateLog(`Virtual Node is placed on: ${iconId}`);
    setIsMarkerPlaced(isPlaced);
  };

  const handleTouchStart = (event, index) => {
    handleDragStart(event, index, true);
  };
  
  const handleTouchMove = (event) => {
    event.preventDefault(); // Prevent scrolling during touch drag
  };
  
  const handleTouchEnd = (event) => {
    const canvasRect = event.currentTarget.getBoundingClientRect();
    const index = event.target.dataset.index;
    const x = event.changedTouches[0].clientX - canvasRect.left;
    const y = event.changedTouches[0].clientY - canvasRect.top;
  
    if (index) {
      const updatedItems = [...canvasItems];
      const markerCoordinates = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
      const { isPlaced } = checkMarkerOverlap(markerCoordinates, index);
  
      updatedItems[index] = {
        ...updatedItems[index],
        x: x,
        y: y,
        isPlaced: isPlaced,
      };
      setCanvasItems(updatedItems);
      console.log(`Moved item ${updatedItems[index].type} to x: ${x}, y: ${y}`);
    } else if (itemToAdd) {
      const newItem = {
        type: itemToAdd,
        x: x,
        y: y,
        isPlaced: false,
      };
      setCanvasItems([...canvasItems, newItem]);
      setItemToAdd(null);
      updateLog(`Added item of type ${itemToAdd}`);
    } else {
      console.log("Dropped at x: ", x, "y: ", y);
    }
  };

  const handleDeleteItem = (index) => {
  const updatedItems = [...canvasItems];
  updatedItems.splice(index, 1);
  setCanvasItems(updatedItems);
  updateLog(`Deleted item at index ${index}.`);
};

const handleDrop = (event) => {
  event.preventDefault();
  const canvasRect = event.currentTarget.getBoundingClientRect();
  const index = event.dataTransfer.getData("index");
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  if (index) {
    const updatedItems = [...canvasItems];
    const markerCoordinates = { x: event.clientX, y: event.clientY };
    const { isPlaced } = checkMarkerOverlap(markerCoordinates, index);

    updatedItems[index] = {
      ...updatedItems[index],
      x: x,
      y: y,
      isPlaced: isPlaced,
    };
    setCanvasItems(updatedItems);
    console.log(`Moved item ${updatedItems[index].type} to x: ${x}, y: ${y}`);
  } else if (itemToAdd) {
    const newItem = {
      type: itemToAdd,
      x: x,
      y: y,
      isPlaced: false,
    };
    setCanvasItems([...canvasItems, newItem]);
    setItemToAdd(null);
    updateLog(`Added item of type ${itemToAdd}`);
  } else {
    console.log("Dropped at x: ", x, "y: ", y);
  }
};

const handleDeleteAllItems = () => {
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
    // console.log(refId, "coordinates:", iconCoordinates);
    // console.log("Icon clicked:", refId);
  };

  const handleMarkerClick = async (item, index, event) => {
    if (isSimulationRunning) {
      if (item.isPlaced) {
      const { clientX, clientY } = event;
      const coordinates = {
        x: clientX,
        y: clientY,
      };

      const nodeData = `Node Type: ${item.type}, ID: ${item.id}`;

      setPopupData({
        isVisible: true,
        x: clientX,
        y: clientY,
        data: nodeData,
      });

    

      const { isPlaced, iconId } = checkMarkerOverlap(coordinates, index);
      updateLog(`Marker of type ${item.type} placed on ${iconId} at coordinates: ${JSON.stringify(coordinates)}`);

      const caltds = await handleCalculate();
      // const caltds=100;
      item.id = iconId;

      if (iconId === "KRBSump" && item.type === "waterlevelsensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "waterlevelsensor",
          [iconId]: (waterInSump / inputValues.sumpCapacity) * 100,
        }));
      }
      if (iconId === "KRBOHTIcon" && item.type === "waterlevelsensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "waterlevelsensor",
          [iconId]: (waterInOHT / inputValues.ohtCapacity) * 100,
        }));
      }
      if (iconId === "KRBROOHT" && item.type === "waterlevelsensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "waterlevelsensor",
          [iconId]: (waterInROFilter / inputValues.ro_ohtCapacity) * 100,
        }));
      }
      if (iconId === "KRBSump" && item.type === "waterqualitysensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "waterqualitysensor",
          [iconId]: caltds,
        }));
      }
      if (iconId === "KRBOHTIcon" && item.type === "waterqualitysensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "waterqualitysensor",
          [iconId]: caltds + Math.floor(Math.random() * 21) - 10,
        }));
      }
      if (iconId === "KRBROOHT" && item.type === "waterqualitysensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "waterqualitysensor",
          [iconId]: result.final_tds_concentration_after_ro_tank + Math.floor(Math.random() * 11) - 5,
        }));
      }

      if(iconId === "Motor" && item.type === "motorsensor") {
        setSensorValues((prevValues) => ({
          ...prevValues,
          type: "motorsensor",
          [iconId]: flowrate,
        }));
      }

      if (pipeList.includes(iconId) && item.type === "waterquantitysensor") {
        console.log("Pipe Icon Id: ", iconId);
        const pipeId = iconId; // Assuming iconId corresponds to the pipe ID
        const hasFlow = pipeFlowPresence[pipeId]; // Get the flow presence for the pipe ID
        const flowRate = pipeFlowRates[pipeId] || 0; // Get the flow rate for the pipe ID, default to 0 if not found
        setSensorValues((prevValues) => ({
          ...prevValues,
          [index]: {
            index,
            type: "waterquantitysensor",
            iconId: iconId,
            totalFlow: hasFlow ? flowRate : 0, // Initialize total flow with the pipe's flow rate if flow is present, otherwise 0
          },
        }));
      }
    }
    }
  };

  const handleToolbarItemClick = (type) => {
    // Prepare to add a new item when the next drop occurs
    // Instead of directly adding the item, we set an "item to add" state
    setItemToAdd(type);
  };

  const handleClearLog = () => {
    // Assuming logContent is a state variable holding the log data
    setLog(""); // Clear the log by setting the log content to an empty string
    updateLog("Log cleared"); // Log the action
  };

  const getImageForType = (type) => {
    switch (type) {
      case "waterqualitysensor":
        return `${config.basePath}/images/WaterQualityNode.png`;
      case "waterquantitysensor":
        return `${config.basePath}/images/WaterQuantityNode.png`;
      case "waterlevelsensor":
        return `${config.basePath}/images/WaterLevelNode.png`;
      case "motorsensor":
        return `${config.basePath}/images/MotorNode.png`;
      default:
        return ""; // default image or empty string if none
    }
  };

  const SimulatedValues = {
    "WM-WL-KH98-00": (waterInSump / inputValues.sumpCapacity) * 100,
    "WM-WL-KH00-00": (waterInOHT / inputValues.ohtCapacity) * 100,
    "DM-KH98-60": 0,
    "WM-WD-KH98-00": result ? result.calculated_tds_value + Math.floor(Math.random() * 21) - 10 : 0,
    "WM-WD-KH96-00": result ? result.calculated_tds_value + 30 + Math.floor(Math.random() * 21) - 10 : 0,
    "WM-WD-KH96-02": result ? result.final_tds_concentration_after_ro_tank + Math.floor(Math.random() * 11) - 5 : 0,
    "WM-WD-KH95-00": result ? result.final_tds_concentration_after_ro_tank - 5 + Math.floor(Math.random() * 11) - 5 : 0,
    "WM-WD-KH96-01": result ? result.calculated_tds_value + Math.floor(Math.random() * 21) - 10 : 0,
    "WM-WD-KH04-00": result ? result.final_tds_concentration_after_ro_tank - 5 + Math.floor(Math.random() * 11) - 5 : 0,
    "WM-WF-KB04-70": waterFlowAdmin,
    "WM-WF-KB04-73": waterFlowKRB,
    "WM-WF-KB04-71": (3 * waterConsumed) / 4,
    "WM-WF-KB04-72": waterConsumed / 4,
    "WM-WF-KH98-40": inputValues ? inputValues.sumpCapacity : 0,
    "WM-WF-KH95-40": inputValues ? inputValues.sumpCapacity - waterInSump + (leakageRate/3) : 0,
  };

  const displayValueOnClick = (id) => {
    const value = SimulatedValues[id];
    // Display the value in the floated text box with close button
    // You can implement the UI logic here
    setFloatBox({ isVisible: true, value: value, nodeId: id });
  };

  // Ensure this function is correctly defined in your component
  const handleFloatBoxClose = () => {
    setFloatBox({ isVisible: false, value: "" });
  };

  
  return (
    <div>
      {/* <ToastContainer /> */}
      <NavigationBar title="Digital Twin for Water Quality" />
      <div style={{ display: "flex" }}>
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
          handleStopSimulation ={handleStopSimulation}
          flowrate ={flowrate}
          log={log}
          showLeakageOptions={showLeakageOptions}
          numLeakages={numLeakages}
          setNumLeakages={setNumLeakages}
          leakageLocation={leakageLocation}
          setLeakageLocation={setLeakageLocation}
          leakageRate={leakageRate}
          setLeakageRate={setLeakageRate}
          handleApplyLeakages={handleApplyLeakages}
          isLoading={isLoading}
          PermeateFlowRate={PermeateFlowRate}
          
          />

        {/* Middle Section */}
        <div style={{ flex: 1, height: '0vw' }}>
          {/* Toolbar */}
          <Toolbar handleToolbarItemClick={handleToolbarItemClick} />

          {/* <LeakageOptions
            showLeakageOptions={showLeakageOptions}
            numLeakages={inputValues.num_leakages}
            // setNumLeakages={setNumLeakages}
            leakageLocation={inputValues.leakage_location}
            // setLeakageLocation={setLeakageLocation}
            leakageRate={inputValues.leakage_rate}
            setLeakageRate={setLeakageRate}
            handleApplyLeakages={handleApplyLeakages}
          /> */}
          <div className="demo-page">
            <div
              style={{
                position: "relative",
                width: "60vw",
                height: "23vw",
                border: "1px solid black",
                background: "#ffffff",
              }}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img src={`${config.basePath}/images/white.png`} alt="blueprint" style={{ width: "100%", height: "100%" }} />
              <SimulationCanvas
                handleIconClick={handleIconClick}
                iconRefs={iconRefs}
                PipeP1toSump={flow1}
                PipeBoreToSump={flow1}
                PipeSumpToMotor={flow5}
                PipeMotorToOHT={flow2}
                PipeOHTtoRO={flow3}
                PipeOHTtoAdminWashrooms={flow3}
                PipeOHTtoKRBWashrooms={flow3}
                PipetoRO1={flow4}
                PipetoRO3={flow4}
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
                calculatedTdsVal = {result ? result.calculated_tds_value : 150}
              />

              {/* IoT Nodes  */}
              <div
                style={{
                  position: "absolute",
                  top: "12.5vw",
                  left: "14vw",
                  textAlign: "center",
                  zIndex: '4'
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH98-00"
                  data={`Water TDS: ${SimulatedValues["WM-WD-KH98-00"].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "1vw",
                  left: "29.5vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-00"
                  data={`Water TDS: ${SimulatedValues["WM-WD-KH96-00"].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "6.5vw",
                  left: "50.6vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-01"
                  data={`Water TDS: ${SimulatedValues["WM-WD-KH96-01"].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "9vw",
                  left: "55vw",
                  textAlign: "center",
                  zIndex: '4'
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-02"
                  data={`Water TDS: ${SimulatedValues["WM-WD-KH96-02"].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  left: "52.3vw",
                  textAlign: "center",
                  zIndex: '5'
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH95-00"
                  data={`Water TDS: ${SimulatedValues["WM-WD-KH95-00"].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  left: "57.9vw",
                  textAlign: "center",
                  zIndex: '5'
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH04-00"
                  data={`Water TDS: ${SimulatedValues["WM-WD-KH04-00"].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "8vw",
                  left: "13vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                 <HoverableIcon
                  src={`${config.basePath}/images/WaterLevelNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WL-KH98-00"
                  data={`Water Level: ${SimulatedValues["WM-WL-KH98-00"].toFixed(2)}%`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "1vw",
                  left: "32vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterLevelNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WL-KH00-00"
                  data={`Water Level: ${SimulatedValues["WM-WL-KH00-00"].toFixed(2)}%`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "10vw",
                  left: "22vw",
                  textAlign: "center",
                  zIndex: 4,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/MotorNode.png`}
                  alt="MotorNode"
                  aId="DM-KH98-60"
                  dataId="DM-KH98-60"
                  data={`Motor Status: ${motorOn ? "ON" : "OFF"}`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "7vw",
                  left: "7vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KH98-40"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KH98-40"]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "6.7vw",
                  left: "26.5vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KH95-40"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KH95-40"].toFixed(2)}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "7.3vw",
                  left: "39.6vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-70"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KB04-70"].toFixed(2)}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "7.3vw",
                  left: "45.3vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-73"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KB04-73"].toFixed(2)}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "11vw",
                  left: "52.5vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: "4",
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-71"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KB04-71"].toFixed(2)}L`}
                  rotation={90}
                  
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "11vw",
                  left: "57.5vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 4,
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-72"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KB04-72"].toFixed(2)}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "19vw",
                  left: "1vw",
                  textAlign: "center",
                }}>
                <Timer elapsedTime={timeElapsed} />
              </div>

              {/* Leakage Markers */}
              {leakageMarkers.map((marker, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    top: `${marker.x}vw`,
                    left: `${marker.y}vw`,
                    cursor: "pointer",
                    zIndex: 3,
                    
                  }}
                  onClick={() => {}}>
                  <img
                    src={`${config.basePath}/images/leakage_water.png`}
                    alt="Leakage"
                    style={{ position:"absolute",width: "1.5vw", height: "1.5vw", zIndex: "1"}}
                  />
                </div>
              ))}

              {/* Sensor Markers */}
      {canvasItems.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchMove={handleTouchMove}
          style={{
            position: "absolute",
            left: `${item.x}px`,
            top: `${item.y}px`,
            cursor: "move",
            border: item.isPlaced ? "2px solid green" : "2px solid red",
            zIndex: 5,
          }}
        >
          <HoverableIcon
            src={getImageForType(item.type)}
            alt={item.type}
            dataId="VirtualNode"
            data={item.type === "waterquantitysensor" ? sensorValues[index]?.totalFlow : sensorValues[item.id]}
            onClick={(e) => handleMarkerClick(item, index, e)}
          />
        </div>
      ))}

               {/* Dustbin Icon for Deleting Items */}
      <div
        id="dustbin"
        onDragOver={(e) => e.preventDefault()}
        onClick={handleDeleteAllItems}
        style={{
          position: "absolute",
          bottom: "1vw",
          right: "1vw",
          width: "2vw",
          height: "2vw",
          cursor: "pointer",
          backgroundColor: "red",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
        }}
        ref={(ref) => {
          if (ref) {
            ref.id = "dustbin";
            iconRefs.push(ref);
          }
        }}
      >
        <DeleteIcon style={{ color: "white", fontSize: "2vw" }} />
      </div>

      {itemToAdd && (
        <div
          draggable
          onDragStart={(e) => handleDragStart(e)}
          onTouchStart={(e) => handleTouchStart(e)}
          style={{
            position: "absolute",
            left: "200px",
            top: "20px",
            cursor: "move",
            border: "2px solid red",
          }}
        >
          <HoverableIcon
            src={getImageForType(itemToAdd)}
            alt={itemToAdd}
            dataId="Virtual Node"
            data={`Invalid placement`}
          />
        </div>
      )}

      {hoverData.isVisible && (
        <div
          style={{
            position: "absolute",
            top: hoverData.y,
            left: hoverData.x,
            zIndex: 100,
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid black",
          }}
        >
          {hoverData.data}
        </div>
              )}
            </div>
            <ConsoleHeader
              handleDownloadLog={handleDownloadLog}
              log={log}
              handleClearLog={handleClearLog}
              className={"consoleContainer"}
            />
          </div>

          <br></br>

          {/* <div className="container" style={{overflowY: 'scroll', height: '25vh', color: 'white' }}>
            <div className='flex-container'>
            <button onClick={handleDownloadLog} className='button' style={{background: 'blue', height:'1vw', width:'6vw'}}>Download</button>
            <button onClick={handleDownloadLog} className='button' sstyle={{background: 'blue', height:'1vw', width:'6vw'}}>Save</button>
            <button onClick={handleDownloadLog} className='button' sstyle={{background: 'blue', height:'1vw', width:'6vw'}}>Close</button>
            </div>
        </div> */}
        </div>

        {/* Right Section */}
        <ResultContainer
          result={result}
          previousResult={previousResult}
          data={data}
          sensorValues={sensorValues}
          PermeateFlowRate={PermeateFlowRate}
          PreviousPermeateFlowRate={PreviousPermeateFlowRate}
          datagraph={datagraph}
          flowgraph={flowgraph}
        />
    </div>
  </div>
  );
};

export default SimulationPage;
