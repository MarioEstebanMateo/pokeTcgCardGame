import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal2 from "sweetalert2";

import "./VerSetCompleto.css";

const apiKey = process.env.REACT_APP_POKEMON_API_KEY;

const VerSetCompleto = () => {
  const navigate = useNavigate();

  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [cards, setCards] = useState([]);

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

  const handleSetChange = (event) => {
    setSelectedSet(event.target.value);
  };

  const fetchCards = async () => {
    if (!selectedSet) {
      swal2.fire({
        icon: "warning",
        title: "No seleccionaste un set",
        text: "Por favor selecciona un set para ver sus cartas.",
      });
      return;
    }

    if (cards.length > 0 && cards[0].set.id === selectedSet) {
      swal2.fire({
        icon: "warning",
        title: "Elegiste el mismo set",
        text: "Por favor selecciona un set diferente para ver sus cartas.",
      });
      return;
    }

    if (cards.length > 0) {
      swal2
        .fire({
          icon: "info",
          title: "Queres cambiar de set?",
          text: "Si cambias de set se perdera la informacion del set anterior",
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            setCards([]);
            doFetchCards();
          }
        });
    } else {
      doFetchCards();
    }
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

  const doFetchCards = async () => {
    showLoading(); // Show the loading indicator

    try {
      const response = await axios.get(
        `https://api.pokemontcg.io/v2/cards?q=set.id:${selectedSet}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );
      //order cards by number
      const sortedCards = response.data.data.sort(
        (a, b) => a.number - b.number
      );
      setCards(sortedCards);
      swal2.close(); // Close the loading indicator when cards are loaded
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
    <div className="container-fluid">
      <p className="textSet">
        Queres ver todas las cartas de un set? Selecciona un set y dale a "Ver
        Set"
        <br />
        Si queres ver una carta con una imagen mas grande, hace click en la
        carta y se abrira en una nueva pestaña de tu navegador con la imagen mas
        grande!
        <br />
        tip: Te pido paciencia, ya que las cartas tardan en salir. Gracias!
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
        <button
          className="openSetButton"
          onClick={fetchCards}
          // disabled={!selectedSet}
        >
          Ver Set
        </button>
      </div>
      <div>
        {cards.length > 0 ? (
          <div>
            <div className="textSet2">
              {" "}
              Set:{" "}
              <img
                className="setSymbol"
                src={cards[0].set.images.symbol}
                alt={cards[0].set.name}
              />{" "}
              {cards[0].set.name} (
              {new Date(cards[0].set.releaseDate).getFullYear()}) / Total de
              cartas: {cards.length}
            </div>
            <div className="text-center">
              <img
                className="setLogo"
                src={cards[0].set.images.logo}
                alt={cards[0].set.name}
              />
            </div>
            <div className="setContainer">
              {cards.map((card) => (
                <div className="" key={card.id}>
                  <a
                    href={card.images.large}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="cardImage"
                      src={card.images.small}
                      alt={card.name}
                    />
                  </a>
                  <div className="cardInfo">
                    <div>Nombre: {card.name}</div>
                    <div>Nro en la Pokedex: {card.nationalPokedexNumbers}</div>
                    <div>Set: {card.set.name}</div>
                    <div>Serie: {card.set.series}</div>
                    <div>
                      Fecha de Lanzamiento:{" "}
                      {new Date(card.set.releaseDate).toLocaleDateString(
                        "es-AR"
                      )}
                    </div>
                    <div>
                      Numero: {card.number} / {card.set.printedTotal}
                    </div>
                    <div>Rareza: {card.rarity}</div>
                    <div>Tipo: {card.types}</div>
                    <div>Puntos HP: {card.hp}</div>
                    <div>
                      Precio: $
                      {card?.tcgplayer?.prices?.holofoil?.market
                        ? card.tcgplayer.prices.holofoil.market
                        : card?.tcgplayer?.prices?.reverseHolofoil?.market
                        ? card.tcgplayer.prices.reverseHolofoil.market
                        : card?.tcgplayer?.prices?.normal?.market
                        ? card.tcgplayer.prices.normal.market
                        : "No hay precio"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="textSet">
            No hay cartas para mostrar, por favor selecciona un set
          </p>
        )}
      </div>
      <div className="text-center">
        <button className="backToHome" onClick={warningVolverAlInicioBySet}>
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
export default VerSetCompleto;
