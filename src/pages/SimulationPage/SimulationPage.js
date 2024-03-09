import React, { useState } from 'react';
import './SimulationPage.css';
import NavigationBar from '../../components/navigation/Navigation';

const SimulationPage = () => {
  const [inputValues, setInputValues] = useState({
    number1: '',
    number2: '',
    number3: '',
    number4: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const handleCalculate = async () => {
    try {
      const response = await fetch('http://localhost:1629/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputValues)
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error calculating simulation:', error);
    }
  };

  return (
    <div className="simulation-page">
      <h2>Simulation Page</h2>
      <div className="input-container">
        <input type="number" name="number1" value={inputValues.number1} onChange={handleChange} />
        <input type="number" name="number2" value={inputValues.number2} onChange={handleChange} />
        <input type="number" name="number3" value={inputValues.number3} onChange={handleChange} />
        <input type="number" name="number4" value={inputValues.number4} onChange={handleChange} />
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      {result && <p>Result: {result}</p>}
    </div>
  );
}

export default SimulationPage;
