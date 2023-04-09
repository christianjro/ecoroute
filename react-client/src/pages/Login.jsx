import React, { useState, useContext }from 'react';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)

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
    event.preventDefault()
    console.log(formData)
    fetch("/login", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.status === 200) {
          setIsAuthenticated(true)
        }
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange}/> 

        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange}/>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}