import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function Dashboard({trips}) {
    const [leaderboardData, setLeaderboardData] = useState([])
    const [userTotalGHGEmissions, setUserTotalGHGEmissions] = useState(0)
    const navigate = useNavigate();

    const usersTrips = trips.map((trip) => {
        return (
          <div key={trip.id}> 
            <h3>Trip Name: {trip.name} </h3>
            <p>Mode: {trip.mode} </p>
            <p>Origin: {trip.origin}</p>
            <p>Destination: {trip.destination}</p>
            <p>GHG Emissions: {trip.ghg_emissions}</p>
          </div>
        )
    })

    useEffect(() => {
        let totalGHGEmissions = 0
        for (const i in trips) {
            const trip = trips[i]
            totalGHGEmissions += trip.ghg_emissions
        }
        setUserTotalGHGEmissions(totalGHGEmissions)
    }, [trips]) 

    useEffect(() => {
        fetch("/feed")
            .then(response => response.json())
            .then(data => {
                let friendGHGEmissions = []
                for (let friend in data) {
                    let totalGHGEmissions = 0
                    console.log(friend)
                    for (const j in data[friend]) {
                        const trip = data[friend][j]
                        totalGHGEmissions += trip.ghg_emissions
                        console.log(trip)
                    }
                    friendGHGEmissions.push({"user": friend, "totalGHGEmissions": totalGHGEmissions})
                    totalGHGEmissions = 0
                }
                console.log("*****")
                console.log(friendGHGEmissions)
                friendGHGEmissions.push({"user": "yourself", "totalGHGEmissions": userTotalGHGEmissions})

                const sortedData = [...friendGHGEmissions].sort((a,b) => a.totalGHGEmissions - b.totalGHGEmissions)
                setLeaderboardData(sortedData) 
            })
    }, [trips, userTotalGHGEmissions])
    
    console.log(userTotalGHGEmissions)
    console.log(trips)
    console.log(leaderboardData)

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
            display: true,
            // text: 'Chart.js Line Chart',
          }
        }
    }

    const leaderboardChart = {
        labels: leaderboardData.map((item) => item.user),
        datasets: [
            {
                label: "Leaderboard",
                data: leaderboardData.map((item) => item.totalGHGEmissions),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
          },
          title: {
            display: true,
            text: 'Chart.js Horizontal Bar Chart',
          },
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => navigate("/addTrip")}>Add Trip</button>

            <div>
                <h2>Your Trips</h2>
                {usersTrips}
            </div>
            
            <div>
                <h2>Week's Emissions</h2>
                <Line options={personalOptions} data={personalChart} />
            </div>

            <div>
                <h2>Leaderboard</h2>
                <Bar options={leaderboardOptions} data={leaderboardChart} />
            </div>
        </div>
    )
}