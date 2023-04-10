import React, { useState, useEffect } from 'react';
import {Routes, Route, Link, useNavigate} from 'react-router-dom';
import './App.css';

import { AuthContext } from './AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState([]);
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

  function handleLogout() {
  fetch("/logout", {
    method: "POST", 
    credentials: "include"
  })
    .then(response => {
      if (response.status === 200) {
        console.log(response)
        setIsAuthenticated(false)
        navigate("/")
      }
    })
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}> 
      <div className="App">
        <Link to="/">Home</Link>
        {!isAuthenticated ? <Link to="/login">Login</Link> : null}
        {!isAuthenticated && <Link to="/signup">Signup</Link>}
        {isAuthenticated && <Link to="/account">Account</Link>}
        {isAuthenticated && <button onClick={handleLogout}>Log out</button>}
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup /> } />
          <Route path="/account" element={<Account />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* <h1>Final Project</h1>
        <h2>{users}</h2> */}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
