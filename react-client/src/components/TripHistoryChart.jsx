import React, {useState, useEffect} from 'react';
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
  const [formattedTrips, setFormattedTrips] = useState([])

  useEffect(() => { 
    const tripsCopy = [...trips]
    console.log(tripsCopy)
    const sortedTrips = tripsCopy.sort((a, b) => {
      return new Date(a.date_created) - new Date(b.date_created)
    })
    setFormattedTrips(sortedTrips)
  }, [trips])

  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = {year: "numeric", month: "long", day: "numeric"}
    return date.toLocaleDateString('en-US', options)
  }


  const personalChart = {
    labels: formattedTrips.map((trip) => formatDate(trip.date_created)),
    datasets: [
        {
            label: "GHG Emissions",
            data: formattedTrips.map((trip) => trip.ghg_emissions),
            fill: false,
            borderColor: "rgb(44, 182, 125)",
            backgroundColor: 'rgb(44, 182, 125)',
        }
    ]
  }

  const personalOptions = {
      responsive: true,
      plugins: {
        title: {
          display: false,
          text: 'Chart.js Line Chart',
        },
        legend: {
          display: false,
        },
      }
  }
  return (
    <Line options={personalOptions} data={personalChart} /> 
  )
}
