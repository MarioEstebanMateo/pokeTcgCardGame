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
        <h1>Bienvenido al Juego!</h1>
        <h4>
          Esta pagina se creo con el fin de que los usuarios puedan jugar con
          las TCG Poke Cartas de una manera mas facil y divertida.
          <br />
          Otra de las razones de ser de esta pagina es para las personas que
          como yo no tenemos acceso a coleccionar las cartas fisicas, por
          motivos economicos o dificultad de acceso a las mismas.
          <br />
          Espero que disfruten de la pagina y pasen un lindo momento. Saludos!!
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
      </div>
    </div>
  );
};

export default Home;
