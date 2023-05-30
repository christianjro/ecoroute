import React, { useState, useContext }from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const userAuthContext = useContext(AuthContext)

  const [validated, setValidated] = useState("")
  const [formData, setFormData] = useState({
    email: "", 
    password: ""
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
    // event.preventDefault()
    console.log(formData)
    const form = event.currentTarget
    if(form.checkValidity() !== true){
      setValidated('was-validated')
    }
    event.preventDefault()
    
    fetch("/login", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error("Wrong email or password.")
        }
      })
      .then(data => {
        userAuthContext.loginUser(data.token)
        navigate("/")
      })
      .catch(error => console.log(error))
  }

  return (
    <div className="text-center mt-5 pt-5">
      <h4 className="text-light">Login</h4>

      <div className="mt-3 mx-auto" style={{maxWidth: '30rem'}}>
        <form onSubmit={handleSubmit} className={validated} noValidate>
          <div className="form-floating mb-3">
            <input className="form-control border-3" placeholder="email" id="email" type="email" name="email" value={formData.email} onChange={handleChange} required/> 
            <label className="text-secondary" htmlFor="email">Email</label>
            <div className="invalid-feedback">Invalid email</div>
          </div>
          
          <div className="form-floating mb-3">
            <input className="form-control border-3" placeholder="password" id="password" type="password" name="password" value={formData.password} onChange={handleChange} required/>
            <label className="text-secondary" htmlFor="password">Password</label>
            <div className="invalid-feedback">Must include password</div>
          </div>
          
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}