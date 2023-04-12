import React, {useState, useEffect } from 'react'

export default function Account() {
  const newVehicleFormTemplate = {
    name: "", 
    efficiency: "",
    make: "", 
    model: "",
    year: "",
  }
  const [userInfo, setUserInfo] = useState({})
  const [isAddVehicleForm, setIsAddVehicleForm] = useState(false)
  const [isUpdateVehicleForm, setIsUpdateVehicleForm] = useState(false)
  const [shouldRefetchUser, setShouldRefetchUser] = useState(false)
  const [newVehicle, setNewVehicle] = useState(newVehicleFormTemplate)

  useEffect(() => {
    fetch("/user_info")
      .then(res => res.json())
      .then(data => setUserInfo(data))
  }, [shouldRefetchUser])

  function handleChange(event) {
    setNewVehicle(prev => {
      return {
        ...prev, 
        [event.target.name] : event.target.value
      }
    })
  }

  function handleAddSubmit(event) {
    event.preventDefault()
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

  function handleUpdateSubmit(event) {
    event.preventDefault()
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
      
      {
        isAddVehicleForm &&
        <form onSubmit={handleAddSubmit}>
          <label htmlFor="name">Name:</label>
          <input id="name" name="name" type="text" value={newVehicle.name} onChange={handleChange}/>
          <label htmlFor="efficiency">Efficiency:</label>
          <input id="efficiency" name="efficiency" type="number" value={newVehicle.efficiency} onChange={handleChange} />
          <label htmlFor="make">Make:</label>
          <input id="make" name="make" type="text" value={newVehicle.make} onChange={handleChange} />
          <label htmlFor="model">Model:</label>
          <input id="model" name="model" type="text" value={newVehicle.model} onChange={handleChange} />
          <label htmlFor="year">Year:</label>
          <input id="year" name="year" type="number" value={newVehicle.year} onChange={handleChange} />
          <button type="submit">Add Vehicle</button>
        </form>
      }

      { 
        isUpdateVehicleForm &&
        <form onSubmit={handleUpdateSubmit}>
          <label htmlFor="name">Name:</label>
          <input id="name" name="name" type="text" value={newVehicle.name} onChange={handleChange}/>
          <label htmlFor="efficiency">Efficiency:</label>
          <input id="efficiency" name="efficiency" type="number" value={newVehicle.efficiency} onChange={handleChange} />
          <label htmlFor="make">Make:</label>
          <input id="make" name="make" type="text" value={newVehicle.make} onChange={handleChange} />
          <label htmlFor="model">Model:</label>
          <input id="model" name="model" type="text" value={newVehicle.model} onChange={handleChange} />
          <label htmlFor="year">Year:</label>
          <input id="year" name="year" type="number" value={newVehicle.year} onChange={handleChange} />
          <button type="submit">Update Vehicle</button>
        </form>
      }
    </div>
  )
}