import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const userAuthContext = useContext(AuthContext)

  // Logout User
  function handleLogout() {
    fetch("/logout", {
      method: "POST", 
      credentials: "include"
    })
      .then(response => {
        if (response.status === 200) {
          userAuthContext.logoutUser()
          navigate("/")
        }
      })
  }
  
  return (
    <nav id="largeSidebar" className="navbar bg-info align-items-start p-0" style={{width: "20rem", height:"100vh"}} data-bs-theme="dark">
      <div className="container-fluid d-flex flex-column p-0">
        <div className="d-flex flex-column align-items-center my-5">
          <i class="bi bi-geo-alt-fill text-primary" style={{fontSize: "2.5rem"}}></i>
          <h3 className="large-screen-enabled mt-1 text-primary">EcoRoute</h3>
        </div>

        <ul className="navbar-nav">
          <div className="">
            <li className="nav-item border-bottom border-dark mb-2 pb-2">
                <NavLink to="/addTrip" className="nav-link" activeClassName="active">
                  <i class="bi bi-plus-square-fill" style={{fontSize: "1.3rem"}}></i>
                  <span className="large-screen-enabled ms-3">Add Trip</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/" className="nav-link" activeClassName="active">
                  <i class="bi bi-grid-fill" style={{fontSize: "1.3rem"}}></i>
                  <span className="large-screen-enabled ms-3">Dashboard</span>
                </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/trips" className="nav-link" activeClassName="active">
                <i class="bi bi-map" style={{fontSize: "1.3rem"}}></i>
                <span className="large-screen-enabled ms-3">Trips</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/feed" className="nav-link" activeClassName="active">
                <i class="bi bi-share-fill" style={{fontSize: "1.3rem"}}></i>
                <span className="large-screen-enabled ms-3">Feed</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/addFriend" className="nav-link" activeClassName="active">
                <i class="bi bi-person-fill-add" style={{fontSize: "1.3rem"}}></i>
                <span className="large-screen-enabled ms-3">Add Friend</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/friendRequests" className="nav-link" activeClassName="active">
                <i class="bi bi-person-lines-fill" style={{fontSize: "1.3rem"}}></i>
                <span className="large-screen-enabled ms-3">Friend Requests</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/viewFriends" className="nav-link" activeClassName="active">
                <i class="bi bi-people-fill" style={{fontSize: "1.3rem"}}></i>
                <span className="large-screen-enabled ms-3">View Friends</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/account" className="nav-link" activeClassName="active">
                <i class="bi bi-gear-fill" style={{fontSize: "1.3rem"}}></i>
                <span className="large-screen-enabled ms-3">Account</span>
              </NavLink>
            </li>
          </div>

          <div className="">
            <li className="nav-item border-top border-dark mt-2 pt-2">
              <button onClick={handleLogout} className="nav-link">
                <i className="bi bi-box-arrow-left" style={{fontSize: "1.3rem", fontWeight: "bold"}}></i>
                <span className="large-screen-enabled ms-3">Log out</span>
              </button>
            </li>
            </div>
        </ul>
      </div>
    </nav>
  )
}
