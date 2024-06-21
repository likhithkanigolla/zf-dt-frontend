// ActuationPage.js
import React, { useState, useEffect } from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';

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

import 'react-toastify/dist/ReactToastify.css';
 
import { ToastContainer, toast } from 'react-toastify';

// const backendAPI = "http://localhost:1629";
const backendAPI = "http://smartcitylivinglab.iiit.ac.in:1629";

const ActuationPage = () => {
  
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
    "WM-WL-KH98-00": {width: '2vw',height: '2vw', position: 'absolute', top: "24vw", left: "38vw" },
    "WM-WL-KH00-00": {width: '2vw',height: '2vw', position: 'absolute', top: '19vw', left: '54vw' },
    "DM-KH98-60"  :  {width: '2vw',height: '2vw', position: 'absolute', top: '26vw', left: '46vw'},
    "WM-WD-KH98-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '26vw', left: '34.8vw' }, //sump
    "WM-WD-KH96-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '22vw', left: '53vw' }, //oht
    "WM-WD-KH96-01" : {width: '2vw',height: '2vw', position: 'absolute', top: '24vw', left: '59.5vw' }, //after oht
    "WM-WD-KH03-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '38vw', left: '73vw' }, //ro 2
    "WM-WD-KH95-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '38vw', left: '67vw' },  //faculty launge
    "WM-WD-KH04-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '29vw', left: '65vw' }, //after ro
    "WM-WF-KB04-71" : {width: '2vw',height: '2vw', position: 'absolute', top: '34vw', left: '67.5vw', transform: 'rotate(90deg)'},
    "WM-WF-KB04-72" : {width: '2vw',height: '2vw', position: 'absolute', top: '34vw', left: '73vw', transform: 'rotate(90deg)'}, 
    "WM-WF-KB04-70" : {width: '2vw',height: '2vw', position: 'absolute', top: '13vw', left: '57vw'},
    "WM-WF-KB04-73" : {width: '2vw',height: '2vw', position: 'absolute', top: '19vw', left: '59vw'},   
    "WM-WF-KH95-40" : {width: '2vw',height: '2vw', position: 'absolute', top: '20vw', left: '32vw', transform: 'rotate(90deg)', zIndex: '3'},
    "WM-WF-KH98-40" : {width: '2vw',height: '2vw', position: 'absolute', top: '23vw', left: '48.5vw',transform: 'rotate(90deg)'},   
  };

  // Debug Statements for Printing the usestate
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

  useEffect(() => {
    // Call getNodeStatus for each node when the component mounts
    const nodeIds = Object.keys(isOn);
    updateNodeStatus(nodeIds)

    // const interval = setInterval(() => {
    //     getNodeStatus('WM-WF-KB04-72', '15m');
    //   }, 5000);
  }, []);

  const updateNodeStatus = async (nodeIds) => {
    let tmpIsOn = {};
    for (let idx in nodeIds) {
      tmpIsOn[nodeIds[idx]] = await getNodeStatus(nodeIds[idx], "6h");
    }
    console.log(tmpIsOn);
    setIsOn(tmpIsOn);
    console.log("Done"); 
  };

  const getNodeStatus = async (nodeId, time) => {
    try {
      const response = await fetch(
        `${backendAPI}/get_value?table_name=${nodeId}`
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
        toast.error(message);  // Customize message as needed
        // sendTelegramNotification(message);
        // toast.info("Alert sent to the telegram");  // Notification after sending to Telegram
      }
      // Check TDS value for WM-WD-KH98-00 node
      if (nodeId === "WM-WD-KH98-00" && data.compensated_tds > 500) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        toast.error(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if (nodeId === "WM-WD-KH96-00" && data.compensated_tds > 500) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        toast.error(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if (nodeId === "WM-WD-KH04-00" && data.compensated_tds > 150) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        toast.error(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      if (nodeId === "WM-WD-KH95-00" && data.compensated_tds > 150) {
        const tdsAlertMessage = `Alert! Node ${nodeId} TDS value is ${data.compensated_tds}`;
        toast.error(tdsAlertMessage);  // Display toast alert
        // sendTelegramNotification(tdsAlertMessage);  // Send Telegram alert
        // toast.info("TDS Alert sent to the telegram");  // Notification after sending to Telegram
      }
      return timeDifference <= parseTime(time);
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
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

  const NodeActuation = async (nodeType, nodeName, status) => {
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
        `${backendAPI}/actuation/${nodeType}/${nodeName}/${status}`,
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

    const handleSubmit = () => {
      NodeActuation(nodeType, ControlNode, inputValue); // Call the function with the input value
      setSelectedButton(null); // Optionally, reset the selected button state
      setInputValue(''); // Clear the input value
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
        <div className="PopUpContent" id="PopUpPopup">
        <button className="close" onClick={handleCloseButtonClick}>✖</button>
        <img src={nodeImage} alt="PopUp-img" />
        <p>Clicked Node: {nodeId}</p>
        <button className="accept" onClick={() => NodeActuation(nodeType, ControlNode, 1)}>Turn On</button>
        <button className="accept" onClick={() => NodeActuation(nodeType, ControlNode, 2)}>Power Reset</button>
        <button className="accept" onClick={() => NodeActuation(nodeType, ControlNode, 3)}>Node Reset</button>
        <button className="accept" onClick={() => UpdateCoef(nodeType,ControlNode)}>Update Calibrated Values</button>
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
        <div style={{ height: "46vw", display: "flex",flex:3, justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", position: 'relative', width: '55vw', height: '45vw', border: '1px solid black', justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div className="demo-page">
              <div style={{ position: "absolute", top: "7vw", left: "3.9vw"}} id="pumpHouseIcon">
                <img src={PumpHouse} alt="sump" style={{ width: "4.8vw", height: "4.8vw" }}/>
                <div style={{ fontSize: "1vw" }}>PumpHouse</div>
              </div>

              {/* Z Shape Pipe Pumphouse to Sump*/}
              <div style={{ position: "absolute", top: "8.5vw", left: "7.9vw" }}>
                <ZshapePipe/>
              </div>

              {/* Mirror Z Pipe Borewell to Sump */}
              <div style={{ position: "absolute", top: "16vw", left: "8vw" }}>
                <MirrorZPipe style={{ width: "4.8vw", height: "4.8vw" }}/>
              </div>

              {/* Borewell */}
              <div id="borewellIcon" style={{ position: "absolute", top: "19vw", left: "3.8vw" }}>
                <img src={Borewell} alt="borewell" style={{ width: "4.8vw", height: "4.8vw" }}/>
                <div style={{ fontSize: "1vw" }}>Borewell</div>
              </div>

              {/* Straight Pipes Sump to Motor*/}
              <div>
                <div style={{ position: "absolute", top: "20.6vw", left: "25vw" }}>
                  <StraightPipe/>
                </div>

                {/* SUMP */}
                <div style={{ position: "absolute", top: "13vw", left: "12vw", textAlign: "center" }}>
                  <img src={SumpIcon} alt="sump" style={{ width: "7vw", height: "8.5vw" }} />
                </div>

                <div style={{ position: "absolute", top: "11.8vw", left: "25.5vw" }}>
                  <MirrorZPipe/>
                </div>

                {/* Motor */}
                <div style={{ position: "absolute", top: "17vw", left: "22vw", textAlign: "center", width: "5.8vw"}}>
                  <img src={Motor} alt="Motor" className={`motor`}style={{ width: "3vw", height: "3vw", transform: "scaleX(-1)"}}/>
                  <div style={{ fontSize: "1vw" }}>Motor</div>
                </div>

                {/* L Shape Pipe  OHT to RO PIPE*/}
                <div style={{ position: "absolute", top: "12vw", left: "32.2vw", transform: "rotate(180deg)" }}>
                  <LShapePipe/>
                </div>

                {/* L Shape Pipe OHT to Admin Block Washrooms*/}
                <div style={{ position: "absolute", top: "10.5vw", left: "31.8vw", transform: "rotate(90deg)" }}>
                  <LShapePipe/>
                </div>
                    
                <div style={{ position: "absolute", top: "2vw", left: "34.3vw", textAlign: "center" }}>
                  <div style={{ fontSize: "1vw" }}>Admin Block Washrooms</div>
                  <img src={Washrooms} alt="WaterTank" style={{ width: "3.8vw", height: "3.8vw" }} />
                </div>

                <div style={{ position: "absolute", top: "7.8vw", left: "38.2vw", textAlign: "center" }}>
                  <img src={Washrooms} alt="WaterTank" style={{ width: "3.8vw", height: "3.8vw" }} />
                  <div style={{ fontSize: "1vw" }}>KRB Washrooms</div>
                </div>

                {/* Straight Pipe OHT to KRB Washrooms */}
                <div style={{ position: "absolute", top: "13vw", left: "41vw" }}>
                  <StraightPipe/>
                </div>

                {/* Water Tower */}
                <div style={{ position: "absolute", top: "9vw", left: "29vw",textAlign: "center"}}>
                  <img src={Watertank} alt="WaterTank" style={{ width: "7vw", height: "7vw" }}/>
                  <div style={{ fontSize: "1vw" }}>KRB OHT</div>
                </div>

                {/* Straight Pipe RO Plant to RO OHT*/}
                <div style={{ position: "absolute", top: "23.2vw", left: "48.7vw" }}>
                  <StraightPipe/>
                </div>

                {/* RO Plant */}
                <div style={{ position: "absolute", top: "17vw", left: "37.2vw" }}>
                  <img src={roPlantImage} alt="ro plant" style={{ width: "4.8vw", height: "4.8vw" }}/>
                  <div style={{ fontSize: "1vw" }}>RO Plant</div>
                </div>

                {/* E Shape Pipe RO OHT to Ro Filters*/}
                <div style={{ position: "absolute", top: "30vw", left: "52vw" }}>
                  <EShapePipe/>
                </div>

                {/* Water Tower */}
                <div style={{ position: "absolute", top: "16.7vw", left: "43.5vw" , textAlign: "center"}}>
                  <div style={{ fontSize: "1vw" }}>RO Filtered Water OHT</div>
                  <img src={ROWatertank} alt="WaterTank" style={{ width: "5vw", height: "5vw" }}/>
                </div>

                {/* RO Coolers */}
                <div style={{ position: "absolute", top: "28vw", left: "43.9vw", textAlign: "center", }} >
                  <img src={roCoolerImage} alt="ro cooler 1" style={{ width: "3.8vw", height: "3.8vw" }}/>
                  <div style={{ fontSize: "1vw" }}>RO 1</div>
                </div>

                <div style={{ position: "absolute", top: "28vw", left: "46.6vw", textAlign: "center", }}>
                  <img src={roCoolerImage} alt="ro cooler 2" style={{ width: "3.8vw", height: "3.8vw" }} />
                  <div style={{ fontSize: "1vw" }}>RO 2</div>
                </div>

                <div style={{ position: "absolute", top: "28vw", left: "49.3vw", textAlign: "center", }}>
                  <img src={roCoolerImage} alt="ro cooler 3" style={{ width: "3.8vw", height: "3.8vw" }}/>
                  <div style={{ fontSize: "1vw" }}>RO 3</div>
                </div>
                
              </div>
              <div>
              <div className="custom-toast-container">
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
         toastClassName="toast-item"

      />
      </div>
      </div>
            </div>
          </div>
        </div>
      {Object.entries(isOn).map(([nodeId, isNodeOn]) => (<Node key={nodeId} nodeId={nodeId} isOn={isNodeOn} />))}
        </div>
        <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '45vw' }}>
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=10" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=22" />
          <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=21" />
        </div>
      </div>
      
    </div>
    
  );
}

export default ActuationPage;