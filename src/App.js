import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RealValueVisualisation from './pages/HomePage/RealValueVisualisation';
import VisualizationPage from './pages/VisualizationPage/VisualizationPage';
import SimulationPage from './pages/SimulationPage/SimulationPage';
import SimulationScenario1 from './pages/SimulationPage/SimulationScenario1';
import LoginPage from './pages/LoginPage/LoginPage';
// import RoOHT from './pages/SimulationPage/components/RoOHT/RoOHT';
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
          <Route path="simulation/scenario1" element={<SimulationScenario1 />} />
          <Route path='login' element={<LoginPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
