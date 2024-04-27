import React, { useState, useEffect } from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';
import blueprint from '../images/simulation_bp.png';
import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";

const ActuationPageT = () => {
  const [isOn, setIsOn] = useState({
    "WM-WL-KH98-00": false,
    "WM-WL-KH00-00": false,
    "DM-KH98-60": false,
    "WM-WD-KH98-00": false,
    "WM-WD-KH96-00": false,
    "WM-WD-KH04-00": false,
    "WM-WD-KH95-00": false,
    "WM-WD-KH01-00": false,
    "WM-WF-KB04-70": false,
    "WM-WF-KB04-73": false,
    "WM-WF-KB04-71": false,
    "WM-WF-KB04-72": false,
  });

  const nodePositions = {
    "WM-WL-KH00-00": { top: '34.6vw', left: '22.6vw' },
    "WM-WL-KH98-00": { top: '4vw', left: '48vw' },
    // Add more node positions as needed
  };
  
  // useEffect(() => {
  //   // Call updateNodeStatus every 10 seconds
  //   // const interval = setInterval(() => {
  //   //   updateNodeStatus(Object.keys(isOn));
  //   // }, 10000);
    
  //   // // Cleanup function to clear the interval
  //   // return () => clearInterval(interval);
  // }, [isOn]); // Run when 'isOn' state changes

  const updateNodeStatus = async (nodeIds) => {
    const tmpIsOn = {};
    for (const nodeId of nodeIds) {
      tmpIsOn[nodeId] = await getRealData(nodeId, "3h");
    }
    setIsOn(tmpIsOn);
  };

  const getRealData = async (nodeId, time) => {
    try {
      const response = await fetch(
        `http://smartcitylivinglab.iiit.ac.in:1629/get_value?table_name=${nodeId}`
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
      case "WM-WD-KH01-00":
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
      <NavigationBar title="Digital Twin for Water Quality - Actuation" />
      <div style={{ position: "relative" }}>
        <img
          src={blueprint}
          alt="blueprint"
          style={{ width: "100vw", height: "34vw", marginTop: "5vw" }}
        />

        {/* Render each node based on its state */}
        {Object.entries(isOn).map(([nodeId, isNodeOn]) => (
          <Node key={nodeId} nodeId={nodeId} isOn={isNodeOn} />
        ))}
      </div>
    </div>
  );
};

export default ActuationPageT;
