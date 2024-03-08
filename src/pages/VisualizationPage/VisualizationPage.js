// VisualizationPage.js
import React from 'react';
import './VisualizationPage.css'; // Import CSS file
import NavigationBar from '../../components/navigation/Navigation';

const VisualizationPage = () => {
  return (
    <div className="visualization-page">
    <NavigationBar />
    <iframe src="http://10.3.1.117:3000/d/c9998c83-4255-4c0d-ad26-524b8b84272d/zf-digitaltwin?orgId=1&kiosk&refresh=5s&autofitpanels" width="100%" height="800px" frameborder="0"></iframe>
   </div>
  );
}

export default VisualizationPage;
