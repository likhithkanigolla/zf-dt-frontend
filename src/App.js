import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RealValueVisualisation from './pages/HomePage/RealValueVisualisation';
import VisualizationPage from './pages/VisualizationPage/VisualizationPage';
import SimulationPage from './pages/SimulationPage/SimulationPage';
import SimulationScenarioTemplate from './pages/SimulationPage/Scenarios/SimulationScenarioTemplate';
import WaterLevelNodeFailure from './pages/SimulationPage/Scenarios/WaterLevelNodeFailure';
import LoginPage from './pages/LoginPage/LoginPage';

const App = () => {
  return (
    <Router basename="/dt_waternetwork">
      <Routes>
        {/* Define routes relative to /dt_waternetwork */}
        <Route path="/" element={<RealValueVisualisation />} />
        <Route path="analytics" element={<VisualizationPage />} />
        <Route path="simulation" element={<SimulationPage />} />
        <Route path="simulation/scenario1" element={<SimulationScenarioTemplate />} />
        <Route path="simulation/waterlevel" element={<WaterLevelNodeFailure />} />
        {/* <Route path="test" element={<Test />} /> */}
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
