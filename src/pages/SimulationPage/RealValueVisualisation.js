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
      setFlow1(true);
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
      setMotorOn(MotorData.status === 1 ? true : false);
      setFlow2(MotorData.status === 1 ? true : false);
      console.log("Motor FlowRate", MotorFlowrate);

      // WaterQuantityNode Data 
      const WaterQuantityDataAW1 = await getRealData('WM-WF-KB04-70');
      const WaterQuantityDataKW2 = await getRealData('WM-WF-KB04-73');
      const WaterQuantityDataR1 = await getRealData('WM-WF-KH04-71');
      const WaterQuantityDataR2 = await getRealData('WM-WF-KH04-72');
      const WaterQuantityBorewelltoSump = await getRealData('WM-WF-KB98-40');
      console.log("WaterQuantityBorewelltoSump", WaterQuantityBorewelltoSump)
      const WaterQuantityMotortoOHT = await getRealData('WM-WF-KH95-40');
      if (WaterQuantityDataAW1.flowrate > 0) {setFlow6(true);} else {setFlow6(false);}
      if (WaterQuantityDataKW2.flowrate > 0) {setFlow7(true);} else {setFlow7(false);}
      if (WaterQuantityDataR1.flowrate > 0) {setFlow9(true);} else {setFlow9(false);}
      if (WaterQuantityDataR2.flowrate > 0) {setFlow8(true);} else {setFlow8(false);}
      if (WaterQuantityBorewelltoSump.flowrate > 0) {setFlow1(true);} else {setFlow1(false);}
      if (WaterQuantityMotortoOHT.flowrate > 0) {setFlow4(true);} else {setFlow4(false);}

    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 120000); // Run every 2 minutes

    return () => clearInterval(interval);
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
    <div>
    <NavigationBar title="Digital Twin for Water Quality - Simulation" />
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", position: 'relative', width: '70vw', height: '40vw', border: '1px solid black', justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div className="demo-page">
          <div>

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
              waterInOHT={waterInOHT}
              waterInROFilter={waterInROFilter}
              motorOn={motorOn}
              isSimulationRunning={isSimulationRunning}  
              waterConsumed={waterConsumed}
              flowrate={flowrate}
            />

            {/* IoT Nodes  */}
            <div style={{ position: "absolute", top: "17vw", left: "14vw", textAlign: "center" }}>
              <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WD-KH98-00')} />
            </div>

            <div style={{ position: "absolute", top: "13vw", left: "31.5vw", textAlign: "center" }}>
              <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WD-KH96-00')} />
            </div>

            <div style={{ position: "absolute", top: "14vw", left: "37vw", textAlign: "center" }}>
              <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WD-KH96-01')} />
            </div>

            <div style={{ position: "absolute", top: "20vw", left: "43vw", textAlign: "center" }}>
              <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WD-KH04-00')} />
            </div>

            <div style={{ position: "absolute", top: "30vw", left: "45vw", textAlign: "center" }}>
              <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={() => getRealData('WM-WD-KH95-00')} />
            </div>

            <div style={{ position: "absolute", top: "30vw", left: "50.4vw", textAlign: "center" }}>
              <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={() => getRealData('WM-WD-KH01-00')} />
            </div>

            <div style={{ position: "absolute", top: "13vw", left: "16vw", textAlign: "center" }}>
              <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WL-KH98-00')} />
            </div>

            <div style={{ position: "absolute", top: "8vw", left: "29.8vw", textAlign: "center" }}>
              <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WL-KH00-00')} />
            </div>

            <div style={{ position: "absolute", top: "18vw", left: "23.6vw", textAlign: "center" }}>
              <img src={MotorNode} alt="MotorNode" style={{ width: "1.2vw", height: "1.2vw" }} onClick={() => getRealData('DM-KH98-60')} />
            </div>

            <div style={{ position: "absolute", top: "12vw", left: "9.5vw", textAlign: "center",transform: "rotate(90deg)", zIndex: 2 }}>
              <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KH98-40')} />
            </div>

            <div style={{ position: "absolute", top: "15vw", left: "26vw", textAlign: "center",transform: "rotate(90deg)", zIndex: 2 }}>
              <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KH95-40')} />
            </div>

            <div style={{ position: "absolute", top: "4vw", left: "34.5vw", textAlign: "center" }}>
              <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KB04-70')} />
            </div>

            <div style={{ position: "absolute", top: "10vw", left: "36.5vw", textAlign: "center" }}>
              <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KB04-73')} />
            </div>

            <div style={{ position: "absolute", top: "25vw", left: "44.5vw", textAlign: "center", transform: "rotate(90deg)" }}>
              <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KB04-71')} />
            </div>

            <div style={{ position: "absolute", top: "25vw", left: "50vw", textAlign: "center", transform: "rotate(90deg)" }}>
              <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KB04-72')} />
            </div>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RealValueVisualisation;