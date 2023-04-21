import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [ trips, setTrips ] = useState([])


    useEffect(() => {
        fetch("/trips")
          .then(res => res.json())
          .then(data => {
            setTrips(data.trips)
            console.log(trips)
        })
    }, [])

    const usersTrips = trips.map((trip) => {
        return (
          <div key={trip.id}> 
            <h3> {trip.name} </h3>
            <p> {trip.mode} </p>
            <p> {trip.starting_point}</p>
          </div>
        )
    })
    
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>User's trips</h2>
                {usersTrips}
            </div>
            
            <button onClick={() => navigate("/addTrip")}>Add Trip</button>
        </div>
    )
}