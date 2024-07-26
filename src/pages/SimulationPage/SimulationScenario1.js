import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";

import NavigationBar from "../../components/navigation/Navigation";
import ConsoleHeader from "../../components/Console/Console";
import SimulationCanvas from "./components/SimulationCanvas";
import Toolbar from "./components/ToolBar/ToolBar";
import Timer from "../../components/timer-component";
import IoTNodes from "../../components/IoTNodes/Nodes";

import MotorNode from "../images/MotorNode.png";
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import LeakageIcon from "../images/leakage_water.png";
import whiteimage from "../images/white.png";
import HoverableIcon from "./components/HoverableIcon";

import DeleteIcon from "@mui/icons-material/Delete";

function SimulationScenario1() {
  // Define the state variables
  const [iconRefs, setIconRefs] = React.useState([]);
  const [flow1, setFlow1] = React.useState(0);
  const [flow2, setFlow2] = React.useState(0);
  const [flow3, setFlow3] = React.useState(0);
  const [flow4, setFlow4] = React.useState(0);
  const [flow5, setFlow5] = React.useState(0);
  const [flow6, setFlow6] = React.useState(0);
  const [flow7, setFlow7] = React.useState(0);
  const [flow8, setFlow8] = React.useState(0);
  const [flow9, setFlow9] = React.useState(0);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterInSump, setWaterInSump] = React.useState(0);
  const [motorOn, setMotorOn] = React.useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = React.useState(false);
  const [waterInOHT, setWaterInOHT] = React.useState(0);
  const [waterInROFilter, setWaterInROFilter] = React.useState(0);
  const [waterConsumed, setWaterConsumed] = React.useState(0);
  const [flowrate, setFlowrate] = React.useState(0);
  const [result, setResult] = React.useState("");
  const [inputValues, setInputValues] = React.useState({
    sumpCapacity: 1000,
    ohtCapacity: 5000,
    flowrate: 10,
  });

  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const [log, setLog] = React.useState([]);
  const [hoverData, setHoverData] = React.useState({
    isVisible: false,
    data: "",
    x: 0,
    y: 0,
  });

  const SimulatedValues = {
    "WM-WD-KH98-00": 0.5,
    "WM-WD-KH96-00": 0.5,
    "WM-WD-KH96-01": 0.5,
    "WM-WD-KH96-02": 0.5,
    "WM-WD-KH95-00": 0.5,
    "WM-WD-KH03-00": 0.5,
    "WM-WL-KH98-00": 50,
    "WM-WL-KH00-00": 50,
    "DM-KH98-60": 0,
    "WM-WF-KH98-40": 0,
    "WM-WF-KH95-40": 0,
    "WM-WF-KB04-70": 0,
    "WM-WF-KB04-73": 0,
    "WM-WF-KB04-71": 0,
    "WM-WF-KB04-72": 0,
  };

  const [itemToAdd, setItemToAdd] = React.useState(null);
  const [isMarkerPlaced, setIsMarkerPlaced] = React.useState(false);
  const [canvasItems, setCanvasItems] = React.useState([]);
  const [sensorValues, setSensorValues] = React.useState({});
  const [leakageMarkers, setLeakageMarkers] = React.useState([]);

  const updateLog = (message) => {
    setLog((prevLog) => [
      ...prevLog,
      `${new Date().toISOString()}: ${message}`,
    ]);
  };

  const handleStartSimulation = async () => {
    if (!isSimulationRunning) {
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
      updateLog("Simulation stopped.");
      // toast.error("Simulation stopped!");
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

  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar title="Digital Twin Simulation - Water Level Node Failure" />
      {/* Page Content */}
      <div
        style={{
          display: "flex",
          height: "50vw",
        }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
          }}>
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Simulation Scenario 1</h1>
          <p style={{}}>
            In this scenario, we simulate the failure of a water level node. The
            node is responsible for measuring the water level in a tank. The
            simulation will demonstrate the impact of the node failure on the
            overall system performance.
          </p>
          <p style={{ textAlign: "center" }}>
            Click on the icons to interact with the simulation.
          </p>
          <button
            onClick={toggleIsOn & handleStartSimulation}
            style={{
              padding: "1rem",
              margin: "1rem",
              backgroundColor: isSimulationRunning ? "red" : "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}>
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
                flowrate={flowrate}
                result={result}
              />
              <IoTNodes SimulatedValues={SimulatedValues} motorOn={motorOn}  timeElapsed={timeElapsed}/>


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
          }}>
          <h2>Node Failure</h2>
          <p>
            The water level node has failed. The system is unable to measure the
            water level in the tank.
          </p>
          <p>
            The system performance is affected due to the lack of data from the
            water level node.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimulationScenario1;
