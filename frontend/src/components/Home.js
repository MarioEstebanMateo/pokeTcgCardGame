import React from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import imgPoke1 from "../img/logo1.png";
import imgPoke2 from "../img/logo2.png";
import imgPoke3 from "../img/logo3.png";
import imgPoke4 from "../img/logo4.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="imgPokeContainer">
        <img className="imgPoke" src={imgPoke1} alt="logo" />
        <img className="imgPoke" src={imgPoke2} alt="logo" />
        <img className="imgPoke" src={imgPoke4} alt="logo" />
        <img className="imgPoke" src={imgPoke3} alt="logo" />
      </div>
      <div className="homeText text-center">
        <h1>¡Bienvenidos al Juego de Cartas Coleccionables!</h1>
        <h4>
          Esta página fue creada para que puedas disfrutar de una experiencia de
          juego con cartas coleccionables de manera accesible y divertida.
          <br />
          También está pensada para aquellos que, como yo, tienen dificultad
          para acceder a las cartas físicas, ya sea por razones económicas o por
          disponibilidad.
          <br />
          Espero que disfrutes de esta plataforma y pases un buen momento
          explorando el mundo de las cartas coleccionables. ¡Saludos!
        </h4>
      </div>
      <div className="buttonContainer text-center">
        <button
          className="buttonHome"
          onClick={() => navigate("/batalla5cartas")}
        >
          Batalla!
        </button>
        <button className="buttonHome" onClick={() => navigate("/abrirsobre")}>
          Abrir Sobre
        </button>
        <button
          className="buttonHome"
          onClick={() => navigate("/versetcompleto")}
        >
          Ver Set Completo
        </button>
      </div>
    </div>
  );
};

export default Home;
