import React, { useState } from 'react';
import './SimulationForm.css';

function SimulationForm({ SoilQuantity, setSoilQuantity, SandQuantity, setSandQuantity, inputValues, handleChange, handleStartSimulation, isSimulationRunning,handleDownloadLog }) {
    const [isWaterConfigCollapsed, setIsWaterConfigCollapsed] = useState(false);
    const [isCapacitiesCollapsed, setIsCapacitiesCollapsed] = useState(false);
    const [isROPlantConfigCollapsed, setIsROPlantConfigCollapsed] = useState(false);
    const [isMotorConfigCollapsed, setIsMotorConfigCollapsed] = useState(false);

    const toggleWaterConfig = () => {
        setIsWaterConfigCollapsed(!isWaterConfigCollapsed);
    };

    const toggleCapacities = () => {
        setIsCapacitiesCollapsed(!isCapacitiesCollapsed);
    };

    const toggleROPlantConfig = () => {
        setIsROPlantConfigCollapsed(!isROPlantConfigCollapsed);
    };

    const toggleMotorConfig = () => {
        setIsMotorConfigCollapsed(!isMotorConfigCollapsed);
    };

    return (
        <div>
        <div className="container" style={{ flex: 1, overflowY: 'scroll', height: '70vh', color: 'white' }}>
            <div>
            <label style={{color: 'black'}}>Speed Multiplier: </label>
            <select name="timeMultiplier" onChange={handleChange} value={inputValues.timeMultiplier}>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
                <option value="8">8x</option>
            </select>
            </div>
            <h3 className="heading" onClick={toggleWaterConfig}>
                Water Configuration
            </h3>
            {isWaterConfigCollapsed && (
                <>
                    <h4 className="heading-in" htmlFor="SoilQuantity">
                        Soil Impurities (In grams)
                    </h4>
                    <input
                        type="number"
                        name="SoilQuantity"
                        id="SoilQuantity"
                        value={inputValues.SoilQuantity}
                        className='input-box'
                        // onChange={(e) => {
                        //     setSoilQuantity(e.target.value);
                        //     handleChange(e);
                        // }}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in" htmlFor="SandQuantity">
                        Sand Impurities (In grams)
                    </h4>
                    <input
                        type="number"
                        name="SandQuantity"
                        id="SandQuantity"
                        value={inputValues.SandQuantity}
                        // onChange={(e) => {
                        //     setSandQuantity(e.target.value);
                        //     handleChange(e);
                        // }}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">Temperature (°C):</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="temperature"
                        id="temperature"
                        value={inputValues.temperature}
                        onChange={handleChange}
                    />
                </>
            )}

            <h3 className="heading" onClick={toggleCapacities}>
                Capacities
            </h3>
            {isCapacitiesCollapsed && (
                <>
                    <h4 className="heading-in">Sump Capacity (Liters):</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="sumpCapacity"
                        id="sumpCapacity"
                        value={inputValues.sumpCapacity}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">OHT Capacity (Liters):</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="ohtCapacity"
                        id="ohtCapacity"
                        value={inputValues.ohtCapacity}
                        onChange={handleChange}
                    />
                </>
            )}

            <h3 className="heading" onClick={toggleROPlantConfig}>
                RO Plant Configuration
            </h3>
            {isROPlantConfigCollapsed && (
                <>
                    <h4 className="heading-in">Desired TDS (After Filtration):</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="desired_tds"
                        id="desired_tds"
                        value={inputValues.desired_tds}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">Membrane Area (m²):</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="membrane_area"
                        id="membrane_area"
                        value={inputValues.membrane_area}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">RO OHT Capacity (Liters):</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="ro_ohtCapacity"
                        id="ro_ohtCapacity"
                        value={inputValues.ro_ohtCapacity}
                        onChange={handleChange}
                    />
                </>
            )}

            <h3 className="heading" onClick={toggleMotorConfig}>
                Motor Configuration
            </h3>
            {isMotorConfigCollapsed && (
                <>
                    <h4 className="heading-in">Voltage:</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="voltage"
                        id="voltage"
                        value={inputValues.voltage}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">Current:</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="current"
                        id="current"
                        value={inputValues.current}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">Power Factor:</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="power_factor"
                        id="power_factor"
                        value={inputValues.power_factor}
                        onChange={handleChange}
                    />
                    <h4 className="heading-in">Motor Efficiency:</h4>
                    <input
                        className="input-box"
                        type="number"
                        name="motor_efficiency"
                        id="motor_efficiency"
                        value={inputValues.motor_efficiency}
                        onChange={handleChange}
                    />
                </>
            )}
        </div>
        <button onClick={handleStartSimulation} className="button">
                {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
        </button>
        <button onClick={handleDownloadLog} className='button' style={{background: 'red'}}>Download Simulation Log</button>
        </div>
    );
}

export default SimulationForm;