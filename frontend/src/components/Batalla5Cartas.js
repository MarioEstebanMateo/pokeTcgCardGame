import React, { useState } from "react";
import "./Batalla5Cartas.css";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./Batalla5Cartas.css";

const Batalla5Cartas = () => {
  const apiKey = "28741ca5-7270-449e-9319-8b046277f2ba";
  // const baseURL = "https://api.pokemontcg.io/v2/cards";

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState();
  const [isLoading2, setIsLoading2] = useState();

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
    if (playerCards.length < 5) {
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
      return;
    }
    if (playerTotalHP > computerTotalHP) {
      setWinner("Ganaste! Felicitaciones! Jugamos de nuevo?");
    } else if (playerTotalHP < computerTotalHP) {
      setWinner("Perdiste... Yo que vos, jugaría de nuevo!");
    } else {
      setWinner("Empate... Jugamos de nuevo?");
    }
    swal2
      .fire({
        icon: "success",
        title: "Batalla terminada!",
        html: `Player HP: ${playerTotalHP} <br> Computer HP: ${computerTotalHP} <br> <br> Ganador: ${winner}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Nuevo Juego`,
        denyButtonText: `Ir a Pantalla de Inicio`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleReset();
        } else if (result.isDenied) {
          navigate("/");
        }
      });
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
    //show playerCards and playerTotalHP
    <div className="container-fluid text-center">
      <h2>Player</h2>
      <button id="drawCardPlayerButton" onClick={handleDrawCardPlayer}>
        Sacar una carta
      </button>
      <p>Total HP: {playerTotalHP}</p>
      <div id="playerCardContainer">
        {playerCards.map((card) => (
          <div key={card.id}>
            <h3>{card.name}</h3>
            <img src={card.images.small} alt={card.name} />
            <p>Set: {card.set.name}</p>
            <p>Rarity: {card.rarity}</p>
            <p>Type: {card.types.join(", ")}</p>
            <p>HP: {card.hp}</p>
            <p>Price: ${card.cardmarket.prices.averageSellPrice}</p>
          </div>
        ))}
      </div>
      <h2>Computer</h2>
      <button id="drawCardPlayerButton" onClick={handleDrawComputerCards}>
        Sacar las 5 cartas de la computadora
      </button>
      <p>Total HP: {computerTotalHP}</p>
      <div id="computerCardContainer">
        {computerCards.map((card) => (
          <div key={card.id}>
            <h3>{card.name}</h3>
            <img src={card.images.small} alt={card.name} />
            <p>Set: {card.set.name}</p>
            <p>Rarity: {card.rarity}</p>
            <p>Type: {card.types.join(", ")}</p>
            <p>HP: {card.hp}</p>
            <p>Price: ${card.cardmarket.prices.averageSellPrice}</p>
          </div>
        ))}
      </div>
      <button id="battleButton" onClick={handleBattle}>
        Batalla
      </button>
      <h2>Resultado: {winner}</h2>
    </div>
  );
};

export default Batalla5Cartas;
