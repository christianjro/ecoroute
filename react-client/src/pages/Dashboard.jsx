import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LeaderboardChart from '../components/LeaderboardChart';
import TripHistoryChart from '../components/TripHistoryChart';
import AirQualityIndexChart from '../components/AirQualityIndexChart';


export default function Dashboard({trips, userInfo, location}) {
    const [leaderboardData, setLeaderboardData] = useState([])
    const [userTotalGHGEmissions, setUserTotalGHGEmissions] = useState(0)
    const [userTotalMilesTraveled, setUserTotalMilesTraveled] = useState(0)
    const [airQualityIndex, setAirQualityIndex] = useState(null)
    const navigate = useNavigate()

    const airNowAPIKey = process.env.REACT_APP_AIRNOW_API_KEY

    const recentTrips = trips.slice(0, 3)

    const usersTrips = recentTrips.map((trip) => {
        return (
          <div key={trip.id} className="card my-3 mx-auto border-2 border-black bg-dark-subtle"> 
            <div className="card-body">
              <h5 className="card-title text-light">{trip.name} </h5>
              <p className="card-text text-secondary">
                Origin: {trip.origin} <br/>
                Destination: {trip.destination} <br/>
                Travel Mode: {trip.mode} 
              </p>
            </div>
            <div className="card-footer bg-transparent text-secondary text-end border-dark">GHG Emissions: {trip.ghg_emissions > 0 ? trip.ghg_emissions.toFixed(4) : trip.ghg_emissions} MTCO2e</div>
          </div>
        )
    })


    useEffect(() => {
        let totalGHGEmissions = 0
        let totalMilesTraveled = 0
        trips.forEach((trip) => {
          totalGHGEmissions += trip.ghg_emissions
          totalMilesTraveled += trip.distance
        })
        setUserTotalGHGEmissions(totalGHGEmissions)
        setUserTotalMilesTraveled(totalMilesTraveled)
    }, [trips]) 


    useEffect(() => {
        fetch("/feed")
            .then(response => response.json())
            .then(data => {
                let friendGHGEmissions = []

                Object.entries(data).forEach(([friend, trips]) => {
                  let totalGHGEmissions = 0
                  trips.forEach((trip) => {
                    totalGHGEmissions += trip.ghg_emissions
                  })
                  friendGHGEmissions.push({"user": friend, "totalGHGEmissions": totalGHGEmissions})
                  totalGHGEmissions = 0
                })

                friendGHGEmissions.push({"user": "Yourself", "totalGHGEmissions": userTotalGHGEmissions})

                const sortedData = [...friendGHGEmissions].sort((a,b) => a.totalGHGEmissions - b.totalGHGEmissions)
                setLeaderboardData(sortedData) 
            })
    }, [trips, userTotalGHGEmissions])
    

    useEffect(() => {
      if (location) {
        const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${location.latitude}&longitude=${location.longitude}&distance=30&API_KEY=${airNowAPIKey}`
        fetch(url)
          .then(response => response.json())
          .then(data => setAirQualityIndex(data[0]))
      }
    }, [location])

    return (
        <div className="container">
            <h4 className="mb-3 text-primary">Welcome, {userInfo.name}</h4>

            <div className="row justify-content-center gap-4 mb-3">
              <div className="col bg-dark-subtle d-flex flex-column justify-content-between align-items-center py-3 rounded-4">
                <h1 className="text-secondary m-0">{userTotalMilesTraveled > 0 ? userTotalMilesTraveled.toFixed(2) : userTotalMilesTraveled}</h1>
                <h7 className="text-secondary m-0">Miles</h7>
                <h6 className="text-center m-0 text-light">Total Miles Traveled</h6>
              </div>

              <div className="col bg-dark-subtle p-2 rounded-4" style={{minWidth: '12rem'}}>
                <AirQualityIndexChart airQualityIndex={airQualityIndex} />
                <h6 className="text-center mt-3 text-light">Current Air Quality Index</h6>
              </div>

              <div className="col bg-dark-subtle d-flex flex-column justify-content-between align-items-center py-3 rounded-4">
                <h1 className="text-secondary m-0">{userTotalGHGEmissions > 0 ? userTotalGHGEmissions.toFixed(4) : userTotalGHGEmissions}</h1>
                <h7 className="text-secondary m-0">MTCO2e</h7>
                <h6 className="text-center m-0 text-light">Total GHG Emissions</h6>
              </div>
            </div>

            <div className="row gap-4 mb-3">
              <div className="col p-0">
              <button className="btn btn-primary w-100" onClick={() => navigate("/addTrip")}>+ <br/> Add Trip</button>
              </div>
            </div>
            
            <div className="row justify-content-center gap-4">
              <div className="col-lg overflow-y-auto bg-dark-subtle p-3 rounded-4">
                <h5 className="text-light">Recent Trips</h5>
                {usersTrips}
              </div>
              
              <div className="col-lg">
                <div className="row bg-dark-subtle p-3 mb-4 rounded-4">
                    <h5 className="text-light">Emissions History</h5>
                    <TripHistoryChart trips={trips} />
                </div>

                <div className="row bg-dark-subtle p-3 rounded-4">
                    <h5 className="text-light">Leaderboard</h5>
                    <LeaderboardChart leaderboardData={leaderboardData} />
                </div>
              </div>
            </div>
        </div>
    )
}