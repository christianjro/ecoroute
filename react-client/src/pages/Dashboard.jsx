import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LeaderboardChart from '../components/LeaderboardChart';
import TripHistoryChart from '../components/TripHistoryChart';
import AirQualityIndexChart from '../components/AirQualityIndexChart';


export default function Dashboard({trips, handleTripsUpdate, location}) {
    const [leaderboardData, setLeaderboardData] = useState([])
    const [userTotalGHGEmissions, setUserTotalGHGEmissions] = useState(0)
    const [airQualityIndex, setAirQualityIndex] = useState(null)
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
              <h2>Current Air Quality</h2>
              <AirQualityIndexChart airQualityIndex={airQualityIndex} />
            </div>

            <div>
                <h2>Your Trips</h2>
                {usersTrips}
            </div>
            
            <div>
                <h2>Week's Emissions</h2>
                <TripHistoryChart trips={trips} />
            </div>

            <div>
                <h2>Leaderboard</h2>
                <LeaderboardChart leaderboardData={leaderboardData} />
            </div>
        </div>
    )
}