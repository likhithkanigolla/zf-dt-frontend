import React, { useState } from 'react';
import './Form.css';

function SimulationForm({inputValues, handleChange, handleStartSimulation, isSimulationRunning,handleDownloadLog,handleToolbarItemClick, handleLeakageIconClick, log}) {
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
    console.log("Log100:" , log)

    

    return (
        <div>
        <h1 style={{ textAlign: 'center', color: '#123462' }}>Configuration</h1>
        <div className="container" style={{ flex: 1, overflowY: 'scroll', height: '73vh', color: 'white' }}>
            <div>
            <label><select name="Scenarios" class="dropdown-content" onChange={handleChange} value={inputValues.Scenarios}>
                <option value="1">Scenario 1</option>
                <option value="2">Scenario 2</option>
                <option value="3">Scenario 3</option>
                <option value="4">Scenario 4</option>
            </select></label>
            <label style={{color: 'white', height: '4vw', whiteSpace: 'now'}} className="heading"><b>Simulation Speed: </b>
            <select name="timeMultiplier" onChange={handleChange} class="dropdown-content-n"  style={{ height: '30vw'}} value={inputValues.timeMultiplier}>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
                <option value="8">8x</option>
                <option value="16">16x</option>
                <option value="32">32x</option>
                <option value="64">64x</option>
            </select></label>
            </div>
            <h4 className="heading" onClick={toggleWaterConfig}>Water Parameter Configuration </h4>
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

            {/* {isWaterConfigCollapsed && (
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
            )} */}

            <h4 className="heading" onClick={toggleCapacities}>Capacity Configuration</h4>
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

            {/* {isCapacitiesCollapsed && (
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
            )} */}

            <h4 className="heading" onClick={toggleROPlantConfig}>RO Plant Configuration</h4>
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

            {/* {isROPlantConfigCollapsed && (
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
            )} */}

            <h4 className="heading" onClick={toggleMotorConfig}>Motor Configuration</h4>
                <h4 className="heading-in">Voltage:</h4>
                <input className="input-box" type="number"
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
            {/* {isMotorConfigCollapsed && (
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
            )} */}
        </div>

        {/* <Toolbar 
              handleToolbarItemClick={handleToolbarItemClick} 
              handleLeakageIconClick={handleLeakageIconClick} 
        /> */}

        

        <button onClick={handleStartSimulation} className="button-form">{isSimulationRunning ? "Stop Simulation" : "Start Simulation"}</button>
        {/* <button onClick={handleDownloadLog} className='button' style={{background: 'red'}}>Download Simulation Log</button> */}
        
        </div>
    );
}

export default SimulationForm;