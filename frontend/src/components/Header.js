import React from "react";
import { NavLink } from "react-router-dom";

import logo from "../img/logo.png";
import logo5 from "../img/logo5.png";

import "./Header.css";

const Header = () => {
  return (
    <div className="container-fluid">
      <header className="headerContainer">
        <div className="navbar-logo">
          <NavLink exact to="/" className="navbar-brand">
            <img className="logo" src={logo} alt="logo" />
          </NavLink>
        </div>
        <div className="pageTitle">
          <h2>Juego de Cartas Coleccionables</h2>
        </div>
        <div className="navbar-logo">
          <NavLink exact to="/" className="navbar-brand">
            <img className="logo" src={logo5} alt="logo" />
          </NavLink>
        </div>
      </header>
    </div>
  );
};

export default Header;
