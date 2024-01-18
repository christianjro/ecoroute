import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/heroAnimation.json';
import { NavLink } from 'react-router-dom';

export default function Home() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  return (
    <div class="container">
      <div class="row align-items-center" style={{height: "75vh"}}>
        <div class="col text-lg-start text-center">
          <h1 class="display-2 fw-semibold text-primary">Welcome to EcoRoute</h1>
          <h3 class="text-light">Explore Your Transportation Emissions and Connect with a Greener Community</h3>
          <div class="mt-3">
            <button className="btn btn-primary" type="submit">
              <NavLink to="/login" className="nav-link" activeClassName="active">Get Started</NavLink>
            </button>
          </div>
        </div>
        <div class="col justify-content-center">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </div>
    </div>
  )
}
