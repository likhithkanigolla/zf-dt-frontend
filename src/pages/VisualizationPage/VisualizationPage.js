// VisualizationPage.js
import React from 'react';
import './VisualizationPage.css'; // Import CSS file
import NavigationBar from '../../components/navigation/Navigation';

const VisualizationPage = () => {
  return (
    <div className="visualization-page">
     <NavigationBar title="Digital Twin for Water Quality - Analytics"/>
    <iframe src="https://smartcitylivinglab.iiit.ac.in/grafana/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digital-twin?orgId=1&kiosk&autofitpanels" width="100%" height="847vh" frameborder="0"></iframe>
   </div>
  );
}

export default VisualizationPage;
