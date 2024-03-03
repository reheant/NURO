import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

// Register the chart.js components we will use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

interface BarChartProps {
  dataPoints: number[];
}

const BarChart: React.FC<BarChartProps> = ({ dataPoints }) => {
  // Prepare the data for chart.js
  const data = {
    labels: dataPoints.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `Day`,
        data: dataPoints,
        backgroundColor: 'rgba(45, 85, 255)',
      },
    ],
  };

  // Define options for the chart, including the animation
  const options = {
    animation: {
      duration: 2000, // Animation will last 2 seconds
      onComplete: () => {
        console.log('Animation completed!');
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;