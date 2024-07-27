import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RealValueVisualisation from './pages/HomePage/RealValueVisualisation';
import VisualizationPage from './pages/VisualizationPage/VisualizationPage';
import SimulationPage from './pages/SimulationPage/SimulationPage';
import SimulationScenarioTemplate from './pages/SimulationPage/Scenarios/SimulationScenarioTemplate';
import WaterLevelNodeFailure from './pages/SimulationPage/Scenarios/WaterLevelNodeFailure';
import LoginPage from './pages/LoginPage/LoginPage';
// import DemoPage from './pages/DemoSim/DemoPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/dt_waternetwork/*" element={<AppLayout />}> */}
        <Route path="/dt_waternetwork/*">
          <Route index element={<RealValueVisualisation />} />
          <Route path="analytics" element={<VisualizationPage />} />
          <Route path="simulation" element={<SimulationPage />} />
          {/* <Route path="/demo" element={<DemoPage />} /> */}
          <Route path="simulation/scenario1" element={<SimulationScenarioTemplate />} />
          <Route path="simulation/waterlevel" element={<WaterLevelNodeFailure />} />
          <Route path='login' element={<LoginPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
