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

  const showLoading = () => {
    swal2.fire({
      title: "Cargando cartas...",
      allowOutsideClick: false,
      didOpen: () => {
        swal2.showLoading();
      },
    });
  };

  const fetchPlayerCards = async () => {
    showLoading();

    try {
      const playerCardsResponse = await fetchRandomCards(5);
      setPlayerCards(playerCardsResponse);
      swal2.close();
    } catch (error) {
      console.error("Error fetching cards:", error);
      swal2.fire({
        icon: "error",
        title: "Error cargando cartas",
        text: "Por favor intenta de nuevo mas tarde",
      });
      swal2.close(); // Close the loading indicator when there is an error
    }
  };

  const fetchComputerCards = async () => {
    showLoading();

    try {
      const computerCardsResponse = await fetchRandomCards(5);
      setComputerCards(computerCardsResponse);
      swal2.close();
    } catch (error) {
      console.error("Error fetching cards:", error);
      swal2.fire({
        icon: "error",
        title: "Error cargando cartas",
        text: "Por favor intenta de nuevo mas tarde",
      });
      swal2.close(); // Close the loading indicator when there is an error
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

  const newGame = () => {
    swal2
      .fire({
        icon: "warning",
        title: "Quieres jugar de nuevo?",
        text: "Si jugas de nuevo se perdera la informacion de las cartas",
        // showDenyButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleReset();
        }
      });
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

  // ------------------------- Scroll Button -----------------------

  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ------------------------- Fin Scroll Button -----------------------

  return (
    <div>
      <p className="rules">
        Reglas:
        <br />
        1. Primero, saca tus 5 cartas. Haz clic en el botón "Sacar Cartas
        Jugador" y espera a que aparezcan tus cartas.
        <br />
        2. Cuando tengas tus 5 cartas, haz clic en el botón "Sacar Cartas
        Computadora" y espera a que salgan las 5 cartas de la computadora.
        <br />
        3. Una vez que aparezcan las 5 cartas de la computadora, haz clic en el
        botón "Batalla" para ver quién ganó.
        <br />
        **Tip:** Agradecemos tu paciencia, ya que las cartas pueden tardar unos
        momentos en cargarse. ¡Gracias!
      </p>
      <div>
        <div>
          <p className="textPlayerAndComputer">Tus Cartas</p>
        </div>
        <div className="text-center">
          <button className="drawCardPlayerButton" onClick={fetchPlayerCards}>
            Sacar Cartas del Jugador
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
          <button
            className="drawCardComputerButton"
            onClick={fetchComputerCards}
          >
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
        <button className="newGameButton" onClick={newGame}>
          Nuevo Juego
        </button>
      </div>
      <div className="text-center">
        <button className="backToHome" onClick={warningVolverAlInicio}>
          Ir a Pantalla de Inicio
        </button>
      </div>
      <button
        className={`back-to-top-button ${showButton ? "show" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default Batalla5Cartas;
