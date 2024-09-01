import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeakageOptions from '../LeakageOptions';
import Timer from '../../../../components/timer-component';

import './Form.css';

function SimulationForm({ inputValues, handleChange, handleStartSimulation, handleSaveLog, handleStopSimulation, isSimulationRunning, handleApplyLeakages, showLeakageOptions, setLeakageRate, setLeakageLocation, setNumLeakages, numLeakages, leakageLocation, leakageRate, isLoading, flowrate, PermeateFlowRate }) {
    const [isLeakageConfigCollapsed, setIsLeakageConfigCollapsed] = useState(false);
    const [isWaterConfigCollapsed, setIsWaterConfigCollapsed] = useState(false);
    const [isCapacitiesCollapsed, setIsCapacitiesCollapsed] = useState(false);
    const [isROPlantConfigCollapsed, setIsROPlantConfigCollapsed] = useState(false);
    const [isMotorConfigCollapsed, setIsMotorConfigCollapsed] = useState(false);
    const [prevScenario, setPrevScenario] = useState(inputValues.Scenarios );  // Set default to "2"

    const navigate = useNavigate();

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

    useEffect(() => {
        // console.log("Simulation",isSimulationRunning);
        if (isSimulationRunning && inputValues.Scenarios !== prevScenario) {
            handleSaveLog(); // End the current simulation
            handleStartSimulation(); // Start the new simulation
        }
        setPrevScenario(inputValues.Scenarios);
    }, [inputValues.Scenarios]);

    const handleChangeOpt = async (event) => {
        await handleChange(event);
        handleSaveLog();
        if (event.target.value === "6") {
            navigate('/dt_waternetwork/simulation/waterlevel');
        }
        // handleStopSimulation();
    };

    const isScenario2 = inputValues.Scenarios === "2";
    // const isScenario1 = inputValues.Scenarios === "1";
    const isScenario3 = inputValues.Scenarios === "3";
    const isScenario7 = inputValues.Scenarios === "7";
    const isallScenario = inputValues.Scenarios === "all";

    const handleStartClick = () => {
        if (isScenario7) {
            handleApplyLeakages(inputValues.leakage_location, inputValues.leakage_rate);
        }
        handleStartSimulation();
    };

    return (
        <div classname>
        <div style={{ width: '20vw', height: '20vh'}}>
            <h1 style={{ textAlign: 'center', 
                color: '#123462',
                fontSize: '2.2vw',
                position: 'relative'
                }}>Configuration</h1>
            <div className="container" style={{height: '30vw'}}>
                <div>
                    <label>
                        <select 
                            name="Scenarios" 
                            className="dropdown-content" 
                            onChange={handleChangeOpt} 
                            value={inputValues.Scenarios} // Default to Scenario 2
                        >
                              
                        
                            <option value="2">Soil Impurities vs TDS</option>
                            <option value="3">Sand Impurities vs TDS</option>
                            <option value="7">Pipe Leakages</option>
                            <option value="6">Water Level Node Failed</option>
                            <option value="all">All</option>
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
                    <input style={{ width: '15vw' }} type="range" min="1" max="500" value={inputValues.timeMultiplier} className="slider" id="myRange" onChange={handleChange}
                    disabled={isSimulationRunning}  name="timeMultiplier" />
                    <div className='simulation-speed'>
                        <label style={{ color: 'white', background: '#ffffff00', whiteSpace: 'nowrap' }} className="heading-as">
                            <b>Simulation Time: <span>{inputValues.simulationTime} sec</span></b>
                        </label>
                    </div>
                    <input type='number' value={inputValues.simulationTime} className='input-box' name='simulationTime' onChange={handleChange}
                    disabled={isSimulationRunning}  />
                </div>

                {/* Parameter Configuration */}
                {(isScenario2 || isScenario3) && (
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
                                    disabled={isSimulationRunning} 
                                    
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
                                    disabled={isSimulationRunning} 
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
                                    disabled={isSimulationRunning} 
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
                                    disabled={isSimulationRunning} 
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
                            disabled={isSimulationRunning} 
                        />
                    </div>
                )}
                {/* Additional Configurations when no scenario is selected */}
                {isallScenario && (
                    <>
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
                        <h4 className="heading" onClick={toggleCapacities}>Capacity Configuration</h4>
                        <h4 className="heading-in">Sump Capacity (Liters):</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="sumpCapacity"
                            id="sumpCapacity"
                            value={inputValues.sumpCapacity}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
                        />
                        <h4 className="heading-in">OHT Capacity (Liters):</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="ohtCapacity"
                            id="ohtCapacity"
                            value={inputValues.ohtCapacity}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
                        />
                        <h4 className="heading-in">RO OHT Capacity (Liters):</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="ro_ohtCapacity"
                            id="ro_ohtCapacity"
                            value={inputValues.ro_ohtCapacity}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
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
                            disabled={isSimulationRunning} 
                        />
                        <h4 className="heading-in">Membrane Area (m²):</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="membrane_area"
                            id="membrane_area"
                            value={inputValues.membrane_area}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
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
                            disabled={isSimulationRunning} 
                        />
                        <h4 className="heading-in">Current:</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="current"
                            id="current"
                            value={inputValues.current}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
                        />
                        <h4 className="heading-in">Power Factor:</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="power_factor"
                            id="power_factor"
                            value={inputValues.power_factor}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
                        />
                        <h4 className="heading-in">Motor Efficiency:</h4>
                        <input
                            className="input-box"
                            type="number"
                            name="motor_efficiency"
                            id="motor_efficiency"
                            value={inputValues.motor_efficiency}
                            onChange={handleChange}
                            disabled={isSimulationRunning} 
                        />

                        <LeakageOptions
                        showLeakageOptions={true}
                        numLeakages={numLeakages}
                        setNumLeakages={setNumLeakages}
                        leakageLocation={leakageLocation}
                        setLeakageLocation={setLeakageLocation}
                        leakageRate={leakageRate}
                        setLeakageRate={setLeakageRate}
                        handleApplyLeakages={handleApplyLeakages}
                        flowrate={flowrate}
                        PermeateFlowRate={PermeateFlowRate}
                    />
                    </>
                )}

                {/* Leakage Configuration */}
                {(isScenario7) && (
                    <LeakageOptions
                        showLeakageOptions={true}
                        numLeakages={numLeakages}
                        setNumLeakages={setNumLeakages}
                        leakageLocation={leakageLocation}
                        setLeakageLocation={setLeakageLocation}
                        leakageRate={leakageRate}
                        setLeakageRate={setLeakageRate}
                        handleApplyLeakages={handleApplyLeakages}
                        flowrate={flowrate}
                        PermeateFlowRate={PermeateFlowRate}
                        isSimulationRunning={isSimulationRunning}
                    />
                )}
            </div>
            <div className="button-container" style={{zIndex: 1000}}>
                    <button
                        onClick={handleStartClick}
                        className="button-form"
                        style={{
                            background: isLoading
                                ? "gray"
                                : isSimulationRunning
                                    ? "blue"
                                    : "rgb(15, 140, 17)",
                            maxWidth: '18vw',
                            fontSize: '1.1vw',
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Starting..." : isSimulationRunning ? "Pause" : "Start"}
                    </button>
                    <button onClick={handleSaveLog} className="button-form" style={{ background: 'rgb(231, 76, 60)', maxWidth: '18vw', fontSize: '1.1vw' }}>
                        End
                    </button>
                
                </div>
        </div>
        </div>
    );
}

export default SimulationForm;

