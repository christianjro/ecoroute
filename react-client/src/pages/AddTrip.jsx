import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import MapSearch from '../components/MapSearch';


export default function AddTrip() {
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
  const [currentQuestion, setCurrentQuestion] = useState(1)

  function handleMapData(data) {
    console.log("this is the child's data")
    console.log(data)

    const cleanDistance = parseFloat(data.distance.match(/[0-9.]+/)[0])

    setNewTrip(prev => {
      return {
        ...prev,
        mode: data.mode,
        origin: data.origin,
        destination: data.destination,
        distance: cleanDistance,
        duration: data.duration
      }
    })
    setCurrentQuestion(2)
  }

  function handleNameChange(event) {
    setNewTrip(prev => {
      return {
        ...prev,
        [event.target.name] : event.target.value
      }
    })
  }

  function calculateGhgEmissions() {
    if (newTrip.mode === "DRIVING"){
      // get user's vehicle car efficiency
      // multiply it with number of miles
      // update state to include efficiency
    } else if (newTrip.mode === "WALKING" || newTrip.mode === "BICYCLING") {
      setNewTrip(prev => ({
        ...prev, 
        ghg_emissions: 0
      }))
    } else if (newTrip.mode === "TRANSIT") {
      // todo
    }
    
  }


  function cancelAddTrip() {
    navigate("/dashboard")
  }


  useEffect(() =>{
    console.log("this is my new Trip")
    console.log(newTrip)
  }, [newTrip])

  return (
    <div>
        <h1>AddTrip</h1>
        {
          currentQuestion == 1 
          &&
          <MapSearch dataTransfer={handleMapData} cancelAddTrip={cancelAddTrip} />
        }
       
        {
          currentQuestion == 2
          &&
          <div>
            <h2>Question 2:</h2>
            <button onClick={() => setCurrentQuestion(1)}>Go Back</button>
            <form>
              <label htmlFor="tripName">Trip Name:</label>
              <input id="tripName" name="name" type="text" value={newTrip.name} onChange={handleNameChange}/>
              <input type="submit" />
            </form>
          </div>
        }


    </div>
  )
}
