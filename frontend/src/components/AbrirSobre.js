import React, { useState, useEffect } from "react";
import axios from "axios";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./AbrirSobre.css";

const apiKey = process.env.REACT_APP_POKEMON_API_KEY;

const AbrirSobre = () => {
  const navigate = useNavigate();

  const [selectedSet, setSelectedSet] = useState("");
  const [selectedSetCards, setSelectedSetCards] = useState([]);
  const [sets, setSets] = useState([]);
  const [sortOption, setSortOption] = useState("number");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get("https://api.pokemontcg.io/v2/sets", {
          headers: {
            "X-Api-Key": apiKey,
          },
        });
        // order sets by release date from newest to oldest
        const sortedSets = response.data.data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setSets(sortedSets);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };
    fetchSets();
  }, []);

  const getCardPrice = (card) => {
    return (
      card?.tcgplayer?.prices?.holofoil?.market ||
      card?.tcgplayer?.prices?.reverseHolofoil?.market ||
      card?.tcgplayer?.prices?.normal?.market ||
      0
    );
  };

  const sortCards = (cardsToSort, sortType) => {
    const cardsCopy = [...cardsToSort];

    switch (sortType) {
      case "number":
        return cardsCopy.sort((a, b) => a.number - b.number);
      case "price-asc":
        return cardsCopy.sort((a, b) => {
          const priceA = getCardPrice(a) || 0;
          const priceB = getCardPrice(b) || 0;
          return priceA - priceB;
        });
      case "price-desc":
        return cardsCopy.sort((a, b) => {
          const priceA = getCardPrice(a) || 0;
          const priceB = getCardPrice(b) || 0;
          return priceB - priceA;
        });
      default:
        return cardsCopy;
    }
  };

  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    setSelectedSetCards(sortCards(selectedSetCards, newSortOption));
  };

  const handleSetChange = (event) => {
    setSelectedSet(event.target.value);
    setSortOption("number"); // Reset sort option when changing set
  };

  const showLoading = () => {
    swal2.fire({
      title: "Cargando cartas...",
      allowOutsideClick: false,
      didOpen: () => {
        swal2.showLoading();
      },
    });
  };

  const drawFromSelectedSet = async () => {
    if (!selectedSet) {
      swal2.fire({
        icon: "warning",
        title: "No seleccionaste un set",
        text: "Por favor selecciona un set para ver sus cartas.",
      });
      return;
    }

    if (selectedSetCards.length > 0) {
      const result = await swal2.fire({
        title:
          "Ya abriste un sobre, si abris otro se perdera la informacion del sobre actual",
        text: "¿Estas seguro que queres abrir otro sobre?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      if (!result.isConfirmed) {
        return;
      }
    }

    setIsLoading(true);
    showLoading();

    try {
      const response = await axios.get(
        `https://api.pokemontcg.io/v2/cards?q=set.id:${selectedSet}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );

      if (response.data.data.length < 11) {
        swal2.fire({
          icon: "error",
          title: "No hay suficientes cartas en este set",
          text: `El Set seleccionado tiene ${response.data.data.length} cartas, por favor selecciona otro set.`,
        });
      } else {
        const randomIndices = new Set();
        while (randomIndices.size < 11) {
          randomIndices.add(
            Math.floor(Math.random() * response.data.data.length)
          );
        }
        const cards = Array.from(randomIndices).map(
          (index) => response.data.data[index]
        );

        // Reset sort option to "number" when opening a new pack
        setSortOption("number");
        // Sort cards by number initially
        const sortedCards = sortCards(cards, "number");
        setSelectedSetCards(sortedCards);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      swal2.fire({
        icon: "error",
        title: "Error cargando cartas",
        text: "Por favor intenta de nuevo mas tarde",
      });
    } finally {
      setIsLoading(false);
      swal2.close();
    }
  };

  const warningVolverAlInicioBySet = () => {
    swal2
      .fire({
        title: "Volver al Inicio?",
        text: "Si volves al inicio se perdera la informacion del set seleccionado",
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
    <div className="container-fluid">
      <p className="textSobre">
        ¿Quieres abrir un sobre de un set en particular? Selecciona el set que
        te guste (están ordenados del más nuevo al más viejo) y haz clic en el
        botón "Abrir sobre de este set".
        <br />
        Te saldrán 11 cartas al azar de ese set. ¡Buena suerte!
        <br />
        Debajo de cada carta verás un precio promedio de referencia en dólares,
        lo que te permitirá saber si te salió una carta valiosa o no.
        <br />
        **Tip:** Te agradecemos tu paciencia, ya que las cartas pueden tardar un
        momento en salir. ¡Gracias!
      </p>

      <div className="selectSetContainer">
        <select id="set-select" onChange={handleSetChange} value={selectedSet}>
          <option value="">Selecciona un Set</option>
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>
        <button className="openSetButton" onClick={drawFromSelectedSet}>
          Abrir Sobre
        </button>
      </div>

      {selectedSetCards.length > 0 && !isLoading && (
        <div className="sortingContainer">
          <select
            id="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            className="sortSelect"
          >
            <option value="number">Ordenar por Número</option>
            <option value="price-asc">
              Ordenar por Precio (Menor a Mayor)
            </option>
            <option value="price-desc">
              Ordenar por Precio (Mayor a Menor)
            </option>
          </select>
        </div>
      )}

      <div className="text-center">
        <button onClick={warningVolverAlInicioBySet} className="backToHome">
          Ir a Pantalla de Inicio
        </button>
      </div>

      <div>
        <div className="cardContainer">
          {selectedSetCards.map((card) => (
            <div key={card.id}>
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
                <div>Precio: ${getCardPrice(card) || "No hay precio"}</div>
                <div>Puntos HP: {card.hp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AbrirSobre;
