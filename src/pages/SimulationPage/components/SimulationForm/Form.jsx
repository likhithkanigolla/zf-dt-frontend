import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function SimulationForm({ inputValues, handleChange, handleStartSimulation, handleSaveLog, isSimulationRunning }) {
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

    const isScenario1 = inputValues.Scenarios === "1";
    const isScenario2 = inputValues.Scenarios === "2";
    const isScenario3 = inputValues.Scenarios === "3";

    const navigate = useNavigate();

    const handleChangeOpt = (event) => {
        if (event.target.value === "6") {
            navigate('/dt_waternetwork/simulation/waterlevel');
        }
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
                            <option value="4" disabled>Flow vs TDS</option>
                            <option value="5" disabled>Water Quality Node Failed</option>
                            <option value="7" disabled>Water Purifiation Agents vs TDS</option>

                        </select>
                    </label>
                    <div className="simulation-speed">
                        <label style={{ color: 'white', background:'#ffffff00' ,whiteSpace: 'nowrap'}} className="heading-as"><b>Simulation Speed:  <span>{inputValues.timeMultiplier}x</span></b></label>
                        {/* <select name="timeMultiplier" onChange={handleChange} className="dropdown-content-n" value={inputValues.timeMultiplier}>
                            <option value="1">1x</option>
                            <option value="2">2x</option>
                            <option value="4">4x</option>
                            <option value="8">8x</option>
                            <option value="16">16x</option>
                            <option value="32">32x</option>
                            <option value="64">64x</option>
                        </select> */}
                    </div>
                    <input style={{width:'15vw'}} type="range" min="1" max="500" value={inputValues.timeMultiplier} className="slider" id="myRange" onChange={handleChange} name="timeMultiplier"/>
                    <div className='simulation-speed'>
                        <label style={{ color: 'white', background:'#ffffff00' ,whiteSpace: 'nowrap'}} className="heading-as"><b>Simulation Time:  <span>{inputValues.simulationTime} sec</span></b></label>
                    </div>
                    <input type='number' value={inputValues.simulationTime} className='input-box' name='simulationTime' onChange={handleChange}/>
                </div>
                <h4 className="heading" onClick={toggleWaterConfig}>Parameter Configuration</h4>
                {(isScenario1 || isScenario2) && (
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
                {(isScenario1 || isScenario3) && (
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
                {(isScenario1 || isScenario2 || isScenario3) && (
                    <>
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

                {isScenario1 && (
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
                <button onClick={handleStartSimulation} className="button-form" style={{background: isSimulationRunning? "blue":"rgb(15, 140, 17)"}}>
                    {isSimulationRunning ? "Pause" : "Start"}
                </button>
                <button onClick={handleSaveLog} className="button-form" style={{background:'rgb(231, 76, 60)'}}>
                    End
                </button>
            </div>
        </div>
    );
}

export default SimulationForm;
