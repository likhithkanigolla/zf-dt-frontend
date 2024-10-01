import React, { useEffect, useRef } from 'react';
import { FaDownload } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import ReplaySharpIcon from '@mui/icons-material/ReplaySharp';
import config from '../../config';
import './Console.css';

const ConsoleHeader = ({ handleDownloadLog, log, handleClearLog }) => {
  const listRef = useRef(null);


  const handleSaveLog = async (logMessages) => {
    const logString = logMessages.join('\n'); // Convert array to string
    try {
      const response = await fetch(`${config.backendAPI}/save_log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: logString, // Send the stringified log
      });
  
      if (response.ok) {
        console.log('Log saved successfully');
      } else {
        console.error('Failed to save log');
      }
    } catch (error) {
      console.error('Error saving log:', error);
    }
};


  useEffect(() => {
    // Scroll to the last element when 'log' changes
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="container-n console-container">
      <div className='flex-container heading-container sticky'>
        <h3 className='heading-n'>Console</h3>
        <button onClick={handleDownloadLog} className='button-c'>
          <DownloadSharpIcon className='icon'  />
        </button>
        <button onClick={handleClearLog} className='button-c'>
          <ReplaySharpIcon className='icon' />
        </button>
      </div>
      <div className='log-container' ref={listRef}>
        {log.slice(-50).map((log, index) => (
          <div key={index} className='log'>{log}</div>
        ))}
      </div>
    </div>
  );
};


export default ConsoleHeader;
