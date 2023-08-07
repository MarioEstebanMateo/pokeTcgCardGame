import React, { useState, useEffect } from "react";
import "./Batalla5Cartas.css";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Batalla5Cartas.css";

const apiKey = process.env.REACT_APP_POKEMON_API_KEY;

const Batalla5Cartas = () => {
  const navigate = useNavigate();

  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [winner, setWinner] = useState("");

  // useEffect(() => {
  //   fetchPlayerCards();
  //   fetchComputerCards();
  // }, []);

  const fetchPlayerCards = async () => {
    try {
      const playerCardsResponse = await fetchRandomCards(5);
      setPlayerCards(playerCardsResponse);
    } catch (error) {
      console.error("Error fetching player cards:", error);
    }
  };

  const fetchComputerCards = async () => {
    try {
      const computerCardsResponse = await fetchRandomCards(5);
      setComputerCards(computerCardsResponse);
    } catch (error) {
      console.error("Error fetching computer cards:", error);
    }
  };

  const fetchRandomCards = async (numCards) => {
    try {
      const response = await axios.get("https://api.pokemontcg.io/v2/cards", {
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      const allCards = response.data.data;
      const randomIndices = new Set();
      while (randomIndices.size < numCards) {
        randomIndices.add(Math.floor(Math.random() * allCards.length));
      }
      return Array.from(randomIndices).map((index) => allCards[index]);
    } catch (error) {
      console.error("Error fetching random cards:", error);
      return [];
    }
  };

  const calculateTotalHP = (cards) => {
    let totalHP = 0;
    cards.forEach((card) => {
      totalHP += parseInt(card.hp) || 100;
    });
    return totalHP;
  };

  const playGame = () => {
    const playerTotalHP = calculateTotalHP(playerCards);
    const computerTotalHP = calculateTotalHP(computerCards);

    if (playerTotalHP === 0 || computerTotalHP === 0) {
      swal2.fire({
        icon: "error",
        title: "No se puede jugar",
        text: "Primeo saca las cartas del jugador y de la computadora",
      });
    } else {
      if (playerTotalHP > computerTotalHP) {
        setWinner("Ganaste!");
        swal2
          .fire({
            icon: "success",
            title: "Batalla terminada!",
            html: `Jugador Total HP: ${playerTotalHP} <br> Computadora Total HP: ${computerTotalHP} <br> <br> Resultado: Ganaste! Jugamos otra vez?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Nuevo Juego`,
            denyButtonText: `Ir a Pantalla de Inicio`,
            cancelButtonText: "Cancelar",
          })
          .then((result) => {
            if (result.isConfirmed) {
              handleReset();
            } else if (result.isDenied) {
              navigate("/");
            }
          });
      } else if (playerTotalHP < computerTotalHP) {
        setWinner("Perdiste!");
        swal2
          .fire({
            icon: "success",
            title: "Batalla terminada!",
            html: `Jugador Total HP: ${playerTotalHP} <br> Computadora Total HP: ${computerTotalHP} <br> <br> Resultado: Perdiste! Yo que voz me jugaria otro!`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Nuevo Juego`,
            denyButtonText: `Ir a Pantalla de Inicio`,
            cancelButtonText: "Cancelar",
          })
          .then((result) => {
            if (result.isConfirmed) {
              handleReset();
            } else if (result.isDenied) {
              navigate("/");
            }
          });
      } else if (playerTotalHP === computerTotalHP) {
        setWinner("Empate!");
        swal2
          .fire({
            icon: "success",
            title: "Batalla terminada!",
            html: `Jugador Total HP: ${playerTotalHP} <br> Computadora Total HP: ${computerTotalHP} <br> <br> Resultado: Empate! Esto no puede quedar así! Juguemos otro! Dale, hace click en "Nuevo Juego"!`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Nuevo Juego`,
            denyButtonText: `Ir a Pantalla de Inicio`,
            cancelButtonText: "Cancelar",
          })
          .then((result) => {
            if (result.isConfirmed) {
              handleReset();
            } else if (result.isDenied) {
              navigate("/");
            }
          });
      }
    }
  };

  const handleReset = () => {
    setPlayerCards([]);
    setComputerCards([]);
    setWinner("");
  };

  const warningVolverAlInicio = () => {
    swal2
      .fire({
        title: "Volver al Inicio?",
        text: "Si volves al inicio se perdera se perdera la informacion de las cartas",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
  };

  return (
    <div>
      <p className="rules">
        Reglas:
        <br />
        1- Primero saca tus 5 cartas. Haz click en el botón "Sacar Cartas
        Jugador" y espera a que salgan tu cartas
        <br />
        2- Cuando tengas tus 5 cartas, hacé click en el botón "Sacar Cartas
        Computadora" y esperá a que salgan las 5 cartas de la computadora.
        <br />
        3- Cuando salgan las 5 cartas de la computadora, hacé click en el botón
        "Batalla" para ver quién ganó!
        <br />
        Tip: Te pido paciencia, ya que las cartas tardan en salir. Gracias!
      </p>
      <div>
        <div>
          <p className="textPlayerAndComputer">Tus Cartas</p>
        </div>
        <div className="text-center">
          <button className="drawCardButton" onClick={fetchPlayerCards}>
            Sacar Cartas Jugador
          </button>
        </div>
        <div className="cards-container">
          {playerCards.map((card) => (
            <div key={card.id} className="">
              <img
                className="cardImage"
                src={card.images.small}
                alt={card.name}
              />
              <div className="cardInfo">
                <div>Nombre: {card.name}</div>
                <div>Nro en la Pokedex: {card.nationalPokedexNumbers}</div>
                <div>Set: {card.set.name}</div>
                <div>Serie: {card.set.series}</div>
                <div>
                  Fecha de Lanzamiento:{" "}
                  {new Date(card.set.releaseDate).toLocaleDateString("es-AR")}
                </div>
                <div>
                  Numero: {card.number} / {card.set.printedTotal}
                </div>
                <div>Rareza: {card.rarity}</div>
                <div>Tipo: {card.types}</div>
                {/* <div>
                      Precio: $
                      {card.tcgplayer.prices.holofoil
                        ? card.tcgplayer.prices.holofoil.market
                        : card.tcgplayer.prices.reverseHolofoil
                        ? card.tcgplayer.prices.reverseHolofoil.market
                        : card.tcgplayer.prices.normal
                        ? card.tcgplayer.prices.normal.market
                        : "No hay precio"}
                    </div> */}
                <div>Puntos HP: {card.hp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>
          <p className="textPlayerAndComputer">Cartas de la Computadora</p>
        </div>
        <div className="text-center">
          <button className="drawCardButton" onClick={fetchComputerCards}>
            Sacar Cartas Computadora
          </button>
        </div>
        <div className="cards-container">
          {computerCards.map((card) => (
            <div key={card.id} className="">
              <img
                className="cardImage"
                src={card.images.small}
                alt={card.name}
              />
              <div className="cardInfo">
                <div>Nombre: {card.name}</div>
                <div>Nro en la Pokedex: {card.nationalPokedexNumbers}</div>
                <div>Set: {card.set.name}</div>
                <div>Serie: {card.set.series}</div>
                <div>
                  Fecha de Lanzamiento:{" "}
                  {new Date(card.set.releaseDate).toLocaleDateString("es-AR")}
                </div>
                <div>
                  Numero: {card.number} / {card.set.printedTotal}
                </div>
                <div>Rareza: {card.rarity}</div>
                <div>Tipo: {card.types}</div>
                {/* <div>
                      Precio: $
                      {card.tcgplayer.prices.holofoil
                        ? card.tcgplayer.prices.holofoil.market
                        : card.tcgplayer.prices.reverseHolofoil
                        ? card.tcgplayer.prices.reverseHolofoil.market
                        : card.tcgplayer.prices.normal
                        ? card.tcgplayer.prices.normal.market
                        : "No hay precio"}
                    </div> */}
                <div>Puntos HP: {card.hp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="battleButtonsContainer text-center">
        <button className="battleButton" onClick={playGame}>
          Batalla!
        </button>
        <button className="newGameButton" onClick={handleReset}>
          Nuevo Juego
        </button>
      </div>
      <div className="text-center">
        <button className="backToHome" onClick={warningVolverAlInicio}>
          Ir a Pantalla de Inicio
        </button>
      </div>
    </div>
  );
};

export default Batalla5Cartas;
