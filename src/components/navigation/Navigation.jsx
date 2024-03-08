import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './NavigationBar.css';
import IITHLOGO from './images/iiith.png';
import SCRCLOGO from './images/scrc_logo.png';
import ZFLOGO from './images/zf_logo.png';

const NavigationBar = () => {
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
      <div className="navbar__title">Digital Twin for Water Quality</div>
      <Link to="/">
        <div className="navbar__logo">
          <img src={ZFLOGO} alt="ZF Logo" />
        </div>
      </Link>
    </nav>
  );
};

export default NavigationBar;
