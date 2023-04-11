import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';

export default function Dashboard() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
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

    const newTrip = {
        name: "trip 2000",
        mode: "car",
        date_created: "now",
        starting_point: "point A",
        ending_point: "point B",
        ghg_emissions: 22  
    }

    function handleAddTrip() {
        fetch("/new_trip", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newTrip)
        })
            .then(res => res.json())
            .then(data => {
                setTrips(prevTrips => [...prevTrips, data])
            })
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <h2> User's trips </h2>
            {usersTrips}
            <button onClick={handleAddTrip}>Add Trip</button>
        </div>
    )
}
