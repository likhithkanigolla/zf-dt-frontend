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
import Sump from './Sump';
import WaterTank from './Watertank';

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
  waterConsumed,
  flowrate
}) => {
  return (
    <div>
      <div style={{ position: "absolute", top: "7vw", left: "3.9vw" }} id="pumpHouseIcon">
        <img src={PumpHouse} alt="sump" style={{ width: "4.8vw", height: "4.8vw" }} onClick={(e) => handleIconClick(e)}
          ref={(ref) => { if (ref) { ref.id = "PumpHouse1"; iconRefs.push(ref); } }}
        />
        <div style={{ fontSize: "1vw" }}>PumpHouse</div>
      </div>

      {/* Z Shape Pipe */}
      <div style={{ position: "absolute", top: "8.5vw", left: "7.9vw" }}>
        <ZshapePipe flow={flow1} onClick={() => { setFlow1((flow1) => !flow1); }}
        ref={(ref) => { if (ref) { ref.id = "PipeP1toSump"; iconRefs.push(ref); } }} />
      </div>

      {/* Straight Pipe from Borewell to Sump */}
      <div style={{ position: "absolute", top: "21vw", left: "15vw" }}>
        <StraightPipe flow={flow1} style={{ width: "4.8vw", height: "4.8vw" }} 
        ref={(ref) => { if (ref) { ref.id = "PipeBoreToSump"; iconRefs.push(ref); } }}
        />
      </div>

      {/* Borewell */}
      <div id="borewellIcon" style={{ position: "absolute", top: "17vw", left: "3.8vw" }}>
        <img
          src={Borewell}
          alt="borewell"
          style={{ width: "4.8vw", height: "4.8vw" }}
          onClick={(e) => handleIconClick(e)}
          ref={(ref) => { if (ref) { ref.id = "Borewell1"; iconRefs.push(ref); } }}
        />
        <div style={{ fontSize: "1vw" }}>Borewell</div>
      </div>

      {/* Straight Pipes */}
      <div>
        <div style={{ position: "absolute", top: "20.6vw", left: "25vw" }}>
          <StraightPipe flow={flow2} 
          ref={(ref) => { if (ref) { ref.id = "motorOHTPipe"; iconRefs.push(ref); } }} />
        </div>

        {/* Sump */}
        <Sump waterInSump={waterInSump} onClick={(e) => handleIconClick(e)} 
         ref={(ref) => {if (ref) {ref.id = "KRBSump"; iconRefs.push(ref);} }}/>

        {/* MirrorZpipe */}
        <div style={{ position: "absolute", top: "11.9vw", left: "25.5vw" }}>
          <MirrorZPipe flow={flow2} 
          ref={(ref) => { if (ref) { ref.id = "motorOHTPipe"; iconRefs.push(ref); } }} />
        </div>

        {/* Motor */}
        <div style={{ position: "absolute", zIndex: 2,top: "17vw", left: "21.5vw", textAlign: "center", width: "5.8vw" }}
          ref={(ref) => { if (ref) { ref.id = "Motor"; iconRefs.push(ref); } }}>
          <img src={Motor} alt="Motor"
            className={`motor ${motorOn ? "running" : ""}`}
            style={{ width: "3vw", height: "3vw", transform: "scaleX(-1)", }}
            onClick={() => {
              toggleIsOn("valve5");
              if (isSimulationRunning) {
                handleMotorToggle();
              }
            }}
            />
            {motorOn && (<div style={{ fontSize: "10px", color: "green" }}>Running</div>)}
            <div style={{ fontSize: "1vw" }}>Motor</div>
            <div style={{fontSize: "1vw"}}>{motorOn ? (flowrate + Math.random() * 2 - 1).toFixed(2) : 0} L/s</div>
          </div>

          {/* L Shape Pipe */}
        <div style={{ position: "absolute", top: "11.5vw", left: "32.2vw", transform: "rotate(180deg)" }}>
          <LShapePipe flow={flow1} 
          ref={(ref) => { if (ref) { ref.id = "OHTtoROPipe"; iconRefs.push(ref); } }}
          />
        </div>

        {/* L Shape Pipe */}
        <div style={{ position: "absolute", top: "10.5vw", left: "31.8vw", transform: "rotate(90deg)" }}>
          <LShapePipe flow={flow1} />
        </div>

        <div style={{ position: "absolute", top: "1.5vw", left: "34.3vw", textAlign: "center" }}>
          <div style={{ fontSize: "1vw" }}>Admin Block Washrooms</div>
          <img src={Washrooms} alt="WaterTank" style={{ width: "2.8vw", height: "2.8vw" }} />
        </div>

        <div style={{ position: "absolute", top: "7.6vw", left: "37.2vw", textAlign: "center" }}>
          <div style={{ fontSize: "1vw" }}>KRB Washrooms</div>
          <img src={Washrooms} alt="WaterTank" style={{ width: "2.8vw", height: "2.8vw" }} />
        </div>

        {/* Straight Pipe */}
        <div style={{ position: "absolute", top: "13vw", left: "41.5vw" }}>
          <StraightPipe flow={flow1} />
        </div>

       {/* Water Tower */}
       <div>
          <WaterTank waterInOHT={waterInOHT} handleIconClick={handleIconClick} 
          onClick={(e) => handleIconClick(e)}
          ref={(ref) => { if (ref) { ref.id = "KRBOHTIcon"; iconRefs.push(ref); } }} />
        </div>


        {/* Straight Pipe */}
        <div style={{ position: "absolute", top: "23.2vw", left: "48.9vw" }}>
          <StraightPipe flow={flow1} />
        </div>

        {/* RO Plant */}
        <div style={{ position: "absolute", top: "17vw", left: "37.2vw" }}>
          <img src={roPlantImage} alt="ro plant" style={{ width: "4.8vw", height: "4.8vw" }}
            onClick={(e) => handleIconClick(e)} ref={(ref) => { if (ref) { ref.id = "ROPlant"; iconRefs.push(ref); } }}
          />
          <div style={{ fontSize: "1vw" }}>RO Plant</div>
        </div>

        {/* E Shape Pipe */}
        <div style={{ position: "absolute", top: "30vw", left: "51.5vw" }}>
          <EShapePipe flow={flow1} />
        </div>

        {/* Water Tower */}
        <div style={{ position: "absolute", top: "16.5vw", left: "43.5vw" , textAlign: "center"}}>
          <div style={{ fontSize: "1vw" }}>RO Filtered Water OHT</div>
          <div style={{ fontSize: "1vw" }}><b>{waterInROFilter.toFixed(2)}L</b></div>
          <img src={ROWatertank} alt="WaterTank" style={{ width: "5vw", height: "5vw" }} onClick={(e) => handleIconClick(e)}
            ref={(ref) => { if (ref) { ref.id = "KRBROOHT"; iconRefs.push(ref); } }} />
        </div>

        {/* RO Coolers */}
        <div style={{ position: "absolute", top: "28vw", left: "44.4vw", textAlign: "center", }} >
          <img src={roCoolerImage} alt="ro cooler 1" style={{ width: "2.8vw", height: "2.8vw" }}
            onClick={(e) => handleIconClick(e)}
            ref={(ref) => { if (ref) { ref.id = "ROCooler1"; iconRefs.push(ref); } }}
          />
          <div style={{ fontSize: "1vw" }}>RO 1</div>
          <div style={{ fontSize: "1vw" }}>{((3 * waterConsumed) / 4).toFixed(1)}L</div>
        </div>

        <div style={{ position: "absolute", top: "28vw", left: "47.1vw", textAlign: "center", }}>
          <img src={roCoolerImage} alt="ro cooler 2" style={{ width: "2.8vw", height: "2.8vw" }}
            onClick={(e) => handleIconClick(e)}
            ref={(ref) => { if (ref) { ref.id = "ROCooler2"; iconRefs.push(ref); } }}
          />
          <div style={{ fontSize: "1vw" }}>RO 2</div>
        </div>

        <div style={{ position: "absolute", top: "28vw", left: "49.8vw", textAlign: "center", }}>
          <img src={roCoolerImage} alt="ro cooler 3" style={{ width: "2.8vw", height: "2.8vw" }}
            onClick={(e) => handleIconClick(e)}
            ref={(ref) => { if (ref) { ref.id = "ROCooler3"; iconRefs.push(ref); } }} />
          <div style={{ fontSize: "1vw" }}>RO 3</div>
          <div style={{ fontSize: "1vw" }}>{(waterConsumed / 4).toFixed(1)}L</div>
        </div>
      </div>
    </div>

  )
};

export default SimulationCanvas;
