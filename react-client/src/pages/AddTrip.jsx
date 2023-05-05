import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import MapSearch from '../components/MapSearch';


export default function AddTrip(props) {
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
    console.log("this is the child's data")
    console.log(data)

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
        return props.userInfo.vehicle.efficiency * newTrip.distance
      } 
      else if (newTrip.mode === "WALKING" || newTrip.mode === "BICYCLING") {
        return 0
      } 
      else if (newTrip.mode === "TRANSIT") {
        return props.userInfo.vehicle.efficiency * 0.5 * newTrip.distance
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
    // make fetch call to the api using newTrip state
    fetch("/new_trip", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(newTrip)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error("Could not add trip.")
        }
      })
      .then(data => props.handleTripsUpdate(data))
      .catch(error => console.log(error))
    navigate("/")
  }

  function cancelAddTrip() {
    navigate("/")
  }

  useEffect(() =>{
    console.log("this is my new Trip")
    console.log(newTrip)
  }, [newTrip])

  return (
    <div>
        <MapSearch dataTransfer={handleMapData}/>
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
