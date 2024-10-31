import React, { useState, useEffect } from "react";
import "./Batalla5Cartas.css";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiKey = process.env.REACT_APP_POKEMON_API_KEY;

const Batalla5Cartas = () => {
  const navigate = useNavigate();
  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [winner, setWinner] = useState("");
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cardCache, setCardCache] = useState([]);

  const showLoading = () => {
    setIsLoading(true);
    swal2.fire({
      title: "Cargando cartas...",
      allowOutsideClick: false,
      didOpen: () => {
        swal2.showLoading();
      },
    });
  };

  const fetchRandomCards = async (numCards) => {
    try {
      if (cardCache.length < 100) {
        const response = await axios.get("https://api.pokemontcg.io/v2/cards", {
          headers: {
            "X-Api-Key": apiKey,
          },
          params: {
            pageSize: 100,
            select: "id,name,images,hp,nationalPokedexNumbers,set,rarity,types",
          },
        });

        const validCards = response.data.data.filter(
          (card) => card.hp && !isNaN(parseInt(card.hp))
        );
        setCardCache(validCards);
        return selectRandomCards(validCards, numCards);
      }

      return selectRandomCards(cardCache, numCards);
    } catch (error) {
      console.error("Error fetching random cards:", error);
      throw new Error("Failed to fetch cards");
    }
  };

  const selectRandomCards = (cards, numCards) => {
    const selectedCards = [];
    const availableCards = [...cards];

    for (let i = 0; i < numCards && availableCards.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      selectedCards.push(availableCards.splice(randomIndex, 1)[0]);
    }

    return selectedCards;
  };

  const fetchPlayerCards = async () => {
    if (playerCards.length > 0) {
      const confirmed = await swal2.fire({
        icon: "warning",
        title: "¿Seguro que quieres nuevas cartas?",
        text: "Perderás tus cartas actuales",
        showCancelButton: true,
        confirmButtonText: "Sí, nuevas cartas",
        cancelButtonText: "Cancelar",
      });

      if (!confirmed.isConfirmed) return;
    }

    showLoading();
    try {
      const cards = await fetchRandomCards(5);
      setPlayerCards(cards);
    } catch (error) {
      handleError("Error al cargar las cartas del jugador");
    } finally {
      swal2.close();
      setIsLoading(false);
    }
  };

  const fetchComputerCards = async () => {
    if (computerCards.length > 0) {
      const confirmed = await swal2.fire({
        icon: "warning",
        title: "¿Seguro que quieres nuevas cartas para la computadora?",
        text: "Se perderán las cartas actuales",
        showCancelButton: true,
        confirmButtonText: "Sí, nuevas cartas",
        cancelButtonText: "Cancelar",
      });

      if (!confirmed.isConfirmed) return;
    }

    showLoading();
    try {
      const cards = await fetchRandomCards(5);
      setComputerCards(cards);
    } catch (error) {
      handleError("Error al cargar las cartas de la computadora");
    } finally {
      swal2.close();
      setIsLoading(false);
    }
  };

  const handleError = (message) => {
    setIsLoading(false);
    swal2.fire({
      icon: "error",
      title: "Error",
      text: message,
    });
  };

  const calculateScore = (cards) => {
    const stats = {
      totalHP: 0,
      rarityScore: 0,
      typeBonus: 0,
    };

    const rarityValues = {
      Common: 1,
      Uncommon: 2,
      Rare: 3,
      "Rare Holo": 4,
      "Rare Ultra": 5,
      "Rare Secret": 6,
    };

    const uniqueTypes = new Set();

    cards.forEach((card) => {
      // Calculate HP score
      const hp = parseInt(card.hp) || 0;
      stats.totalHP += hp;

      // Calculate rarity score
      stats.rarityScore += rarityValues[card.rarity] || 1;

      // Calculate type bonus
      if (card.types) {
        card.types.forEach((type) => uniqueTypes.add(type));
      }
    });

    stats.typeBonus = uniqueTypes.size * 20;

    // Calculate final score
    return Math.round(
      stats.totalHP * 0.5 + stats.rarityScore * 30 + stats.typeBonus
    );
  };

  const calculateTotalHP = (cards) => {
    return cards.reduce((total, card) => {
      const hp = parseInt(card.hp) || 0;
      return total + hp;
    }, 0);
  };

  const playGame = async () => {
    if (playerCards.length === 0 || computerCards.length === 0) {
      swal2.fire({
        icon: "error",
        title: "No se puede jugar",
        text: "Primero saca las cartas del jugador y de la computadora",
      });
      return;
    }

    const playerScore = calculateScore(playerCards);
    const computerScore = calculateScore(computerCards);
    const playerHP = calculateTotalHP(playerCards);
    const computerHP = calculateTotalHP(computerCards);

    let result, message;

    if (playerScore > computerScore) {
      result = "¡Victoria!";
      message = "¡Ganaste! Dale, Juga de Nuevo!";
    } else if (playerScore < computerScore) {
      result = "Derrota";
      message = "¡Perdiste! Juga de Nuevo! ¡Vamos!";
    } else {
      result = "Empate";
      message = "¡Empate! ¡Juga de Nuevo! ¡Vamos!";
    }

    setGameHistory((prev) => [
      ...prev,
      {
        date: new Date(),
        result,
        playerScore,
        computerScore,
      },
    ]);

    const response = await swal2.fire({
      icon:
        result === "¡Victoria!"
          ? "success"
          : result === "Empate"
          ? "info"
          : "error",
      title: result,
      html: `
        <div>
          <p>${message}</p>
          <h4>Detalles de la Batalla:</h4>
          <br>
          <p>Puntaje Final Jugador: ${playerScore}</p>
          <br>
          <p>Puntaje Final Computadora: ${computerScore}</p>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Nuevo Juego",
      denyButtonText: "Ir a Inicio",
      cancelButtonText: "Cerrar",
    });

    if (response.isConfirmed) {
      handleReset();
    } else if (response.isDenied) {
      navigate("/");
    }
  };

  const handleReset = () => {
    setPlayerCards([]);
    setComputerCards([]);
    setWinner("");
  };

  const newGame = async () => {
    const result = await swal2.fire({
      icon: "warning",
      title: "¿Quieres jugar de nuevo?",
      text: "Se perderá la información de las cartas actuales",
      showCancelButton: true,
      confirmButtonText: "Sí, nuevo juego",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      handleReset();
    }
  };

  const warningVolverAlInicio = async () => {
    const result = await swal2.fire({
      title: "¿Volver al Inicio?",
      text: "Se perderá la información de las cartas",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, volver",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      navigate("/");
    }
  };

  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    setShowButton(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <p className="rules">
        Reglas:
        <br />
        1. Para comenzar, obtén tus 5 cartas haciendo clic en "Sacar Cartas
        Jugador". Cada carta tiene diferentes características: - Puntos de vida
        (HP) - Rareza (común, poco común, rara, etc.) - Tipos de Pokémon
        <br />
        2. Una vez que tengas tus cartas, haz clic en "Sacar Cartas Computadora"
        para que tu oponente obtenga sus 5 cartas.
        <br />
        3. ¡Hora de la batalla! Presiona el botón "Batalla" para ver quién gana.
        Tu puntaje final se calcula considerando: - Puntos de vida totales (50%
        del puntaje) - Rareza de las cartas (30% del puntaje) - Variedad de
        tipos de Pokémon (20% del puntaje)
        <br />
        4. El jugador con el puntaje más alto gana la batalla.
        <br />
        5. Después de cada batalla, puedes: - Comenzar un nuevo juego con cartas
        diferentes - Volver al menú principal
        <br />
        **Nota importante:** La carga de las cartas puede tomar unos momentos.
        Por favor, sé paciente mientras se cargan las imágenes y datos de cada
        carta.
        <br />
        **Consejo:** ¡Una buena estrategia es intentar obtener cartas con alta
        rareza y diferentes tipos de Pokémon para maximizar tu puntaje!
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
