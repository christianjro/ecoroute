import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';

export default function Dashboard() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
    const [ trips, setTrips ] = useState([])

    useEffect(() => {
        fetch("/trips")
          .then(res => res.json())
          .then(data => setTrips(data.trips))
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
            <h2> User's trips </h2>
            {usersTrips}
        </div>
    )
}
