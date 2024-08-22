import React, {useRef,useState} from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ data, title , feild }) => {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const chartRef = useRef(null);

  const toggleEnlargedMode = () => {
    setIsEnlarged(!isEnlarged);
  };

  const closeEnlargedMode = () => {
    setIsEnlarged(false);
  };



  // Separate data for ID1, ID2, and ID3
  const id1Data = data.filter(entry => entry.id === 1);
  const id2Data = data.filter(entry => entry.id === 2);
  const id3Data = data.filter(entry => entry.id === 3);
  const id4Data = data.filter(entry => entry.id === 4);

  // Extract timestamps for ID1, ID2, and ID3
  const id1Timestamps = id1Data.map(entry => entry.time);
  const id2Timestamps = id2Data.map(entry => entry.time);
  const id3Timestamps = id3Data.map(entry => entry.time);
  const id4Timestamps = id4Data.map(entry => entry.time);

  // Combine all unique timestamps and sort them chronologically
  const timestamps = Array.from(new Set([...id1Timestamps, ...id2Timestamps, ...id3Timestamps, ...id4Timestamps])).sort();

  // Function to create datasets for each ID with updated labels
  const createDataset = (id, timestamps, propertyName) => {
    const dataPoints = timestamps.map(time => {
      const entry = data.find(item => item.id === id && item.time === time);
      return entry ? entry[propertyName] : null; // Return tds or null if no data
    });

    let label, borderColor, backgroundColor;
    switch (id) {
      case 1:
        label = 'Soil';
        borderColor = 'rgba(75, 192, 192, 1)';
        backgroundColor = 'rgba(75, 192, 192, 0.2)';
        break;
      case 2:
        label = 'Sand';
        borderColor = 'rgba(255, 205, 86, 1)';
        backgroundColor = 'rgba(255, 205, 86, 0.2)';
        break;
      case 3:
        label = 'Sand and Soil(ppm)';
        borderColor = 'rgba(153, 102, 255, 1)';
        backgroundColor = 'rgba(153, 102, 255, 0.2)';
        break;
      case 4:
        label = 'Permeative Flow Rate(L/S)';
        borderColor = 'rgba(255, 159, 64, 1)';
        backgroundColor = 'rgba(255, 159, 64, 0.2)';
        break;
      default:
        label = `ID ${id}`;
        borderColor = 'rgba(0, 0, 0, 1)';
        backgroundColor = 'rgba(0, 0, 0, 0.2)';
    }

    return {
      label: label,
      data: dataPoints,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      fill: false,
      spanGaps: true, // Connect lines across null values
    };
  };

  const datasets = [
    createDataset(1, timestamps, feild),
    createDataset(2, timestamps, feild),
    createDataset(3, timestamps, feild),
    createDataset(4, timestamps, feild),
  ];

  const filteredDatasets = datasets.filter(dataset => dataset.data.some(point => point !== null));

  const chartData = {
    labels: timestamps,
    datasets: filteredDatasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          padding: 10,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          // text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          // text: 'TDS Value',
        },
      },
    },
    elements: {
      line: {
        tension: 0, // Ensure straight lines between points
      },
    },
  };

  const containerClassName = isEnlarged ? 'chart-container enlarged' : 'chart-container';

  const downloadChart = () => {
    const chart = chartData.current; // Access the chart instance
    if (!chart) {
      console.error('Unable to access chart');
      return;
    }
    const url = chart.toBase64Image(); // Get the image URL of the chart
    const link = document.createElement('a'); // Create an anchor element
    link.href = url; // Set the href to the chart's image URL
    link.download = `${title}.png`; // Set the download attribute to the desired file name
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up by removing the link
  };

  return (
    <div className={containerClassName} onClick={toggleEnlargedMode}>
      <div className="chart-content">
        <Line data={chartData} options={options} ref={chartRef} />
        {isEnlarged && (
          <div className="close-button" onClick={closeEnlargedMode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        )}
      </div>
       <style jsx>{`
        .chart-container {
          position: relative;
          width: 18vw;
          height: 13vw;
          transition: all 0.3s ease;
        }

        .enlarged {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .chart-content {
          width: 100%;
          height: 100%;
          max-width: 1000px; /* Adjust max width as needed */
          max-height: 80vh; /* Adjust max height as needed */
          background-color: ${isEnlarged ? '#fff' : 'none'};
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          background-color: red;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .close-button svg {
          width: 20px;
          height: 20px;
          stroke: #fff;
        }

        .close-button:hover {
          background-color: darkred;
        }

        .chart-content canvas {
          width: 100% !important;
          height: 100% !important;
        }
       
       `}</style>
    </div>
  );
};

export default LineGraph;