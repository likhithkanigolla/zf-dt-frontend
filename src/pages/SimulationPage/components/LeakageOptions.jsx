import React from 'react';
import LeakageIcon from "../../images/leakage_water.png"; 

const LeakageOptions = ({ showLeakageOptions, numLeakages, setNumLeakages, leakageLocation, setLeakageLocation, leakageRate, setLeakageRate, handleApplyLeakages, flowrate, PermeateFlowRate}) => {
  if (!showLeakageOptions) {
    return null;
  }

  return (
    <div className="leakage-options-popup">
    {/* Write the text in the form of mathematical formaula; Effective Flowrate = Flowrate - (Number of Leakages * LeakageRate) */}
    <h6 style={{ textAlign: 'center', color: 'black'}}>Effective Flowrate = Flowrate - (Number of Leakages * LeakageRate)</h6>
    <h6 style={{ textAlign: 'center', color: 'black'}}>OHT OutflowRate =  FlowrateOfAdminBlockWashrooms + FlowrateOfKRBBlockWashrooms + FlowrateofRO </h6>
    <h6 style={{ textAlign: 'center', color: 'black'}}>Original Flowrate = {flowrate} L/s</h6>
    <h6 style={{ textAlign: 'center', color: 'black'}}>Effective Flowrate = {(flowrate - (numLeakages*leakageRate)).toFixed(2)} L/s</h6>
    <h6 style={{ textAlign: 'center', color: 'black'}}>OHT Outflowrate = {(flowrate-(flowrate*0.06)-PermeateFlowRate).toFixed(2)} L/s</h6>

    <div className="heading" style={{ display: 'flex', alignItems: 'center'}}>
  <h4  style={{ margin: 0 }}>Leakage Configuration</h4>
  <img 
    src={LeakageIcon} 
    alt="Leakage"  
    style={{ 
      
      width: '1vw', 
      height: '1vw' 
    }} 
  />
</div>
      <label htmlFor="numLeakages">Number of Leakages:</label>
      <input
        type="number"
        id="numLeakages"
        value={numLeakages}
        onChange={(e) => setNumLeakages(parseInt(e.target.value, 4))}
        min="1"
        className="input-box"
      />
      <label htmlFor="leakageLocation">Leakage Location:</label>
      <select
        id="leakageLocation"
        value={leakageLocation}
        onChange={(e) => setLeakageLocation(e.target.value)}
        className="input-box"
      >
        <option value="">Select Location</option>
        <option value="motorOHT">Between Motor and OHT</option>
        <option value="roPlant">Around RO Plant</option>
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
      />
      <button onClick={handleApplyLeakages} className="button-form" style={{ background: 'black' }}>Apply</button>
    </div>
  );
};

export default LeakageOptions;