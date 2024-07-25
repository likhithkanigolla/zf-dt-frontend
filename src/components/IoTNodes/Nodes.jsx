import React from 'react';
import HoverableIcon from '../../pages/SimulationPage/components/HoverableIcon';
import WaterQualityNode from   '../../pages/images/WaterQualityNode.png';
import WaterLevelNode from '../../pages/images/WaterLevelNode.png';
import MotorNode from  '../../pages/images/MotorNode.png';
import WaterQuantityNode from  '../../pages/images/WaterQuantityNode.png';
import Timer from '../timer-component';

function IoTNodes(SimulatedValues, motorOn, timeElapsed) {
    return (
        <div>
              {/* IoT Nodes  */}
              <div
                style={{
                  position: "absolute",
                  top: "12.5vw",
                  left: "14vw",
                  textAlign: "center",
                }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WD-KH98-00')} /> */}
                <HoverableIcon
                  src={WaterQualityNode}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH98-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH98-00"
                  ]}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "1vw",
                  left: "29.5vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WD-KH96-00')} /> */}
                <HoverableIcon
                  src={WaterQualityNode}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH96-00"
                  ]}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "6.5vw",
                  left: "50.6vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WD-KH96-01')} /> */}
                <HoverableIcon
                  src={WaterQualityNode}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-01"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH96-01"
                  ]}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "9vw",
                  left: "55vw",
                  textAlign: "center",
                }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WD-KH96-02')} /> */}
                <HoverableIcon
                  src={WaterQualityNode}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-02"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH96-02"
                  ]}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  left: "52.3vw",
                  textAlign: "center",
                }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WD-KH95-00')} /> */}
                <HoverableIcon
                  src={WaterQualityNode}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH95-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH95-00"
                  ]}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  left: "57.9vw",
                  textAlign: "center",
                }}>
                {/* <img src={WaterQualityNode} alt="WaterQuality Node" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WD-KH03-00')} /> */}
                <HoverableIcon
                  src={WaterQualityNode}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH03-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH03-00"
                  ]}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "8vw",
                  left: "13vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                {/* <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WL-KH98-00')} /> */}
                <HoverableIcon
                  src={WaterLevelNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WL-KH98-00"
                  data={`Water Level: ${SimulatedValues[
                    "WM-WL-KH98-00"
                  ]}%`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "1vw",
                  left: "32vw",
                  textAlign: "center",
                  zIndex: 3,
                }}>
                {/* <img src={WaterLevelNode} alt="WaterLevelNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> displayValueOnClick('WM-WL-KH00-00')} onMouseEnter={(e) => handleMouseEnter(e)} onMouseLeave={(e) => handleMouseLeave(e)}/> */}
                <HoverableIcon
                  src={WaterLevelNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WL-KH00-00"
                  data={`Water Level: ${SimulatedValues[
                    "WM-WL-KH00-00"
                  ]}%`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "10vw",
                  left: "22vw",
                  textAlign: "center",
                  zIndex: 4,
                }}>
                {/* <img src={MotorNode} alt="MotorNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('DM-KH98-60')} /> */}
                <HoverableIcon
                  src={MotorNode}
                  alt="MotorNode"
                  aId="DM-KH98-60"
                  dataId="DM-KH98-60"
                  data={`Motor Status: ${motorOn ? "ON" : "OFF"}`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "7vw",
                  left: "7vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={() => getRealData('WM-WF-KH98-40')} /> */}
                <HoverableIcon
                  src={WaterQuantityNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KH98-40"
                  data={`Total Water Flow: ${SimulatedValues["WM-WF-KH98-40"]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "6.7vw",
                  left: "26.5vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WF-KH95-40')} /> */}
                <HoverableIcon
                  src={WaterQuantityNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KH95-40"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KH95-40"
                  ]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "7.3vw",
                  left: "39.6vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WF-KB04-70')} /> */}
                <HoverableIcon
                  src={WaterQuantityNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-70"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-70"
                  ]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "7.3vw",
                  left: "45.3vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "2vw", height: "2vw" }} onClick={()=> getRealData('WM-WF-KB04-73')} /> */}
                <HoverableIcon
                  src={WaterQuantityNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-73"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-73"
                  ]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "11vw",
                  left: "52.5vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WF-KB04-71')} /> */}
                <HoverableIcon
                  src={WaterQuantityNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-71"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-71"
                  ]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "11vw",
                  left: "57.5vw",
                  textAlign: "center",
                  transform: "rotate(90deg)",
                  zIndex: 3,
                }}>
                {/* <img src={WaterQuantityNode} alt="WaterQuantityNode" style={{ width: "1.5vw", height: "1.5vw" }} onClick={()=> getRealData('WM-WF-KB04-72')} /> */}
                <HoverableIcon
                  src={WaterQuantityNode}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-72"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-72"
                  ]}L`}
                  rotation={90}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "19vw",
                  left: "1vw",
                  textAlign: "center",
                }}>
                <Timer elapsedTime={timeElapsed} />
              </div>

        </div>
    );
}

export default IoTNodes;