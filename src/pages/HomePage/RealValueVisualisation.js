import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
// import { useInView } from 'react-intersection-observer';

import "./RealValueVisualisation.css";

import NavigationBar from "../../components/navigation/Navigation";
import LoginPage from '../LoginPage/LoginPage';
import SimulationCanvas from "../SimulationPage/components/SimulationCanvas";

import config from '../../config';
import MotorNode from "../images/MotorNode-removebg.png";
import WaterLevelNode from "../images/WaterLevelNode-removebg.png";
import WaterQualityNode from "../images/WaterQualityNode-removebg.png";
import WaterQuantityNode from "../images/WaterQuantityNode-removebg.png";
import { SignalCellularNullOutlined } from '@mui/icons-material';

// const NodeComponent = React.memo(({ nodeId, onClick }) => {
//   return <div onClick={() => onClick(nodeId)}>Node {nodeId}</div>;
// });

// Memoize the InteractiveIcon to prevent re-renders unless props change
const InteractiveIcon = React.memo(({ src, alt, onClick, style }) => (
  <img src={src} alt={alt} onClick={onClick} style={style} />
));


const RealValueVisualisation = () => {
  // State for holding input values and results
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const highlightedNodeRef = useRef(null);
  const modalRef = useRef(null);
  // const [selectedTable, setSelectedTable] = useState("");
  const iconRefs = [];
  const [flowStates, setFlowStates] = useState({
    flow1: false, flow2: false, flow3: false, flow4: false,
    flow5: false, flow6: false, flow7: false, flow8: false, flow9: false
  });

  const [isOn, setIsOn] = useState({
    "WM-WL-KH98-00": false, "WM-WL-KH00-00": false, "DM-KH98-60": false,"WM-WD-KH98-00": false,"WM-WD-KH96-00": false,"WM-WD-KH96-02": false,"WM-WD-KH95-00": false,"WM-WD-KH96-01": false,
    "WM-WD-KH04-00": false,"WM-WF-KB04-70": false,"WM-WF-KB04-73": false,"WM-WF-KB04-71": false,"WM-WF-KB04-72": false,"WM-WF-KH98-40": false,"WM-WF-KH95-40": false, 
    // ... other nodes
  });

  


  const [units, setUnits] = useState ({
    flowrate : "Kl/min",
    totalflow: "Kl",
    waterlevel : "cm",
    temparature : "°C",
    temperature: "°C",
    status : "ON(1)/OFF(0)",
    voltage : "V",
    current	: "A",
    power	: "W",
    energy	: "kWh",
    frequency  : "Hz",
    power_factor : "n/a",
    uncompensated_tds: "ppm",
    compensated_tds: "ppm",
    turbudity: "NTU",
    ph: "pH",
  });


  const [waterInSump, setWaterInSump] = useState(60000); // Initial water level in Sump
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(465.32); // Initial water level in RO Filter
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [flowrate, setFlowrate] = useState(10);
  // Memoize static data
  const sumpMeasurements = useMemo(() => ({length: 5, breadth: 6.5, height: 2.08}), []);
  const ohtMeasurements = useMemo(() => ({length: 11.28, breadth: 8.82, height: 1.15}), []);


  const WaterLevelCalculate = async (waterlevel, length, breadth, height) => {
  const WaterPercentage = (((height * 100) - waterlevel) / (height * 100)) * 100;
  const EstimatedWaterCapacity = (length * breadth * height * 1000) * (WaterPercentage / 100);
  return [WaterPercentage, EstimatedWaterCapacity]; // Return values inside an array
  };
  
  const MotorFlow = async (voltage, current, power_factor, motor_efficiency, depth, status) => {
    const power_input = voltage * current * (1.73205080757) * power_factor; // 1.73205080757 is sqrt(3), considering 3 phase motor
    const p_mechanical = power_input * motor_efficiency;
    const p_hydraulic = p_mechanical;
    const flowrate = p_hydraulic / (1000 * 9.81 * depth);
    const flowrate_lpm = flowrate * 1000 * status;
    return flowrate_lpm;
  }

  // Memoize handleNodeClick to prevent unnecessary re-renders
  const handleNodeClick = useCallback((nodeId) => {
    // Clear the border of the previously highlighted node, if any
    if (highlightedNodeRef.current && highlightedNodeRef.current !== nodeId) {
      const prevNode = document.getElementById(highlightedNodeRef.current);
      if (prevNode) {
        prevNode.style.border = 'none';
      }
    }

    // Highlight the new node
    const currentNode = document.getElementById(nodeId);
    if (currentNode) {
      currentNode.style.border = '4px solid yellow';
    }

    // Update the ref to the newly highlighted node
    highlightedNodeRef.current = nodeId;

    // Fetch the node data
    fetchNodeData(nodeId);

    // Show the modal
    if (modalRef.current) {
      modalRef.current.style.display = 'block';
    }
  }, []);


 // Memoize closeModal to avoid triggering re-renders
  const closeModal = useCallback(() => {
    // Remove highlight from the currently highlighted node
    if (highlightedNodeRef.current) {
      const currentNode = document.getElementById(highlightedNodeRef.current);
      if (currentNode) {
        currentNode.style.border = 'none';
      }
    }

    highlightedNodeRef.current = null; // Clear the reference

    // Close the modal
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
  }, []);


  const toggleIsOn = (valve) => {};
  const handleIconClick = (icon) => {};


  const parseTime = (timeString) => {
    const regex = /(\d+)([mhr])/;
    const [, value, unit] = timeString.match(regex);
    const multiplier = {
      m: 60000, // minutes to milliseconds
      h: 3600000, // hours to milliseconds
      r: 60000 * 60 * 24, // days to milliseconds
    };
    return parseInt(value, 10) * multiplier[unit];
  };

  const getNodeStatus = async (nodeId, time) => {
    try {
      const response = await fetch(
        `${config.backendAPI}/get_value?table_name=${nodeId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      // Extract timestamp from the response
      const timestamp = new Date(data.timestamp).getTime();
      const currentTime = new Date().getTime();
  
      // Check if the timestamp is within the specified time range
      const timeDifference = currentTime - timestamp;
      if (timeDifference > parseTime(time)) {
        // Show toast notification using react-toastify
        const message = `Node ${nodeId} is down!`;
      }

      return timeDifference <= parseTime(time);
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  };

  const updateNodeStatus = async (nodeIds) => {
    let tmpIsOn = {};
    for (const nodeId of nodeIds) { // Use for...of loop
        tmpIsOn[nodeId] = await getNodeStatus(nodeId, "6h"); // Await the completion of each call
    }
    setIsOn(tmpIsOn); // Assuming setIsOn is a state setter or similar function
};

  const getRealData = async (tableName) => {
    try {
      const response = await fetch(`${config.backendAPI}/get_value?table_name=${tableName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Assuming this returns an object
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Failed to fetch data" }; // Update accordingly
    }
  };

  const checkTokenValidity = async (token) => {
    try {
      const response = await fetch(`${config.backendAPI}/introspect`, {
        method: 'POST', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Set the content type
        },
        body: JSON.stringify({ token }), // Pass the token in the body
      });
      if (!response.ok) {
        // Token is not valid, ask user to login again
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  useEffect(() => {
    // Set initial flows based on business logic
    setFlowStates({
      flow1: false,
      flow2: true,  // Pre-defined as true
      flow3: true,  // Pre-defined as true
      flow4: false,
      flow5: true,  // Pre-defined as true
      flow6: false,
      flow7: false,
      flow8: true,  // Pre-defined as true
      flow9: false
    });
  
    const fetchData = async () => {
      // Calculate Water in Sump
      const SumpWaterLevelData = await getRealData('WM-WL-KH98-00');
      const [SumpWaterPercentage, SumpEstimatedWaterCapacity] = await WaterLevelCalculate((SumpWaterLevelData.waterlevel - 20), sumpMeasurements.length, sumpMeasurements.breadth, sumpMeasurements.height);
      setWaterInSump(SumpEstimatedWaterCapacity);
  
      // Calculate Water Consumed
      const RO1FlowData = await getRealData('WM-WF-KB04-71');
      const RO2FlowData = await getRealData('WM-WF-KB04-72');
      setWaterConsumed((RO1FlowData.totalflow + RO2FlowData.totalflow) * 1000); // Converting to Litres from KL
  
      // Calculate Water in OHT
      const OHTWaterLevelData = await getRealData('WM-WL-KH00-00');
      const [OHTWaterPercentage, OHTEstimatedWaterCapacity] = await WaterLevelCalculate(OHTWaterLevelData.waterlevel, ohtMeasurements.length, ohtMeasurements.breadth, ohtMeasurements.height);
      setWaterInOHT(OHTEstimatedWaterCapacity);
  
      // Calculate Motor Running Status
      const MotorData = await getRealData('DM-KH98-60');
      const MotorFlowrate = await MotorFlow(MotorData.voltage, MotorData.current, MotorData.power_factor, 0.85, sumpMeasurements.height, MotorData.status);
      setMotorOn(MotorData.status === 1);
      setFlowStates(prevFlowStates => ({
        ...prevFlowStates,
        flow4: MotorData.status === 1  // Set flow4 based on motor status
      }));
  
      // WaterQuantityNode Data
      const WaterQuantityDataAW1 = await getRealData('WM-WF-KB04-70');
      const WaterQuantityDataKW2 = await getRealData('WM-WF-KB04-73');
      const WaterQuantityDataR1 = await getRealData('WM-WF-KB04-71');
      const WaterQuantityDataR2 = await getRealData('WM-WF-KB04-72');
      const WaterQuantityBorewelltoSump = await getRealData('WM-WF-KH98-40');
      const WaterQuantityMotortoOHT = await getRealData('WM-WF-KH95-40');
  
      // Update flow states based on fetched flowrates
      setFlowStates(prevFlowStates => ({
        ...prevFlowStates,
        flow1: WaterQuantityBorewelltoSump.flowrate > 0,  // Borewell to Sump flow
        flow6: WaterQuantityDataAW1.flowrate > 0,  // AW1 flow
        flow7: WaterQuantityDataKW2.flowrate > 0,  // KW2 flow
        flow8: WaterQuantityDataR1.flowrate > 0,   // R1 flow (already set initially to true)
        flow9: WaterQuantityDataR2.flowrate > 0    // R2 flow
      }));
    };
  
    fetchData();

    const nodeIds = Object.keys(isOn);
    updateNodeStatus(nodeIds)
    const token = localStorage.getItem('token');
    if (token) {
      checkTokenValidity(token); // Pass the token to the function
    } else {
      setIsAuthenticated(false);
    }
    const interval = setInterval(() => {
      fetchData();
    }, 120000); // Run every 2 minutes

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {return <LoginPage />;}

  // Modified onClick functions to disable the button and re-enable it after the operation
  const modifiedOnClick = async (buttonId, tableName, actionType) => {
    // Call NodeActuation with the button ID, tableName, and actionType
    document.getElementById(buttonId).disabled = true;
    try{
      await NodeActuation(tableName, actionType, buttonId, () => {
        console.log('Operation complete');
    });
  }
  catch (error) {
    console.error('Error:', error);
  }
  finally{
    document.getElementById(buttonId).disabled = false;
  };
};

  async function NodeActuation(nodeName, status, buttonId, callback){
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
    // Determine the status based on the updated state
    const node_status = !isOn[nodeName] ? 'on' : 'off';
    const requestBody = {
      // Your request body data here
      
    };
  
    try {
      const response = await fetch(
        `${config.backendAPI}/actuation/${nodeName}/${status}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
    finally{
      if (callback) {
        callback();
      }
    }
  };

  const motorClick = async (buttonId, actionType) => {
    // Call NodeActuation with the button ID, tableName, and actionType
    console.log("Motor",buttonId, actionType);
    document.getElementById(buttonId).disabled = true;
    try{
      await MotorActuation(actionType, () => {
        console.log('Operation complete');
    });
  }
  catch (error) {
    console.error('Error:', error);
  }
  finally{
    document.getElementById(buttonId).disabled = false;
  };
};

  async function MotorActuation (status, callback){
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
    // Determine the status based on the updated state
    // const node_status = !isOn[nodeName] ? 'on' : 'off';
    const requestBody = {
      // Your request body data here
      
    };
    try {
      const response = await fetch(
        `${config.backendAPI}/motor/actuation/${status}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }

  }


  const GrafanaPanel = React.memo(({ src }) => (
    <iframe src={src} style={{ width: '100%', height: '100%', border: 'none' }} />
  ));

  // const LazyBox = ({ src, panelId }) => {
  //   const [isLoaded, setIsLoaded] = useState(false);
  //   const [iframeSrc, setIframeSrc] = useState('');
  
  //   useEffect(() => {
  //     const cachedSrc = localStorage.getItem(`panel-${panelId}`);
  //     if (cachedSrc) {
  //       setIframeSrc(cachedSrc);
  //       setIsLoaded(true);
  //     } else {
  //       setIframeSrc(src);
  //     }
  //   }, [src, panelId]);
  
  //   const handleLoad = () => {
  //     localStorage.setItem(`panel-${panelId}`, src);
  //     setIsLoaded(true);
  //   };
  
  //   return (
  //     <div style={{ flex: 1 }}>
  //       {!isLoaded && <div>Loading...</div>}
  //       <iframe
  //         src={iframeSrc}
  //         style={{ width: '100%', height: '100%', border: 'none', display: isLoaded ? 'block' : 'none' }}
  //         onLoad={handleLoad}
  //       />
  //     </div>
  //   );
  // };
  
  const handleSubmit = async (tableName, inputValue) => {
    try {
      if (!inputValue.trim()) {
        alert("Input cannot be blank");
        return;
      }
      // Submit logic here, e.g., sending data to the backend
      console.log("Submitting data for", tableName, "with value:", inputValue);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Fetch data when tableName is selected
  // useEffect(() => {
  //   if (selectedTable) {
  //     fetchNodeData(selectedTable);
  //   }
  // }, [selectedTable]);
  
  const fetchNodeData = async (tableName) => {
    const WaterQualityNodes = [
      "WM-WD-KH98-00",
      "WM-WD-KH96-00",
      "WM-WD-KH96-02",
      "WM-WD-KH95-00",
      "WM-WD-KH96-01",
      "WM-WD-KH04-00",
    ];
    const WaterLevelNodes = ["WM-WL-KH98-00", "WM-WL-KH00-00"];
    const MotorNodes = ["DM-KH98-60"];
    const WaterFlowNodes = [
      "WM-WF-KB04-70",
      "WM-WF-KB04-73",
      "WM-WF-KB04-71",
      "WM-WF-KB04-72",
      "WM-WF-KH98-40",
      "WM-WF-KH95-40",
    ];
  
    try {
      // Fetch the data from the backend
      const jsonData = await getRealData(tableName);
  
      // Ensure data is valid
      if (!jsonData || typeof jsonData !== "object") {
        console.log("No valid data available for", tableName);
        return;
      }
  
      // Create a table and heading
      const table = document.createElement("table");
      const heading = document.createElement("h3");
      heading.textContent = tableName;
      table.appendChild(heading);
  
      // Table styling
      table.style.width = "69%";
      table.style.left = "1vw";
      table.style.borderCollapse = "collapse";
  
      // Table header
      const headerRow = document.createElement("tr");
      const headers = ["Parameter", "Value", "Units"];
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.border = "1px solid black";
        th.style.padding = "2px";
        th.style.fontSize = "1vw";
        th.style.backgroundColor = "#f2f2f2";
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
  
      // Populate table with data
      Object.entries(jsonData).forEach(([key, value]) => {
        if (key === "timestamp") return;
  
        const row = document.createElement("tr");
  
        const keyCell = document.createElement("td");
        keyCell.textContent = key;
        keyCell.style.border = "1px solid black";
        keyCell.style.padding = "8px";
        row.appendChild(keyCell);
  
        const valueCell = document.createElement("td");
        if (key === "creationtime" && value) {
          value = value.replace("+00:00", "+05:30");
        }
        valueCell.textContent = value;
        valueCell.style.border = "1px solid black";
        valueCell.style.padding = "2px";
        row.appendChild(valueCell);
  
        const unitCell = document.createElement("td");
        unitCell.textContent = units[key] || ""; // Assuming `units` is defined
        unitCell.style.border = "1px solid black";
        unitCell.style.padding = "8px";
        row.appendChild(unitCell);
  
        table.appendChild(row);
      });
  
      // Append table to container
      const tableContainer = document.getElementById("tableContainer");
      tableContainer.innerHTML = ""; // Clear existing content
      tableContainer.style.width = "57vw";
  
      // Create table wrapper for scrollable content
      const tableWrapper = document.createElement("div");
      tableWrapper.className = "tableWrapper no-scrollbar";
      tableWrapper.style.overflowY = "auto";
      tableWrapper.style.maxHeight = "15vw"; // Limit height for scrolling
      tableWrapper.style.padding = "1px"; // Optional: add padding
  
      tableWrapper.appendChild(table);
      tableContainer.appendChild(tableWrapper);
  
      // Create button container
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "buttonContainer";
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "space-around";
      buttonContainer.style.marginTop = "20px";
      buttonContainer.style.height = "60px";
      buttonContainer.style.width = "39.2vw";
      buttonContainer.style.position = "sticky";
  
      let selectedButton = null;
      let inputValue = "";
  
      // Render buttons based on node type
      const renderButtons = (buttonsInfo) => {
        buttonContainer.innerHTML = ""; // Clear existing buttons
        buttonsInfo.forEach((buttonInfo) => {
          const button = document.createElement("button");
          button.textContent = buttonInfo.text;
          button.id = buttonInfo.id;
          button.style.padding = "1px 20px";
          button.style.margin = "0 10px"; // Adjust spacing between buttons
          button.style.cursor = "pointer";
          button.style.width = "25vw";
          button.style.position = "sticky";
          button.addEventListener("click", buttonInfo.onClick); // Attach event listener
          buttonContainer.appendChild(button);
        });
  
        tableContainer.appendChild(buttonContainer);
      };
  
      // Define node-specific buttons
      const handleNodeButtons = () => {
        if (WaterQualityNodes.includes(tableName)) {
          const buttonsInfo = [
            { text: "Node Reset", id: "powerResetButton", onClick: () => modifiedOnClick("powerResetButton", tableName, 2) },
            { text: "Power Reset", id: "nodeResetButton", onClick: () => modifiedOnClick("nodeResetButton", tableName, 3) },
            {
              text: "Update Calibrated Values",
              id: "updateValuesButton",
              onClick: () => {
                selectedButton = 4;
                renderButtons(buttonsInfo);
                createInputForm();
              }
            },
          ];
          renderButtons(buttonsInfo);
        } else if (MotorNodes.includes(tableName)) {
          const buttonsInfo = [
            { text: "Motor On", id: "turnOnButton", onClick: () => motorClick("turnOnButton", 1) },
            { text: "Motor Off", id: "turnOffButton", onClick: () => motorClick("turnOffButton", 0) },
            { text: "Motor Node Reset", id: "powerResetButton", onClick: () => modifiedOnClick("powerResetButton", tableName, 2) },
            { text: "Motor Power Reset", id: "nodeResetButton", onClick: () => modifiedOnClick("nodeResetButton", tableName, 3) },
          ];
          renderButtons(buttonsInfo);
        } else {
          const buttonsInfo = [
            { text: "Node Reset", id: "powerResetButton", onClick: () => modifiedOnClick("powerResetButton", tableName, 2) },
            { text: "Power Reset", id: "nodeResetButton", onClick: () => modifiedOnClick("nodeResetButton", tableName, 3) },
          ];
          renderButtons(buttonsInfo);
        }
      };
  
      // Input form for updating values
      const createInputForm = () => {
        const inputDiv = document.createElement("div");
        inputDiv.style.marginTop = "10px";
        inputDiv.style.textAlign = "center";
  
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.className = "input-field";
        inputField.value = inputValue;
        inputField.placeholder = "[5.6,4.3,2.8,.....]";
        inputField.style.padding = "8px";
        inputField.style.width = "15vw";
        inputField.onchange = (e) => { inputValue = e.target.value; };
  
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.className = "submit-button";
        submitButton.style.marginTop = "10px";
        submitButton.style.padding = "10px 20px";
        submitButton.style.cursor = "pointer";
        submitButton.onclick = async (event) => {
          event.preventDefault();
          if (!inputValue.trim()) {
            alert("Input cannot be blank");
            return;
          }
          await handleSubmit(tableName, inputValue);
        };
  
        inputDiv.appendChild(inputField);
        inputDiv.appendChild(submitButton);
        tableContainer.appendChild(inputDiv);
      };
  
      // Execute node button logic
      handleNodeButtons();
  
      // Display modal
      const modal = document.getElementById("myModal");
      modal.style.display = "block";
  
    } catch (error) {
      console.error("Error fetching node data:", error);
    }
  };
  
  
  
  

  

  function InteractiveIcon({ src, alt, onClick, fetchNodeDataParam,rotation }) {
    const [backgroundColor, setBackgroundColor] = useState('transparent');

    useEffect(() => {
      const newColor = isOn[fetchNodeDataParam] ? 'green' : 'red';
      setBackgroundColor(newColor);
    }, [isOn, fetchNodeDataParam]);

    const iconStyle = {
      width: "2vw",
      height: "2vw",
      transition: "transform 0.3s, filter 0.3s", // Smooth transition for transform and filter
      zIndex: 10,
      cursor: "pointer",
      backgroundColor: isOn[fetchNodeDataParam] ? '#7bae37' : '#d51c3f',
      borderRadius: "50%",
    };
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      color: isOn[fetchNodeDataParam] ? '#7bae37' : '#d51c3f',
      fontSize: '20px',
      transform: rotation ? `rotate(${-rotation}deg)` : 'none', // Counter-rotation applied here
    };
  
    const handleMouseOver = (e) => {
      e.currentTarget.style.transform = "scale(1.2)"; // Zoom effect
      e.currentTarget.style.filter = "brightness(0.5)"; // Change color effect
    };
  
    const handleMouseOut = (e) => {
      e.currentTarget.style.transform = "scale(1)"; // Return to normal size
      e.currentTarget.style.filter = "none"; // Remove color change effect
    };
  
    return (
      <div style={{ position: "absolute"}}>
        <img
          src={src}
          alt={alt}
          style={iconStyle}
          onClick={() => onClick(fetchNodeDataParam)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
        {/* <span style={overlayStyle}>
        {isOn[fetchNodeDataParam] ? '✓' : '✕'} 
      </span> */}
      </div>
    );
  }

  return (
    <div className='page'>
      <NavigationBar title="Digital Twin for Water Quality " 
      style={{position:'relative',
       width: '90vw',
       height: '20vw'
       }} />
      <div style={{ display: "flex"}} className='Page'>
        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '41.2vw', border: "0px" }}>

          <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=24" />
          {/* <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=17" /> */}
          <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=9" />
          <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=20" />
      {/* <LazyBox src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=24" panelId="24" />
      <LazyBox src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=9" panelId="9" />
      <LazyBox src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=20" panelId="20" /> */}

        </div>

        <div style={{ height: "42.6vw", width: "100vw",display: "flex", flex:2, justifyContent: "center", alignItems: "center"}} className='canvas'>
            <div>
              <div>
              {/* Modal */}
      <div
        id="myModal"
        ref={modalRef}
        className="modal"
        style={{
          position: 'fixed',
          top: '93%',
          left: '49%',
          transform: 'translate(-50%, -50%)',
          width: '50vw',
          height: '48vw',
          zIndex: 10,
          display: 'none', // Hide modal initially
        }}
      >
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <div id="tableContainer"></div>
        </div>
      </div>
                <div style={{ position: 'relative', width: '60vw',height: '20vw', top: '-3vw'}}>
                <SimulationCanvas
                    handleIconClick={handleIconClick}
                    iconRefs={iconRefs}
                    PipeP1toSump={flowStates.flow1}               // Pipe from P1 to Sump
                    PipeBoreToSump={flowStates.flow2}             // Pipe from Bore to Sump
                    PipeSumpToMotor={flowStates.flow3}            // Pipe from Sump to Motor
                    PipeMotorToOHT={flowStates.flow4}             // Pipe from Motor to OHT
                    PipeOHTtoRO={flowStates.flow5}                // Pipe from OHT to RO
                    PipeOHTtoAdminWashrooms={flowStates.flow6}    // Pipe from OHT to Admin Washrooms
                    PipeOHTtoKRBWashrooms={flowStates.flow7}      // Pipe from OHT to KRB Washrooms
                    PipetoRO1={flowStates.flow8}                  // Pipe to RO1
                    PipetoRO3={flowStates.flow9}                  // Pipe to RO3
                    setFlow1={setFlowStates}                           // Setter for flow1
                    setFlow2={setFlowStates}                           // Setter for flow2
                    waterInSump={waterInSump}                     // Water level in Sump
                    sumpCapacity={sumpMeasurements.length * sumpMeasurements.breadth * sumpMeasurements.height * 1000}  // Sump Capacity
                    waterInOHT={waterInOHT}                       // Water level in OHT
                    ohtCapacity={ohtMeasurements.length * ohtMeasurements.breadth * ohtMeasurements.height * 1000}     // OHT Capacity
                    waterInROFilter={waterInROFilter}             // Water in RO Filter
                    toggleIsOn={toggleIsOn}                       // Toggle status
                    motorOn={motorOn}                             // Motor status (on/off)
                    waterConsumed={waterConsumed}                 // Water consumption data
                    flowrate={flowrate}                           // Flowrate data
                  />

                  {/* IoT Nodes */}
      <div
        id="WM-WD-KH98-00"
        className="node"
        style={{
          position: 'absolute',
          top: '11.5vw',
          left: '13.5vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WD-KH98-00' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQualityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WD-KH98-00')} fetchNodeDataParam={'WM-WD-KH98-00'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WD-KH96-00"
        className="node"
        style={{
          position: 'absolute',
          top: '1.2vw',
          left: '29vw',
          zIndex: "10",
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WD-KH96-00' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQualityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WD-KH96-00')} fetchNodeDataParam={'WM-WD-KH96-00'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WD-KH96-01"
        className="node"
        style={{
          position: 'absolute',
          top: '6vw',
          left: '50.3vw',
          zIndex: "2",
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WD-KH96-01' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQualityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WD-KH96-01')} fetchNodeDataParam={'WM-WD-KH96-01'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WD-KH96-02"
        className="node"
        style={{
          position: 'absolute',
          top: '8vw',
          left: '54.5vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WD-KH96-02' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQualityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WD-KH96-02')} fetchNodeDataParam={'WM-WD-KH96-02'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WD-KH95-00"
        className="node"
        style={{
          position: 'absolute',
          top: '14.5vw',
          left: '51.5vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WD-KH95-00' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQualityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WD-KH95-00')} fetchNodeDataParam={'WM-WD-KH95-00'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WD-KH04-00"
        className="node"
        style={{
          position: 'absolute',
          top: '14.5vw',
          left: '57vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WD-KH04-00' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
           src={WaterQualityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WD-KH04-00')} fetchNodeDataParam={'WM-WD-KH04-00'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WL-KH98-00"
        className="node"
        style={{
          position: 'absolute',
          top: '8vw',
          left: '14vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WL-KH98-00' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterLevelNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WL-KH98-00')} fetchNodeDataParam={'WM-WL-KH98-00'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WL-KH00-00"
        className="node"
        style={{
          position: 'absolute',
          top: '1.2vw',
          left: '33vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          zIndex: "3",
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WL-KH00-00' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterLevelNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WL-KH00-00')} fetchNodeDataParam={'WM-WL-KH00-00'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="DM-KH98-60"
        className="node"
        style={{
          position: 'absolute',
          top: '10vw',
          left: '21.5vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          zIndex: 2,
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'DM-KH98-60' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={MotorNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('DM-KH98-60')} fetchNodeDataParam={'DM-KH98-60'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WF-KH98-40"
        className="node"
        style={{
          position: 'absolute',
          top: '6.5vw',
          left: '6.5vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          transform: "rotate(90deg)", zIndex: 2,
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WF-KH98-40' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQuantityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WF-KH98-40')} fetchNodeDataParam={'WM-WF-KH98-40'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WF-KH95-40"
        className="node"
        style={{
          position: 'absolute',
          top: '6.3vw',
          left: '26vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          transform: "rotate(90deg)", zIndex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WF-KH95-40' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQuantityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WF-KH95-40')} fetchNodeDataParam={'WM-WF-KH95-40'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WF-KB04-70"
        className="node"
        style={{
          position: 'absolute',
          top: '6.8vw',
          left: '39vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          transform: "rotate(90deg)", 
          zIndex: "2",
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WF-KB04-70' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQuantityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WF-KB04-70')} fetchNodeDataParam={'WM-WF-KB04-70'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WF-KB04-73"
        className="node"
        style={{
          position: 'absolute',
          top: '6.8vw',
          left: '45vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          transform: "rotate(90deg)",
          zIndex: "2", 
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WF-KB04-73' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQuantityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WF-KB04-73')} fetchNodeDataParam={'WM-WF-KB04-73'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WF-KB04-71"
        className="node"
        style={{
          position: 'absolute',
          top: '11.5vw',
          left: '51.5vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          alignItems: 'center',
          transform: "rotate(90deg)",
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WF-KB04-71' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQuantityNode} 
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WF-KB04-71')} fetchNodeDataParam={'WM-WF-KB04-71'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>

      <div
        id="WM-WF-KB04-72"
        className="node"
        style={{
          position: 'absolute',
          top: '11vw',
          left: '57vw',
          textAlign: 'center',
          padding: '0.5vw', // Create space between the node and the border
          width: '3vw',
          height: '3vw',
          display: 'flex',
          transform: "rotate(90deg)",
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          border: highlightedNodeRef.current === 'WM-WF-KB04-72' ? '4px solid yellow' : 'none',
        }}
      >
        <InteractiveIcon
          src={WaterQuantityNode}
          alt="WaterQuantityNode"
          onClick={() => handleNodeClick('WM-WF-KB04-72')} fetchNodeDataParam={'WM-WF-KB04-72'}
          style={{ width: '2vw', height: '2vw' }}
        />
      </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', flex:1, height: '16vw' }}>
                <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=17" />
                <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" />
              </div>
            </div>
        </div>

        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '40vw' }}>
          <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=22" />
          {/* <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" /> */}
          <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=10" />
          <GrafanaPanel src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=21" />
        </div>
      </div>
    </div>
  );
};


export default RealValueVisualisation;