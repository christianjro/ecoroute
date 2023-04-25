import React, { useState, useEffect, useContext } from 'react';
import {Routes, Route, Link, useNavigate} from 'react-router-dom';
import './App.css';
import Cookie from 'js-cookie';

import AuthContext from './AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import AddTrip from './pages/AddTrip';
import AddFriend from './pages/AddFriend';
import FriendRequests from './pages/FriendRequests';
import ViewFriends from './pages/ViewFriends';


function App() {
  // these are the values that manage the user's authentication state
  const [token, setToken] = useState(Cookie.get("token") || null)
  const [isLoggedIn, setIsLoggedIn] = useState(token !== null)
  const [userInfo, setUserInfo] = useState({})
  const [trips, setTrips] = useState([])
  const [shouldRefetchUser, setShouldRefetchUser] = useState(false)
  const [shouldRefetchTrips, setShouldRefetchTrips] = useState(false)

  const navigate = useNavigate();
  
  // useEffect(() => {
  //   fetch('/message')
  //     .then(res => res.json())
  //     .then(data => setData(data));
  // }, []);

  // useEffect(() => {
  //   fetch("/users")
  //     .then(res => res.json())
  //     .then(data => setData(data.users));
  // }, []);

  // const users = data.map((user) => {
  //   return (
  //     <div key={user.id}>
  //       <h3>{user.name}</h3>
  //       <p>{user.email}</p>
  //     </div>
  //   )
  // })

  const authContextValue = {
    token,
    isLoggedIn, 
    setToken,
    setIsLoggedIn
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/user_info")
        .then(res => res.json())
        .then(data => setUserInfo(data))
        // .then(data => console.log(data))
    }
  },[isLoggedIn, shouldRefetchUser])

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/trips")
          .then(res => res.json())
          .then(data => {
            setTrips(data.trips)
            console.log(trips)
        })
    }
  }, [isLoggedIn, shouldRefetchTrips])

  function handleUserInfoUpdate() {
    setShouldRefetchUser(prev => !prev)
  }

  function handleTripsUpdate(newTrip) {
    // setShouldRefetchTrips(prev => !prev)
    setTrips(prev => [...prev, newTrip])
  }

  function handleLogout() {
    fetch("/logout", {
      method: "POST", 
      credentials: "include"
    })
      .then(response => {
        if (response.status === 200) {
          console.log(response)
          setToken(null)
          setIsLoggedIn(false)
          Cookie.remove('token')
          navigate("/")
        }
      })
  }

  return (
    <AuthContext.Provider value={authContextValue}> 
      <div className="App">
        <Link to="/">Home</Link>
        {!isLoggedIn ? <Link to="/login">Login</Link> : null}
        {!isLoggedIn && <Link to="/signup">Signup</Link>}
        {isLoggedIn && <Link to="/account">Account</Link>}
        {isLoggedIn && <button onClick={handleLogout}>Log out</button>}
        {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
        {isLoggedIn && <Link to="/addFriend">Add Friend</Link>}
        {isLoggedIn && <Link to="/friendRequests">Friend Requests</Link>}
        {isLoggedIn && <Link to="/viewFriends">View Friends</Link>}
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup /> } />
          <Route path="/account" element={<Account userInfo={userInfo} handleUserInfoUpdate={handleUserInfoUpdate}/>} />
          <Route path="/dashboard" element={<Dashboard trips={trips} />} />
          <Route path="/addTrip" element={<AddTrip userInfo={userInfo} handleTripsUpdate={handleTripsUpdate}/>} />
          <Route path="/addFriend" element={<AddFriend />} />
          <Route path="/friendRequests" element={<FriendRequests />} />
          <Route path="/viewFriends" element={<ViewFriends />} />
        </Routes>

      </div>
    </AuthContext.Provider>
  );
}

export default App;
