import React, { useState, useEffect, useContext } from 'react';
import {Routes, Route, Link, useNavigate} from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
import './custom.scss';
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
import Feed from './pages/Feed';
import Friends from './pages/Friends';
import Trips from './pages/Trips';


function App() {
  // these are the values that manage the user's authentication state
  const [token, setToken] = useState(Cookie.get("token") || null)
  const [isLoggedIn, setIsLoggedIn] = useState(token !== null)
  const [userInfo, setUserInfo] = useState({})
  const [trips, setTrips] = useState([])
  const [location, setLocation] = useState(null)
  const [shouldRefetchUser, setShouldRefetchUser] = useState(false)
  const [shouldRefetchTrips, setShouldRefetchTrips] = useState(false)

  const navigate = useNavigate();

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
            const sortedTrips = data.trips.sort((a, b) => {
              return new Date(b.date_created) - new Date(a.date_created)
            })
            setTrips(sortedTrips)
            console.log(trips)
        })
    }
  }, [isLoggedIn, shouldRefetchTrips])

  function handleUserInfoUpdate() {
    setShouldRefetchUser(prev => !prev)
  }

  function handleTripsUpdate(newTrip=null) {
    // update trips if adding a newTrip or deleting a new trip

    if (newTrip) {
      setTrips(prev => [newTrip, ...prev])
    } else {
      setShouldRefetchTrips(prev => !prev)
    }
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
    <AuthContext.Provider value={authContextValue}> 
      <div className="App">
        <div className={`d-flex ${isLoggedIn ? 'flex-row' : 'flex-column'}`}>

          {
            isLoggedIn 
            &&
            <nav id="largeSidebar" className="navbar bg-secondary align-items-start p-0" style={{width: "20rem", height:"100vh"}}>
              <div className="container-fluid d-flex flex-column p-0">
                <div className="d-flex flex-column align-items-center my-5">
                  <i class="bi bi-geo-alt-fill" style={{fontSize: "2.5rem"}}></i>
                  <h3 className="large-screen-enabled mt-1">Capstone</h3>
                </div>

                <ul className="navbar-nav">
                  <div className="">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                          <i class="bi bi-grid-fill" style={{fontSize: "1.3rem"}}></i>
                          <span className="large-screen-enabled ms-3">Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/trips" className="nav-link">
                        <i class="bi bi-map" style={{fontSize: "1.3rem"}}></i>
                        <span className="large-screen-enabled ms-3">Trips</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/feed" className="nav-link">
                        <i class="bi bi-share-fill" style={{fontSize: "1.3rem"}}></i>
                        <span className="large-screen-enabled ms-3">Feed</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/addFriend" className="nav-link">
                        <i class="bi bi-person-fill-add" style={{fontSize: "1.3rem"}}></i>
                        <span className="large-screen-enabled ms-3">Add Friend</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/friendRequests" className="nav-link">
                        <i class="bi bi-person-lines-fill" style={{fontSize: "1.3rem"}}></i>
                        <span className="large-screen-enabled ms-3">Friend Request</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/viewFriends" className="nav-link">
                        <i class="bi bi-people-fill" style={{fontSize: "1.3rem"}}></i>
                        <span className="large-screen-enabled ms-3">View Friends</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/account" className="nav-link">
                        <i class="bi bi-gear-fill" style={{fontSize: "1.3rem"}}></i>
                        <span className="large-screen-enabled ms-3">Account</span>
                      </Link>
                    </li>
                  </div>

                  <div className="">
                    <li className="nav-item">
                      <button onClick={handleLogout} className="nav-link">
                        <i className="bi bi-box-arrow-left" style={{fontSize: "1.3rem", fontWeight: "bold"}}></i>
                        <span className="large-screen-enabled ms-3">Log out</span>
                      </button>
                    </li>
                    </div>
                </ul>
              </div>
            </nav>
          }

          {
            !isLoggedIn
            &&
            <nav className="navbar sticky-top navbar-expand-lg bg-body-secondary">
              <div className="container-fluid">
                <Link to="/" className="navbar-brand">Capstone</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link to="/" class="nav-link active" aria-current="page">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/login" class="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/signup" class="nav-link">Signup</Link>
                    </li>
                  </ul>
                </div>
              </div>
              
            </nav>
          }


          {/* {!isLoggedIn && <Link to="/">Home</Link>}
          {!isLoggedIn ? <Link to="/login">Login</Link> : null}
          {!isLoggedIn && <Link to="/signup">Signup</Link>}
          {isLoggedIn && <Link to="/account">Account</Link>}
          {isLoggedIn && <button onClick={handleLogout}>Log out</button>}
          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
          {isLoggedIn && <Link to="/addFriend">Add Friend</Link>}
          {isLoggedIn && <Link to="/friendRequests">Friend Requests</Link>}
          {isLoggedIn && <Link to="/viewFriends">View Friends</Link>}
          {isLoggedIn && <Link to="/feed">Feed</Link>} */}

          <div class="container bg-dark vh-100 overflow-y-auto">
            <Routes>
              <Route path="/" element={isLoggedIn? <Dashboard trips={trips} handleTripsUpdate={handleTripsUpdate} location={location}/> : <Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup /> } />
              <Route path="/account" element={<Account userInfo={userInfo} handleUserInfoUpdate={handleUserInfoUpdate}/>} />
              {/* <Route path="/dashboard" element={<Dashboard trips={trips} handleTripsUpdate={handleTripsUpdate} location={location}/>} /> */}
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
    </AuthContext.Provider>
  );
}

export default App;
