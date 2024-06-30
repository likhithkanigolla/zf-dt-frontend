import React, { useRef,useState, useEffect } from 'react';

import "./ActuationPage.css";

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


const ActuationPage = () => {
  // State for holding input values and results
  const [isAuthenticated, setIsAuthenticated] = useState(true);
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

  const nodePositions = {
    "WM-WL-KH98-00": {width: '2vw',height: '2vw', position: 'absolute', top: "17vw", left: "35vw", zIndex: '3' }, //WL at sump
    "WM-WL-KH00-00": {width: '2vw',height: '2vw', position: 'absolute', top: '10vw', left: '49vw', zIndex: '3' }, //WL at OHT
    "DM-KH98-60"  :  {width: '2vw',height: '2vw', position: 'absolute', top: '19vw', left: '42vw',  zIndex: '3'}, //motor
    "WM-WD-KH98-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '20vw', left: '32vw' ,  zIndex: '3'}, //WQ at sump
    "WM-WD-KH96-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '12vw', left: '50vw',  zIndex: '3'}, //WQ at OHT
    "WM-WD-KH96-01" : {width: '2vw',height: '2vw', position: 'absolute', top: '15vw', left: '70.6vw', zIndex: '3'}, //WQ to RO plant
    "WM-WD-KH03-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '23vw', left: '72vw' }, //ro 2
    "WM-WD-KH95-00" : {width: '2vw',height: '2vw', position: 'absolute', top: '23vw', left: '78vw' },  //faculty launge(ro1)
    "WM-WD-KH96-02" : {width: '2vw',height: '2vw', position: 'absolute', top: '21vw', left: '60vw' }, //after ro
    "WM-WF-KB04-71" : {width: '2vw',height: '2vw', position: 'absolute', top: '20vw', left: '72vw', transform: 'rotate(90deg)'},
    "WM-WF-KB04-72" : {width: '2vw',height: '2vw', position: 'absolute', top: '20vw', left: '78vw', transform: 'rotate(90deg)'}, 
    "WM-WF-KB04-70" : {width: '2vw',height: '2vw', position: 'absolute', top: '15.5vw', left: '60vw',transform: 'rotate(90deg)',zIndex: '3'},
    "WM-WF-KB04-73" : {width: '2vw',height: '2vw', position: 'absolute', top: '15.5vw', left: '65vw',transform: 'rotate(90deg)',zIndex: '3'},   
    "WM-WF-KH95-40" : {width: '2vw',height: '2vw', position: 'absolute', top: '14vw', left: '27vw', transform: 'rotate(90deg)', zIndex: '3'},
    "WM-WF-KH98-40" : {width: '2vw',height: '2vw', position: 'absolute', top: '16.3vw', left: '47vw',transform: 'rotate(90deg)',  zIndex: '3'},   
  };


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
      if ((nodeId === "WM-WD-KH96-02" && data.compensated_tds > 150) || data.compensated_tds < 50 ) {
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

  const handleClearLog = () => {
    // Assuming logContent is a state variable holding the log data
    setLog(''); // Clear the log by setting the log content to an empty string
    updateLog('Log cleared'); // Log the action
  };

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



  // const ResultCard = React.forwardRef(({ title, value }, ref) => {
  //   return (
  //     <div ref={ref} className="result-card">
  //       <h5>{title}</h5>
  //       <p>{value}</p>
  //     </div>
  //   );
  // });

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
    <div className='page'>
      <NavigationBar title="Digital Twin for Water Quality " style={{position:'fixed'}} />
      <div style={{ display: "flex"}} className='Page'>
      <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '53vw', border: "0px" }}>
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=17" />
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=9" />
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=24" />
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=20" />
    </div>
      <div style={{ height: "50vw", width: "60vw",display: "flex", flex:3, justifyContent: "center", alignItems: "center"}} className='canvas'>
        <div>
            <div style={{position: 'relative', width: '60vw',height: '30vw',border: '',}}>
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
            </div>
            {Object.entries(isOn).map(([nodeId, isNodeOn]) => (<Node key={nodeId} nodeId={nodeId} isOn={isNodeOn} />))}
          <ConsoleHeader handleDownloadLog={handleDownloadLog} log={log} handleClearLog={handleClearLog}/>
        </div>
      </div>
      <div style={{ display: 'flex',flex:1, flexDirection: 'column', height: '53vw' }}>
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=33" />
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=10" />
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=22" />
      <Box src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels&theme=light&viewPanel=21" />
    </div>
      </div>
    </div>
  );
};

export default ActuationPage;