import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="container-fluid">
      <ul className="liContainer">
        <li>
          <NavLink className="navLink" exact to="/" activeClassName="active">
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
            Juego de Batalla por HP
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
      </ul>
    </div>
  );
};

export default Navbar;
