import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getUserData, postNewTrip } from '../lib/api';
import MapSearch from '../components/MapSearch';


export default function AddTrip() {
  const queryClient = useQueryClient()
  const { data: userInfo } = useQuery({ queryKey: ["userInfo"], queryFn: getUserData, initialData: {name: ""} })
  const { mutate: addNewTripMutation } = useMutation({ mutationFn: postNewTrip, onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["trips"]})
  }})
  const navigate = useNavigate()
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
  const [newTrip, setNewTrip] = useState({...newTripFormTemplate})

  function handleMapData(data) {
    const cleanDistance = parseFloat(data.distance.match(/[0-9.]+/)[0])

    setNewTrip(prev => {
      return {
        ...prev,
        name: data.name,
        mode: data.mode,
        origin: data.origin,
        destination: data.destination,
        distance: cleanDistance,
        duration: data.duration
      }
    })
  }

  useEffect(() => {
    function calculateGhgEmissions() {
      if (newTrip.mode === "DRIVING"){
        return userInfo.vehicle.efficiency * newTrip.distance
      } 
      else if (newTrip.mode === "WALKING" || newTrip.mode === "BICYCLING") {
        return 0
      } 
      else if (newTrip.mode === "TRANSIT") {
        return userInfo.vehicle.efficiency * 0.5 * newTrip.distance
      }
    }
    const ghg_emissions = calculateGhgEmissions()
    setNewTrip(prev => ({
      ...prev,
      ghg_emissions: ghg_emissions
    }))
  }, [newTrip.mode, newTrip.distance]) 

  
  function handleTripSubmit(event) {
    event.preventDefault()
    // add new trip to the server/database through query mutation
    addNewTripMutation(newTrip)
    navigate("/")
  }

  function cancelAddTrip() {
    navigate("/")
  }

  return (
    <div>
        <MapSearch dataTransfer={handleMapData} />
        
        {
          newTrip.duration
          && 
          <div className="row bg-tertiary my-4">
            <div className="d-grid col-6">
              <h5 className="text-light">Anticipated GHG Emissions</h5>
              {newTrip.ghg_emissions ? 
                <h6 className="text-secondary m-0">{newTrip.ghg_emissions.toFixed(4)}</h6> 
                : 
                <h6 className="text-secondary m-0">0</h6>
              }
              <h6 className="text-secondary m-0">MTCO2e</h6>
            </div>
            <div className="d-grid col-6">
              <h5 className="text-light">Expected Travel Time</h5>
              <h6 className="text-secondary m-0">{newTrip.duration}</h6>
            </div>
          </div>
        }
        
        <div className="row my-4">
          <div className="d-grid col-6">
            <button className="btn btn-danger py-2" onClick={cancelAddTrip}>Cancel</button>
          </div>
          <div className="d-grid col-6">
          <button className="btn btn-secondary text-light py-2" onClick={handleTripSubmit}>Add Trip</button>
          </div>
        </div>
    </div>
  )
}
