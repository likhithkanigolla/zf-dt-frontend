import React, {useRef} from 'react';
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

const LineGraph = ({ data, title }) => {
  // Separate data for ID1, ID2, and ID3
  const id1Data = data.filter(entry => entry.id === 1);
  const id2Data = data.filter(entry => entry.id === 2);
  const id3Data = data.filter(entry => entry.id === 3);
  const chartRef = useRef(null);

  // Extract timestamps for ID1, ID2, and ID3
  const id1Timestamps = id1Data.map(entry => entry.time);
  const id2Timestamps = id2Data.map(entry => entry.time);
  const id3Timestamps = id3Data.map(entry => entry.time);

  // Combine all unique timestamps and sort them chronologically
  const timestamps = Array.from(new Set([...id1Timestamps, ...id2Timestamps, ...id3Timestamps])).sort();

  // Function to create datasets for each ID with updated labels
  const createDataset = (id, timestamps) => {
    const dataPoints = timestamps.map(time => {
      const entry = data.find(item => item.id === id && item.time === time);
      return entry ? entry.tds : null; // Return tds or null if no data
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
        label = 'Sand and Soil';
        borderColor = 'rgba(153, 102, 255, 1)';
        backgroundColor = 'rgba(153, 102, 255, 0.2)';
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
    createDataset(1, timestamps),
    createDataset(2, timestamps),
    createDataset(3, timestamps),
  ];

  const chartData = {
    labels: timestamps,
    datasets: datasets,
  };

  // Debugging: Log the chartData to ensure it's structured correctly
  console.log(chartData);

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
    <div style={{ position: 'relative', width: '18vw', height: '13vw'}}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;