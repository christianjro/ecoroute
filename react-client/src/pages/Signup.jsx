import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate()
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
    event.preventDefault()
    console.log(formData)
    fetch("/signup", {
      method: "POST", 
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
    navigate("/login")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <label htmlFor="name">Name</label>
        <input 
          id="name" 
          type="text" 
          name="name" 
          value={ formData.name } 
          onChange={handleChange}
        /> 
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          type="email" 
          name="email" 
          value={ formData.email } 
          onChange={handleChange}
          />
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          type="password" 
          name="password" 
          value={ formData.password } 
          onChange={handleChange}
          />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
