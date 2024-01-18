import React from 'react';
import {NavLink} from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar sticky-top navbar-expand-lg bg-black navbar-dark">
      <div className="container">
        <div className="d-flex flex-row align-items-center">
          <i class="bi bi-geo-alt-fill text-primary" style={{fontSize: "1.5rem"}}></i>
          <NavLink to="/" className="navbar-brand ms-1 fw-semibold mb-2 mt-1 text-primary">EcoRoute</NavLink>
        </div>
        <button className="navbar-toggler body-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item ">
              <NavLink to="/" className="nav-link" activeClassName="active" aria-current="page">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className="nav-link" activeClassName="active">Login</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" className="nav-link" activeClassName="active">Signup</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
