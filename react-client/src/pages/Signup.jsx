import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../store';

export default function Signup() {
  const navigate = useNavigate()
  const createUser = useCreateUser()
  const [validated, setValidated] = useState("")
  const [formData, setFormData] = useState({
    name : "",
    email : "", 
    password : "",
  })

  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData, 
        [event.target.name] : event.target.value
      }
    })
  }

  function handleSubmit(event) {
    const form = event.currentTarget
    if(form.checkValidity() !== true){
      setValidated('was-validated')
    }
    event.preventDefault()
    console.log(formData)
    createUser.mutate(formData)
    navigate("/login")
  }

  return (
    <div className="text-center mt-5 pt-5">
      <h4 className="text-light">Sign Up</h4>
      <div className="mt-3 mx-auto" style={{maxWidth: '30rem'}}>
        <form onSubmit={handleSubmit} className={validated} noValidate>
          <div className="form-floating mb-3">
            <input 
              id="name" 
              className="form-control border-3"
              placeholder="name"
              type="text" 
              name="name" 
              value={ formData.name } 
              onChange={handleChange}
              required
            /> 
            <label className="text-secondary" htmlFor="name">Name</label>
          </div>
          
          <div className="form-floating mb-3">
            <input 
            id="email" 
            className="form-control border-3"
            placeholder="email"
            type="email" 
            name="email" 
            value={ formData.email } 
            onChange={handleChange}
            required
            />
            <label className="text-secondary" htmlFor="email">Email</label>
            <div className="invalid-feedback">Invalid email</div>
          </div>
          
          <div className="form-floating mb-3">
            <input 
            id="password" 
            className="form-control border-3"
            placeholder="password"
            type="password" 
            name="password" 
            value={ formData.password } 
            onChange={handleChange}
            required
            />
            <label className="text-secondary" htmlFor="password">Password</label>
            <div className="invalid-feedback">Must include password</div>
          </div>
          
          <button className="btn btn-primary" type="submit">Sign Up</button>
        </form>
      </div>
      
    </div>
  )
}
