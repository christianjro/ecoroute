import React, {useState, useEffect } from 'react';
import {XMLParser} from 'fast-xml-parser';

export default function Account(props) {
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
  const [isAddVehicleForm, setIsAddVehicleForm] = useState(false)
  const [isUpdateVehicleForm, setIsUpdateVehicleForm] = useState(false)
  const [isMakeReceived, setIsMakeReceived] = useState(false)
  const [isSpecReceived, setIsSpecReceived] = useState(false)

  // const [shouldRefetchUser, setShouldRefetchUser] = useState(false)

  const [newVehicle, setNewVehicle] = useState({...newVehicleFormTemplate})
  const [searchVehicleModelOptions, setSearchVehicleModelOptions] = useState([])
  const [searchVehicleSpecOptions, setSearchVehicleSpecOptions] = useState([])
  const [finishButton, setFinishButton] = useState(false)

  // useEffect(() => {
  //   fetch("/user_info")
  //     .then(res => res.json())
  //     .then(data => setUserInfo(data))
  // }, [shouldRefetchUser])


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
        setIsMakeReceived(true)
      })
  }

  const vehicleModelItems = searchVehicleModelOptions.map((item) => {
    return (
      // <div key={item.value} onClick={() => handleModelClick(item.text)}>
      //   <h3>Model: {item.text}</h3>
      // </div>
      <option value={item.text}>{item.text}</option>
    )
  })

  // Get vehicle spec and id (from year, make, and model)
  function handleModelChange(event) {
    const option = event.target.value
    setNewVehicle(prev => ({...prev, model: option}))
    const year = newVehicle.year
    const make = newVehicle.make
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${option}`)
      .then(response => response.text())
      .then(data => {
        const parser = new XMLParser()
        let result = parser.parse(data)
        setSearchVehicleSpecOptions(result.menuItems.menuItem)
        setIsSpecReceived(true)
      })
  }

  const vehicleSpecItems = searchVehicleSpecOptions.map((item) => {
    return (
      // <div key={item.value} onClick={() => handleSpecClick(item.value)}>
      //   <h3>Spec: {item.text}</h3>
      // </div>
      <option value={item.value}>{item.text}</option>
    )
  })

  // Get vehicle mpg (from vehicle id)
  function handleSpecChange(event) {
    const option = event.target.value
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
            min_mpg: result.yourMpgVehicle.minMpg,
            efficiency : (0.00889 * 1/result.yourMpgVehicle.avgMpg * 1/0.993)
            // to do: separate this logic to a function
          }
        })
        setFinishButton(true)
      })
  }


  function submitVehicleToDB() {
    if (props.userInfo.has_personal_vehicle) {
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
        if (response.status === 200) {
          // setShouldRefetchUser(prev => !prev)
          props.handleUserInfoUpdate()
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
        if (response.status === 200) {
          setNewVehicle({...newVehicleFormTemplate})
          props.handleUserInfoUpdate()
          setIsUpdateVehicleForm(prev => !prev)
        }
      })
  }

  function handleClose() {
    setNewVehicle({...newVehicleFormTemplate})
    setIsAddVehicleForm(prev => !prev)
    setIsUpdateVehicleForm(prev => !prev)
    setIsMakeReceived(false)
    setIsSpecReceived(false)
    setFinishButton(false)
  }

  return (
    <div className="container">
      <h1>Account</h1>
      <div className="card mx-auto" style={{maxWidth: '30rem'}}>
        <div className="card-header">
          Account Info
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <div className="fw-bold">Name</div>
            <div>{props.userInfo.name}</div>
          </li> 
          <li className="list-group-item d-flex justify-content-between">
            <div className="fw-bold">Email</div>
            <div>{props.userInfo.email}</div>
          </li> 
          <li className="list-group-item d-flex justify-content-between">
            <div className="fw-bold">Personal Vehicle</div>
            <div>{props.userInfo.has_personal_vehicle ? "Yes" : "None"}</div>
          </li> 
          <li className="list-group-item d-flex justify-content-between">
            <div className="fw-bold">Password</div>
            <div>{props.userInfo.password}</div>
          </li> 
        </ul>
      </div>
  
      {
        props.userInfo.has_personal_vehicle &&
        <div className="card my-3 mx-auto" style={{maxWidth: '30rem'}}>
          <div className="card-header">
            Vehicle Info
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              <div className="fw-bold">Make</div>
              <div>{props.userInfo.vehicle.make}</div>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <div className="fw-bold">Model</div>
              <div>{props.userInfo.vehicle.model}</div>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <div className="fw-bold">Year</div>
              <div>{props.userInfo.vehicle.year}</div>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <div className="fw-bold">Efficiency Factor</div>
              <div>{props.userInfo.vehicle.efficiency}</div>
            </li>
          </ul>
        </div>
      }

      <div className="text-center mt-3">
        {
          props.userInfo.has_personal_vehicle ?
          <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#vehicleForm" data-bs-whatever="@update" onClick={() => setIsUpdateVehicleForm(prev => !prev)}>Update Vehicle</button>
          :
          <button  className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#vehicleForm" data-bs-whatever="@add" onClick={() => setIsAddVehicleForm(prev => !prev)}>Add New Vehicle</button>
        }
      </div>
      
      
      <div className="modal fade" id="vehicleForm" tabindex="-1"> 
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Vehicle</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            {
              (isAddVehicleForm || isUpdateVehicleForm)
              &&
              <form onSubmit={handleSearchSubmit}>
                <label htmlFor="make">Make:</label>
                <input className="form-control" id="make" name="make" type="text" value={newVehicle.make} onChange={handleChangeSearch}/>
                
                <label htmlFor="year">Year:</label>
                <input className="form-control" id="year" name="year" type="text" value={newVehicle.year} onChange={handleChangeSearch}/>
                
                <div className="text-center">
                  {!isMakeReceived && <button className="btn btn-dark mt-3" type="submit">Next</button>}
                </div>
              </form>
            }
            
            {
              isMakeReceived
              &&
              <div className="">
                <label>Make:</label>
                <select class="form-select" onChange={handleModelChange}>
                  <option selected>Select a make from menu</option>
                  {vehicleModelItems}
                </select>
              </div>
            }
            
            {
              isSpecReceived
              &&
              <div className="">
                <label>Spec:</label>
                <select class="form-select" onChange={handleSpecChange}>
                  <option selected>Select spec from menu</option>
                  {vehicleSpecItems}
                </select>
              </div>
            }
            
            {
              finishButton 
              &&
              <div className="text-center mt-3">
                <button className="btn btn-dark" onClick={submitVehicleToDB} data-bs-dismiss="modal">Finish</button>
              </div>
            }
          </div>
            
          </div>
        </div>
      </div>
      
    </div>
  )
}