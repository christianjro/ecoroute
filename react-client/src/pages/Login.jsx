import React, { useState, useContext }from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import Cookie from 'js-cookie';

export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext)

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