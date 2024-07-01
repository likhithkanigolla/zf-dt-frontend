import React, { useRef,useState, useEffect } from 'react';

import "./RealValueVisualisation.css";

import NavigationBar from "../../components/navigation/Navigation";
import LoginPage from '../LoginPage/LoginPage';
import ConsoleHeader from '../SimulationPage/components/Console/Console.jsx';
import SimulationCanvas from "../SimulationPage/components/SimulationCanvas";

import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import config from '../../config';
import { saveAs } from 'file-saver';


const RealValueVisualisation = () => {
  // State for holding input values and results
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const iconRefs = [];
  const [flow1, setFlow1] = useState(false);
  const [flow2, setFlow2] = useState(false);
  const [flow3, setFlow3] = useState(false);
  const [flow4, setFlow4] = useState(false);
  const [flow5, setFlow5] = useState(false);
  const [flow6, setFlow6] = useState(false);
  const [flow7, setFlow7] = useState(false);
  const [flow8, setFlow8] = useState(false);
  const [flow9, setFlow9] = useState(false);


  const [isOn, setIsOn] = useState({
    "WM-WL-KH98-00": false,
    "WM-WL-KH00-00": false,
    "DM-KH98-60": false,
    "WM-WD-KH98-00": false,
    "WM-WD-KH96-00": false,
    "WM-WD-KH96-02": false,
    "WM-WD-KH95-00": false,
    "WM-WD-KH96-01": false,
    "WM-WD-KH03-00": false,
    "WM-WF-KB04-70": false,
    "WM-WF-KB04-73": false,
    "WM-WF-KB04-71": false,
    "WM-WF-KB04-72": false,
    "WM-WF-KH98-40": false,
    "WM-WF-KH95-40": false, 
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
  // All measurements are in m(meters)
  const [sumpMeasurements, setSumpMeasurements] = useState({length: 5,breadth: 6.5, height: 2.08});
  const [ohtMeasurements, setOhtMeasurements] = useState({length: 11.28,breadth: 8.82, height: 1.15});


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

  const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

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
      console.log(timeDifference, parseTime(time));
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
    for (let idx in nodeIds) {
      tmpIsOn[nodeIds[idx]] = await getNodeStatus(nodeIds[idx], "6h");
    }
    console.log(tmpIsOn);
    setIsOn(tmpIsOn);
    console.log("Done", isOn); 
  };

  const getRealData = async (tableName) => {
    try {
      const response = await fetch(`${config.backendAPI}/get_value?table_name=${tableName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Assuming this returns an object
      // console.log(data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Failed to fetch data" }; // Update accordingly
    }
  };
  
  useEffect(() => {
    setFlow2(true);
    setFlow3(true);
    setFlow5(true);
    setFlow8(true);
    const fetchData = async () => {
      // Calculate Water in Sump
      const SumpWaterLevelData = await getRealData('WM-WL-KH98-00');
      const [SumpWaterPercentage, SumpEstimatedWaterCapacity] = await WaterLevelCalculate((SumpWaterLevelData.waterlevel-20), sumpMeasurements.length, sumpMeasurements.breadth, sumpMeasurements.height);
      setWaterInSump(SumpEstimatedWaterCapacity);

      const RO1FlowData = await getRealData('WM-WF-KB04-71');
      const RO2FlowData = await getRealData('WM-WF-KB04-72');
      setWaterConsumed((RO1FlowData.totalflow + RO2FlowData.totalflow)*1000); //Converting to Litres from Kl

      // Calculate Water in OHT
      const OHTWaterLevelData = await getRealData('WM-WL-KH00-00');
      const [OHTWaterPercentage, OHTEstimatedWaterCapacity] = await WaterLevelCalculate(OHTWaterLevelData.waterlevel, ohtMeasurements.length, ohtMeasurements.breadth, ohtMeasurements.height);
      setWaterInOHT(OHTEstimatedWaterCapacity);

      // Calculate Motor Running Status
      const MotorData = await getRealData('DM-KH98-60');
      const MotorFlowrate = await MotorFlow(MotorData.voltage, MotorData.current, MotorData.power_factor, 0.85, sumpMeasurements.height, MotorData.status);
      setMotorOn(MotorData.status === 1 ? true : false);
      setFlow4(MotorData.status === 1 ? true : false);
      console.log("Motor FlowRate", MotorFlowrate);

      // WaterQuantityNode Data 
      const WaterQuantityDataAW1 = await getRealData('WM-WF-KB04-70');
      const WaterQuantityDataKW2 = await getRealData('WM-WF-KB04-73');
      const WaterQuantityDataR1 = await getRealData('WM-WF-KB04-71');
      const WaterQuantityDataR2 = await getRealData('WM-WF-KB04-72');
      const WaterQuantityBorewelltoSump = await getRealData('WM-WF-KH98-40');
      console.log("WaterQuantityBorewelltoSump", WaterQuantityBorewelltoSump)
      const WaterQuantityMotortoOHT = await getRealData('WM-WF-KH95-40');
      if (WaterQuantityDataAW1.flowrate > 0) {setFlow6(true);} else {setFlow6(false);}
      if (WaterQuantityDataKW2.flowrate > 0) {setFlow7(true);} else {setFlow7(false);}
      if (WaterQuantityDataR1.flowrate > 0) {setFlow8(true);} else {setFlow8(false);}
      if (WaterQuantityDataR2.flowrate > 0) {setFlow9(true);} else {setFlow9(false);}
      if (WaterQuantityBorewelltoSump.flowrate > 0) {setFlow1(true);} else {setFlow1(false);}
      // if (WaterQuantityMotortoOHT.flowrate > 0) {setFlow4(true);} else {setFlow4(false);}

    };
    fetchData();

    const nodeIds = Object.keys(isOn);
    updateNodeStatus(nodeIds)
    const token = localStorage.getItem('token');
    if (token) {
        setIsAuthenticated(true);
    }
    const interval = setInterval(() => {
      fetchData();
    }, 120000); // Run every 2 minutes

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {return <LoginPage />;}


  const NodeActuation = async (nodeName, status) => {
    // Update the state based on the current state
    // Add nodeID in params if needed 
    // setIsOn((prevState) => ({ ...prevState, [nodeID]: !prevState[nodeID] }));
    // console.log(isOn)
  
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
      console.log(data); // Log the response data if needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const UpdateCoef = async (nodeType, nodeName) => {
    // Update the coefficients 
    // Get the Token
  };

  const Node = ({ nodeId, isOn }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = (number) => {
      setSelectedButton(number);
      console.log(number);
    };

    const handleCloseButtonClick = () => {
      setShowPopup(false);
    };

    const handleChange = (event) => {
      setInputValue(event.target.value); // Update the input value state
    };

    const handleSubmit = async () => {
      try {
        console.log("I am here")
        // Step 1: Get the token
        const tokenResponse = await fetch(`${config.middlewareAPI}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'username': 'smartcity_water',
            'password': 'WaterQualityNode'
          })
        });
    
        if (!tokenResponse.ok) {
          throw new Error('Failed to fetch token');
        }
    
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;
        console.log(token);
    
        // Step 2: Use the token in the next request
        const updateResponse = await fetch(`${config.middlewareAPI}/coefficients/${nodeId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model_name: nodeId,
            coefficients: inputValue
          })
        });
    
        if (!updateResponse.ok) {
          throw new Error('Failed to update coefficients');
        }
    
        const updateData = await updateResponse.json();
        console.log('Update response:', updateData);
    
        // Reset the state
        setSelectedButton(null);
        setInputValue('');
      } catch (error) {
        console.error('Error:', error);
      }
    };
    


    let nodeImage, nodeType, ControlNode;
    switch (nodeId) {
      case "DM-KH98-60":
        nodeType = "Motor";
        ControlNode = "DM-KH98-80";
        nodeImage = MotorNode;
        break;
      case "WM-WL-KH00-00":
      case "WM-WL-KH98-00":
        nodeImage = WaterLevelNode;
        break;
      case "WM-WD-KH98-00":
      case "WM-WD-KH96-02":
      case "WM-WD-KH96-00":
      case "WM-WD-KH95-00":
      case "WM-WD-KH03-00":
      case "WM-WD-KH96-01":
        nodeImage = WaterQualityNode;
        break;
      default:
        nodeImage = WaterQuantityNode;
        break;
    }

    const handleNodeClick = () => {
      setShowPopup(true);
    };

    return (
      <>
      <img
        src={nodeImage}
        alt={`${nodeId} Node`}
        style={{
        width: "3vw",
        height: "3vw",
        position: "absolute",
        
        }}
        className={isOn ? "node-on" : "node-off"}
        onClick={handleNodeClick}
      />

      {showPopup && (
        <div className="PopUpContent" id="PopUpPopup" style={{zIndex:100}}>
        <button className="close" onClick={handleCloseButtonClick}>✖</button>
        <img src={nodeImage} alt="PopUp-img" />
        <p>Clicked Node: {nodeId}</p>
        <div className="buttons-row">
          <button className="accept" onClick={() => NodeActuation(nodeId, 1)}>Turn On</button>
          <button className="accept" onClick={() => NodeActuation(nodeId, 2)}>Power Reset</button>
          <button className="accept" onClick={() => NodeActuation(nodeId, 3)}>Node Reset</button>
          <button className="accept" onClick={() => handleButtonClick(4)}>Update Calibrated Values</button>
        </div>
          {selectedButton === 4 && (
            <div>
              {/* <label htmlFor="calibratedvalues" className="input-label">Enter Calibrated Values:</label> */}
              <input type="text" onChange={handleChange} name="calibratedvalues" value={inputValue} className="input-field" placeholder="[5.6,4.3,2.8,.....]"/><br></br>
              <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>
          )}
          </div>
      )}
      </>
    );
  };


  const Box = ({ color, src }) => (
    <div style={{
      flex: 1,
      backgroundColor: color,
      margin: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <iframe src={src} width="120%" height="120%" style={{ border: 'none' }}></iframe>
    </div>
  );

  const fetchNodeData = async (tableName) => {
    console.log("Fetching data for", tableName);
    try {
      const jsonData = await getRealData(tableName);
      if (typeof jsonData !== 'object' || jsonData === null) {
        console.log("No valid data available for", tableName);
        return; // Exit the function if no valid data is available
      }

      // Create a table element
      const table = document.createElement('table');
      // Keep the table name as heading for the box
      const heading = document.createElement('h2');
      heading.textContent = tableName;
      table.appendChild(heading);
      // Create table header row
      const headerRow = document.createElement('tr');
      // Create table header cells
      const headers = ['Parameter', 'Value', 'Units']; // Modify the headers here
      // Add styles to the table
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      // Add styles to table headers
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid black';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2'; // Example background color for headers
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow); // Append the header row to the table
  
      // Similarly, add styles to cells in the body
      Object.entries(jsonData).forEach(([key, value]) => {
        if (key === 'timestamp') {
          return; // Skip the key 'timestamp'
        }
        const row = document.createElement('tr');
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        keyCell.style.border = '1px solid black';
        keyCell.style.padding = '8px';
        const valueCell = document.createElement('td');
        if (key === 'creationtime' && value !== null) {
          value = value.replace('+00:00', '+05:30'); // Replace the timezone offset only if value is not null
        }
        valueCell.textContent = value;
        valueCell.style.border = '1px solid black';
        valueCell.style.padding = '8px';
        const unitCell = document.createElement('td');
        unitCell.textContent = units[key] || ''; // Get the unit from the units object, or leave it empty if not found
        unitCell.style.border = '1px solid black';
        unitCell.style.padding = '8px';
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        row.appendChild(unitCell);
        table.appendChild(row);
      });
      // Display the table in a suitable container or console.log for debugging
      console.log(table.outerHTML); // For debugging, replace with your actual display logic
      const tableContainer = document.getElementById("tableContainer"); // Get the table container element
      tableContainer.innerHTML = ""; // Clear the table container
      tableContainer.appendChild(table); // Append the table to the table container
  
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'buttonContainer'; // Use the class name for styling
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'space-around'; // Adjust as needed
      buttonContainer.style.marginTop = '20px'; // Space above the buttons
  
      // Create buttons
      const buttonsInfo = [
        { text: 'Turn On', id: 'turnOnButton', onClick: () => NodeActuation(tableName, 1) },
        { text: 'Power Reset', id: 'powerResetButton', onClick: () => NodeActuation(tableName, 2) },
        { text: 'Node Reset', id: 'nodeResetButton', onClick: () => NodeActuation(tableName, 3) },
        { text: 'Update Calibrated Values', id: 'updateValuesButton', onClick: () => console.log('Update Calibrated Values clicked') }
      ];
  
      buttonsInfo.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.textContent = buttonInfo.text;
        button.id = buttonInfo.id;
        button.addEventListener('click', buttonInfo.onClick); // Attach event listener
        // Optional: Add classes or styles to button
        button.style.padding = '10px 20px';
        button.style.margin = '0 10px'; // Adjust spacing between buttons
        button.style.cursor = 'pointer';
        buttonContainer.appendChild(button);
      });
  
      // Append the button container to the table container or directly to the modal
      tableContainer.appendChild(buttonContainer);
      const modal = document.getElementById("myModal"); // Get the modal element
      modal.style.display = "block"; // Show the modal after fetching and displaying the data
    } catch (error) {
      console.error(error);
    }
  };

  // function InteractiveIcon({ src, alt, onClick, fetchNodeDataParam }) {
  //   const iconStyle = {
  //     width: "2vw",
  //     height: "2vw",
  //     transition: "transform 0.3s, filter 0.3s", // Smooth transition for transform and filter
  //     zIndex:10,
  //     cursor: "pointer" // Change cursor to indicate it's clickable
  //   };
  
  //   const handleMouseOver = (e) => {
  //     e.currentTarget.style.transform = "scale(1.2)"; // Zoom effect
  //     e.currentTarget.style.filter = "brightness(0.5)"; // Change color effect
  //     if (isOn[fetchNodeDataParam]) {
  //       e.currentTarget.style.backgroundColor = "green"; // Change background color to green if node is on
  //     } else {
  //       e.currentTarget.style.backgroundColor = "red"; // Change background color to red if node is off
  //     }
  //   };
  
  //   const handleMouseOut = (e) => {
  //     e.currentTarget.style.transform = "scale(1)"; // Return to normal size
  //     e.currentTarget.style.filter = "none"; // Remove color change effect
  //     e.currentTarget.style.backgroundColor = "transparent"; // Reset background color
  //   };
  
  //   return (
  //     <div style={{ position: "absolute"}}>
  //     <img
  //       src={src}
  //       alt={alt}
  //       style={iconStyle}
  //       onClick={() => onClick(fetchNodeDataParam)}
  //       onMouseOver={handleMouseOver}
  //       onMouseOut={handleMouseOut}
  //     />
  //   </div>
  //   );
  // }
  

  function InteractiveIcon({ src, alt, onClick, fetchNodeDataParam }) {
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    useEffect(() => {
      // Update backgroundColor based on isOn[fetchNodeDataParam]
      const newColor = isOn[fetchNodeDataParam] ? 'green' : 'red';
      setBackgroundColor(newColor);
    }, [isOn, fetchNodeDataParam]); 

    const iconStyle = {
      width: "2vw",
      height: "2vw",
      transition: "transform 0.3s, filter 0.3s", // Smooth transition for transform and filter
      zIndex: 10,
      cursor: "pointer", // Change cursor to indicate it's clickable
      backgroundColor: backgroundColor // Dynamic background color
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
      </div>
    );
  }

  return (
    <div className='page'>
      <NavigationBar title="Digital Twin for Water Quality " style={{position:'fixed'}} />
      <div style={{ display: "flex"}} className='Page'>
        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '40vw', border: "0px" }}>

          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=24" />
          {/* <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=17" /> */}
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=9" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=20" />
        </div>

        <div style={{ height: "46vw", width: "100%",display: "flex", flex:3, justifyContent: "center", alignItems: "center"}} className='canvas'>
            <div>
              <div>
              <div id="myModal" className="modal" style={{
                  position: 'fixed', // Keeps the modal above all other content
                  top: '50%', // Centers vertically
                  left: '50%', // Centers horizontally
                  transform: 'translate(-50%, -50%)', // Adjusts for the modal's dimensions
                  width: '60vw',
                  zIndex: 1000, // Ensures it's on top of everything
                  }}>
                <div className="modal-content">
                  <span className="close" onClick={() => closeModal()}>&times;</span>
                  <div id="tableContainer"></div>
                </div>
              </div>
                <div style={{ position: 'relative', width: '60vw',height: '20vw',border: '',}}>
                  <SimulationCanvas
                    handleIconClick={handleIconClick}
                    iconRefs={iconRefs}
                    flow1={flow1}
                    flow2={flow2}
                    flow3={flow3}
                    flow4={flow4}
                    flow5={flow5}
                    flow6={flow6}
                    flow7={flow7}
                    flow8={flow8}
                    flow9={flow9}
                    setFlow1={setFlow1}
                    setFlow2={setFlow2} 
                    waterInSump={waterInSump}
                    sumpCapacity={sumpMeasurements.length * sumpMeasurements.breadth * sumpMeasurements.height*1000}
                    waterInOHT={waterInOHT}
                    ohtCapacity={ohtMeasurements.length * ohtMeasurements.breadth * ohtMeasurements.height*1000}
                    waterInROFilter={waterInROFilter}
                    toggleIsOn={toggleIsOn}
                    motorOn={motorOn}
                    waterConsumed={waterConsumed}
                    flowrate={flowrate}
                  />
                  {/* IoT Nodes  */}
                  <div style={{ position: "absolute", top: "12.5vw", left: "14vw", textAlign: "center" }}>
                    {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => fetchNodeData('WM-WD-KH98-00')} /> */}
                    <InteractiveIcon src={WaterQualityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WD-KH98-00'  className={isOn['WM-WD-KH98-00'] ? "node-on" : "node-off"}/>
                  </div>

                  <div style={{ position: "absolute", top: "2vw", left: "30vw", textAlign: "center" }}>
                    {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw", zIndex:5 }} onClick={()=> fetchNodeData('WM-WD-KH96-00')} /> */}
                    <InteractiveIcon src={WaterQualityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WD-KH96-00'  className={'node-off'}/>
                  </div>

                  <div style={{ position: "absolute", top: "6.5vw", left: "50.6vw", textAlign: "center" }}>
                    {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WD-KH96-01')} /> */}
                    <InteractiveIcon src={WaterQualityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WD-KH96-01'/>
                  </div>

                  <div style={{ position: "absolute", top: "8vw", left: "55vw", textAlign: "center" }}>
                    {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WD-KH96-02')} /> */}
                    <InteractiveIcon src={WaterQualityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WD-KH96-02'/>
                  </div>

                  <div style={{ position: "absolute", top: "15vw", left: "52.3vw", textAlign: "center" }}>
                    {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> fetchNodeData('WM-WD-KH95-00')} /> */}
                    <InteractiveIcon src={WaterQualityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WD-KH95-00'/>
                  </div>

                  <div style={{ position: "absolute", top: "15vw", left: "57.9vw", textAlign: "center" }}>
                    {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> fetchNodeData('WM-WD-KH03-00')} /> */}
                    <InteractiveIcon src={WaterQualityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WD-KH03-00'/>
                  </div>

                  <div style={{ position: "absolute", top: "8vw", left: "14vw", textAlign: "center" }}>
                    {/* <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WL-KH98-00')} /> */}
                    <InteractiveIcon src={WaterLevelNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WL-KH98-00'/>
                  </div>

                  <div style={{ position: "absolute", top: "2vw", left: "33vw", textAlign: "center" }}>
                    {/* <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WL-KH00-00')} /> */}
                    <InteractiveIcon src={WaterLevelNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WL-KH00-00'/>
                  </div>

                  <div style={{ position: "absolute", top: "10vw", left: "22vw", textAlign: "center", zIndex: 2 }}>
                    {/* <img src={MotorNode} alt="MotorNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('DM-KH98-60')} /> */}
                    <InteractiveIcon src={MotorNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='DM-KH98-60'/>
                  </div>

                  <div style={{ position: "absolute", top: "7vw", left: "9vw", textAlign: "center",transform: "rotate(90deg)", zIndex: 2 }}>
                    {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => fetchNodeData('WM-WF-KH98-40')} /> */}
                    <InteractiveIcon src={WaterQuantityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WF-KH98-40'/>
                  </div>

                  <div style={{ position: "absolute", top: "7.7vw", left: "29vw", textAlign: "center",transform: "rotate(90deg)", zIndex: 2 }}>
                    {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WF-KH95-40')} /> */}
                    <InteractiveIcon src={WaterQuantityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WF-KH95-40'/>
                  </div>

                  <div style={{ position: "absolute", top: "7.2vw", left: "42vw", textAlign: "center", transform: "rotate(90deg)", zIndex: "2" }}>
                    {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WF-KB04-70')} /> */}
                    <InteractiveIcon src={WaterQuantityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WF-KB04-70'/>
                  </div>

                  <div style={{ position: "absolute", top: "7.2vw", left: "48vw", textAlign: "center", transform: "rotate(90deg)", zIndex: "2"  }}>
                    {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> fetchNodeData('WM-WF-KB04-73')} /> */}
                    <InteractiveIcon src={WaterQuantityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WF-KB04-73'/>
                  </div>

                  <div style={{ position: "absolute", top: "11vw", left: "54vw", textAlign: "center", transform: "rotate(90deg)" }}>
                    {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> fetchNodeData('WM-WF-KB04-71')} /> */}
                    <InteractiveIcon src={WaterQuantityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WF-KB04-71'/>
                  </div>

                  <div style={{ position: "absolute", top: "11vw", left: "60vw", textAlign: "center", transform: "rotate(90deg)" }}>
                    {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> fetchNodeData('WM-WF-KB04-72')} /> */}
                    <InteractiveIcon src={WaterQuantityNode} alt="WaterQuantityNode" onClick={fetchNodeData} fetchNodeDataParam='WM-WF-KB04-72'/>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', flex:1, height: '15vw' }}>
                <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=17" />
                <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" />
              </div>
            </div>
        </div>

        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '40vw' }}>
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=22" />
          {/* <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" /> */}
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=10" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=21" />
        </div>
      </div>
    </div>
  );
};

export default RealValueVisualisation;