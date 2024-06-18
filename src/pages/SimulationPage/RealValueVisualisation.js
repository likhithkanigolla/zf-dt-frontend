import React, { useRef,useState, useEffect } from 'react';

import "./SimulationPage.css";

import NavigationBar from "../../components/navigation/Navigation";
import ResultContainer from "./components/ResultContainer";

import SimulationCanvas from "./components/SimulationCanvas";

import whiteimage from "../images/white.png";
import MotorNode from "../images/MotorNode.png"; 
import WaterLevelNode from "../images/WaterLevelNode.png";
import WaterQualityNode from "../images/WaterQualityNode.png";
import WaterQuantityNode from "../images/WaterQuantityNode.png";


const backendAPI = "http://smartcitylivinglab.iiit.ac.in:1629";
// const backendAPI = "http://localhost:1629";

const RealValueVisualisation = () => {
  // State for holding input values and results
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

  // All measurements are in m(meters)
  const [sumpMeasurements, setSumpMeasurements] = useState({length: 5,breadth: 6.5, height: 2.5});
  const [ohtMeasurements, setOhtMeasurements] = useState({length: 13.6,breadth: 9, height: 1.34});

  // calculate the sump capacity in litres with the sumpMeasurements given in m
  const sumpCapacity = sumpMeasurements.length * sumpMeasurements.breadth * sumpMeasurements.height * 1000;
  const resultCardRef = useRef(null);

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



  useEffect(() => {
      const fetchData = async () => {

      setFlow1(true)
      // Calculate Water in Sump
      const SumpWaterLevelData = await getRealData('WM-WL-KH98-00');
      const [SumpWaterPercentage, SumpEstimatedWaterCapacity] = await WaterLevelCalculate(SumpWaterLevelData.waterlevel, sumpMeasurements.length, sumpMeasurements.breadth, sumpMeasurements.height);
      setWaterInSump(SumpEstimatedWaterCapacity);

      // Calculate Water in OHT
      const OHTWaterLevelData = await getRealData('WM-WL-KH00-00');
      const [OHTWaterPercentage, OHTEstimatedWaterCapacity] = await WaterLevelCalculate(OHTWaterLevelData.waterlevel, ohtMeasurements.length, ohtMeasurements.breadth, ohtMeasurements.height);
      setWaterInOHT(OHTEstimatedWaterCapacity);

      // Calculate Motor Running Status
      const MotorData = await getRealData('DM-KH98-60');
      const MotorFlowrate = await MotorFlow(MotorData.voltage, MotorData.current, MotorData.power_factor, 0.85, sumpMeasurements.height, MotorData.status);
      // let status = 1; 
      // const MotorFlowrate = await MotorFlow(415, 1.5, 0.85, 0.85, sumpMeasurements.height, status); // Used for testing 
      setMotorOn(MotorData.status === 1 ? true : false);
      setFlow2(MotorData.status === 1 ? true : false)
      console.log("Motor FlowRate", MotorFlowrate);

      };
      fetchData();

      // if (resultCardRef.current) {
      //   console.log('ResultCard div is:', resultCardRef.current);
      //   // You can now directly interact with the DOM element, for example:
      //   // resultCardRef.current.style.backgroundColor = 'lightblue';
      // }
  }, []);


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
      const response = await fetch(`${backendAPI}/get_value?table_name=${tableName}`);
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



  return (
    <div style={{ height: "100vh" }}>
      <NavigationBar title="Digital Twin for Water Quality - Simulation" />
      <div style={{ display: "flex", height: "100%" }}>
          <div className="demo-page" style={{ flex: 1 }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                border: '1px solid black',
              }}
            >
              <img src={whiteimage} alt="blueprint" style={{ width: "100%", height: "100%" }}/>
              <SimulationCanvas 
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
      {/* <ResultCard ref={resultCardRef} title="Water Level" value="75%" /> */}
    </div>
  );
};

export default RealValueVisualisation;