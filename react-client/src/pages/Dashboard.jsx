import React, { useContext, useEffect, useState, useRef } from 'react';
import MapSearch from '../components/MapSearch';

export default function Dashboard() {
    const newTripFormTemplate = {
        name: "", 
        mode: "", 
        date_created: "",
        origin: "",
        destination: "",
        distance: "",
        duration: "",
        ghg_emissions: ""
    }

    const [ trips, setTrips ] = useState([])
    const [ isNewTripForm, setIsNewTripForm ] = useState(false)
    const [ newTrip, setNewTrip ] = useState({...newTripFormTemplate})

   
    useEffect(() => {
        console.log("hello")
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

    
    // function handleSubmit(event) {
    //     event.preventDefault()
    //     fetch("/new_trip", {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify(newTrip)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             setTrips(prevTrips => [...prevTrips, data])
    //             setNewTrip({...newTripFormTemplate})
    //             setIsNewTripForm(false)
    //         })
    // }
    
    return (
        <div>
            <h1>Dashboard</h1>
            <h2> User's trips </h2>
            {usersTrips}
            <button onClick={() => setIsNewTripForm(prev => !prev)}>Add Trip</button>
            {
                isNewTripForm 
                &&
                <MapSearch />
            }
        </div>
    )
}