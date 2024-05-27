import React from 'react';

import ZshapePipe from './ZshapePipe';
import MirrorZPipe from './MirrorZPipe';
import StraightPipe from './StraightPipe';
import LShapePipe from './LShapePipe';
import EShapePipe from './EShapePipe';

import roPlantImage from "../../images/ro_plant.png";
import roCoolerImage from "../../images/ro_cooler.png";
import Motor from "../../images/Motor.png";
import SumpIcon from "../../images/Sump.png";
import PumpHouse from "../../images/pump_house.png";
import Borewell from "../../images/borewell.png";
import Watertank from "../../images/watertank.png";
import ROWatertank from "../../images/tank_ro.png";
import Washrooms from "../../images/Washrooms.png";

const backendAPI = "http://localhost:1629";



const SimulationCanvas = ({ 
  handleIconClick, 
  iconRefs, 
  flow1, 
  setFlow1, 
  flow2, 
  waterInSump, 
  motorOn, 
  toggleIsOn, 
  isSimulationRunning, 
  handleMotorToggle, 
  waterInOHT, 
  waterInROFilter, 
  waterConsumed 
}) => {
  return (
    <div>
                <div style={{ position: "absolute", top: "6vw", left: "3.8vw" }} id="pumpHouseIcon">
                <img src={PumpHouse} alt="sump" style={{ width: "4.8vw", height: "4.8vw" }} onClick={(e) => handleIconClick(e)}
                  ref={(ref) => {if (ref) {ref.id = "PumpHouse1"; iconRefs.push(ref);} }}
                />
                <div style={{ fontSize: "1vw" }}>PumpHouse</div>
              </div>

              {/* Z Shape Pipe */}
              <div style={{ position: "absolute", top: "8.5vw", left: "7.8vw" }}>
                <ZshapePipe flow={flow1}  onClick={() => {setFlow1((flow1) => !flow1);}}/>
              </div>

              {/* Mirror Z Pipe */}
              <div style={{ position: "absolute", top: "16vw", left: "7.8vw" }}>
                <MirrorZPipe flow={flow1} style={{ width: "4.8vw", height: "4.8vw" }}/>
              </div>

              {/* Borewell */}
              <div id="borewellIcon" style={{ position: "absolute", top: "19vw", left: "3.8vw" }}>
                <img
                  src={Borewell}
                  alt="borewell"
                  style={{ width: "4.8vw", height: "4.8vw" }}
                  onClick={(e) => handleIconClick(e)}
                  ref={(ref) => {if (ref) {ref.id = "Borewell1"; iconRefs.push(ref);} }}
                />
                <div style={{ fontSize: "1vw" }}>Borewell</div>
              </div>

              {/* Straight Pipes */}
              <div>
                <div style={{ position: "absolute", top: "13vw", left: "18vw" }}>
                  <StraightPipe flow={flow2} />
                </div>

                {/* SUMP */}
                <div style={{position: "absolute", top: "13vw", left: "13vw", textAlign: "center"}}>
                  <img src={SumpIcon}  alt="sump" style={{ width: "6vw", height: "6vw" }} onClick={(e) => handleIconClick(e)} 
                  ref={(ref) => {if (ref) {ref.id = "KRBSump"; iconRefs.push(ref);} }}/>
                  <div style={{fontSize:"1vw"}}>SUMP-{waterInSump}L</div>
                </div>

                <div style={{ position: "absolute", top: "10.3vw", left: "25vw" }}>
                  <MirrorZPipe flow={flow2} id="motorOHTPipe" />
                </div>

                {/* Motor */}
                <div style={{position: "absolute", top: "15.5vw", left: "21.5vw", textAlign: "center", width: "5.8vw"}} 
                ref={(ref) => {if (ref) {ref.id = "Motor"; iconRefs.push(ref);} }}>
                  <img src={Motor} alt="Motor" 
                    className={`motor ${motorOn ? "running" : ""}`} 
                    style={{width: "3vw", height: "3vw",transform: "scaleX(-1)",}}
                    onClick={() => {toggleIsOn("valve5");
                      if (isSimulationRunning) {
                        handleMotorToggle();
                      }
                    }}
                  />
                  {motorOn && (<div style={{ fontSize: "10px", color: "green" }}>Running</div>)}
                  <div style={{fontSize:"1vw"}}>Motor</div>
                </div>

                {/* L Shape Pipe */}
                <div style={{ position: "absolute", top: "11.5vw", left: "32.2vw", transform: "rotate(180deg)"}}>
                  <LShapePipe flow={flow1} />
                </div>

                {/* L Shape Pipe */}
                <div style={{ position: "absolute", top: "3.5vw", left: "33vw", transform: "rotate(90deg)"}}>
                  <LShapePipe flow={flow1} />
                </div>

                <div style={{ position: "absolute", top: "1.8vw", left: "34.5vw" ,textAlign:"center"}}>
                <div style={{fontSize:"1vw"}}>Admin Block Washrooms</div>
                  <img src={Washrooms} alt="WaterTank" style={{ width: "2.8vw", height: "2.8vw" }}/>
                </div>

                <div style={{ position: "absolute", top: "8vw", left: "38.5vw", textAlign:"center" }}>
                <div style={{fontSize:"1vw"}}>KRB Washrooms</div>
                  <img src={Washrooms} alt="WaterTank" style={{ width: "2.8vw", height: "2.8vw" }}/>
                </div>

                <div style={{ position: "absolute", top: "7vw", left: "35vw" }}>
                  <StraightPipe flow={flow1} />
                </div>
                
                {/* Water Tower */}
                <div style={{ position: "absolute", top: "9vw", left: "29.5vw" }}>
                  <img src={Watertank} alt="WaterTank" style={{ width: "7vw", height: "7vw" }} onClick={(e) => handleIconClick(e)} 
                  ref={(ref) => {if (ref) {ref.id = "KRBOHTIcon"; iconRefs.push(ref);} }}/>
                  <div style={{fontSize:"1vw"}}>KRB OHT - {waterInOHT}L</div>
                </div>

                {/* Straight Pipe */}
                <div style={{ position: "absolute", top: "17vw", left: "41.5vw" }}>
                  <StraightPipe flow={flow1} />
                </div>

                {/* RO Plant */}
                <div style={{ position: "absolute", top: "17vw", left: "37vw" }}>
                  <img src={roPlantImage} alt="ro plant" style={{ width: "4.8vw", height: "4.8vw" }}
                    onClick={(e) => handleIconClick(e)} ref={(ref) => {if (ref) {ref.id = "ROPlant"; iconRefs.push(ref);} }}
                  />
                  <div style={{fontSize:"1vw"}}>RO Plant</div>
                </div>

                {/* E Shape Pipe */}
                <div style={{ position: "absolute", top: "22vw", left: "45.5vw" }}>
                  <EShapePipe flow={flow1} />
                </div>

                {/* Water Tower */}
                <div style={{ position: "absolute", top: "16.5vw", left: "46vw" }}>
                  <div style={{fontSize:"1vw"}}>RO Filtered Water OHT- <b>{waterInROFilter.toFixed(1)}L</b></div>
                  <img src={ROWatertank} alt="WaterTank" style={{ width: "5vw", height: "5vw" }} onClick={(e) => handleIconClick(e)} 
                  ref={(ref) => {if (ref) {ref.id = "KRB-RO-OHT"; iconRefs.push(ref);} }}/>
                </div>

                {/* RO Coolers */}
                <div style={{ position: "absolute", top: "28vw", left: "44.4vw", textAlign: "center", }} >
                  <img src={roCoolerImage} alt="ro cooler 1" style={{ width: "2.8vw", height: "2.8vw" }}
                   onClick={(e) => handleIconClick(e)} 
                   ref={(ref) => {if (ref) {ref.id = "ROCooler1"; iconRefs.push(ref);} }}
                  />
                  <div style={{fontSize:"1vw"}}>RO 1</div>
                  <div style={{fontSize:"1vw"}}>{((3*waterConsumed)/4).toFixed(1)}L</div>
                </div>

                <div style={{ position: "absolute", top: "28vw", left: "47.1vw", textAlign: "center", }}>
                  <img src={roCoolerImage} alt="ro cooler 2" style={{ width: "2.8vw", height: "2.8vw" }}
                    onClick={(e) => handleIconClick(e)} 
                    ref={(ref) => {if (ref) {ref.id = "ROCooler2"; iconRefs.push(ref);} }}
                  />
                  <div style={{fontSize:"1vw"}}>RO 2</div>
                </div>

                <div style={{ position: "absolute", top: "28vw", left: "49.8vw", textAlign: "center",}}>
                  <img src={roCoolerImage} alt="ro cooler 3" style={{ width: "2.8vw", height: "2.8vw" }}
                    onClick={(e) => handleIconClick(e)}
                    ref={(ref) => {if (ref) {ref.id = "ROCooler3"; iconRefs.push(ref);} }}/>
                  <div style={{fontSize:"1vw"}}>RO 3</div>
                  <div style={{fontSize:"1vw"}}>{(waterConsumed/4).toFixed(1)}L</div>
                </div>
              </div>
              </div>

)};

export default SimulationCanvas;