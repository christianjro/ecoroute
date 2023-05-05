import React from 'react';

export default function Trips({trips, handleTripsUpdate}) {
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
      <tr key={trip.id} className="text-secondary"> 
          <td>{trip.name}</td>
          <td>{trip.origin}</td>
          <td>{trip.destination}</td>
          <td>{trip.mode} </td>
          <td>{trip.date_created} </td>
          <td>{trip.ghg_emissions > 0 ? trip.ghg_emissions.toFixed(4) : trip.ghg_emissions}</td>
          <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteTrip(trip.id)}>Delete</button></td>
      </tr>
    )
  })

  return (
    <div className="p-lg-4">
      <h4 className="my-4 text-primary">All Trip Records</h4>
      <table className="table border-dark-subtle">
        <thead>
          <tr className="text-light">
            <th scope="col">Trip Name</th>
            <th scope="col">Origin</th>
            <th scope="col">Destination</th>
            <th scope="col">Mode</th>
            <th scope="col">Date</th>
            <th scope="col">GHG Emissions (MTCO2e)</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {usersTrips}
        </tbody>
      </table>
    </div>
    
  )
}
