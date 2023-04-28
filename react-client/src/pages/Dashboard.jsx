import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexCharts from 'apexcharts';
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

export default function Dashboard({trips, handleTripsUpdate, location}) {
    const [leaderboardData, setLeaderboardData] = useState([])
    const [userTotalGHGEmissions, setUserTotalGHGEmissions] = useState(0)
    const [airQualityIndex, setAirQualityIndex] = useState(null)
    const aqiChartRef = useRef(null)
    const navigate = useNavigate()

    const airNowAPIKey = process.env.REACT_APP_AIRNOW_API_KEY

    function handleDeleteTrip(trip_id) {
      fetch("/delete_trip", {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({trip_id})
      })
        .then(response => {
          if (response.status === 200) {
            handleTripsUpdate()
          }
        })
    }

    const usersTrips = trips.map((trip) => {
        return (
          <div key={trip.id}> 
            <h3>Trip Name: {trip.name} </h3>
            <p>Mode: {trip.mode} </p>
            <p>Origin: {trip.origin}</p>
            <p>Destination: {trip.destination}</p>
            <p>GHG Emissions: {trip.ghg_emissions}</p>
            <button onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
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

    useEffect(() => { 
      console.log("&&&&&")
      console.log(airQualityIndex)
      if (airQualityIndex) {
        const aqiChartOptions = {
          series: [100, (airQualityIndex.AQI/500 * 100)],
              chart: {
              type: 'radialBar',
              offsetY: -20,
              sparkline: {
                enabled: true
              }
            },
            tooltip: {
                enabled: false,
              },
            stroke: {
              lineCap: 'round',
            },
            plotOptions: {
              radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                  size: "75%",
                },
                track: {
                  background: ["#e7e7e7", "#ffffff"],
                  strokeWidth: ['100%', '75%'],
                  margin: 3, 
                },
                dataLabels: {
                  name: {
                    offsetY: -30,
                    show: false,
                    fontSize: '30px',
                  },
                  value: {
                    // offsetY: -2,
                    text: "AQI",
                    formatter: function(val) {
                      return parseInt(val)
                    },
                    fontSize: '90px',
                    show: true,
                  },
                  total: {
                    show: true,
                    label: "AQI",
                    formatter: function(w) {
                      return airQualityIndex.AQI
                    },
                  },
                },
              },
            },
            grid: {
              padding: {
                top: -10
              }
            },
            fill: {
              colors: ['#ff0000', '#000000'],
              type: ['gradient', "solid"],
              gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.9,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#00e400",
                    opacity: 1
                  },
                  {
                    offset: 10,
                    color: "#ffff00",
                    opacity: 1
                  },
                  {
                    offset: 40,
                    color: "#ff0000",
                    opacity: 1
                  },
                  {
                    offset: 50,
                    color: "#8f3f97",
                    opacity: 1
                  },
                  {
                    offset: 100,
                    color: "#7e0023",
                    opacity: 1
                  }
                ],
              },
            },  
            labels: ['Scale', 'AQI'],
        }

        const chart = new ApexCharts(aqiChartRef.current, aqiChartOptions)
        chart.render()
        return () => chart.destroy()
      }
    }, [airQualityIndex])

    useEffect(() => {
      console.log("this is location")
      console.log(location)
      if (location) {
        const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${location.latitude}&longitude=${location.longitude}&distance=30&API_KEY=${airNowAPIKey}`
        fetch(url)
          .then(response => response.json())
          .then(data => setAirQualityIndex(data[0]))
      }
    }, [location])



    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => navigate("/addTrip")}>Add Trip</button>

            <div>
              <div ref={aqiChartRef} id="chart"></div>
            </div>

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