// ActuationPage.js
import React from 'react';
import './ActuationPage.css';
import NavigationBar from '../../components/navigation/Navigation';

const ActuationPage = () => {
  return (
    <div className="actuation-page">
        <NavigationBar title="Digital Twin for Water Quality - Actuation"/>
      <h2>Actuation Page</h2>
      <p>This is the Actuation page.</p>
    </div>
  );
}

export default ActuationPage;
