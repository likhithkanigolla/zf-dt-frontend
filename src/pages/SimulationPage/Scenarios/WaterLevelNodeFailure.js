import React, { useEffect, useState, useRef } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { saveAs } from "file-saver";
import NavigationBar from "../../../components/navigation/Navigation";
import ConsoleHeader from "../../../components/Console/Console";
import SimulationCanvas from "../components/SimulationCanvas";
import Toolbar from "../components/ToolBar/ToolBar";
import IoTNodes from "../../../components/IoTNodes/Nodes";
import MotorNode from "../../images/MotorNode.png";
import WaterLevelNode from "../../images/WaterLevelNode.png";
import WaterQualityNode from "../../images/WaterQualityNode.png";
import WaterQuantityNode from "../../images/WaterQuantityNode.png";
import whiteimage from "../../images/white.png";
import HoverableIcon from "../components/HoverableIcon";
import DeleteIcon from "@mui/icons-material/Delete";

function WaterLevelNodeFailure() {
  // Define the state variables
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
  const [waterInROFilter, setWaterInROFilter] = React.useState(100);
  const [waterConsumed, setWaterConsumed] = React.useState(0);
  const [waterFlowAdmin, setWaterFlowAdmin] = useState(0); // Initial water flow in Admin
  const [waterFlowKRB, setWaterFlowKRB] = useState(0); // Initial water flow in KRB
  const [result, setResult] = React.useState("");
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
    sumpCapacity: "60000",
    ohtCapacity: "100000",
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
    "WM-WD-KH03-00": 46 - 5 + Math.floor(Math.random() * 11) - 5,
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
      content:
        "Welcome to the Water Level Node Failure Scenario. This is a guided tour to help you understand the scenario.",
      target: ".full-page",
      placement: "center",
    },
    {
      target: ".left-section",
      content:
        "This is the left section. You can find the scenario title and description here.",
    },
    {
      target: ".right-section",
      content:
        "This is the right section.Asumptions and solution will be displayed here.",
      placement: "left",
    },
    {
      target: ".toolbar",
      content: "This is the toolbar. Each icon indicates a Virtual Node.",
    },
    {
      target: ".middle-section-element-2",
      content: "This is the main simulation area.",
    },
    {
      target: ".console-container",
      content:
        "This is the console. Everything that happen in simulation will be displayed here .You can download the log here.",
    },
    {
      title: "Start Simulation",
      target: ".start-simulation-button",
      content: "Click on start simulation to begin.",
      spotlightClicks: true,
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: "bottom",
    },
    {
      target: ".toolbar",
      content: "Click on the toolbar to select a tool.",
      placement: "bottom",
    },
    {
      target: ".middle-section-element-2",
      content: "Now drag an item onto the canvas.",
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
      if (index === 4) {
        // Code to handle next step after step 6
        console.log("I am at step 6");
        setStepIndex(nextStepIndex);
      } else {
        // Code for other cases

        setStepIndex(nextStepIndex);
        console.log("Index", index);
      }
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      console.log("Target not found:", steps[index].target);
    }

    //Print the step number based on the index which is executing now
    console.log("Step Index:", index);
    console.log("This is Step Number:", index + 1);
  };

  const handleStartSimulation = async () => {
    if (!isSimulationRunning) {
      setStepIndex(7);
      handleStartWaterFlow(); // Start water flow
      setIsSimulationRunning(true);
      setFlow1((flow1) => !flow1);
      setFlow5((flow5) => !flow5);
      setFlow2(true);
      setFlow3(true);
      setMotorOn(true);
      updateLog("Simulation started.");
    } else {
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
    console.log(`Marker clicked: ${item.type}`);
    if (item.type === "waterlevelsensor") {
      setSensorValues({
        ...sensorValues,
        [index]: Math.floor(Math.random() * 100),
      });
    } else if (item.type === "waterquantitysensor") {
      setSensorValues({
        ...sensorValues,
        [index]: { totalFlow: Math.floor(Math.random() * 100) },
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
        return WaterQualityNode;
      case "waterquantitysensor":
        return WaterQuantityNode;
      case "waterlevelsensor":
        return WaterLevelNode;
      case "motorsensor":
        return MotorNode;
      default:
        return ""; // default image or empty string if none
    }
  };

  const updateLog = (message) => {
    setLog((prevLog) => [
      ...prevLog,
      `${new Date().toISOString()}: ${message}`,
    ]);
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

  useEffect(() => {
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
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div>
      <Joyride
        ref={joyrideRef}
        callback={handleJoyrideCallback}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        run={run}
        steps={steps}
        stepIndex={stepIndex}
        styles={{
          options: {
            zIndex: 10000,
            width: 400,
            position: "relative",
          },
        }}
      />
      {/* Navigation Bar */}
      <NavigationBar title="Digital Twin Simulation - Water Level Node Failure" />
      {/* Page Content */}
      <div
        style={{
          display: "flex",
          height: "50vw",
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
          <h2 style={{textAlign: "center"}}>Simulation Scenario</h2>
          <h4 style={{ textAlign: "center" }}>Water Level Node at OHT Failed</h4>
          <p style={{ textAlign: "center" }}>
            Water level node in the OHT is responsible for turning on and off
            the motor. The primary principle is when the water level in the OHT
            goes below 20% then the motor should be turned on and when it
            reaches 80% it should turned off. But in this scenario the water
            level node got failed.
          </p>
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
                src={whiteimage}
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
                    data={
                      item.type === "waterquantitysensor"
                        ? sensorValues[index]?.totalFlow
                        : sensorValues[item.id]
                    }
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
                <DeleteIcon style={{ color: "white", fontSize: "40px" }} />
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
                  }}>
                  <HoverableIcon
                    src={getImageForType(itemToAdd)}
                    alt={itemToAdd}
                    dataId="Virtual Node"
                    data={`NULL`}
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
          <h4 style={{ textAlign: "center" }}>Assumptions</h4>
            <ol>
              <li>Motor Voltage: 240V</li>
              <li>Motor Current: 11A</li>
              <li>Power Factor: 0.11</li>
              <li>Motor Efficiency: 0.85</li>
              <li>Temperature: 25°C</li>
              <li>Sump Capacity: 60,000L</li>
              <li>OHT Capacity: 100,000L</li>
              <li>Flow Rate: 10L/s</li>
            </ol>
          <h4>Soulution</h4>
          <ol>
            <li>Check the Motor Running Status by deploying the Virtual Motor Sensor</li>
            <li>Check the Total InFlow from sump to OHT by deploying Water Quality Sensor at Motor</li>
            <li>Check the Total OutFlow from OHT to RO Filter by deploying Water Quality Sensor at RO Plant</li>
            <li>Finally Deploy the WaterLevel Sensor at OHT and check the issue is resolved or not. </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default WaterLevelNodeFailure;
