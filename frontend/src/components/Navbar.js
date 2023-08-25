import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav class="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="liContainer navbar-nav">
            <li>
              <NavLink
                className="navLink"
                exact
                to="/"
                activeClassName="active"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className="navLink"
                exact
                to="/batalla5cartas"
                activeClassName="active"
              >
                Batalla!
              </NavLink>
            </li>
            <li>
              <NavLink
                className="navLink"
                exact
                to="/abrirsobre"
                activeClassName="active"
              >
                Abrir Sobre
              </NavLink>
            </li>
            <li>
              <NavLink
                className="navLink"
                exact
                to="/versetcompleto"
                activeClassName="active"
              >
                Ver Set Completo
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
