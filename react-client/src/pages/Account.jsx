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

  const [newVehicle, setNewVehicle] = useState({...newVehicleFormTemplate})
  const [searchVehicleModelOptions, setSearchVehicleModelOptions] = useState([])
  const [searchVehicleSpecOptions, setSearchVehicleSpecOptions] = useState([])
  const [finishButton, setFinishButton] = useState(false)


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
      <option value={item.value}>{item.text}</option>
    )
  })

  // Get vehicle mpg (from vehicle id)
  function handleSpecChange(event) {
    const option = event.target.value
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/${option.toString()}`)
      .then(response => response.text())
      .then(data => {
        const parser = new XMLParser()
        let result = parser.parse(data)
        console.log(result)
        setNewVehicle(prev => {
          return {
            ...prev, 
            id: option,
            avg_mpg: result.vehicle.comb08U,
            max_mpg: result.vehicle.comb08,
            min_mpg: result.vehicle.comb08,
            efficiency : (0.00889 * 1/result.vehicle.comb08U * 1/0.993)
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
    <div>
      <div className="row justify-content-center p-sm-4">
        <div className="col-md-8">
          <h4 className="mt-5 mb-4 text-primary">Account</h4>
          <div className="card mx-auto border-black border-3">
            <div className="card-header text-light border-black">
              Account Info
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between border-info">
                <div className="text-light">Name</div>
                <div className="text-secondary">{props.userInfo.name}</div>
              </li> 
              <li className="list-group-item d-flex justify-content-between border-info">
                <div className="text-light">Email</div>
                <div className="text-secondary">{props.userInfo.email}</div>
              </li> 
              <li className="list-group-item d-flex justify-content-between border-info">
                <div className="text-light">Personal Vehicle</div>
                <div className="text-secondary">{props.userInfo.has_personal_vehicle ? "Yes" : "None"}</div>
              </li> 
              <li className="list-group-item d-flex justify-content-between border-info">
                <div className="text-light">Password</div>
                <div className="text-secondary">{props.userInfo.password}</div>
              </li> 
            </ul>
          </div>
  
          {
            props.userInfo.has_personal_vehicle &&
            <div className="card my-3 mx-auto border-black border-3">
              <div className="card-header text-light border-black">
                Vehicle Info
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between border-info">
                  <div className="text-light">Make</div>
                  <div className="text-secondary">{props.userInfo.vehicle.make}</div>
                </li>
                <li className="list-group-item d-flex justify-content-between border-info">
                  <div className="text-light">Model</div>
                  <div className="text-secondary">{props.userInfo.vehicle.model}</div>
                </li>
                <li className="list-group-item d-flex justify-content-between border-info">
                  <div className="text-light">Year</div>
                  <div className="text-secondary">{props.userInfo.vehicle.year}</div>
                </li>
                <li className="list-group-item d-flex justify-content-between border-info">
                  <div className="text-light">Efficiency Factor</div>
                  <div className="text-secondary">{props.userInfo.vehicle.efficiency}</div>
                </li>
              </ul>
            </div>
          }
        </div>
      </div>

      <div className="text-center mt-3">
        {
          props.userInfo.has_personal_vehicle ?
          <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#vehicleForm" data-bs-whatever="@update" onClick={() => setIsUpdateVehicleForm(prev => !prev)}>Update Vehicle</button>
          :
          <button  className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#vehicleForm" data-bs-whatever="@add" onClick={() => setIsAddVehicleForm(prev => !prev)}>Add New Vehicle</button>
        }
      </div>
      
      
      <div className="modal fade" id="vehicleForm" tabIndex="-1"> 
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
          <div className="modal-header border-info" data-bs-theme="dark">
            <h5 className="modal-title text-primary ms-lg-4">New Vehicle</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
          </div>

          <div className="modal-body mx-lg-4">
            {
              (isAddVehicleForm || isUpdateVehicleForm)
              &&
              <form onSubmit={handleSearchSubmit}>
                <label className="text-light" htmlFor="make">Make:</label>
                <input className="form-control border-3 mt-2 mb-3" id="make" name="make" type="text" value={newVehicle.make} onChange={handleChangeSearch}/>
                
                <label className="text-light" htmlFor="year">Year:</label>
                <input className="form-control border-3 mt-2 mb-3" id="year" name="year" type="text" value={newVehicle.year} onChange={handleChangeSearch}/>
                
                <div className="text-center">
                  {!isMakeReceived && <button className="btn btn-secondary mb-1" type="submit">Next</button>}
                </div>
              </form>
            }
            
            {
              isMakeReceived
              &&
              <div className="">
                <label className="text-light">Make:</label>
                <select class="form-select border-3 mt-2 mb-3" onChange={handleModelChange}>
                  <option selected>Select a make from menu</option>
                  {vehicleModelItems}
                </select>
              </div>
            }
            
            {
              isSpecReceived
              &&
              <div className="">
                <label className="text-light">Spec:</label>
                <select class="form-select border-3 mt-2 mb-3" onChange={handleSpecChange}>
                  <option selected>Select spec from menu</option>
                  {vehicleSpecItems}
                </select>
              </div>
            }
            
            {
              finishButton 
              &&
              <div className="text-center mt-3">
                <button className="btn btn-secondary mb-1" onClick={submitVehicleToDB} data-bs-dismiss="modal">Finish</button>
              </div>
            }
          </div>
            
          </div>
        </div>
      </div>
      
    </div>
  )
}