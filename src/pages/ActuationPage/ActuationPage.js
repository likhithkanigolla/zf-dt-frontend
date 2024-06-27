// ActuationPage.js
import React, { useState, useEffect } from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';
import LoginPage from '../LoginPage/LoginPage';

import ZshapePipe from '../SimulationPage/components/ZshapePipe';
import MirrorZPipe from '../SimulationPage/components/MirrorZPipe';
import StraightPipe from '../SimulationPage/components/StraightPipe';
import LShapePipe from '../SimulationPage/components/LShapePipe';
import EShapePipe from '../SimulationPage/components/EShapePipe';

import roPlantImage from "../images/ro_plant.png";
import roCoolerImage from "../images/ro_cooler.png";
import Motor from "../images/Motor.png";
import SumpIcon from "../images/Sump.png";
import PumpHouse from "../images/pump_house.png";
import Borewell from "../images/borewell.png";
import Watertank from "../images/watertank.png";
import ROWatertank from "../images/tank_ro.png";
import Washrooms from "../images/Washrooms.png";

import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import LeakageIcon from "../images/borewell.png"; 
import SimulationCanvas from '../SimulationPage/components/SimulationCanvas';
import { saveAs } from 'file-saver';
import ConsoleHeader from  '../SimulationPage/components/Console';

import 'react-toastify/dist/ReactToastify.css';
 
import { ToastContainer, toast } from 'react-toastify';
import { CgLayoutGrid } from 'react-icons/cg';

import config from '../../config';



const ActuationPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputValues, setInputValues] = useState({
    number1: '',
    number2: '',
    number3: '',
    number4: ''
  });
  const [result, setResult] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const [isOn, setIsOn] = useState({
    "WM-WL-KH98-00": false,
    "WM-WL-KH00-00": false,
    "DM-KH98-60": false,

    "WM-WD-KH98-00": false,
    "WM-WD-KH96-00": false,
    "WM-WD-KH04-00": false,
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

  const nodePositions = {
    "WM-WL-KH98-00": {width: '2vw',height: '2vw', position: 'absolute', top: "14vw", left: "32vw" },
    "WM-WL-KH00-00": {width: '2vw',height: '2vw', position: 'absolute', top: '13vw', left: '49vw' },
    "DM-KH98-60"  :  {width: '2vw',height: '2vw', position: 'absolute', top: '18.5vw', left: '41vw',  zIndex: '3'},
    "WM-WD-KH98-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '18vw', left: '30vw' ,  zIndex: '3'}, //sump
    "WM-WD-KH96-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '16vw', left: '48vw',  zIndex: '3'}, //oht
    "WM-WD-KH96-01" : {width: '2vw',height: '2vw', position: 'absolute', top: '17.9vw', left: '54vw' }, //after oht
    "WM-WD-KH03-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '28vw', left: '67.3vw' }, //ro 2
    "WM-WD-KH95-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '28vw', left: '62vw' },  //faculty launge
    "WM-WD-KH04-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '21vw', left: '60vw' }, //after ro
    "WM-WF-KB04-71" : {width: '2vw',height: '2vw', position: 'absolute', top: '25vw', left: '62vw', transform: 'rotate(90deg)'},
    "WM-WF-KB04-72" : {width: '2vw',height: '2vw', position: 'absolute', top: '25vw', left: '67.5vw', transform: 'rotate(90deg)'}, 
    "WM-WF-KB04-70" : {width: '2vw',height: '2vw', position: 'absolute', top: '8.5vw', left: '52vw'},
    "WM-WF-KB04-73" : {width: '2vw',height: '2vw', position: 'absolute', top: '13vw', left: '54vw'},   
    "WM-WF-KH95-40" : {width: '2vw',height: '2vw', position: 'absolute', top: '12vw', left: '26vw', transform: 'rotate(90deg)', zIndex: '3'},
    "WM-WF-KH98-40" : {width: '2vw',height: '2vw', position: 'absolute', top: '15vw', left: '43vw',transform: 'rotate(90deg)',  zIndex: '3'},   
  };
  // const handleDownloadLog = () => {
  //   const blob = new Blob([log.join('\n')], { type: 'text/plain;charset=utf-8' });
  //   saveAs(blob, 'simulation_log.txt');
  // };
  // Debug Statements for Printing the usestate
  const [log, setLog] = useState([]); 
  const updateLog = (message) => {
    setLog((prevLog) => [...prevLog, `${new Date().toISOString()}: ${message}`]);
  };
  const handleDownloadLog = () => {
    const blob = new Blob([log.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'actuation_log.txt');
  };
  const AllNodes = () => {
    return (
      <div>
        <h1>All Nodes</h1>
        {Object.keys(isOn).map((node_id) => {
          //   console.log("Here: ", node_id)
          return (
            <p key={node_id}>
              {node_id}: {isOn[node_id].toString()}{" "}
              {/* Convert boolean to string */}
            </p>
          );
        })}
      </div>
    );
  };

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
        updateLog(message);  // Customize message as needed
        // sendTelegramNotification(message);
        // toast.info("Alert sent to the telegram");  // Notification after sending to Telegram
      }
      
      // Check TDS value for WM-WD-KH98-00 node
      if ((nodeId === "WM-WD-KH98-00" && data.compensated_tds > 500) || data.compensated_tds < 50 ) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        updateLog(tdsAlertMessage);  // Display toast alert
        console.log(tdsAlertMessage)
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if ((nodeId === "WM-WD-KH96-00" && data.compensated_tds > 500) || data.compensated_tds < 50 ) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        updateLog(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if ((nodeId === "WM-WD-KH04-00" && data.compensated_tds > 150) || data.compensated_tds < 50 ) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        updateLog(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if ((nodeId === "WM-WD-KH95-00" && data.compensated_tds > 150) || data.compensated_tds < 50 ) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        updateLog(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if ((nodeId === "WM-WD-KH96-01" && data.compensated_tds > 500) || data.compensated_tds < 50 ) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        updateLog(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
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
    console.log("Done"); 
  };

  useEffect(() => {
    // Call getNodeStatus for each node when the component mounts
    const nodeIds = Object.keys(isOn);
    updateNodeStatus(nodeIds)
    const token = localStorage.getItem('token');
    if (token) {
        setIsAuthenticated(true);
    }

    // const interval = setInterval(() => {
    //     getNodeStatus('WM-WF-KB04-72', '15m');
    //   }, 5000);
  }, []);
  if (!isAuthenticated) {
    return <LoginPage />;
}


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
      case "WM-WD-KH04-00":
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
        ...(nodePositions[nodeId] || {}),
        }}
        className={isOn ? "node-on" : "node-off"}
        onClick={handleNodeClick}
      />

      {showPopup && (
        <div className="PopUpContent" id="PopUpPopup" style={{zIndex:100}}>
        <button className="close" onClick={handleCloseButtonClick}>✖</button>
        <img src={nodeImage} alt="PopUp-img" />
        <p>Clicked Node: {nodeId}</p>
        <button className="accept" onClick={() => NodeActuation(nodeId, 1)}>Turn On</button>
        <button className="accept" onClick={() => NodeActuation(nodeId, 2)}>Power Reset</button>
        <button className="accept" onClick={() => NodeActuation(nodeId, 3)}>Node Reset</button>
        <button className="accept" onClick={() => handleButtonClick(4)}>Update Calibrated Values</button>
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
  
  

  return (
    <div className="actuation-page">
      {/* <h2>Actuation Page</h2> */}
      <NavigationBar title="Digital Twin for Water Quality - Actuation" />
      <div style={{ display: "flex"}} className='Page'>
        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '45vw' }}>
        <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=17" />
        <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=9" />
        <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=24" />
        <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=20" />
      </div>
        <div>
      {/* <img src={blueprint} alt="blueprint" style={{ width: '100vw', height: '34vw', marginTop: '5vw' }} /> */}
      {/* Components */}
        <div style={{ height: "30vw", display: "flex",flex:3, justifyContent: "flex-start", alignItems: "flex-start" }}>
          {/* Box for the actuation display */}
          
          <div style={{position: "relative", width: "65vw", height: "30vw", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
          <div className="demo-page"> 
              <div style={{ position: "absolute", top: "-3.5vw", left: "3vw"}} id="pumpHouseIcon">
                <img src={PumpHouse} alt="sump" style={{ width: "4.8vw", height: "4.8vw" }}/>
                <div style={{ fontSize: "1vw" }}>PumpHouse</div>
              </div>

              {/* Z Shape Pipe Pumphouse to Sump*/}
              <div style={{ position: "absolute", top: "-2vw", left: "7.4vw" }}>
                <ZshapePipe/>
              </div>

              {/* Mirror Z Pipe Borewell to Sump */}
              <div style={{ position: "absolute", top: "6vw", left: "8.4vw" }}>
                <MirrorZPipe style={{ width: "4.8vw", height: "4.8vw" }}/>
              </div>

              {/* Borewell */}
              <div id="borewellIcon" style={{ position: "absolute", top: "8.8vw", left: "3.8vw" }}>
                <img src={Borewell} alt="borewell" style={{ width: "4.8vw", height: "4.8vw" }}/>
                <div style={{ fontSize: "1vw" }}>Borewell</div>
              </div>

              {/* Straight Pipes Sump to Motor*/}
              <div>
                <div style={{ position: "absolute", top: "11vw", left: "25vw" }}>
                  <StraightPipe/>
                </div>

                {/* SUMP */}
                <div style={{ position: "absolute", top: "3vw", left: "12vw", textAlign: "center" }}>
                  <img src={SumpIcon} alt="sump" style={{ width: "7vw", height: "8.5vw" }} />
                </div>

                <div style={{ position: "absolute", top: "2.3vw", left: "25.5vw" }}>
                  <MirrorZPipe/>
                </div>

                {/* Motor */}
                <div style={{ position: "absolute", top: "7.5vw", left: "22vw", textAlign: "center", width: "5.8vw"}}>
                  <img src={Motor} alt="Motor" className={`motor`}style={{ width: "3vw", height: "3vw", transform: "scaleX(-1)"}}/>
                  <div style={{ fontSize: "1vw" }}>Motor</div>
                </div>

                {/* L Shape Pipe  OHT to RO PIPE*/}
                <div style={{ position: "absolute", top: "5.6vw", left: "32.2vw", transform: "rotate(180deg)" }}>
                  <LShapePipe/>
                </div>

                {/* L Shape Pipe OHT to Admin Block Washrooms*/}
                <div style={{ position: "absolute", top: "4.5vw", left: "31.8vw", transform: "rotate(90deg)" }}>
                  <LShapePipe/>
                </div>
                    
                <div style={{ position: "absolute", top: "-4.5vw", left: "34.3vw", textAlign: "center" }}>
                  <img src={Washrooms} alt="WaterTank" style={{ width: "3.8vw", height: "3.8vw" }} />
                  <div style={{ fontSize: "1vw" }}>Admin Block Washrooms</div>
                </div>

                <div style={{ position: "absolute", top: "1.2vw", left: "38vw", textAlign: "center" }}>
                  <img src={Washrooms} alt="WaterTank" style={{ width: "3.8vw", height: "3.8vw" }} />
                  <div style={{ fontSize: "1vw" }}>KRB Washrooms</div>
                </div>

                {/* Straight Pipe OHT to KRB Washrooms */}
                <div style={{ position: "absolute", top: "5vw", left: "41vw" }}>
                  <StraightPipe/>
                </div>

                {/* Water Tower */}
                <div style={{ position: "absolute", top: "2vw", left: "29vw",textAlign: "center"}}>
                  <img src={Watertank} alt="WaterTank" style={{ width: "7vw", height: "7vw" }}/>
                  <div style={{ fontSize: "1vw" }}>KRB OHT</div>
                </div>

                {/* Straight Pipe RO Plant to RO OHT*/}
                <div style={{ position: "absolute", top: "13.2vw", left: "48.5vw" }}>
                  <StraightPipe/>
                </div>

                {/* RO Plant */}
                <div style={{ position: "absolute", top: "9vw", left: "37.2vw" }}>
                  <img src={roPlantImage} alt="ro plant" style={{ width: "4.8vw", height: "4.8vw" }}/>
                  <div style={{ fontSize: "1vw" }}>RO Plant</div>
                </div>

                {/* E Shape Pipe RO OHT to Ro Filters*/}
                <div style={{ position: "absolute", top: "19vw", left: "51.7vw" }}>
                  <EShapePipe/>
                </div>

                {/* Water Tower */}
                <div style={{ position: "absolute", top: "7.7vw", left: "43.5vw" , textAlign: "center"}}>
                  <div style={{ fontSize: "1vw" }}>RO Filtered Water OHT</div>
                  <img src={ROWatertank} alt="WaterTank" style={{ width: "5vw", height: "5vw" }}/>
                </div>

                {/* RO Coolers */}
                <div style={{ position: "absolute", top: "16.8vw", left: "43.9vw", textAlign: "center", }} >
                  <img src={roCoolerImage} alt="ro cooler 1" style={{ width: "3.8vw", height: "3.8vw" }}/>
                  <div style={{ fontSize: "1vw" }}>RO 1</div>
                </div>

                <div style={{ position: "absolute", top: "16.8vw", left: "46.6vw", textAlign: "center", }}>
                  <img src={roCoolerImage} alt="ro cooler 2" style={{ width: "3.8vw", height: "3.8vw" }} />
                  <div style={{ fontSize: "1vw" }}>RO 2</div>
                </div>

                <div style={{ position: "absolute", top: "16.8vw", left: "49.3vw", textAlign: "center", }}>
                  <img src={roCoolerImage} alt="ro cooler 3" style={{ width: "3.8vw", height: "3.8vw" }}/>
                  <div style={{ fontSize: "1vw" }}>RO 3</div>
                </div>
                
              </div>
              
      
            </div>
          </div>
        </div>
      {Object.entries(isOn).map(([nodeId, isNodeOn]) => (<Node key={nodeId} nodeId={nodeId} isOn={isNodeOn} />))}
      <ConsoleHeader handleDownloadLog={handleDownloadLog} log={log}/>
        </div>
        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '45vw' }}>
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=10" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=22" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=21" />
        </div>
      </div>
      <div>
        {/* <ConsoleHeader handleDownloadLog={handleDownloadLog} log={log}/> */}
              {/* {<div className="custom-toast-container">
              
      <ToastContainer 
         position="bottom-center"
         autoClose={false}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
         className="horizontal-toasts"
         toastClassName="toast-item" }

      /> */}
      </div>
    </div>
    
  );
}

export default ActuationPage;