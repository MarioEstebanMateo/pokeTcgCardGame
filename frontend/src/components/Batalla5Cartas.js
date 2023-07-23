import React, { useState } from "react";
import "./Batalla5Cartas.css";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./Batalla5Cartas.css";

const Batalla5Cartas = () => {
  const apiKey = "28741ca5-7270-449e-9319-8b046277f2ba";
  // const baseURL = "https://api.pokemontcg.io/v2/cards";

  const navigate = useNavigate();

  // const [isLoading, setIsLoading] = useState();
  // const [isLoading2, setIsLoading2] = useState();

  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [playerTotalHP, setPlayerTotalHP] = useState(0);
  const [computerTotalHP, setComputerTotalHP] = useState(0);
  const [winner, setWinner] = useState("");

  const getRandomPokemonCardPlayer = async () => {
    const apiUrl = `https://api.pokemontcg.io/v2/cards`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    const data = await response.json();
    const totalCards = data.data.length;
    const randomIndex = Math.floor(Math.random() * totalCards);
    const randomCard = data.data[randomIndex];
    return randomCard;
  };

  const getRandomPokemonCardComputer = async () => {
    const apiUrl = `https://api.pokemontcg.io/v2/cards`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    const data = await response.json();
    const totalCards = data.data.length;
    const randomIndex = Math.floor(Math.random() * totalCards);
    const randomCard = data.data[randomIndex];
    return randomCard;
  };

  const handleDrawCardPlayer = async () => {
    if (computerCards.length === 5 && playerCards.length === 5) {
      swal2.fire({
        icon: "warning",
        title: "Ya sacaste tus 5 cartas y la computadora también!",
        text: "Ahora hace click en el botón de batalla para ver quién ganó! =)",
      });
    } else {
      if (playerCards.length < 5) {
        handleIsLoading();
        const card = await getRandomPokemonCardPlayer();
        setPlayerCards([...playerCards, card]);
        setPlayerTotalHP(playerTotalHP + parseInt(card.hp || 0));
        console.log(playerCards);
      } else {
        if (playerCards.length === 5) {
          swal2.fire({
            icon: "warning",
            title: "Ya tenés 5 cartas!",
            text: "Ahora hace click en el botón de la computadora para que saque sus cartas!",
          });
        }
      }
    }
  };

  const handleDrawComputerCards = async () => {
    if (playerCards.length < 5) {
      swal2.fire({
        icon: "error",
        title: "Primero termina de sacar tus 5 cartas! =)",
        text: "Hace click en el botón de sacar una carta para que puedas terminar de sacar tus 5 cartas!",
      });
      return;
    } else if (computerCards.length === 5) {
      swal2.fire({
        icon: "error",
        title: "La computadora ya sacó sus cartas!",
        text: "Hace click en el botón de batalla para ver quién ganó!",
      });
    } else {
      const cards = [];
      let totalHP = 0;
      handleIsLoading2();
      for (let i = 0; i < 5; i++) {
        const card = await getRandomPokemonCardComputer();
        cards.push(card);
        totalHP += parseInt(card.hp || 0);
      }
      setComputerCards(cards);
      setComputerTotalHP(totalHP);
      console.log(computerCards);
    }
  };

  const handleBattle = () => {
    if ((playerTotalHP === 0 || computerTotalHP === 0) && winner === "") {
      swal2.fire({
        icon: "error",
        title: "El Juego recien empieza!",
        text: "Primero tenés que sacar tus cartas! y la computadora también!",
      });
    } else if (playerTotalHP === 0 || computerTotalHP === 0) {
      swal2.fire({
        icon: "error",
        title: "El Juego recien empieza!",
        text: "Primero tenés que sacar tus cartas! y la computadora también!",
      });
    } else if (playerTotalHP !== 0 && computerTotalHP === 0) {
      swal2.fire({
        icon: "error",
        title: "La computadora todavía no sacó sus cartas!",
        text: "Hace click en el botón de sacar las 5 cartas de la computadora para que pueda sacar sus cartas!",
      });
    } else if (playerTotalHP === 0 && computerTotalHP !== 0) {
      swal2.fire({
        icon: "error",
        title: "Todavía no sacaste tus cartas!",
        text: "Hace click en el botón de sacar una carta para que puedas sacar tus cartas!",
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
    setPlayerTotalHP(0);
    setComputerTotalHP(0);
    setWinner("");
  };

  const handleIsLoading = () => {
    swal2.fire({
      title: "Buscando...",
      text: "Ya sale tu carta! Que pokemon te tocará?",
      timer: 7000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleIsLoading2 = () => {
    swal2.fire({
      title: "Buscando...",
      text: "Ya salen las cartas de la computadora! Que pokemon le tocará?",
      timer: 35000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  return (
    <div className="board container-fluid text-center">
      <p className="rules">
        Reglas:
        <br />
        1- Primero saca tus 5 cartas. Haz click en el botón "Sacar una carta" y
        espera que salga tu carta. Cuando salga, hacé click en el botón de nuevo
        para que salga otra carta. Repetí esto hasta que tengas 5 cartas.
        <br />
        2- Cuando tengas tus 5 cartas, hacé click en el botón "Sacar las 5
        cartas de la computadora" y esperá a que salgan las 5 cartas de la
        computadora.
        <br />
        3- Cuando salgan las 5 cartas de la computadora, hacé click en el botón
        "Batalla" para ver quién ganó!
        <br />
        Tip: Te pido paciencia, ya que las cartas tardan en salir. Gracias!
      </p>
      <h2 className="textPlayerAndComputer">Jugador</h2>
      <button id="drawCardPlayerButton" onClick={handleDrawCardPlayer}>
        Sacar una carta
      </button>
      {/* <p>Total HP: {playerTotalHP}</p> */}
      <div id="playerCardContainer">
        {playerCards.map((card) => (
          <div key={card.id}>
            {/* <h3>{card.name}</h3> */}
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
              <div>Total de Impresiones: {card.set.printedTotal}</div>
              <div>Rareza: {card.rarity}</div>
              <div>Tipo: {card.types.join(", ")}</div>
              {/* <div>Puntos HP: {card.hp}</div> */}
              {/* <div>Precio: ${card.cardmarket.prices.averageSellPrice}</div> */}
            </div>
          </div>
        ))}
      </div>
      <h2 className="textPlayerAndComputer">Computadora</h2>
      <button id="drawCardsComputerButton" onClick={handleDrawComputerCards}>
        Sacar las 5 cartas de la computadora
      </button>
      {/* <p>Total HP: {computerTotalHP}</p> */}
      <div id="computerCardContainer">
        {computerCards.map((card) => (
          <div key={card.id}>
            {/* <h3>{card.name}</h3> */}
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
              <div>Total de Impresiones: {card.set.printedTotal}</div>
              <div>Rareza: {card.rarity}</div>
              <div>Tipo: {card.types.join(", ")}</div>
              {/* <div>Puntos HP: {card.hp}</div> */}
              {/* <div>Precio: ${card.cardmarket.prices.averageSellPrice}</div> */}
            </div>
          </div>
        ))}
      </div>
      <button id="battleButton" onClick={handleBattle}>
        Batalla
      </button>
      {/* <h2>Resultado: {winner}</h2> */}
    </div>
  );
};

export default Batalla5Cartas;
