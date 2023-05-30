import React, { useState, useEffect, useContext } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './custom.scss';
import './App.css';

import { AuthContext } from './store/context/AuthContext'

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import AddTrip from './pages/AddTrip';
import AddFriend from './pages/AddFriend';
import FriendRequests from './pages/FriendRequests';
import ViewFriends from './pages/ViewFriends';
import Feed from './pages/Feed';
import Friends from './pages/Friends';
import Trips from './pages/Trips';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


function App() {
  const userAuthContext = useContext(AuthContext)
  
  const [userInfo, setUserInfo] = useState({})
  const [trips, setTrips] = useState([])
  const [location, setLocation] = useState(null)
  const [shouldRefetchUser, setShouldRefetchUser] = useState(false)
  const [shouldRefetchTrips, setShouldRefetchTrips] = useState(false)

  // Get User Info
  useEffect(() => {
    if (userAuthContext.isLoggedIn) {
      fetch("/user_info")
        .then(res => res.json())
        .then(data => setUserInfo(data))
    }
  },[userAuthContext.isLoggedIn, shouldRefetchUser])

  // Get User Trips
  useEffect(() => {
    if (userAuthContext.isLoggedIn) {
      fetch("/trips")
          .then(res => res.json())
          .then(data => {
            const sortedTrips = data.trips.sort((a, b) => {
              return new Date(b.date_created) - new Date(a.date_created)
            })
            setTrips(sortedTrips)
            console.log(trips)
        })
    }
  }, [userAuthContext.isLoggedIn, shouldRefetchTrips])

  function handleUserInfoUpdate() {
    setShouldRefetchUser(prev => !prev)
  }

  // Re-render trips (if adding a newTrip or deleting a new trip)
  function handleTripsUpdate(newTrip=null) {
    if (newTrip) {
      setTrips(prev => [newTrip, ...prev])
    } else {
      setShouldRefetchTrips(prev => !prev)
    }
  }


  // Get User's Current Location
  function getLocation() {
    const positionPromise = new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      } else {
        reject(new Error("Geolocation is not supported by this browser."))
      }
    })

    return positionPromise
  }

  useEffect(() => {
    async function fetchLocation() {
      try {
        const position = await getLocation()
        setLocation(position.coords)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLocation()
  }, [])
  

  return (
    <div className="App bg-dark">
      <div className={`d-flex ${userAuthContext.isLoggedIn ? 'flex-row' : 'flex-column'}`}>

        {userAuthContext.isLoggedIn ? <Sidebar /> : <Navbar />}

        <div class="container bg-dark vh-100 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={userAuthContext.isLoggedIn? <Dashboard userInfo={userInfo} trips={trips} location={location}/> : <Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup /> } />
            <Route path="/account" element={<Account userInfo={userInfo} handleUserInfoUpdate={handleUserInfoUpdate}/>} />
            <Route path="/addTrip" element={<AddTrip userInfo={userInfo} handleTripsUpdate={handleTripsUpdate}/>} />
            <Route path="/addFriend" element={<AddFriend />} />
            <Route path="/friendRequests" element={<FriendRequests />} />
            <Route path="/viewFriends" element={<ViewFriends />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/trips" element={<Trips trips={trips} handleTripsUpdate={handleTripsUpdate}/>} />
          </Routes>
        </div>

      </div>
    </div>
  );
}

export default App;
