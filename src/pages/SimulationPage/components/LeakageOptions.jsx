import React from 'react';

const LeakageOptions = ({ showLeakageOptions, numLeakages, setNumLeakages, leakageLocation, setLeakageLocation, leakageRate, setLeakageRate, handleApplyLeakages }) => {
  if (!showLeakageOptions) {
    return null;
  }

  return (
    <div className="leakage-options-popup">
       <h4 className="heading">Leakage Configuration</h4>
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