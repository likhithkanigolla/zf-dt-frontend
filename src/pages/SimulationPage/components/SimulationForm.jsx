import React from 'react';

function SimulationForm({ SoilQuantity, setSoilQuantity, SandQuantity, setSandQuantity, inputValues, handleChange, handleStartSimulation, isSimulationRunning }) {
    return (
        <div className="container" style={{ flex: 1 }}>
            <h4 className="heading" htmlFor="SoilQuantity">
                Soil Impurities(In grams){" "}
            </h4>
            <input
                type="number"
                name="SoilQuantity"
                id="SoilQuantity"
                value={SoilQuantity}
                onChange={(e) => {
                    setSoilQuantity(e.target.value);
                    handleChange(e);
                }}
            />
            <h4 className="heading" htmlFor="SandQuantity">
                Sand Impurities(In grams){" "}
            </h4>
            <input
                type="number"
                name="SandQuantity"
                id="SandQuantity"
                value={SandQuantity}
                onChange={(e) => {
                    setSandQuantity(e.target.value);
                    handleChange(e);
                }}
            />
            <h4 className="heading">Temperature(°C):</h4>
            <input
                className="input-box"
                type="number"
                name="temperature"
                id="temperature"
                value={inputValues.temperature}
                onChange={handleChange}
            />
            <br />
            <h4 className="heading">Desired TDS(mg/Litre):</h4>
            <input
                className="input-box"
                type="number"
                name="desired_tds"
                id="desired_tds"
                value={inputValues.desired_tds}
                onChange={handleChange}
            />
            <h4 className="heading">Effective Membrane Area(m²):</h4>
            <input
                className="input-box"
                type="number"
                name="effective_membrane_area"
                id="effective_membrane_area"
                value={inputValues.effective_membrane_area}
                onChange={handleChange}
            />
            <br />
            <h4 className="heading">Sump Capacity (Liters):</h4>
            <input
                className="input-box"
                type="number"
                name="sumpCapacity"
                id="sumpCapacity"
                value={inputValues.sumpCapacity}
                onChange={handleChange}
            />
            <button onClick={handleStartSimulation} className="button">
                {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
            </button>
        </div>
    );
}

export default SimulationForm;