import React, {useState, useEffect } from 'react'

export default function Account() {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    fetch("/user_info")
      .then(res => res.json())
      .then(data => setUserInfo(data))
  }, [])

  return (
    <div>
      <h1>Account</h1>

      <h2>Name: {userInfo.name}</h2> 
      <h2>Email: {userInfo.email}</h2> 
      <h2>Personal Vehicle: {userInfo.has_personal_vehicle ? "yes" : "no"}</h2> 
      <h2>Password: {userInfo.password}</h2> 
    </div>
  )
}