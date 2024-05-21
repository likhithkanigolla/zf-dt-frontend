// ActuationPage.js
import React, { useState, useEffect } from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';
import blueprint from '../images/simulation_bp.png';

import { GiWaterTower } from "react-icons/gi";
import roPlantImage from '../images/ro_plant.png'
import roCoolerImage from '../images/ro_cooler.png'
import Motor from '../images/Motor.png';
import Watertank from "../images/watertank.png";
import ROWatertank from "../images/tank_ro.png";

import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import LeakageIcon from "../images/borewell.png"; 

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
    "WM-WD-KH04-00": false,
    "WM-WF-KB04-70": false,
    "WM-WF-KB04-73": false,
    "WM-WF-KB04-71": false,
    "WM-WF-KB04-72": false,
    
  });

  const nodePositions = {
    "WM-WL-KH98-00": {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '22.6vw',transform: 'scaleX(-1)' },
    "WM-WL-KH00-00": {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '4vw', left: '48vw',transform: 'scaleX(-1)' },
    "DM-KH98-60"  :  {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '32vw', left: '35vw',transform: 'scaleX(-1)'},
    "WM-WD-KH98-00" : {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '27.8vw',transform: 'scaleX(-1)' },
    "WM-WD-KH96-00" : {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '4vw', left: '51vw',transform: 'scaleX(-1)' },
    "WM-WD-KH96-01" : {width: '2vw',height: '2vw', position: 'absolute', top: '12vw', left: '52vw',transform: 'scaleX(-1)' },
    "WM-WD-KH04-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '11.5vw', left: '62.5vw',transform: 'scaleX(-1)' },
    "WM-WD-KH95-00" : {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '55vw',transform: 'scaleX(-1)' },
    "WM-WD-KH04-00" : {width: '2.5vw',height: '2.5vw', position: 'absolute', top: '23.5vw', left: '55vw',transform: 'scaleX(-1)' },
    "WM-WF-KB04-71" : {width: '1.5vw',height: '1.5vw', position: 'absolute', top: '23.4vw', left: '61vw'},
    "WM-WF-KB04-72" : {width: '1.5vw',height: '1.5vw', position: 'absolute', top: '35vw', left: '61.5vw'}
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
      console.log(timeDifference,parseTime(time))
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

  const NodeRestart = async (nodeType, nodeName,nodeID, status) => {
    // Update the state based on the current state
    setIsOn((prevState) => ({ ...prevState, [nodeID]: !prevState[nodeID] }));
    console.log(isOn)
  
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

  const Node = ({ nodeId, isOn }) => {
    let nodeImage;
    switch (nodeId) {
      case "DM-KH98-60":
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
      case "WM-WD-KH04-00":
      case "WM-WD-KH96-01":
        nodeImage = WaterQualityNode;
        break;
      default:
        nodeImage = WaterQuantityNode;
        break;
    }
  
    return (
      <img
        src={nodeImage}
        alt={`${nodeId} Node`}
        style={{ width: "3vw", height: "3vw", position: "absolute", ...(nodePositions[nodeId] || {}) }}
        className={isOn ? "node-on" : "node-off"}
      />
    );
  };
  
  

  return (
    <div className="actuation-page">
      {/* <h2>Actuation Page</h2> */}
      <NavigationBar title="Digital Twin for Water Quality - Actuation" />
      <div style={{ position: 'relative' }}>
        
      <img src={blueprint} alt="blueprint" style={{ width: '100vw', height: '34vw', marginTop: '5vw' }} />
      {/* Components */}
      <img src={Watertank} alt="water tank OHT" style={{ width: '4vw', height: '4vw', position: 'absolute', top: '6.8vw', left: '49%' }} />
      <img src={ROWatertank} alt="RO OHT" style={{ width: '3vw', height: '3vw', position: 'absolute', top: '12vw', left: '59.8%' }} />
      <img src={roPlantImage} alt="ro plant" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '11vw', left: '54vw' }} />
      <img src={roCoolerImage} alt="ro cooler" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '23.4vw', left: '57vw' }}  />
      <img src={roCoolerImage} alt="ro cooler" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '29vw', left: '57vw' }}/>
      <img src={roCoolerImage} alt="ro cooler" style={{ width: '3.48vw', height: '3.48vw', position: 'absolute', top: '34.5vw', left: '57vw' }} />
      <img src={Motor}  alt="Motor" style={{width: '3.5vw',height: '3.5vw', position: 'absolute', top: '34.6vw', left: '35vw',transform: 'scaleX(-1)' }} />


      {Object.entries(isOn).map(([nodeId, isNodeOn]) => (<Node key={nodeId} nodeId={nodeId} isOn={isNodeOn} />))}
      
      
      {/* IoT Nodes */}
      {/* <img src={WaterLevelNode}  alt="WaterLevelNode at SUMP" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '22.6vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_level_sump'); }} />
      <img src={WaterLevelNode}  alt="WaterLevelNode at OHT" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '4vw', left: '48vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_level_krb_oht'); }} />
      
      <img src={MotorNode}  alt="MotorNode" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '32vw', left: '35vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('motor', 'DM-KH98-80', 'motor_control',2); }} />

      <img src={WaterQualityNode}  alt="WaterQualityNode at sump" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '27.8vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_quality_krb_sump'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at OHT" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '4vw', left: '51vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_quality_krb_oht'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO Plant" style={{width: '2vw',height: '2vw', position: 'absolute', top: '12vw', left: '52vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_qualityro_plant'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO OHT" style={{width: '2vw',height: '2vw', position: 'absolute', top: '11.5vw', left: '62.5vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_quality_ro_tank_oht'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO 1" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '34.6vw', left: '55vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_quality_ro_cooler1'); }} />
      <img src={WaterQualityNode}  alt="WaterQualityNode at RO 2" style={{width: '2.5vw',height: '2.5vw', position: 'absolute', top: '23.5vw', left: '55vw',transform: 'scaleX(-1)' }} onClick={() => { NodeRestart('water_quality_ro_cooler2'); }} />
      <img src={WaterQuantityNode}  alt="WaterQualityNode at RO 1" style={{width: '1.5vw',height: '1.5vw', position: 'absolute', top: '23.4vw', left: '61vw'}} onClick={() => { NodeRestart('water_flow_ro_cooler1'); }} />
      <img src={WaterQuantityNode}  alt="WaterQualityNode at RO 2" style={{width: '1.5vw',height: '1.5vw', position: 'absolute', top: '35vw', left: '61.5vw'}} onClick={() => { NodeRestart('water_flow_ro_cooler2'); }} />
      */}
      </div>   
      {/* <AllNodes />   */}
    </div>
  );
}

export default ActuationPage;