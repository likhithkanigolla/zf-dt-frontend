import React from 'react';
import HoverableIcon from '../../pages/SimulationPage/components/HoverableIcon';
import Timer from '../timer-component';
import config from '../../config';

function IoTNodes({SimulatedValues, motorOn, timeElapsed, waterLevelNodeWorking, setWaterLevelNodeWorking,setStepIndex, stepIndex}) {
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH98-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH98-00"
                  ].toFixed(2)}ppm`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH96-00"
                  ].toFixed(2)}ppm`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-01"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH96-01"
                  ].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "9vw",
                  left: "55vw",
                  textAlign: "center",
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH96-02"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH96-02"
                  ].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  left: "52.3vw",
                  textAlign: "center",
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH95-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH95-00"
                  ].toFixed(2)}ppm`}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  left: "57.9vw",
                  textAlign: "center",
                }}>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQualityNode.png`}
                  alt="WaterQualityNode"
                  dataId="WM-WD-KH04-00"
                  data={`Water Quality: ${SimulatedValues[
                    "WM-WD-KH04-00"
                  ].toFixed(2)}ppm`}
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
                <HoverableIcon
                  classsName="hello-water-node"
                  src={`${config.basePath}/images/WaterLevelNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WL-KH98-00"
                  data={`Water Level: ${SimulatedValues[
                    "WM-WL-KH98-00"
                  ].toFixed(2)}%`}

                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "1vw",
                  left: "32vw",
                  textAlign: "center",
                  zIndex: 3,
                }}
                className='water-level-node-oht'>
                <HoverableIcon
                  src={`${config.basePath}/images/WaterLevelNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WL-KH00-00"
                  data={`Water Level: ${SimulatedValues[
                    "WM-WL-KH00-00"
                  ].toFixed(2)}%`}
                  waterLevelNodeWorking={waterLevelNodeWorking}
                  setWaterLevelNodeWorking={setWaterLevelNodeWorking}
                  setStepIndex={setStepIndex}
                  stepIndex={stepIndex}
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
                <HoverableIcon
                  src={`${config.basePath}/images/MotorNode.png`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KH95-40"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KH95-40"
                  ].toFixed(2)}L`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-70"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-70"
                  ].toFixed(2)}L`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-73"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-73"
                  ].toFixed(2)}L`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-71"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-71"
                  ].toFixed(2)}L`}
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
                <HoverableIcon
                  src={`${config.basePath}/images/WaterQuantityNode.png`}
                  alt="WaterQuantityNode"
                  dataId="WM-WF-KB04-72"
                  data={`Total Water Flow: ${SimulatedValues[
                    "WM-WF-KB04-72"
                  ].toFixed(2)}L`}
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