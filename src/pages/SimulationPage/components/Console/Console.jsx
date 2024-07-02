import React, { useState, useRef, useEffect } from 'react';
import { FaDownload, FaSave } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import './Console.css';
import config from '../../../../config';

const ConsoleHeader = ({ handleDownloadLog, log, handleClearLog }) => {
  const listRef = useRef(null);


  const handleSaveLog = async (logMessages) => {
    const logString = logMessages.join('\n'); // Convert array to string
    console.log('Saving log:', logString);
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
      <div className='flex-container heading-container'>
        <h3 className='heading-n'>Console</h3>
        <button onClick={handleDownloadLog} className='button-c'>< FaDownload className='icon' /></button>
        {/* <button onClick={() => handleSaveLog(log)} className='button-c'><FaSave className='icon' /></button> */}
        <button onClick={handleClearLog} className='button-c'><IoIosCloseCircle className='icon' /></button>
      </div>
      <div className='log-container' ref={listRef}>
        {log.map((log, index) => (
          <div key={index} className='log'>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default ConsoleHeader;
