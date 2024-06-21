import React, { useState,useRef,useEffect } from 'react';
import { FaDownload, FaSave } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const ConsoleHeader = ({ handleDownloadLog, log}) => {
  const [logs, setLogs] = useState([
    "2024-06-19T12:31:09.787Z: TDS Value Sand Contamination calculated: 472.11711527273815",
    "2024-06-19T12:31:10.503Z: TDS Value Soil Contamination calculated: 254.35696411132812",
    "2024-06-19T12:31:10.503Z: Soil TDS Value calculated: 254.35696411132812",
    "2024-06-19T12:31:10.503Z: Sand TDS Value calculated: 472.11711527273815",
    "2024-06-19T12:31:10.503Z: Average TDS Value calculated: 363.23703969203314"
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    // Scroll to the last element when 'log' changes
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
}, [log]);

  console.log("Log200", log);

  

  return (
    <div className="container" style={styles.consoleContainer}>
    <div className='flex-container' style={styles.headingContainer}>
        <h3 style={styles.heading}>Console</h3>
        <button onClick={handleDownloadLog} className='button' style={styles.button}><FaDownload style={styles.icon} /></button>
        <button onClick={handleDownloadLog} className='button' style={styles.button}><FaSave style={styles.icon} /></button>
        <button onClick={handleDownloadLog} className='button' style={styles.button}><IoIosCloseCircle style={styles.icon} /></button>
      </div>
      {/* <div className='flex-container' style={styles.buttonContainer}>
        <button onClick={handleDownloadLog} className='button' style={styles.button}><FaDownload style={styles.icon} /></button>
        <button onClick={handleDownloadLog} className='button' style={styles.button}><FaSave style={styles.icon} /></button>
        <button onClick={handleDownloadLog} className='button' style={styles.button}><IoIosCloseCircle style={styles.icon} /></button>
      </div> */}
      <div className='log-container' style={styles.logContainer} ref={listRef}>
        {/* {logs.map((log, index) => (
          <div key={index} style={styles.log}>{log}</div>
        ))} */}
        {log.map((log, index) => (
          <div key={index} style={styles.log}>{log}</div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  consoleContainer: {
    color: 'white',
    fontFamily: 'monospace',
    padding: '10px',
    background: 'white',
    overflowY: 'scroll',
    height: '17vh'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: '2vw',
    width: '4vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: '1vw'
  },
  headingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    margin: 0,
    fontSize: '1vw', // Adjust as needed
    color: 'black'
  },
  logContainer: {
    background: 'black',
    color: 'limegreen',
    fontFamily: 'monospace',
    padding: '10px',
    border: '1px solid limegreen',
    borderRadius: '5px',
    maxHeight: '10vh',
    maxWidth: '100vh',
    overflowY: 'auto' 
    // auto scroll to down automatically 

  },
//   log: {
//     margin: '5px 0'
//   }
};

export default ConsoleHeader;
