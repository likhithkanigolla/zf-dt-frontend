import React, { useState, useRef, useEffect } from 'react';
import { FaDownload, FaSave } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import './Console.css';

const ConsoleHeader = ({ handleDownloadLog, log }) => {
  const listRef = useRef(null);

  useEffect(() => {
    // Scroll to the last element when 'log' changes
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="container console-container">
      <div className='flex-container heading-container'>
        <h3 className='heading-n'>Console</h3>
        <button onClick={handleDownloadLog} className='button'><FaDownload className='icon' /></button>
        <button onClick={handleDownloadLog} className='button'><FaSave className='icon' /></button>
        <button onClick={handleDownloadLog} className='button'><IoIosCloseCircle className='icon' /></button>
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
