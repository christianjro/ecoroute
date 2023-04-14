import React, {useState, useEffect } from 'react';
import {XMLParser} from 'fast-xml-parser';

export default function Account() {
  const newVehicleFormTemplate = {
    api_id: "",
    name: "Car",
    make: "", 
    model: "",
    year: "",
    avg_mpg: "",
    max_mpg: "",
    min_mpg: "",
    efficiency: 3
  }
  const [userInfo, setUserInfo] = useState({})
  const [isAddVehicleForm, setIsAddVehicleForm] = useState(false)
  const [isUpdateVehicleForm, setIsUpdateVehicleForm] = useState(false)

  const [shouldRefetchUser, setShouldRefetchUser] = useState(false)

  const [newVehicle, setNewVehicle] = useState({...newVehicleFormTemplate})
  const [searchVehicleModelOptions, setSearchVehicleModelOptions] = useState([])
  const [searchVehicleSpecOptions, setSearchVehicleSpecOptions] = useState([])
  const [finishButton, setFinishButton] = useState(false)

  useEffect(() => {
    fetch("/user_info")
      .then(res => res.json())
      .then(data => setUserInfo(data))
  }, [shouldRefetchUser])


  function handleChangeSearch(event) {
    setNewVehicle(prev => {
      return {
        ...prev, 
        [event.target.name] : event.target.value
      }
    })
  }

  // Get all vehicle models (from make and year)
  function handleSearchSubmit(event){
    event.preventDefault()
    const year = newVehicle.year
    const make = newVehicle.make
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`)
      .then(response => response.text())
      .then(data => {
        const parser = new XMLParser()
        let result = parser.parse(data)
        setSearchVehicleModelOptions(result.menuItems.menuItem)
      })
  }

  const vehicleModelItems = searchVehicleModelOptions.map((item) => {
    return (
      <div key={item.value} onClick={() => handleModelClick(item.text)}>
        <h3>Model: {item.text}</h3>
      </div>
    )
  })

  // Get vehicle spec and id (from year, make, and model)
  function handleModelClick(option) {
    setNewVehicle(prev => ({...prev, model: option}))
    const year = newVehicle.year
    const make = newVehicle.make
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${option}`)
      .then(response => response.text())
      .then(data => {
        const parser = new XMLParser()
        let result = parser.parse(data)
        setSearchVehicleSpecOptions(result.menuItems.menuItem)
      })
  }

  const vehicleSpecItems = searchVehicleSpecOptions.map((item) => {
    return (
      <div key={item.value} onClick={() => handleSpecClick(item.value)}>
        <h3>Spec: {item.text}</h3>
      </div>
    )
  })

  // Get vehicle mpg (from vehicle id)
  function handleSpecClick(option) {
    fetch(`https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${option.toString()}`)
      .then(response => response.text())
      .then(data => {
        const parser = new XMLParser()
        let result = parser.parse(data)
        console.log(result)
        setNewVehicle(prev => {
          return {
            ...prev, 
            id: option,
            avg_mpg: result.yourMpgVehicle.avgMpg,
            max_mpg: result.yourMpgVehicle.maxMpg,
            min_mpg: result.yourMpgVehicle.minMpg
          }
        })
        setFinishButton(true)
      })
  }


  function submitVehicleToDB() {
    if (userInfo.has_personal_vehicle) {
      updateVehicle()
      console.log("hi")
    } else {
      addVehicle()
    }
  }

  // (1/2) Final call to Flask Server (Add Vehicle)
  function addVehicle() {
    fetch("/new_vehicle", {
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newVehicle)
    })
      .then(response => {
        if (response.status == 200) {
          setShouldRefetchUser(prev => !prev)
          setIsAddVehicleForm(prev => !prev)
        }
      })
  }
  // (2/2) Final call to Flask Server (Update Vehicle)
  function updateVehicle() {
    fetch("/update_vehicle", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newVehicle)
    })
      .then(response => {
        if (response.status == 200) {
          setNewVehicle({...newVehicleFormTemplate})
          setShouldRefetchUser(prev => !prev)
          setIsUpdateVehicleForm(prev => !prev)
        }
      })
  }

  return (
    <div>
      <h1>Account</h1>

      <h2>Name: {userInfo.name}</h2> 
      <h2>Email: {userInfo.email}</h2> 
      <h2>Personal Vehicle: {userInfo.has_personal_vehicle ? "yes" : "no"}</h2> 
      <h2>Password: {userInfo.password}</h2> 
      {
        userInfo.has_personal_vehicle &&
        <div>
          <h2>Vehicle Name: {userInfo.vehicle.name}</h2>
          <h2>Vehicle Efficiency: {userInfo.vehicle.efficiency}</h2>
        </div>
      }

      {
        userInfo.has_personal_vehicle ?
        <button onClick={() => setIsUpdateVehicleForm(prev => !prev)}>Update Vehicle</button>
        :
        <button onClick={() => setIsAddVehicleForm(prev => !prev)}>Add New Vehicle</button>
      }

      {vehicleModelItems}
      {vehicleSpecItems}
      
      
      {
        (isAddVehicleForm || isUpdateVehicleForm)
        &&
        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="make">Make:</label>
          <input id="make" name="make" type="text" value={newVehicle.make} onChange={handleChangeSearch}/>
          <label htmlFor="year">Year:</label>
          <input id="year" name="year" type="text" value={newVehicle.year} onChange={handleChangeSearch}/>
          <button type="submit">Search Car</button>
        </form>
      }
      
      {
        finishButton 
        &&
        <button onClick={submitVehicleToDB}>Finish</button>
      }
    </div>
  )
}