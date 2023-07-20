import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/batalla5cartas");
  };

  return (
    <div>
      <h1>Ir a Juego de Cartas</h1>
      <button onClick={handleClick}>Ir</button>
    </div>
  );
};

export default Home;
