import React from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getTrips, deleteTrip } from '../lib/api';


export default function Trips() {
  const queryClient = useQueryClient()
  const { data: trips } = useQuery({ queryKey: ["trips"], queryFn: getTrips, initialData: [] })
  const { mutate: deleteTripMutation } = useMutation({ mutationFn: deleteTrip, onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["trips"]})
  }})

  function handleDeleteTrip(tripId) {
    deleteTripMutation(tripId)
  }

  const userTrips = trips.map((trip) => {
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
          {userTrips}
        </tbody>
      </table>
    </div>
    
  )
}
