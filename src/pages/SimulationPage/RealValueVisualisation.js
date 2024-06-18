import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import "./SimulationPage.css";

import NavigationBar from "../../components/navigation/Navigation";
import Toolbar from "./components/ToolBar";
import SimulationForm from "./components/SimulationForm";
import ResultContainer from "./components/ResultContainer";
import LeakageOptions from "./components/LeakageOptions";
import SimulationCanvas from "./components/SimulationCanvas";

import whiteimage from "../images/white.png";
import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";
import LeakageIcon from "../images/leakage_water.png"; 


const backendAPI = "http://smartcitylivinglab.iiit.ac.in:1629";
// const backendAPI = "http://localhost:1629";

const RealValueVisualisation = () => {
  // State for holding input values and results
  const iconRefs = [];



  const [flow1, setFlow1] = useState(false);
  const [flow2, setFlow2] = useState(false);

  const [sensorValues, setSensorValues] = useState({
    KRBSump: 0,
    KRBOHTIcon: 0,
    KRBROOHT: 0,
  });

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [waterInSump, setWaterInSump] = useState(60000); // Initial water level in Sump
  const [waterInOHT, setWaterInOHT] = useState(0); // Initial water level in OHT
  const [motorOn, setMotorOn] = useState(false); // Initial motor state
  const [waterInROFilter, setWaterInROFilter] = useState(10); // Initial water level in RO Filter
  const [alertShown, setAlertShown] = useState(false);
  const [waterFlowStarted, setWaterFlowStarted] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [flowrate, setFlowrate] = useState(10);
  const [data, setData] = useState([]);




  


  useEffect(() => {
    
  }, []);


  const ResultCard = ({ title, value }) => {
    return (
      <div className="result-card">
        <h5>{title}</h5>
        <p>{value}</p>
      </div>
    );
  };

  const getRealData = async (tableName) => {
    try {
      const response = await fetch(`${backendAPI}/get_value?table_name=${tableName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Assuming this returns an object
      // Transform the data object into an array of objects for each key-value pair,
      // ensuring null values are handled gracefully.
      const dataArray = Object.entries(data).map(([key, value]) => ({
        title: key,
        value: value === null ? 'N/A' : value.toString(), // Use 'N/A' for null values
      }));
      setData(dataArray); // Assuming you have a setData function to update state
    } catch (error) {
      console.error("Fetch error:", error);
      setData([{ title: "Error", value: "Failed to fetch data" }]); // Update accordingly
    }
  };



  return (
    <div>
      <NavigationBar title="Digital Twin for Water Quality - Simulation" />
      <div style={{ display: "flex"}}>
          <div className="demo-page">
            <div
              style={{
                position: 'relative',
                width: '60vw',
                height: '40vw',
                border: '1px solid black',
              }}
            >
              <img src={whiteimage} alt="blueprint" style={{ width: "100%", height: "100%" }}/>
              <SimulationCanvas 
                  iconRefs={iconRefs}
                  flow1={flow1}
                  flow2={flow2}
                  setFlow1={setFlow1}
                  waterInSump={waterInSump}
                  motorOn={motorOn}
                  isSimulationRunning={isSimulationRunning}
                  waterInOHT={waterInOHT}
                  waterInROFilter={waterInROFilter}
                  waterConsumed={waterConsumed}
                  flowrate={flowrate}
                />

              {/* IoT Nodes  */}
              <div style={{ position: "absolute", top: "24vw", left: "13vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KH98-00')}
                />
              </div>

              <div style={{ position: "absolute", top: "21vw", left: "29vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                 style={{ width: "3vw", height: "3vw",}}
                onClick={() => getRealData('WM-WD-KH96-00')}
                />
              </div>

              <div style={{ position: "absolute", top: "24vw", left: "38vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KH96-01')}
                />
                {/* <div>KRB between oht and ro tank</div> */}
              </div>

              <div style={{ position: "absolute", top: "20vw", left: "51vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KH04-00')}
                />
                {/* <div>RO OHT</div> */}
              </div>

              <div style={{ position: "absolute", top: "35vw", left: "44vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                 style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KH95-00')}
                />
                {/* <div>RO 1</div> */}
              </div>

              <div style={{ position: "absolute", top: "35vw", left: "50vw", textAlign: "center", }}>
                <img src={WaterQualityNode} alt="WaterQuality Node"
                 style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WD-KH01-00')}
                />
                {/* <div>RO 3</div> */}
              </div>

              <div style={{ position: "absolute", top: "24vw", left: "17vw", textAlign: "center", }}>
                <img src={WaterLevelNode} alt="WaterLevelNode"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WL-KH98-00')}
                />
                {/* <div>SUMP</div> */}
              </div>

              <div style={{ position: "absolute", top: "21vw", left: "33vw", textAlign: "center", }}>
                <img src={WaterLevelNode} alt="WaterLevelNode"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('WM-WL-KH00-00')}
                />
                {/* <div>OHT</div> */}
              </div>

              <div style={{ position: "absolute", top: "23vw", left: "22.7vw", textAlign: "center", }}>
                <img src={MotorNode} alt="MotorNode"
                  style={{ width: "3vw", height: "3vw",}}
                  onClick={() => getRealData('DM-KH98-60')}
                />
                {/* <div>Motor</div> */}
              </div>

              <div style={{ position: "absolute", top: "4vw", left: "34.5vw", textAlign: "center", }}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-70')}
                />
                {/* <div>W1</div> */}
              </div>

              <div style={{ position: "absolute", top: "9.4vw", left: "36.5vw", textAlign: "center", }}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-73')}
                />
                {/* <div>W2</div> */}
              </div>

              <div style={{ position: "absolute", top: "25vw", left: "44.5vw", textAlign: "center", transform: "rotate(90deg)",}}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-71')}
                />
                {/* <div>RO1</div> */}
              </div>

              <div style={{ position: "absolute", top: "25vw", left: "50vw", textAlign: "center", transform: "rotate(90deg)",}}>
                <img src={WaterQuantityNode} alt="WaterQuantityNode"
                  style={{ width: "2vw", height: "2vw",}}
                  onClick={() => getRealData('WM-WF-KB04-72')}
                />
                {/* <div>RO3</div> */}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RealValueVisualisation;