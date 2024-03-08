// VisualizationPage.js
import React from 'react';
import './VisualizationPage.css'; // Import CSS file
import NavigationBar from '../../components/navigation/Navigation';

const VisualizationPage = () => {
  return (
    <div className="visualization-page">
    <NavigationBar />
      <h2>Visualization Page</h2>
      <p>This is the Visualization page.</p>
    </div>
  );
}

export default VisualizationPage;
