import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
BarElement,
Title,
Tooltip,
Legend
);


export default function TripHistoryChart({trips}) {
  const personalChart = {
    labels: trips.map((trip) => trip.date_created),
    datasets: [
        {
            label: "GHG Emissions",
            data: trips.map((trip) => trip.ghg_emissions),
            fill: false,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
    ]
  }

  const personalOptions = {
      responsive: true,
      plugins: {
        title: {
          display: false,
          text: 'Chart.js Line Chart',
        }
      }
  }
  return (
    <Line options={personalOptions} data={personalChart} /> 
  )
}
