import React, { useContext, useEffect, useState } from 'react';

export default function Dashboard() {
    const newTripFormTemplate = {
        name: "", 
        mode: "", 
        date_created: "",
        starting_point: "",
        ending_point: "",
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

    function handleChange(event) {
        setNewTrip(prevNewTrip => {
            return {
                ...prevNewTrip,
                [event.target.name] : event.target.value
            }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        fetch("/new_trip", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newTrip)
        })
            .then(res => res.json())
            .then(data => {
                setTrips(prevTrips => [...prevTrips, data])
                setNewTrip({...newTripFormTemplate})
                setIsNewTripForm(false)
            })
    }
    
    return (
        <div>
            <h1>Dashboard</h1>
            <h2> User's trips </h2>
            {usersTrips}
            <button onClick={() => setIsNewTripForm(prev => !prev)}>Add Trip</button>
            {
                isNewTripForm &&
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input id="name" name="name" type="text" value={newTrip.name} onChange={handleChange} /> 
                    <label htmlFor="mode">Mode:</label>
                    <input id="mode" name="mode" type="text" value={newTrip.mode} onChange={handleChange} />
                    <label htmlFor="date_created">Date Created:</label>
                    <input id="date_created" name="date_created" type="text" value={newTrip.date_created} onChange={handleChange} />
                    <label htmlFor="starting_point">Starting Point:</label>
                    <input id="starting_point" name="starting_point" type="text" value={newTrip.starting_point} onChange={handleChange} />
                    <label htmlFor="ending_point">Ending Point</label>
                    <input id="ending_point" name="ending_point" type="text" value={newTrip.ending_point} onChange={handleChange} />
                    <label htmlFor="ghg_emissions">GHG Emissions:</label>
                    <input id="ghg_emissions" name="ghg_emissions" type="text" value={newTrip.ghg_emissions} onChange={handleChange} />
                    <button type="submit">Add Trip</button>
                </form>
            }
        </div>
    )
}
