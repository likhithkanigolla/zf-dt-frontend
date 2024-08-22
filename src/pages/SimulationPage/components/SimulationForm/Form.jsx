import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeakageOptions from '../LeakageOptions';

import './Form.css';

function SimulationForm({ inputValues, handleChange, handleStartSimulation, handleSaveLog, isSimulationRunning, handleApplyLeakages, showLeakageOptions,setLeakageRate, setLeakageLocation, setNumLeakages,numLeakages,leakageLocation,leakageRate , isLoading}) {
    const [isLeakageConfigCollapsed, setIsLeakageConfigCollapsed] = useState(false);
    const [isWaterConfigCollapsed, setIsWaterConfigCollapsed] = useState(false);
    const [isCapacitiesCollapsed, setIsCapacitiesCollapsed] = useState(false);
    const [isROPlantConfigCollapsed, setIsROPlantConfigCollapsed] = useState(false);
    const [isMotorConfigCollapsed, setIsMotorConfigCollapsed] = useState(false);

    const toggleLeakageConfig = () => {
        setIsLeakageConfigCollapsed(!isLeakageConfigCollapsed);
    };

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

    const navigate = useNavigate();

    const handleChangeOpt = (event) => {
        handleChange(event);
        if (event.target.value === "6") {
            navigate('/dt_waternetwork/simulation/waterlevel');
        }
    };

    const isScenario2 = inputValues.Scenarios === "2";
    const isScenario3 = inputValues.Scenarios === "3";
    const isScenario7 = inputValues.Scenarios === "7";
    const isAnyScenarioSelected = isScenario2 || isScenario3 || isScenario7;

    const handleStartClick = () => {
        if (isScenario7) {
            handleApplyLeakages(inputValues.leakage_location, inputValues.leakage_rate);
        }
        handleStartSimulation();
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', color: '#123462' }}>Configuration</h1>
            <div className="container" style={{ flex: 1, overflowY: 'scroll', height: '68vh', color: 'white' }}>
                <div>
                    <label>
                        <select name="Scenarios" className="dropdown-content" onChange={handleChangeOpt} value={inputValues.Scenarios}>
                            <option value="1">Select Scenario</option>
                            <option value="2">Soil Impurities vs TDS</option>
                            <option value="3">Sand Impurities vs TDS</option>
                            <option value="6">Water Level Node Failed</option>
                            <option value="7">Pipe Leakages</option>
                            <option value="4" disabled>Flow vs TDS</option>
                            <option value="5" disabled>Water Quality Node Failed</option>
                            <option value="8" disabled>Water Purification Agents vs TDS</option>
                        </select>
                    </label>
                    <div className="simulation-speed">
                        <label style={{ color: 'white', background: '#ffffff00', whiteSpace: 'nowrap' }} className="heading-as">
                            <b>Simulation Speed: <span>{inputValues.timeMultiplier}x</span></b>
                        </label>
                    </div>
                    <input style={{ width: '15vw' }} type="range" min="1" max="500" value={inputValues.timeMultiplier} className="slider" id="myRange" onChange={handleChange} name="timeMultiplier" />
                    <div className='simulation-speed'>
                        <label style={{ color: 'white', background: '#ffffff00', whiteSpace: 'nowrap' }} className="heading-as">
                            <b>Simulation Time: <span>{inputValues.simulationTime} sec</span></b>
                        </label>
                    </div>
                    <input type='number' value={inputValues.simulationTime} className='input-box' name='simulationTime' onChange={handleChange} />
                </div>

                {/* Parameter Configuration */}
                {(isScenario2 || isScenario3 || !isAnyScenarioSelected) && (
                    <div>
                        <h4 className="heading">Parameter Configuration</h4>
                        {(!isScenario2 && !isScenario3) && (
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
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        {isScenario2 && (
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
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        {isScenario3 && (
                            <>
                                <h4 className="heading-in" htmlFor="SandQuantity">
                                    Sand Impurities (In grams)
                                </h4>
                                <input
                                    type="number"
                                    name="SandQuantity"
                                    id="SandQuantity"
                                    value={inputValues.SandQuantity}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        <h4 className="heading-in">Temperature (°C):</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="temperature"
                            id="temperature"
                            value={inputValues.temperature}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Leakage Configuration */}
                {(isScenario7 || !isAnyScenarioSelected) && (
                    // <div>
                    //     <h4 className="heading" onClick={toggleLeakageConfig}>Leakage Configuration</h4>
                    //     <h4 className="heading-in">Number of Leakages:</h4>
                    //     <input
                    //         className="input-box"
                    //         type="number"
                    //         name="num_leakages"
                    //         id="num_leakages"
                    //         value={inputValues.num_leakages}
                    //         onChange={handleChange}
                    //     />
                    //     <h4 className="heading-in">Leakage Location:</h4>
                    //     <select
                    //         className="input-box"
                    //         name="leakage_location"
                    //         id="leakage_location"
                    //         value={inputValues.leakage_location}
                    //         onChange={handleChange}
                    //     >
                    //         <option value="">Select Location</option>
                    //         <option value="Between Motor and OHT">Between Motor and OHT</option>
                    //         <option value="Around RO Plant">Around RO Plant</option>
                    //         <option value="Near Sump">Near Sump</option>
                    //     </select>
                    //     <h4 className="heading-in">Leakage Rate (Liters/Second):</h4>
                    //     <input
                    //         className="input-box"
                    //         type="number"
                    //         name="leakage_rate"
                    //         id="leakage_rate"
                    //         value={inputValues.leakage_rate}
                    //         onChange={handleChange}
                    //     />
                    //     <button onClick={handleApplyLeakages} className="button-form" style={{ background: 'rgb(15, 140, 17)' }}>Apply</button>
                    // </div>
   

                    <LeakageOptions
                    showLeakageOptions={true}
                    numLeakages={numLeakages}
                    setNumLeakages={setNumLeakages}
                    leakageLocation={leakageLocation}
                    setLeakageLocation={setLeakageLocation}
                    leakageRate={leakageRate}
                    setLeakageRate={setLeakageRate}
                    handleApplyLeakages={handleApplyLeakages}
                  />
         
                    
                )}

                {/* Additional Configurations when no scenario is selected */}
                {!isAnyScenarioSelected && (
                    <>
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
                        <h4 className="heading-in">RO OHT Capacity (Liters):</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="ro_ohtCapacity"
                            id="ro_ohtCapacity"
                            value={inputValues.ro_ohtCapacity}
                            onChange={handleChange}
                        />

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

                        <h4 className="heading" onClick={toggleMotorConfig}>Motor Configuration</h4>
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

            <div className="button-container">
            <button
                onClick={handleStartClick}
                className="button-form"
                style={{ 
                    background: isLoading 
                        ? "gray" 
                        : isSimulationRunning 
                            ? "blue" 
                            : "rgb(15, 140, 17)" 
                }}
                disabled={isLoading}
            >
                {isLoading ? "Starting..." : isSimulationRunning ? "Pause" : "Start"}
            </button>
                <button onClick={handleSaveLog} className="button-form" style={{ background: 'rgb(231, 76, 60)' }}>
                    End
                </button>
            </div>
        </div>
    );
}

export default SimulationForm;
