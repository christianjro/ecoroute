import React, { useState, useContext }from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import Cookie from 'js-cookie';

export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext)
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
    if(form.checkValidity() === false){
      event.preventDefault()
    }
    setValidated('was-validated')

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
        Cookie.set('token', data.token)
        auth.setToken(data.token)
        auth.setIsLoggedIn(true)
        navigate("/dashboard")
      })
      .catch(error => console.log(error))
  }

  return (
    <div>
      <h1>Login</h1>

      <div className="container mt-5" style={{maxWidth: '30rem'}}>
        <form onSubmit={handleSubmit} className={validated} noValidate>
          <div className="form-floating mb-3">
            <input className="form-control" placeholder="email" id="email" type="email" name="email" value={formData.email} onChange={handleChange} required/> 
            <label htmlFor="email">Email</label>
            <div class="invalid-feedback">Invalid email</div>
          </div>
          
          <div className="form-floating mb-3">
            <input className="form-control" placeholder="password" id="password" type="password" name="password" value={formData.password} onChange={handleChange} required/>
            <label htmlFor="password">Password</label>
            <div class="invalid-feedback">Must include password</div>
          </div>
          
          <button className="btn btn-primary" type="submit">Login</button>
      </form>
      </div>
    </div>
  )
}