import React from 'react';
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

const LineGraph = ({ data }) => {
  // Separate data for ID1 and ID2
  const id1Data = data.filter(entry => entry.id === 1);
  const id2Data = data.filter(entry => entry.id === 2);

  // Extract timestamps for ID1 and ID2
  const id1Timestamps = id1Data.map(entry => entry.time);
  const id2Timestamps = id2Data.map(entry => entry.time);

  // Combine all unique timestamps and sort them chronologically
  const timestamps = Array.from(new Set([...id1Timestamps, ...id2Timestamps])).sort();

  // Function to create datasets for each ID
  const createDataset = (id, timestamps) => {
    const dataPoints = timestamps.map(time => {
      const entry = data.find(item => item.id === id && item.time === time);
      return entry ? entry.tds : null; // Return tds or null if no data
    });

    return {
      label: `ID ${id}`,
      data: dataPoints,
      borderColor: id === 1 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 205, 86, 1)',
      backgroundColor: id === 1 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 205, 86, 0.2)',
      fill: false,
      spanGaps: true, // Connect lines across null values
    };
  };

  const datasets = [
    createDataset(1, timestamps),
    createDataset(2, timestamps),
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
        text: 'TDS Values VS Time',
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

  return (
    <div style={{ position: 'relative', width: '18vw', height: '18vw'}}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;