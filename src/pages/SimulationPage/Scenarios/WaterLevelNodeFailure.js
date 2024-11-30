import React, { useEffect, useState, useRef } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../../components/navigation/Navigation";
import ConsoleHeader from "../../../components/Console/Console";
import SimulationCanvas from "../components/SimulationCanvas";
import Back from "@mui/icons-material/ArrowBackRounded";
import Toolbar from "../components/ToolBar/ToolBar";
import IoTNodes from "../../../components/IoTNodes/Nodes";
import HoverableIcon from "../components/HoverableIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import config from '../../../config';

function WaterLevelNodeFailure() {
  // Define the state variables
  const navigate = useNavigate();
  const [iconRefs, setIconRefs] = React.useState([]);
  const [flow1, setFlow1] = React.useState(0);
  const [flow2, setFlow2] = React.useState(0);
  const [flow3, setFlow3] = React.useState(0);
  const [flow4, setFlow4] = React.useState(0);
  const [flow5, setFlow5] = React.useState(0);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterInSump, setWaterInSump] = useState(38670);
  const [motorOn, setMotorOn] = React.useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = React.useState(false);
  const [waterInOHT, setWaterInOHT] = React.useState(39260);
  const [prevWaterInOHT, setPrevWaterInOHT] = useState(0);
  const [waterInROFilter, setWaterInROFilter] = React.useState(100);
  const [waterConsumed, setWaterConsumed] = React.useState(0);
  const [waterFlowAdmin, setWaterFlowAdmin] = useState(0); // Initial water flow in Admin
  const [waterFlowKRB, setWaterFlowKRB] = useState(0); // Initial water flow in KRB
  const [result, setResult] = React.useState("");
  const [waterLevelNodeWorking, setWaterLevelNodeWorking] = useState(true);
  const [inputValues, setInputValues] = useState({
    Scenarios: "1",
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
    sumpCapacity: "67600",
    ohtCapacity: "114413",
    ro_ohtCapacity: "1000",
    flowrate: 10,
  });

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [log, setLog] = React.useState([]);
  const [hoverData, setHoverData] = React.useState({
    isVisible: false,
    data: "",
    x: 0,
    y: 0,
  });

  const SimulatedValues = {
    "WM-WL-KH98-00": (waterInSump / inputValues.sumpCapacity) * 100,
    "WM-WL-KH00-00": (waterInOHT / inputValues.ohtCapacity) * 100,
    "DM-KH98-60": 0,
    "WM-WD-KH98-00": 435 + Math.floor(Math.random() * 21) - 10,
    "WM-WD-KH96-00": 435 + 30 + Math.floor(Math.random() * 21) - 10,
    "WM-WD-KH96-02": 46 + Math.floor(Math.random() * 11) - 5,
    "WM-WD-KH95-00": 46 - 5 + Math.floor(Math.random() * 11) - 5,
    "WM-WD-KH96-01": 435 + Math.floor(Math.random() * 21) - 10,
    "WM-WD-KH04-00": 46 - 5 + Math.floor(Math.random() * 11) - 5,
    "WM-WF-KB04-70": waterFlowAdmin,
    "WM-WF-KB04-73": waterFlowKRB,
    "WM-WF-KB04-71": (3 * waterConsumed) / 4,
    "WM-WF-KB04-72": waterConsumed / 4,
    "WM-WF-KH98-40": inputValues ? inputValues.sumpCapacity : 0,
    "WM-WF-KH95-40": inputValues ? inputValues.sumpCapacity - waterInSump : 0,
  };

  const [itemToAdd, setItemToAdd] = React.useState(null);
  const [isMarkerPlaced, setIsMarkerPlaced] = React.useState(false);
  const [canvasItems, setCanvasItems] = React.useState([]);
  const [sensorValues, setSensorValues] = React.useState({});

  const [run, setRun] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  // Joyride steps
  const [steps, setSteps] = useState([
    {
      title: "Water Level Node Failure Scenario",
      content: "Welcome to the Water Level Node Failure Scenario. This is a guided tour to help you understand the scenario and how to resolve it.",
      target: ".full-page",
      placement: "center",
    },
    {
      target: ".left-section",
      content: "This is the left section. You can find the scenario title, description and simulation controls here",
      placement: "right",
    },
    {
      target: ".right-section",
      content: "This is the right section. Asumptions and Steps to Replicate Scenario are written here.",
      placement: "left",
    },
    {
      target: ".toolbar",
      content: "This is the toolbar. Each icon indicates a Virtual Node. By Clicking on the node you can deploy a virtual node.",
    },
    {
      target: ".middle-section-element-2",
      content: "This is the main simulation area.",
    },
    {
      target: ".console-container",
      content: "This is the console. Everything that happen in simulation will be displayed here .You can download the log here.",
    },
    // {
    //   target: ".waterquantity-tool",
    //   content: "Lets first deploy the water quantity sensor to get the flow to at the RO Plant.Click on the sensor",
    //   placement: "bottom",
    //   disableBeacon: true,
    //   spotlightClicks: true,
    //   hideFooter: true,
    // },
    // {
    //   target: ".watertest",
    //   content: "You can see the water node is added here.",

    // },
    // {
    //   target: ".lshapeoht-pipe-border",
    //   content: "This is the pipe to RO Plant. Since there is no sensor here. Let's place it here.",
    // },
    // {
    //   target: ".middle-section-element-2",
    //   content: "Now drag the water quantity sensor and place it on the pipe to RO Plant.",
    //   spotlightClicks: true,
    // },
    // {
    //   target: ".waterquantity-vtool",
    //   content: "You can see the water quantity sensor is added here. Now click on it.",
    // },
    {
      title: "Start Simulation",
      target: ".start-simulation-button",
      content: "Great, Click on start simulation to begin.",
      spotlightClicks: true,
      disableBeacon: true,
      disableOverlayClose: true,
      hideFooter: true,
      placement: "bottom",
    },
    {
      target: ".motor",
      content: "Now You can see the simulation is started and motor is running. Increase the water level in OHT to 85% and check the motor status.",
      placement: "bottom",
      // isLastStep: true,
    },
    {
      target: ".eightyfive-percentoht",
      content: "Click on 85% to increase the water level in OHT to 85%.",
      placement: "bottom",
      disableBeacon: true,
      hideFooter: true,
      spotlightClicks: true,
    },
    {
      target: ".motor",
      content: "Wait for few seconds,Now you can see the motor is turned off.",
      placement: "bottom",
    },
    {
      target: ".fifteen-percentoht",
      content: "Click on 15% to decrease the water level in OHT to 15% to see motor behavior.",
      placement: "bottom",
      disableBeacon: true,
      hideFooter: true,
      spotlightClicks: true,
    },
    {
      target: ".motor",
      content: "Wait for few seconds, The motor will be turned on.",
      placement: "bottom",
    },
    {
      target: ".water-level-node-oht",
      content: "Now let's make the water level node failure. Click on the water level node at OHT.",
      spotlightClicks: true,
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: ".eightyfive-percentoht",
      content: "Click on 85% to increase the water level in OHT to 85%.",
      spotlightClicks: true,
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: ".motor",
      content: "Wait for few seconds, Now you can see the motor is not turned off because the water level node is failed.",
      placement: "bottom",
    },
    {
      target: ".waterlevel-tool",
      content: "Now deploy the water level sensor at OHT to check the water level.",
      spotlightClicks: true,
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: ".watertest",
      content: "You can see the water level sensor is added here.",
    },
    {
      target: ".water-tank",
      content: "This is where the water level node should be placed.",
    },
    {
      target: ".middle-section-element-2",
      content: "Now drag the water level sensor and place it on the water tank. Make sure the node is validated with a green border.",
      spotlightClicks: true,
    },
    {
      target: ".waterlevel-vtool",
      content: "You can see the water level sensor is added here. Now click on it.",
      spotlightClicks: true,
    },
    {
      target: ".motor",
      content: "Wait for few seconds, The motor will be turned off since the virtual water level node is working.",
      placement: "bottom",
    },
    {
      target: ".start-simulation-button",
      content: "Click on stop simulation to stop the simulation.",
      placement: "bottom",
      spotlightClicks: true,
      disableBeacon: true,
      hideFooter: true,
    },
    {
      target: ".full-page",
      content: "This is the end of the tour. Thankyou.",
      placement: "center",
      isLastStep: true,
    },
  ]);

  const joyrideRef = useRef(null);

  const handleJoyrideCallback = (data) => {
    const { action, index, type, status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      console.log("Tour finished or skipped");
      setRun(false);
      setStepIndex(0);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      console.log("Step after or target not found");
      const step = steps[index];
      const nextStepIndex = action === ACTIONS.PREV ? index - 1 : index + 1;
      setStepIndex(nextStepIndex);
      console.log("Index", index);
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      console.log("Target not found:", steps[index].target);
    }

    //Print the step number based on the index which is executing now
    console.log("Step Index:", index);
    console.log("This is Step Number:", index + 1);
  };

  const handleStartSimulation = async () => {
    if (!isSimulationRunning) {
      setStepIndex(stepIndex + 1);
      handleStartWaterFlow(); // Start water flow
      setIsSimulationRunning(true);
      setFlow1((flow1) => !flow1);
      setFlow5((flow5) => !flow5);
      setFlow2(true);
      setFlow3(true);
      setMotorOn(true);
      updateLog("Simulation started.");
    } else {
      setStepIndex(stepIndex + 1);
      handleStopWaterFlow(); // Stop water flow
      setIsSimulationRunning(false);
      setFlow1(false);
      setFlow2(false);
      setFlow3(false);
      setFlow4(false);
      setFlow5(false);
      setMotorOn(false);
      updateLog("Simulation stopped.");
    }
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

  // Function to handle the toolbar item click event
  const handleToolbarItemClick = (type) => {
    // Prepare to add a new item when the next drop occurs
    // Instead of directly adding the item, we set an "item to add" state
    setItemToAdd(type);
  };

  // Function to handle the leakage icon click event
  const handleLeakageIconClick = () => {
    console.log("Leakage icon clicked");
  };

  const handleDragStart = (event, index) => {
    if (index !== undefined) {
      event.dataTransfer.setData("index", index);
    }

    const markerCoordinates = {
      x: event.clientX,
      y: event.clientY,
    };

    const { isPlaced, iconId } = checkMarkerOverlap(markerCoordinates, index);
    console.log("Marker is placed on:", iconId);
    updateLog(`Marker is placed on: ${iconId}`);
    setIsMarkerPlaced(isPlaced);
  };

  const checkMarkerOverlap = (markerCoordinates, index) => {
    let isPlaced = false;
    let iconId = null;

    // Iterate over each icon and check if the marker overlaps with it
    iconRefs.forEach((ref, index) => {
      const rect = ref.getBoundingClientRect();
      if (markerCoordinates.x >= rect.left && markerCoordinates.x <= rect.left + rect.width && markerCoordinates.y >= rect.top && markerCoordinates.y <= rect.top + rect.height) {
        iconId = ref.id;
        isPlaced = true;
      }
    });

    if (iconId === "dustbin") {
      handleDeleteItem(index);
    }

    return { isPlaced, iconId };
  };

  // Function to handle the drop event
  const handleDrop = (event) => {
    event.preventDefault();
    const canvasRect = event.currentTarget.getBoundingClientRect();
    const index = event.dataTransfer.getData("index");
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

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
    } else {
      console.log("Dropped at x: ", x, "y: ", y);
    }
  };

  // Function to handle the drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle the marker click event
  const handleMarkerClick = (item, index, e) => {
    const { isPlaced, iconId } = checkMarkerOverlap({ x: e.clientX, y: e.clientY }, index);
    console.log(`Marker clicked: ${item.type}, iconId: ${iconId}`);
    updateLog(`Marker clicked: ${item.type}, iconId: ${iconId}`);

    if (iconId === "KRBOHTIcon" && item.type === "waterlevelsensor") {
      setSensorValues((prevValues) => ({
        ...prevValues,
        type: "waterlevelsensor",
        waterleveloht: (waterInOHT / inputValues.ohtCapacity) * 100,
      }));
    }

    if (item.type === "waterquantitysensor") {
      setSensorValues({
        ...sensorValues,
        [index]: { totalFlow: 10 },
      });
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...canvasItems];
    updatedItems.splice(index, 1);
    setCanvasItems(updatedItems);
    updateLog(`Deleted item at index ${index}.`);
  };

  // Function to handle the delete all items event
  const handleDeleteAllItems = () => {
    setCanvasItems([]);
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

  const updateLog = (message) => {
    setLog((prevLog) => [...prevLog, `${new Date().toISOString()}: ${message}`]);
  };

  // Function to handle the download log event
  const handleDownloadLog = () => {
    const blob = new Blob([log.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "simulation_log.txt");
  };

  // Function to handle the clear log event

  const handleClearLog = () => {
    // Assuming logContent is a state variable holding the log data
    setLog(""); // Clear the log by setting the log content to an empty string
    updateLog("Log cleared"); // Log the action
  };

  // Function to handle the icon click event
  const handleIconClick = (dataId) => {
    console.log(`Icon clicked: ${dataId}`);
  };

  // Function to toggle the motor state
  const handleMotorToggle = () => {
    setMotorOn(!motorOn);
  };

  // Function to toggle the simulation state
  const toggleIsOn = () => {
    setIsSimulationRunning(!isSimulationRunning);
  };

  const handleConsumeWater = () => {
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

  const handleButtonClick = (percentage) => {
    const newWaterLevel = (inputValues.ohtCapacity * percentage) / 100;
    setWaterInOHT(newWaterLevel);
  };

  useEffect(() => {
    console.log("step", stepIndex);
    const interval = setInterval(() => {
      if (isSimulationRunning) {
        setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
        console.log("Time Elapsed: ", timeElapsed);
        if (waterFlowStarted) {
          if (motorOn) {
            if (waterInSump > 0) {
              setWaterInSump(waterInSump - inputValues.flowrate);
              setWaterInOHT(waterInOHT + inputValues.flowrate);
            } else {
              setMotorOn(false);
              updateLog("Motor turned off due to insufficient water in sump.");
            }
          }
          if (waterInOHT > 0) {
            setWaterInOHT(waterInOHT - inputValues.flowrate);
            setWaterInROFilter(waterInROFilter + inputValues.flowrate);
            setWaterFlowAdmin((prev) => prev + inputValues.flowrate * 0.02);
            setWaterFlowKRB((prev) => prev + inputValues.flowrate * 0.04);
          } else {
            setFlow3(false);
            updateLog("Motor turned off due to insufficient water in OHT.");
          }

          if (waterInROFilter >= 10) {
            setFlow4(true);
            setWaterInROFilter(waterInROFilter - 5);
            setWaterConsumed(waterConsumed + 5);
          }
        }
      }
    }, 1000);

    // if (isSimulationRunning && waterLevelNodeWorking) {
    //   // Turn on or off motor based on water level in OHT, if below 20% turn on motor, if above 80% turn off motor
    //   console.log("Working", waterLevelNodeWorking)
    //   if (
    //     (prevWaterInOHT > 0.2 * inputValues.ohtCapacity && waterInOHT <= 0.2 * inputValues.ohtCapacity) ||
    //     (prevWaterInOHT < 0.8 * inputValues.ohtCapacity && waterInOHT >= 0.8 * inputValues.ohtCapacity)
    //   ) {
    //     if (waterInOHT <= 0.2 * inputValues.ohtCapacity) {
    //       setMotorOn(true);
    //       updateLog("Motor turned on due to low water level in OHT.");
    //     }

    //     if (waterInOHT >= 0.8 * inputValues.ohtCapacity) {
    //       // sleep for 2 seconds

    //       setMotorOn(false);
    //       updateLog("Motor turned off due to high water level in OHT.");
    //     }
    //   }
    //   setPrevWaterInOHT(waterInOHT);
    // }

    if (isSimulationRunning && (waterLevelNodeWorking || sensorValues["waterleveloht"])) {
      // Turn on or off motor based on water level in OHT, if below 20% turn on motor, if above 80% turn off motor
      console.log("Working", waterLevelNodeWorking);
      if (
        (prevWaterInOHT > 0.2 * inputValues.ohtCapacity && waterInOHT <= 0.2 * inputValues.ohtCapacity) ||
        (prevWaterInOHT < 0.8 * inputValues.ohtCapacity && waterInOHT >= 0.8 * inputValues.ohtCapacity)
      ) {
        setTimeout(() => {
          if (waterInOHT <= 0.2 * inputValues.ohtCapacity) {
            setMotorOn(true);
            updateLog("Motor turned on due to low water level in OHT.");
          } else if (waterInOHT >= 0.8 * inputValues.ohtCapacity) {
            setMotorOn(false);
            updateLog("Motor turned off due to high water level in OHT.");
          }
        }, 2000); // 2 seconds delay
      }
      setPrevWaterInOHT(waterInOHT);
    }

    return () => clearInterval(interval);
  }, [waterInOHT, isSimulationRunning, inputValues.ohtCapacity, prevWaterInOHT]);

  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar title="Digital Twin Simulation - Water Level Node Failure" />
      {/* Page Content */}

      <div
        style={{
          display: "flex",
          // height: "50vw",
        }}
        className="full-page">
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
          }}
          className="left-section">
          <Joyride
            ref={joyrideRef}
            callback={handleJoyrideCallback}
            continuous={true}
            scrollToFirstStep={true}
            showSkipButton={true}
            run={run}
            steps={steps}
            stepIndex={stepIndex}
            locale={{
              back: 'Previous',
              close: 'Close',
              last: 'Finish',
              next: 'Next',
              skip: 'Skip',
            }}
            styles={{
              options: {
                zIndex: 10000,
                width: 400,
                position: "absolute",
              },
              // buttonNext: {
              //   backgroundColor: '#5cb85c',
              // },
              buttonBack: {
                marginRight: 10,
              },
              // buttonSkip: {
              //   backgroundColor: '#d9534f',
              // },
              tooltipContainer: {
                textAlign: 'left',
              },
              tooltip: {
                borderRadius: '10px',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
              },
            }}
          />
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "relative",
              top: "2vw",
              right: "8vw",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}>
            <Back style={{ fontSize: "1.6rem", color: "black" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", left: "2vw", marginTop: "-2.5vw", width: "7vw" }}>
            <h2 style={{ marginLeft: "-2.5vw", flex: "none", fontSize: "1.3vw" }}>Simulation Scenario</h2>

            <InfoIcon
              onClick={() => setRun(true)}
              style={{
                marginLeft: "0.5rem",
                top: "2vw",
                color: "blue",
                cursor: "pointer",
                fontSize: "1.5rem",
              }}
            />
          </div>
          <h4 style={{ textAlign: "center" }}>Water Level Node at OHT Failed</h4>
          <p style={{ textAlign: "left" }}>
            Water level node in the OHT is responsible for turning on and off the motor. The primary principle is when the water level in the OHT goes below 20% then the motor should be turned on and
            when it reaches 80% it should turned off. But in this scenario the water level node got failed.
          </p>
          {/* Slider to control the water in the OHT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="ohtCapacity">OHT Capacity:{inputValues.ohtCapacity}</label>
            <label htmlFor="waterInOHT">Water in OHT:{Number(waterInOHT)}</label>
            <input
              type="range"
              min="0"
              max={inputValues.ohtCapacity}
              value={Number(waterInOHT)}
              onChange={(e) => setWaterInOHT(parseFloat(e.target.value))}
            />
            <div style={{ marginTop: "10px" }}>
              <button
                className="fifteen-percentoht"
                onClick={() => {
                  handleButtonClick(15);
                  setStepIndex(stepIndex + 1);
                }}>
                15%
              </button>
              <button
                className="fifty-percentoht"
                onClick={() => handleButtonClick(50)}>
                50%
              </button>
              <button
                className="eightyfive-percentoht"
                onClick={() => {
                  handleButtonClick(85);
                  setStepIndex(stepIndex + 1);
                }}>
                85%
              </button>
            </div>
          </div>
          <button
            onClick={handleStartSimulation}
            style={{
              padding: "1rem",
              margin: "1rem",
              backgroundColor: isSimulationRunning ? "red" : "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            className="start-simulation-button">
            {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
          </button>
        </div>
        {/* Middle Section */}
        <div style={{ flex: 3 }}>
          {/* Toolbar */}
          <Toolbar
            handleToolbarItemClick={handleToolbarItemClick}
            handleLeakageIconClick={handleLeakageIconClick}
            setStepIndex={setStepIndex}
            stepIndex={stepIndex}
          />
          <div className="demo-page">
            <div
              className="middle-section-element-2"
              style={{
                position: "relative",
                width: "60vw",
                height: "23vw",
                border: "1px solid black",
                background: "#ffffff",
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}>
              <img
                src={`${config.basePath}/images/white.png`}
                alt="blueprint"
                style={{ width: "100%", height: "100%" }}
              />
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
                flowrate={inputValues.flowrate}
                result={result}
              />
              <IoTNodes
                SimulatedValues={SimulatedValues}
                motorOn={motorOn}
                timeElapsed={timeElapsed}
                waterLevelNodeWorking={waterLevelNodeWorking}
                setWaterLevelNodeWorking={setWaterLevelNodeWorking}
                setStepIndex={setStepIndex}
                stepIndex={stepIndex}
              />

              {canvasItems.map((item, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  style={{
                    position: "absolute",
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    cursor: "move",
                    border: isMarkerPlaced ? "2px solid green" : "none",
                    zIndex: 5,
                  }}>
                  <HoverableIcon
                    src={getImageForType(item.type)}
                    alt={item.type}
                    dataId="VirtualNode"
                    data={item.type === "waterquantitysensor" ? sensorValues[index]?.totalFlow : item.type === "waterlevelsensor" ? sensorValues["waterleveloht"] : sensorValues[index]}
                    type={item.type}
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
                  zIndex: 10,
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
                }}>
                <DeleteIcon style={{ color: "white", fontSize: "2vw" }} />
              </div>

              {itemToAdd && (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e)}
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "20px",
                    cursor: "move",
                  }}
                  className="watertest">
                  <HoverableIcon
                    src={getImageForType(itemToAdd)}
                    alt={itemToAdd}
                    dataId="Virtual Node"
                    data={`NULL`}
                    setStepIndex={setStepIndex}
                    stepIndex={stepIndex}
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
                  }}>
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
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
          }}
          className="right-section">
          <h4 style={{ textAlign: "left", marginBottom: "1px" }}>Assumptions</h4>
          <ol style={{ marginTop: "0", paddingLeft: "40px" }}>
            <li>Motor Voltage: 240V</li>
            <li>Motor Current: 11A</li>
            <li>Power Factor: 0.11</li>
            <li>Motor Efficiency: 0.85</li>
            <li>Temperature: 25°C</li>
            <li>Sump Capacity: 60,000L</li>
            <li>OHT Capacity: 100,000L</li>
            <li>Flow Rate: 10L/s</li>
            <li>Initial Sump Capacity: 38,670.00L</li>
            <li>Initial OHT Capacity: 39,260.00L</li>
          </ol>

          <h4 style={{ marginTop: "1px", marginBottom: "0px" }}>Steps to Replicate Scenario</h4>
          <ol style={{ marginTop: "0", paddingLeft: "40px" }}>
            <li>Start the simulation</li>
            <li>Set the water level in OHT to 85%</li>
            <li>Check the motor status</li>
            <li>Set the water level in OHT to 15%</li>
            <li>Check the motor status</li>
            <li>Make the water level node failure at OHT</li>
            <li>Check the motor status</li>
            <li>Deploy the water level sensor at OHT</li>
            <li>Check the motor status</li>
            <li>Stop the simulation</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default WaterLevelNodeFailure;
