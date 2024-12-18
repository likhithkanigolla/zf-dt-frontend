import React from 'react';

const LeakageOptions = ({ showLeakageOptions, numLeakages, setNumLeakages, leakageLocation, setLeakageLocation, leakageRate, setLeakageRate, handleApplyLeakages, flowrate, PermeateFlowRate, isSimulationRunning}) => {
  if (!showLeakageOptions) {
    return null;
  }

  return (
    <div className="leakage-options-popup">
       <div className="heading" style={{ display: 'flex', alignItems: 'center'}}>
          <h4  style={{ margin: 0 }}>Leakage Configuration
          <img 
            src="../../images/leakage_water.png"
            alt="Leakage"  
            style={{ 
              
              width: '1vw', 
              height: '1vw',
              marginLeft: '0.5vw'
            }} 
          />
          </h4>
        </div>
    {/* Write the text in the form of mathematical formaula; Effective Flowrate = Flowrate - (Number of Leakages * LeakageRate) */}
    <h6 style={{ textAlign: 'left', color: 'black'}}>Effective Flowrate = Flowrate - (Number of Leakages * LeakageRate)</h6>
    <h6 style={{ textAlign: 'left', color: 'black'}}>OHT OutflowRate =  FlowrateOfAdminBlockWashrooms + FlowrateOfKRBBlockWashrooms + FlowrateofRO </h6>
    <h6 style={{ textAlign: 'left', color: 'black'}}>Original Flowrate = {flowrate} L/s</h6>
    <h6 style={{ textAlign: 'left', color: 'black'}}>Effective Flowrate = {(flowrate - (numLeakages*leakageRate)).toFixed(2)} L/s</h6>
    <h6 style={{ textAlign: 'left', color: 'black'}}>OHT Outflowrate = {(flowrate-(flowrate*0.06)-PermeateFlowRate).toFixed(2)} L/s</h6>
   
      <label htmlFor="numLeakages">Number of Leakages:</label>
      <input
        type="number"
        id="numLeakages"
        value={numLeakages}
        onChange={(e) => setNumLeakages(parseInt(e.target.value, 4))}
        min="1"
        className="input-box"
        disabled={isSimulationRunning} 
      />
      <label htmlFor="leakageLocation">Leakage Location:</label>
      <select
        id="leakageLocation"
        value={leakageLocation}
        onChange={(e) => setLeakageLocation(e.target.value)}
        onClick={(e) => setLeakageLocation(e.target.value)}
        className="input-box"
       >
        {/* <option value="">Select Location</option> */}
        <option value="motorOHT">Between Motor and OHT</option>
        <option value="roPlant">Between OHT and RO Plant</option>
        {/* Add more options as needed */}
      </select>
      <label htmlFor="leakageRate">Leakage Rate (L/s):</label>
      <input
        type="number"
        id="leakageRate"
        value={leakageRate}
        onChange={(e) => setLeakageRate(parseFloat(e.target.value))}
        min="0"
        className="input-box"
        disabled={isSimulationRunning} 
      />
      <button onClick={handleApplyLeakages} className="button-form" style={{ background: 'black', borderRadius: '1vw', marginBottom: '1vw'}}>Apply</button>
    </div>
  );
};

export default LeakageOptions;