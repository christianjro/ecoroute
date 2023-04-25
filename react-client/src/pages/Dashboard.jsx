import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({trips}) {
    const navigate = useNavigate();

    const usersTrips = trips.map((trip) => {
        return (
          <div key={trip.id}> 
            <h3>Trip Name: {trip.name} </h3>
            <p>Mode; {trip.mode} </p>
            <p>Origin: {trip.origin}</p>
            <p>Destination: {trip.destination}</p>
            <p>GHG Emissions: {trip.ghg_emissions}</p>
          </div>
        )
    })
    
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
            </div>

            <div>
                <h2>Leaderboard</h2>
            </div>
        </div>
    )
}