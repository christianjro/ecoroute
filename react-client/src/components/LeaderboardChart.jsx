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

export default function LeaderBoard({leaderboardData}) {
  const leaderboardChart = {
    labels: leaderboardData.map((item) => item.user),
    datasets: [
        {
            label: "Leaderboard",
            data: leaderboardData.map((item) => item.totalGHGEmissions),
            borderColor: 'rgb(127, 90, 240)',
            backgroundColor: 'rgb(127, 90, 240, 0.5)',
        }
    ]
  }

  const leaderboardOptions = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          // position: 'right' as const,
          display: false,
        },
        title: {
          display: false,
          text: 'Chart.js Horizontal Bar Chart',
        },
      }
  }
  return (
    <Bar options={leaderboardOptions} data={leaderboardChart} />
  )
}
