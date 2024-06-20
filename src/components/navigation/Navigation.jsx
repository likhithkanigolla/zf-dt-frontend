import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import IITHLOGO from './images/iiith.png';
import SCRCLOGO from './images/scrc_logo.png';
import ZFLOGO from './images/zf_logo.png';

const NavigationBar = ({ title }) => {
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar__logo">
          <img src={IITHLOGO} alt="IIITH Logo" />
        </div>
      </Link>
      <Link to="/">
        <div className="navbar__logo">
          <img src={SCRCLOGO} alt="Smart City Living Lab Logo" />
        </div>
      </Link>
      <div className="navbar__title">{title}</div> {/* Display dynamic title */}
      <Link to="/">
        <div className="navbar__logo">
          <img src={ZFLOGO} alt="ZF Logo" />
        </div>
      </Link>
      <div>
          {/* Dropdown to select the pages */}
          <select className="navbar__dropdown" onChange={(e) => { window.location.href = e.target.value }}>
            <option value="/" selected={window.location.pathname === '/'}>Home</option>
            <option value="/analytics" selected={window.location.pathname === '/analytics'}>Analytics</option>
            <option value="/actuation" selected={window.location.pathname === '/actuation'}>Actuation</option>
            <option value="/simulation" selected={window.location.pathname === '/simulation'}>Simulation</option>
          </select>
        </div>
    </nav>
  );
};

export default NavigationBar;
